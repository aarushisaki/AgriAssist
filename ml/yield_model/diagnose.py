import pandas as pd
import numpy as np
import joblib

df = pd.read_csv("data.csv")
df2 = df[['Crop', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Yield']]

print("=== YIELD STATS ===")
print(df2['Yield'].describe())
print("\n=== SAMPLE ROWS ===")
print(df2.head(5).to_string())
print("\n=== UNIQUE CROPS ===", sorted(df2['Crop'].unique().tolist()))
print("=== UNIQUE SEASONS ===", sorted(df2['Season'].unique().tolist()))

model    = joblib.load("model.pkl")
le_crop  = joblib.load("le_crop.pkl")
le_season = joblib.load("le_season.pkl")

print("\n=== ENCODER CLASSES ===")
print("Crops  :", list(le_crop.classes_))
print("Seasons:", list(le_season.classes_))

# Test a few combos
for crop in le_crop.classes_[:3]:
    for season in le_season.classes_[:2]:
        test = pd.DataFrame([{
            'Crop':            int(le_crop.transform([crop])[0]),
            'Season':          int(le_season.transform([season])[0]),
            'Area':            5.0,
            'Annual_Rainfall': 300.0,
            'Fertilizer':      120.0,
            'Pesticide':       8.0
        }])
        pred = model.predict(test)[0]
        print(f"  {crop:15s} | {season:12s} => Yield: {pred:.4f}")