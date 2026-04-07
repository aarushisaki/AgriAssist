import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(__file__)

# ── Load yield model + encoders ───────────────────────────────────────────────
yield_model   = joblib.load(os.path.join(BASE_DIR, "../yield_model/model.pkl"))
le_crop       = joblib.load(os.path.join(BASE_DIR, "../yield_model/le_crop.pkl"))
le_season     = joblib.load(os.path.join(BASE_DIR, "../yield_model/le_season.pkl"))
feature_cols  = joblib.load(os.path.join(BASE_DIR, "../yield_model/feature_columns.pkl"))

# ── Load fertilizer model + encoders ─────────────────────────────────────────
fert_model     = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/fertilizer_model.pkl"))
fert_encoders  = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/encoders.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/target_encoder.pkl"))

print("✅ All models loaded.")
print("   Crops  :", list(le_crop.classes_))
print("   Seasons:", list(le_season.classes_))
print("   Features:", feature_cols)


# ── Helpers ───────────────────────────────────────────────────────────────────

def safe_encode(encoder, value, fallback=0):
    """Case-insensitive LabelEncoder lookup, never crashes."""
    val = str(value).strip()
    # Exact match first
    if val in encoder.classes_:
        return int(encoder.transform([val])[0])
    # Case-insensitive fallback
    for cls in encoder.classes_:
        if cls.strip().lower() == val.lower():
            return int(encoder.transform([cls])[0])
    print(f"⚠️  '{val}' not found in {list(encoder.classes_)}, using fallback={fallback}")
    return fallback


def apply_rules(input_data):
    penalty = 0.0
    if float(input_data.get("soil_pH", 7.0)) < 5.5:
        penalty += 0.2
    if str(input_data.get("irrigation_type", "")).lower() == "flood":
        penalty += 0.1
    return penalty


def cost_score(fertilizer_per_ha):
    f = float(fertilizer_per_ha)
    if f > 150:
        return 0.3
    elif f > 100:
        return 0.6
    return 1.0


def compute_final_score(ml_score, cost, penalty):
    return (0.5 * ml_score) + (0.3 * cost) - (0.2 * penalty)


def interpret_result(result):
    score = result["final_score"]
    if score > 0.7:
        verdict_key = "verdictHighly"
    elif score > 0.5:
        verdict_key = "verdictRecommended"
    elif score > 0.3:
        verdict_key = "verdictModerate"
    else:
        verdict_key = "verdictNot"

    explanation_keys = [
        "expYield",
        "expCostHigh" if result["cost_score"] <= 0.6 else "expCostOk",
        "expCondBad"  if result["penalty"] > 0         else "expCondOk",
    ]
    return verdict_key, explanation_keys


FERTILIZER_AMOUNT_MAP = {
    "Urea": 120, "DAP": 100, "14-35-14": 90,
    "28-28": 110, "17-17-17": 95, "20-20": 100, "10-26-26": 85,
}

def fertilizer_to_amount(name):
    return FERTILIZER_AMOUNT_MAP.get(str(name), 100)


# ── Fertilizer prediction ─────────────────────────────────────────────────────
def get_crop_defaults(crop):
    crop = str(crop).lower()
    defaults = {
        "wheat":     {"humidity": 60, "moisture": 35, "n": 25, "k": 15, "p": 20},
        "paddy":     {"humidity": 80, "moisture": 70, "n": 30, "k": 20, "p": 25},
        "maize":     {"humidity": 55, "moisture": 40, "n": 28, "k": 18, "p": 22},
        "sugarcane": {"humidity": 75, "moisture": 65, "n": 35, "k": 25, "p": 30},
    }
    return defaults.get(crop, defaults["wheat"])

def predict_fertilizer(input_data):
    try:
        defaults = get_crop_defaults(input_data.get("Crop", "wheat"))

        row = {
            'Temparature': float(input_data.get("temperature", 25)),
            'Humidity ': float(input_data.get("humidity", defaults["humidity"])),
            'Moisture': float(input_data.get("moisture", defaults["moisture"])),
            'Soil Type': str(input_data.get("soil_type", "Loamy")),
            'Crop Type': str(input_data.get("Crop", "Wheat")),
            'Nitrogen': float(input_data.get("nitrogen", defaults["n"])),
            'Potassium': float(input_data.get("potassium", defaults["k"])),
            'Phosphorous': float(input_data.get("phosphorous", defaults["p"])),
        }
        df = pd.DataFrame([row])
        for col in fert_encoders:
            if col in df.columns:
                df[col] = safe_encode(fert_encoders[col], df[col].iloc[0])
        pred = fert_model.predict(df)
        return target_encoder.inverse_transform(pred)[0]
    except Exception as e:
        print("❌ Fertilizer prediction error:", e)
        return "Urea"

