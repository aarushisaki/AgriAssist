import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("data.csv")

print("Columns:", df.columns)

# Select useful columns (adjust if needed)
df = df[['Crop', 'Season', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Yield']]

# Encode categorical columns
le_crop = LabelEncoder()
le_season = LabelEncoder()

df['Crop'] = le_crop.fit_transform(df['Crop'])
df['Season'] = le_season.fit_transform(df['Season'])

# Split features and target
X = df.drop('Yield', axis=1)
y = df['Yield']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained successfully!")

from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import numpy as np

# Predict on test data
y_pred = model.predict(X_test)

# Metrics
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print("\n📊 MODEL PERFORMANCE:")
print("R2 Score:", r2)
print("MAE:", mae)
print("RMSE:", rmse)
print("Model Accuracy (approx):", r2 * 100, "%")