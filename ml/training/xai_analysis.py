import pandas as pd
import numpy as np
import joblib
import shap
import lime
import lime.lime_tabular
import dice_ml
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# -------------------------
# LOAD DATA
# -------------------------
df = pd.read_csv("../data/data.csv")

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

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y)

# -------------------------
# LOAD MODEL (BEST ONE)
# -------------------------
model = joblib.load("../models/yield_models/Random_Forest.pkl")

# -------------------------
# 🔥 SHAP EXPLANATION
# -------------------------
print("\n===== SHAP ANALYSIS =====")

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Summary plot
shap.summary_plot(shap_values, X_test, show=False)
plt.savefig("../models/shap_summary.png")

# Individual prediction
shap.force_plot(
    explainer.expected_value,
    shap_values[0],
    X_test.iloc[0],
    matplotlib=True
)
plt.savefig("../models/shap_force.png")

print("SHAP plots saved")

# -------------------------
# 🔥 LIME EXPLANATION
# -------------------------
print("\n===== LIME ANALYSIS =====")

lime_explainer = lime.lime_tabular.LimeTabularExplainer(
    training_data=np.array(X_train),
    feature_names=features,
    mode='regression'
)

exp = lime_explainer.explain_instance(
    X_test.iloc[0],
    model.predict
)

fig = exp.as_pyplot_figure()
fig.savefig("../models/lime_explanation.png")

print("LIME explanation saved")

# -------------------------
# 🔥 DICE (COUNTERFACTUALS)
# -------------------------
print("\n===== DiCE ANALYSIS =====")

data_dice = dice_ml.Data(
    dataframe=df,
    continuous_features=['Annual_Rainfall', 'Fertilizer_per_ha', 'Pesticide_per_ha'],
    outcome_name='Yield'
)

model_dice = dice_ml.Model(model=model, backend="sklearn")

dice = dice_ml.Dice(data_dice, model_dice, method="random")

query_instance = X_test.iloc[0]

cf = dice.generate_counterfactuals(
    query_instance.to_frame().T,
    total_CFs=3,
    desired_range=[y.mean(), y.max()]
)

cf.visualize_as_dataframe()

print("DiCE counterfactuals generated")

print("\n✅ XAI analysis complete")