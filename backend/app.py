from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS so the React frontend can communicate with this API
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the backend!"}), 200

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        
        # Extract inputs
        lang = data.get('lang', 'hi')
        crop = data.get('crop', 'wheat')
        fertilizer = float(data.get('fertilizer', 120))
        rainfall = float(data.get('rainfall', 200))
        irrigation = data.get('irrigation', 'rainfed')
        
        # ---------------------------------------------------------
        # MOCK ML LOGIC (Replace this with your actual ML model later)
        # ---------------------------------------------------------
        base_yield = 40.0
        if crop == 'wheat':
            base_yield += 5.0
        elif crop == 'sugarcane':
            base_yield += 30.0
            
        current_yield = base_yield + (fertilizer * 0.08) + (rainfall * 0.035)
        potential_yield = current_yield + 25.4
        
        # Language strings
        strings = {
            'en': {
                'unit': 'Quintal / Hectare',
                'status': 'Average',
                'irrigation_title': 'Change Irrigation System',
                'irrigation_new': 'Drip Irrigation',
                'irrigation_ben': f'+27.6 Q/ha estimated gain',
                'irrigation_desc': 'Drip irrigation saves water and maintains moisture up to 60%. Roots develop well.',
                'fert_title': 'Optimize Fertilizer',
                'fert_new': f'{fertilizer + 60} kg/ha',
                'fert_ben': f'+13.7 Q/ha estimated gain',
                'fert_desc': 'Adding extra 60 kg/ha urea will optimize nitrogen needs and accelerate plant growth.',
                'rain_title': 'Additional Irrigation',
                'rain_new': f'{rainfall + 500} mm/year (Est.)',
                'rain_ben': f'+5.7 Q/ha estimated gain',
                'rain_desc': 'Provide 3-4 additional irrigations during crop development. Prevents drought stress.',
                'impact_high': 'High Impact',
                'impact_med': 'Medium Impact'
            },
            'hi': {
                'unit': 'क्विंटल / हेक्टेयर',
                'status': 'औसत',
                'irrigation_title': 'सिंचाई प्रणाली बदलें',
                'irrigation_new': 'टपक सिंचाई (ड्रिप)',
                'irrigation_ben': f'+27.6 क्विंटल/हेक्टेयर का अनुमानित लाभ',
                'irrigation_desc': 'टपक सिंचाई से पानी की बचत होती है और नमी 60% तक बनी रहती है। इससे जड़ें अच्छी तरह विकसित होती हैं।',
                'fert_title': 'उर्वरक बदलें',
                'fert_new': f'{fertilizer + 60} किग्रा/हेक्टेयर',
                'fert_ben': f'+13.7 क्विंटल/हेक्टेयर का अनुमानित लाभ',
                'fert_desc': 'अतिरिक्त 60 किग्रा/हेक्टेयर यूरिया डालने से नाइट्रोजन आवश्यकता बेहतर होगी और पौधे तेजी से बढ़ेंगे।',
                'rain_title': 'अतिरिक्त सिंचाई करें',
                'rain_new': f'{rainfall + 500} मिमी/वर्ष (अनुमानित)',
                'rain_ben': f'+5.7 क्विंटल/हेक्टेयर का अनुमानित लाभ',
                'rain_desc': 'फसल के विकास के 3-4 अतिरिक्त सिंचाई करें। कम पानी से फसल सूखे का शिकार होती है।',
                'impact_high': 'अधिक प्रभाव',
                'impact_med': 'मध्यम प्रभाव'
            }
        }
        
        s = strings[lang]

        # Value translators back to UI string formats
        irrigation_labels = {
            'en': {'rainfed': 'Rainfed', 'canal': 'Canal', 'tubewell': 'Tube well', 'drip': 'Drip Irrigation'},
            'hi': {'rainfed': 'वर्षा पर निर्भर', 'canal': 'नहर', 'tubewell': 'नलकूप', 'drip': 'टपक सिंचाई (ड्रिप)'}
        }
        
        # Formulate response
        response = {
            "summary": {
                "estimated_yield": round(current_yield, 1),
                "unit": s['unit'],
                "status": s['status'],
                "potential_yield": round(potential_yield, 1)
            },
            "inputs": data, 
            "scenarios": [
                {
                    "type": "irrigation",
                    "title": s['irrigation_title'],
                    "old_value": irrigation_labels[lang].get(irrigation, irrigation),
                    "new_value": s['irrigation_new'],
                    "benefit": s['irrigation_ben'],
                    "description": s['irrigation_desc'],
                    "impact": s['impact_high']
                },
                {
                    "type": "fertilizer",
                    "title": s['fert_title'],
                    "old_value": f"{fertilizer} {'kg/ha' if lang == 'en' else 'किग्रा/हेक्टेयर'}",
                    "new_value": s['fert_new'],
                    "benefit": s['fert_ben'],
                    "description": s['fert_desc'],
                    "impact": s['impact_high']
                },
                {
                    "type": "additional_irrigation",
                    "title": s['rain_title'],
                    "old_value": f"{rainfall} {'mm/yr' if lang == 'en' else 'मिमी/वर्ष'}",
                    "new_value": s['rain_new'],
                    "benefit": s['rain_ben'],
                    "description": s['rain_desc'],
                    "impact": s['impact_med']
                }
            ]
        }
        
        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Starts server at http://localhost:5000
    app.run(debug=True, port=5000)