# ── Main ──────────────────────────────────────────────────────────────────────

def recommend(input_data):
    print("\n🔍 recommend() called with:", input_data)

    # 1. Fertilizer recommendation
    fertilizer_name      = predict_fertilizer(input_data)
    fertilizer_per_ha = float(
        input_data.get("Fertilizer") or input_data.get("fertilizer") 
        or fertilizer_to_amount(fertilizer_name)
    )
    pesticide_per_ha     = float(input_data.get("Pesticide", 10))
    annual_rainfall      = float(input_data.get("Annual_Rainfall", 200))

    print(f"🌿 Fertilizer: {fertilizer_name} | {fertilizer_per_ha} kg/ha")

    # 2. Encode crop and season — strip whitespace to match training labels
    crop_raw   = str(input_data.get("Crop",   "Wheat")).strip()
    season_raw = str(input_data.get("Season", "Kharif")).strip()

    crop_enc   = safe_encode(le_crop,   crop_raw)
    season_enc = safe_encode(le_season, season_raw)
    print(f"🌾 '{crop_raw}' → {crop_enc}  |  '{season_raw}' → {season_enc}")

    # 3. Build feature DataFrame — must match feature_columns.pkl order exactly
    # Features: ['Crop', 'Season', 'Annual_Rainfall', 'Fertilizer_per_ha', 'Pesticide_per_ha']
    row = {
        'Crop':               crop_enc,
        'Season':             season_enc,
        'Annual_Rainfall':    annual_rainfall,
        'Fertilizer_per_ha':  fertilizer_per_ha,
        'Pesticide_per_ha':   pesticide_per_ha,
    }
    # Build in the exact column order the model was trained on
    df = pd.DataFrame([[row[c] for c in feature_cols]], columns=feature_cols)
    print("📊 Yield model input:\n", df)

    # 4. Predict
    ml_prediction = float(yield_model.predict(df)[0])

    # 🔥 APPLY FERTILIZER ADJUSTMENT
    fert_factor = fertilizer_response_curve(fertilizer_per_ha)
    ml_prediction *= fert_factor
    # Scale ml_score: typical yield ~2 Q/ha, score should be 0-1 range for MCDA
    ml_score = min(ml_prediction / 40.0, 1.0)
    print(f"✅ Predicted yield: {ml_prediction:.3f} Q/ha")

    # 5. Score
    penalty     = apply_rules(input_data)
    cost        = cost_score(fertilizer_per_ha)
    final_score = compute_final_score(ml_score, cost, penalty)

    result = {
        "ml_prediction": ml_prediction,
        "cost_score":    cost,
        "penalty":       penalty,
        "final_score":   final_score,
    }

    verdict_key, explanation_keys = interpret_result(result)

    return {
        "ideal_fertilizer":  fertilizer_name,
        "verdict_key":       verdict_key,
        "explanation_keys":  explanation_keys,
        "yield_value":       round(ml_prediction, 2),   # number only, frontend formats it
        "details":           result,
    }

if __name__ == "__main__":
    # Sample input data for testing
    input_data = {
        "temperature": 25.0,
        "humidity": 50.0,
        "moisture": 30.0,
        "soil_type": "Loamy",
        "Crop": "Wheat",
        "nitrogen": 20.0,
        "potassium": 10.0,
        "phosphorous": 10.0,
        "soil_pH": 7.0,
        "irrigation_type": "Drip",
        "Fertilizer": 100.0,
        "Pesticide": 10.0,
        "Annual_Rainfall": 200.0,
        "Season": "Kharif"
    }
    result = recommend(input_data)
    print(result)
    verdict, explanation = interpret_result(result["details"])
    print("Verdict:", verdict)

def fertilizer_response_curve(fert):
    # realistic agronomy-inspired curve
    if fert < 50:
        return 0.85
    elif fert < 100:
        return 1.0
    elif fert < 150:
        return 1.08
    elif fert < 200:
        return 1.12
    else:
        return 1.05  # diminishing returns