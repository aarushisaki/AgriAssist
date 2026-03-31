import sys
import os

# 🔥 FIX: Add project root to path BEFORE imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, request, jsonify
from flask_cors import CORS
from ml.hybrid_service import recommend

app = Flask(__name__)
CORS(app)

# -------------------------------
# HYBRID MODEL ROUTE
# -------------------------------
@app.route("/recommend", methods=["POST"])
def get_recommendation():
    data = request.json
    result = recommend(data)
    return jsonify(result)


# -------------------------------
# EXISTING ANALYSIS ROUTE
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
                'impact_high': 'High Impact',
                'impact_med': 'Medium Impact'
            },
            'hi': {
                'unit': 'क्विंटल / हेक्टेयर',
                'status': 'औसत',
                'impact_high': 'अधिक प्रभाव',
                'impact_med': 'मध्यम प्रभाव'
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
    app.run(debug=True, port=5000)