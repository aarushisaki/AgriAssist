import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data.csv")

df = pd.read_csv(DATA_PATH)
df = df[['Crop', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Yield']]

# ── FIX 1: Strip whitespace from all string columns ───────────────────────────
# Raw data has 'Kharif     ' etc. — this is why season never affected predictions
df['Crop']   = df['Crop'].str.strip()
df['Season'] = df['Season'].str.strip()

# ── FIX 2: Convert absolute totals → per-hectare rates ───────────────────────
# The CSV is district-level aggregated data:
#   Fertilizer column = total kg used across entire area (millions of kg)
#   Pesticide  column = total kg used across entire area
#   Yield      column = total production / area  (already per-hectare in some rows, not all)
# We normalise Fertilizer and Pesticide to kg/hectare so the model learns
# the same scale a farmer would input (100-200 kg/ha, not 7,000,000 kg)
df['Fertilizer_per_ha'] = df['Fertilizer'] / df['Area']   # kg/ha
df['Pesticide_per_ha']  = df['Pesticide']  / df['Area']   # kg/ha

# Drop rows where Area is 0 (division by zero) or clearly corrupt
df = df[df['Area'] > 0]

# ── FIX 3: Cap extreme outliers (Coconut yield of 5238 skews everything) ─────
# Use IQR-based capping at 99th percentile per crop
yield_p99 = df['Yield'].quantile(0.99)
fert_p99  = df['Fertilizer_per_ha'].quantile(0.99)
pest_p99  = df['Pesticide_per_ha'].quantile(0.99)

df['Yield']              = df['Yield'].clip(upper=yield_p99)
df['Fertilizer_per_ha']  = df['Fertilizer_per_ha'].clip(upper=fert_p99)
df['Pesticide_per_ha']   = df['Pesticide_per_ha'].clip(upper=pest_p99)

print("=== CLEANED YIELD STATS ===")
print(df['Yield'].describe())
print("\n=== CLEANED FERTILIZER/HA STATS ===")
print(df['Fertilizer_per_ha'].describe())
print("\n=== UNIQUE CROPS ===",   sorted(df['Crop'].unique().tolist()))
print("=== UNIQUE SEASONS ===", sorted(df['Season'].unique().tolist()))

# ── Encode ────────────────────────────────────────────────────────────────────
le_crop   = LabelEncoder()
le_season = LabelEncoder()
df['Crop']   = le_crop.fit_transform(df['Crop'])
df['Season'] = le_season.fit_transform(df['Season'])

joblib.dump(le_crop,   os.path.join(BASE_DIR, "le_crop.pkl"))
joblib.dump(le_season, os.path.join(BASE_DIR, "le_season.pkl"))
print("\n✅ Saved le_crop.pkl   classes:", list(le_crop.classes_))
print("✅ Saved le_season.pkl classes:", list(le_season.classes_))

# ── Features: use per-hectare values, keep Annual_Rainfall as-is ─────────────
FEATURES = ['Crop', 'Season', 'Annual_Rainfall', 'Fertilizer_per_ha', 'Pesticide_per_ha']
X = df[FEATURES]
y = df['Yield']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

joblib.dump(model, os.path.join(BASE_DIR, "model.pkl"))

# Save feature list so hybrid_service always uses same column order
joblib.dump(FEATURES, os.path.join(BASE_DIR, "feature_columns.pkl"))
print("✅ Saved model.pkl")
print("✅ Saved feature_columns.pkl:", FEATURES)

y_pred = model.predict(X_test)
r2   = r2_score(y_test, y_pred)
mae  = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"\n📊 R²   : {r2:.4f} ({r2*100:.1f}%)")
print(f"📊 MAE  : {mae:.4f}")
print(f"📊 RMSE : {rmse:.4f}")

# Quick sanity check — what does wheat/kharif predict now?
wheat_enc  = int(le_crop.transform(['Wheat'])[0])
kharif_enc = int(le_season.transform(['Kharif'])[0])
test = pd.DataFrame([{
    'Crop': wheat_enc, 'Season': kharif_enc,
    'Annual_Rainfall': 800,
    'Fertilizer_per_ha': 120,
    'Pesticide_per_ha': 1.5
}])
print(f"\n🌾 Sanity check — Wheat/Kharif/800mm/120kg fert: {model.predict(test)[0]:.2f} Q/ha")