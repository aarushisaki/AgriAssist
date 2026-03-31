import joblib
import pandas as pd

# Load model
model = joblib.load("model.pkl")

# -------------------------------
# 1. RULE-BASED SYSTEM
# -------------------------------
def apply_rules(input_data):
    penalties = 0

    # Example rules
    if input_data["soil_pH"] < 5.5:
        penalties += 0.2  # acidic soil penalty

    if input_data["irrigation_type"] == "flood":
        penalties += 0.1  # inefficient irrigation

    return penalties


# -------------------------------
# 2. COST FUNCTION (dummy for now)
# -------------------------------
def cost_score(fertilizer_amount):
    # Normalize cost (lower cost = better score)
    if fertilizer_amount > 150:
        return 0.3
    elif fertilizer_amount > 100:
        return 0.6
    else:
        return 1.0


# -------------------------------
# 3. MCDA SCORING
# -------------------------------
def compute_final_score(ml_score, cost, penalty):
    return (0.5 * ml_score) + (0.3 * cost) - (0.2 * penalty)


# -------------------------------
# 4. MAIN HYBRID FUNCTION
# -------------------------------
def recommend(input_data):

    # Convert to DataFrame
    df = pd.DataFrame([{
        'Crop': 0,
        'Season': 1,
        'Area': input_data['Area'],
        'Annual_Rainfall': input_data['Annual_Rainfall'],
        'Fertilizer': input_data['Fertilizer'],
        'Pesticide': input_data['Pesticide']
    }])

    # Encode categorical values manually (same as training)
    df['Crop'] = 0
    df['Season'] = 1

    # ML prediction
    ml_prediction = model.predict(df)[0]

    # Normalize ML score (simple scaling)
    ml_score = ml_prediction / 10

    # Apply rules
    penalty = apply_rules(input_data)

    # Cost score
    cost = cost_score(input_data["Fertilizer"])

    # Final score
    final_score = compute_final_score(ml_score, cost, penalty)

    return {
        "ml_prediction": ml_prediction,
        "cost_score": cost,
        "penalty": penalty,
        "final_score": final_score
    }


# -------------------------------
# TEST RUN
# -------------------------------
input_data = {
    "soil_pH": 6.5,
    "irrigation_type": "drip",
    "Fertilizer": 100,
    "Area": 2.0,
    "Annual_Rainfall": 800,
    "Pesticide": 10
}

result = recommend(input_data)

print(result)

def interpret_result(result):
    score = result["final_score"]

    if score > 0.7:
        verdict = "Highly Recommended ✅"
    elif score > 0.5:
        verdict = "Recommended 👍"
    elif score > 0.3:
        verdict = "Moderately Suitable ⚠️"
    else:
        verdict = "Not Recommended ❌"

    explanation = []

    # ML reasoning
    explanation.append(f"Predicted yield is {round(result['ml_prediction'], 2)} tons/hectare")

    # Cost reasoning
    if result["cost_score"] > 0.8:
        explanation.append("Fertilizer is cost-effective")
    else:
        explanation.append("Fertilizer is relatively expensive")

    # Rule reasoning
    if result["penalty"] > 0:
        explanation.append("Some conditions reduce effectiveness")
    else:
        explanation.append("Soil and irrigation conditions are suitable")

    return verdict, explanation

result = recommend(input_data)

verdict, explanation = interpret_result(result)

print("\n=== FINAL RECOMMENDATION ===")
print("Verdict:", verdict)

print("\nReasoning:")
for line in explanation:
    print("-", line)