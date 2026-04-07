import sys
import os
import json
from urllib.parse import urlencode
from urllib.request import urlopen

# -------------------------------
# SET PROJECT ROOT PROPERLY
# -------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(BASE_DIR)

# -------------------------------
# IMPORTS
# -------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import hybrid model
from ml.hybrid.hybrid_service import recommend

# -------------------------------
# APP INIT
# -------------------------------
app = Flask(__name__)
CORS(app)

# -------------------------------
# HEALTH CHECK (OPTIONAL BUT USEFUL)
# -------------------------------
@app.route("/")
def home():
    return "Backend is running 🚀"

def fetch_json(url):
    with urlopen(url, timeout=20) as response:
        return json.load(response)


@app.route("/weather", methods=["POST"])
def get_weather():
    try:
        data = request.get_json() or {}
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is None or longitude is None:
            return jsonify({"success": False, "error": "Latitude and longitude are required"}), 400

        latitude = float(latitude)
        longitude = float(longitude)

        from datetime import date

        today = date.today()
        last_full_year = today.year - 1
        first_year = last_full_year - 9

        forecast_url = "https://api.open-meteo.com/v1/forecast?" + urlencode({
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m",
        })
        rainfall_url = "https://archive-api.open-meteo.com/v1/archive?" + urlencode({
            "latitude": latitude,
            "longitude": longitude,
            "start_date": f"{first_year}-01-01",
            "end_date": f"{last_full_year}-12-31",
            "daily": "precipitation_sum",
            "timezone": "auto",
        })

        current_data = fetch_json(forecast_url)
        rainfall_data = fetch_json(rainfall_url)

        temperature = current_data.get("current", {}).get("temperature_2m")
        daily_values = rainfall_data.get("daily", {}).get("precipitation_sum") or []

        if temperature is None and not daily_values:
            return jsonify({"success": False, "error": "Weather data incomplete"}), 502

        annual_rainfall = None
        if daily_values:
            total_mm = sum(float(value or 0) for value in daily_values)
            annual_rainfall = round(total_mm / (last_full_year - first_year + 1))
            annual_rainfall = min(5000, max(50, annual_rainfall))

        return jsonify({
            "success": True,
            "data": {
                "temperature": round(float(temperature), 1) if temperature is not None else None,
                "rainfall": annual_rainfall,
            }
        }), 200

    except Exception as e:
        print("âŒ WEATHER ERROR:", str(e))
        return jsonify({"success": False, "error": str(e)}), 500

# -------------------------------
# HYBRID MODEL ROUTE
# -------------------------------
@app.route("/recommend", methods=["POST"])
def get_recommendation():
    try:
        data = request.get_json()

        print("\n📥 Incoming Data:", data)  # DEBUG LOG

        # -------------------------------
        # SAFE INPUT MAPPING (VERY IMPORTANT)
        # -------------------------------
        mapped_data = {
            "soil_pH": data.get("soil_pH") or data.get("ph"),
            "irrigation_type": data.get("irrigation_type") or data.get("irrigation"),
            "Annual_Rainfall": data.get("Annual_Rainfall") or data.get("rainfall"),
            "temperature": data.get("temperature"),
            "soil_type": data.get("soil_type") or data.get("soil"),
            "Area": data.get("Area") or data.get("area"),
            "Pesticide": data.get("Pesticide") or data.get("pesticide"),
            "Fertilizer": data.get("Fertilizer") or data.get("fertilizer"),  # ← ADD THIS
            "Crop": data.get("Crop") or data.get("crop", "wheat"),
            "Season": data.get("Season") or data.get("season", "kharif")
        }

        print("🧠 Mapped Data:", mapped_data)  # DEBUG LOG

        # -------------------------------
        # RUN HYBRID MODEL
        # -------------------------------
        result = recommend(mapped_data)

        print("✅ Result:", result)  # DEBUG LOG

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        print("❌ ERROR:", str(e))  # PRINT FULL ERROR

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -------------------------------
# OLD ANALYSIS ROUTE (OPTIONAL KEEP)
# -------------------------------
@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json

        lang = data.get('lang', 'hi')
        crop = data.get('crop', 'wheat')
        fertilizer = float(data.get('fertilizer', 120))
        rainfall = float(data.get('rainfall', 200))
        irrigation = data.get('irrigation', 'rainfed')

        base_yield = 40.0
        if crop == 'wheat':
            base_yield += 5.0
        elif crop == 'sugarcane':
            base_yield += 30.0

        current_yield = base_yield + (fertilizer * 0.08) + (rainfall * 0.035)
        potential_yield = current_yield + 25.4

        strings = {
            'en': {
                'unit': 'Quintal / Hectare',
                'status': 'Average',
            },
            'hi': {
                'unit': 'क्विंटल / हेक्टेयर',
                'status': 'औसत',
            }
        }

        s = strings[lang]

        response = {
            "summary": {
                "estimated_yield": round(current_yield, 1),
                "unit": s['unit'],
                "status": s['status'],
                "potential_yield": round(potential_yield, 1)
            },
            "inputs": data
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == '__main__':
    print("🚀 Starting Flask Server...")
    print("📁 Project Root:", BASE_DIR)
    app.run(debug=True, port=5000)
