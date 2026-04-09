import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

from xgboost import XGBRegressor

# Create model folder
os.makedirs("../models/yield_models", exist_ok=True)

# Load data
df = pd.read_csv("../data/data.csv")

# Preprocessing
df['Crop'] = df['Crop'].str.strip()
df['Season'] = df['Season'].str.strip()

df['Fertilizer_per_ha'] = df['Fertilizer'] / df['Area']
df['Pesticide_per_ha'] = df['Pesticide'] / df['Area']

# Encoding
le_crop = LabelEncoder()
le_season = LabelEncoder()

df['Crop'] = le_crop.fit_transform(df['Crop'])
df['Season'] = le_season.fit_transform(df['Season'])

features = ['Crop', 'Season', 'Annual_Rainfall', 'Fertilizer_per_ha', 'Pesticide_per_ha']
target = 'Yield'

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# MODELS
models = {
    "Linear_Regression": LinearRegression(),
    "Decision_Tree": DecisionTreeRegressor(),
    "Random_Forest": RandomForestRegressor(n_estimators=200),

    # 🔥 NEW
    "Gradient_Boosting": GradientBoostingRegressor(),
    "XGBoost": XGBRegressor(n_estimators=200, learning_rate=0.1)
}

# TRAIN
for name, model in models.items():
    print(f"\n===== {name} =====")

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    print("R2:", r2_score(y_test, preds))
    print("MAE:", mean_absolute_error(y_test, preds))
    print("RMSE:", np.sqrt(mean_squared_error(y_test, preds)))

    joblib.dump(model, f"../models/yield_models/{name}.pkl")

print("\n✅ Advanced yield models trained")