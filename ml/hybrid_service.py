import joblib
import pandas as pd

import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(MODEL_PATH)

def apply_rules(input_data):
    penalties = 0

    if input_data["soil_pH"] < 5.5:
        penalties += 0.2

    if input_data["irrigation_type"] == "flood":
        penalties += 0.1

    return penalties


def cost_score(fertilizer):
    if fertilizer > 150:
        return 0.3
    elif fertilizer > 100:
        return 0.6
    else:
        return 1.0


def compute_final_score(ml_score, cost, penalty):
    return (0.5 * ml_score) + (0.3 * cost) - (0.2 * penalty)


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


def recommend(input_data):

    df = pd.DataFrame([{
        'Crop': 0,
        'Season': 1,
        'Area': input_data['Area'],
        'Annual_Rainfall': input_data['Annual_Rainfall'],
        'Fertilizer': input_data['Fertilizer'],
        'Pesticide': input_data['Pesticide']
    }])

    ml_prediction = model.predict(df)[0]
    ml_score = ml_prediction / 10

    penalty = apply_rules(input_data)
    cost = cost_score(input_data["Fertilizer"])

    final_score = compute_final_score(ml_score, cost, penalty)

    result = {
        "ml_prediction": float(ml_prediction),
        "cost_score": float(cost),
        "penalty": float(penalty),
        "final_score": float(final_score)
    }

    verdict, explanation = interpret_result(result)

    return {
        "verdict": verdict,
        "explanation": explanation,
        "details": result
    }