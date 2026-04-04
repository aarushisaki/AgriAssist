import joblib
import pandas as pd

model = joblib.load("model.pkl")

# Example input (adjust values)
data = {
    'Crop': 0,
    'Season': 1,
    'Area': 2.0,
    'Annual_Rainfall': 800,
    'Fertilizer': 100,
    'Pesticide': 10
}

df = pd.DataFrame([data])

prediction = model.predict(df)

print("Predicted Yield:", prediction[0])