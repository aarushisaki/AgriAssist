import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

from xgboost import XGBClassifier

# Create folder
os.makedirs("../models/fertilizer_models", exist_ok=True)

# Load data
df = pd.read_csv("../data/fertilizer_data.csv")

# Encoding
le_soil = LabelEncoder()
le_crop = LabelEncoder()
le_target = LabelEncoder()

df['Soil Type'] = le_soil.fit_transform(df['Soil Type'])
df['Crop Type'] = le_crop.fit_transform(df['Crop Type'])
df['Fertilizer Name'] = le_target.fit_transform(df['Fertilizer Name'])

X = df.drop('Fertilizer Name', axis=1)
y = df['Fertilizer Name']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# MODELS
models = {
    "Decision_Tree": DecisionTreeClassifier(),
    "Random_Forest": RandomForestClassifier(n_estimators=200),

    # 🔥 NEW
    "Gradient_Boosting": GradientBoostingClassifier(),
    "XGBoost": XGBClassifier(n_estimators=200)
}

# TRAIN
for name, model in models.items():
    print(f"\n===== {name} =====")

    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    print("Accuracy:", accuracy_score(y_test, preds))

    joblib.dump(model, f"../models/fertilizer_models/{name}.pkl")

print("\n✅ Advanced fertilizer models trained")