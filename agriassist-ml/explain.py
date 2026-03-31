import shap
import joblib
import pandas as pd

model = joblib.load("model.pkl")

data = {
    'Crop': 0,
    'Season': 1,
    'Area': 2.0,
    'Annual_Rainfall': 800,
    'Fertilizer': 100,
    'Pesticide': 10
}

df = pd.DataFrame([data])

explainer = shap.TreeExplainer(model)
shap_values = explainer(df)

# Print nicely
for feature, value in zip(df.columns, shap_values.values[0]):
    print(f"{feature}: {value}")