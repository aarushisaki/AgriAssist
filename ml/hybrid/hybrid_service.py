import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(__file__)

# Load models
yield_model = joblib.load(os.path.join(BASE_DIR, "../yield_model/model.pkl"))

fert_model = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/fertilizer_model.pkl"))
encoders = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/encoders.pkl"))
target_encoder = joblib.load(os.path.join(BASE_DIR, "../fertilizer_model/target_encoder.pkl"))


# -------------------------------
# RULES
# -------------------------------
def apply_rules(input_data):
    penalties = 0

    if input_data["soil_pH"] < 5.5:
        penalties += 0.2

    if input_data["irrigation_type"] == "flood":
        penalties += 0.1

    return penalties


# -------------------------------
# COST
# -------------------------------
def cost_score(fertilizer):
    if fertilizer > 150:
        return 0.3
    elif fertilizer > 100:
        return 0.6
    else:
        return 1.0


# -------------------------------
# MCDA
# -------------------------------
def compute_final_score(ml_score, cost, penalty):
    return (0.5 * ml_score) + (0.3 * cost) - (0.2 * penalty)


# -------------------------------
# EXPLANATION
# -------------------------------
def interpret_result(result):
    score = result["final_score"]

    if score > 0.7:
        verdict = "Highly Recommended"
    elif score > 0.5:
        verdict = "Recommended"
    elif score > 0.3:
        verdict = "Moderately Suitable"
    else:
        verdict = "Not Recommended"

    explanation = []

    explanation.append(f"Predicted yield is {round(result['ml_prediction'], 2)} tons/hectare")

    if result["cost_score"] > 0.8:
        explanation.append("Fertilizer is cost-effective")
    else:
        explanation.append("Fertilizer is relatively expensive")

    if result["penalty"] > 0:
        explanation.append("Some conditions reduce effectiveness")
    else:
        explanation.append("Soil and irrigation conditions are suitable")

    return verdict, explanation


# -------------------------------
# FERTILIZER PREDICTION
# -------------------------------
def predict_fertilizer(input_data):
    try:
        # Create full valid input for model
# -------------------------------
# PREPARE INPUT FOR YIELD MODEL
# -------------------------------
        df = pd.DataFrame([{
            'Crop': 0,  # keep static for now
            'Season': 1,
            'Area': input_data.get('Area', 5),
            'Annual_Rainfall': input_data.get('Annual_Rainfall', 200),
            'Fertilizer': input_data.get('Fertilizer', 100),  # IMPORTANT FIX
            'Pesticide': input_data.get('Pesticide', 10)
        }])

        print("🧪 Fertilizer Input:", df)

        # Encode categorical safely
        for col in encoders:
            if col in df.columns:
                df[col] = encoders[col].transform(df[col])

        pred = fert_model.predict(df)
        fertilizer = target_encoder.inverse_transform(pred)

        return fertilizer[0]

    except Exception as e:
        print("❌ Fertilizer Error:", e)
        return "Urea"  # fallback so app never crashes


# -------------------------------
# MAIN HYBRID FUNCTION
# -------------------------------
def recommend(input_data):

    # 1️⃣ Predict fertilizer
    fertilizer_name = predict_fertilizer(input_data)

    # 2️⃣ Use fertilizer amount (dummy mapping for now)
    input_data["Fertilizer"] = 100

    # 3️⃣ Prepare data for yield model
    df = pd.DataFrame([{
        'Crop': 0,
        'Season': 1,
        'Area': input_data['Area'],
        'Annual_Rainfall': input_data['Annual_Rainfall'],
        'Fertilizer': input_data['Fertilizer'],
        'Pesticide': input_data['Pesticide']
    }])

    # 4️⃣ Predict yield
    ml_prediction = yield_model.predict(df)[0]
    ml_score = ml_prediction / 10

    # 5️⃣ Apply rules + cost
    penalty = apply_rules(input_data)
    cost = cost_score(input_data["Fertilizer"])

    # 6️⃣ Final score
    final_score = compute_final_score(ml_score, cost, penalty)

    result = {
        "ml_prediction": float(ml_prediction),
        "cost_score": float(cost),
        "penalty": float(penalty),
        "final_score": float(final_score)
    }

    # 7️⃣ Explain
    verdict, explanation = interpret_result(result)

    return {
        "ideal_fertilizer": fertilizer_name,
        "verdict": verdict,
        "explanation": explanation,
        "details": result
    }