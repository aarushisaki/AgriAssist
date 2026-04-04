import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Get correct path
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "fertilizer_data.csv")

# Load dataset
df = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print(df.head())

# -------------------------------
# Encode categorical columns
# -------------------------------
label_encoders = {}

categorical_cols = ['Soil Type', 'Crop Type']

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# -------------------------------
# Encode target
# -------------------------------
target_encoder = LabelEncoder()
df['Fertilizer Name'] = target_encoder.fit_transform(df['Fertilizer Name'])

# -------------------------------
# Split data
# -------------------------------
X = df.drop("Fertilizer Name", axis=1)
y = df["Fertilizer Name"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------------
# Train model
# -------------------------------
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# -------------------------------
# Evaluate
# -------------------------------
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy:.2f}")

# -------------------------------
# Save everything
# -------------------------------
joblib.dump(model, os.path.join(BASE_DIR, "fertilizer_model.pkl"))
joblib.dump(label_encoders, os.path.join(BASE_DIR, "encoders.pkl"))
joblib.dump(target_encoder, os.path.join(BASE_DIR, "target_encoder.pkl"))

print("Fertilizer model saved successfully!")