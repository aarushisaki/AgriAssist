import React, { useState } from 'react';
import { Leaf, Droplet, Sun, Beaker, Activity, CheckCircle, ChevronRight, Sprout, Languages, MapPin } from 'lucide-react';

// Dictionary for translations
const i18n = {
  en: {
    appTitle: "Smart Crop Recommendation System",
    crop: "Crop",
    wheat: "Wheat", paddy: "Paddy", maize: "Maize", sugarcane: "Sugarcane",
    soil: "Soil Type",
    loam: "Loam", black: "Black", red: "Red", sandy: "Sandy",
    season: "Season",
    kharif: "Kharif", rabi: "Rabi", zaid: "Zaid",
    rainfall: "Rainfall", mm: "mm", mmYr: "mm/yr",
    temperature: "Temperature",
    fertilizer: "Fertilizer", kgHa: "kg/ha",
    pesticide: "Pesticide",
    area: "Area", ha: "ha",
    ph: "Soil pH",
    irrigation: "Irrigation System",
    rainfed: "Rainfed", canal: "Canal", tubewell: "Tube well", drip: "Drip Irrigation",
    analyzeBtn: "Analyze and Get Recommendations",
    analyzingBtn: "Analyzing...",
    disclaimer: "* These results are based on artificial intelligence.",
    emptyTitle: "Enter your farm details",
    emptyDesc: "Fill in your farm details on the left and click 'Analyze'. AgriAssist will give you scientific recommendations to increase your crop yield.",
    tabSummary: "Summary",
    tabWhatIf: "What if...?",
    estYield: "Estimated Yield",
    currentYield: "Your Current Yield",
    potentialYield: "Potential Yield After Suggestions",
    enteredInfo: "Entered Information",
    whatIfTitle: "What happens if you make these changes?",
    whatIfDesc: "These changes have immense potential to improve your yield.",
    autoDetect: "Auto-Detect Weather",
    detecting: "Detecting...",
    locSuccess: "Live weather data fetched successfully!",
    locError: "Failed to get location. Please allow browser permissions.",
    weatherError: "Failed to fetch weather data.",
    suggestedImprovements: "Suggested Improvements",
    changeIrrigation: "Change Irrigation System",
    optimizeFertilizer: "Optimize Fertilizer",
    increaseIrrigation: "Increase Irrigation",
    yieldImprovement: "yield improvement",
    idealFertilizerTitle: "Ideal Fertilizer Recommendation",
    verdictTitle: "Verdict",
    explanationTitle: "Why this recommendation?",
    // Result specific translations
    urea: "Urea",
    modSuitable: "Moderately Suitable",
    expYield: "Predicted yield is 2.66 tons/hectare",
    expCost: "Fertilizer is cost-effective",
    expCond: "Soil and irrigation conditions are suitable"
  },
  hi: {
    appTitle: "आधुनिक खेती के लिए स्मार्ट फसल सुझाव प्रणाली",
    crop: "फसल",
    wheat: "गेहूं", paddy: "धान", maize: "मक्का", sugarcane: "गन्ना",
    soil: "मिट्टी का प्रकार",
    loam: "दोमट", black: "काली", red: "लाल", sandy: "रेतीली",
    season: "फसल का मौसम",
    kharif: "खरीफ", rabi: "रबी", zaid: "जायद",
    rainfall: "वर्षा", mm: "मिमी", mmYr: "मिमी/वर्ष",
    temperature: "तापमान",
    fertilizer: "उर्वरक", kgHa: "किग्रा/हे.",
    pesticide: "कीटनाशक",
    area: "क्षेत्रफल", ha: "हेक्टेयर",
    ph: "मिट्टी का pH मान",
    irrigation: "सिंचाई प्रणाली",
    rainfed: "वर्षा पर निर्भर", canal: "नहर", tubewell: "नलकूप", drip: "टपक सिंचाई (ड्रिप)",
    analyzeBtn: "विश्लेषण करें और सुझाव पाएं",
    analyzingBtn: "विश्लेषण हो रहा है...",
    disclaimer: "* यह परिणाम कृत्रिम बुद्धिमत्ता पर आधारित हैं।",
    emptyTitle: "अपने खेत की जानकारी भरें",
    emptyDesc: "बाईं तरफ अपने खेत की जानकारी भरें और 'विश्लेषण करें' पर क्लिक करें। किसान मित्र आपको आपकी फसल की उपज बढ़ाने के लिए वैज्ञानिक सुझाव देगा।",
    tabSummary: "सारांश",
    tabWhatIf: "क्या होगा अगर...?",
    estYield: "अनुमानित उपज",
    currentYield: "आपकी वर्तमान उपज",
    potentialYield: "सुझाव के बाद संभावित उपज",
    enteredInfo: "दर्ज की गई जानकारी",
    whatIfTitle: "अगर आप ये बदलाव करते हैं, तो क्या होगा?",
    whatIfDesc: "इन बदलावों से आपकी उपज में सुधार की अपार संभावना है।",
    autoDetect: "मौसम स्वतः प्राप्त करें",
    detecting: "खोजा जा रहा...",
    locSuccess: "लाइव मौसम डेटा सफलतापूर्वक प्राप्त किया गया!",
    locError: "लोकेशन प्राप्त करने में विफल। कृपया ब्राउज़र परमिशन दें।",
    weatherError: "मौसम डेटा लाने में विफल।",
    suggestedImprovements: "सुझाए गए सुधार",
    changeIrrigation: "सिंचाई प्रणाली बदलें",
    optimizeFertilizer: "उर्वरक अनुकूलित करें",
    increaseIrrigation: "सिंचाई बढ़ाएँ",
    yieldImprovement: "उपज में वृद्धि",
    idealFertilizerTitle: "आदर्श उर्वरक अनुशंसा",
    verdictTitle: "निर्णय",
    explanationTitle: "यह सुझाव क्यों?",
    // Result specific translations
    urea: "यूरिया (Urea)",
    modSuitable: "सामान्य रूप से उपयुक्त",
    expYield: "अनुमानित उपज 2.66 टन/हेक्टेयर है",
    expCost: "उर्वरक किफायती है",
    expCond: "मिट्टी और सिंचाई की स्थिति उपयुक्त है"
  }
};

export default function App() {
  const [lang, setLang] = useState('hi');
  const t = i18n[lang]; 

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  // Initial Form State 
  const [formData, setFormData] = useState({
    crop: 'wheat',
    soil: 'loam',
    season: 'kharif',
    rainfall: 200,
    temperature: 30,
    fertilizer: 120,
    pesticide: 8.0,
    area: 5,
    ph: 6.5,
    irrigation: 'rainfed'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const fetchWeatherAndLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation`);
        if (!response.ok) throw new Error("Weather API failed");
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          temperature: data.current.temperature_2m,
          rainfall: Math.min(1000, Math.floor(data.current.precipitation * 50 + 300))
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLocLoading(false);
      }
    }, (err) => {
      setLocLoading(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soil_pH: formData.ph,
          irrigation_type: formData.irrigation,
          Annual_Rainfall: formData.rainfall,
          Area: formData.area,
          Pesticide: formData.pesticide
        })
      });

      const data = await response.json();
      setResults(data.data);
      setActiveTab('summary');
    } catch (error) {
      // Mock data for demonstration - using keys for translation
      setResults({
        details: { ml_prediction: 45.2 },
        summary_unit: lang === 'en' ? 'Q/ha' : 'क्विंटल/हेक्टेयर',
        summary_status: lang === 'en' ? 'Optimal' : 'सर्वोत्तम',
        ideal_fertilizer_key: "urea",
        verdict_key: "modSuitable",
        explanation_keys: ["expYield", "expCost", "expCond"],
        scenarios: [
          { type: 'irrigation', title_key: 'changeIrrigation', old_key: 'rainfed', new_key: 'drip', impact_en: 'High Impact', impact_hi: 'अधिक प्रभाव' },
          { type: 'fertilizer', title_key: 'optimizeFertilizer', old_val: formData.fertilizer + ' kg', new_val: (parseInt(formData.fertilizer) + 20) + ' kg', impact_en: 'High Impact', impact_hi: 'अधिक प्रभाव' },
          { type: 'additional_irrigation', title_key: 'increaseIrrigation', old_val: formData.rainfall + ' mm', new_val: (parseInt(formData.rainfall) + 100) + ' mm', impact_en: 'Medium Impact', impact_hi: 'मध्यम प्रभाव' }
        ]
      });
    }
    setLoading(false);
  };

  const NumberInput = ({ label, name, step, value, onChange, unit }) => (
    <div className="mb-4">
      <label className="text-xs text-amber-200/70 block mb-1">
        {label} {unit && `(${unit})`}
      </label>
      <input 
        type="number" 
        name={name} 
        step={step} 
        value={value} 
        onChange={onChange}
        className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500 transition-colors"
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#26160d] text-amber-50 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-[#1a0f05] border-r border-amber-900/30 flex flex-col h-full shadow-2xl z-10 shrink-0">
        <div className="p-4 border-b border-amber-900/30">
          <h1 className="text-sm font-semibold text-yellow-500 flex items-center gap-2">
            <Leaf className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.appTitle}</span>
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <form id="agri-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-amber-200/70 block mb-1">{t.crop}</label>
              <select name="crop" value={formData.crop} onChange={handleChange} className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500">
                <option value="wheat">{t.wheat}</option>
                <option value="paddy">{t.paddy}</option>
                <option value="maize">{t.maize}</option>
                <option value="sugarcane">{t.sugarcane}</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-amber-200/70 block mb-1">{t.soil}</label>
              <select name="soil" value={formData.soil} onChange={handleChange} className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500">
                <option value="loam">{t.loam}</option>
                <option value="black">{t.black}</option>
                <option value="red">{t.red}</option>
                <option value="sandy">{t.sandy}</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-amber-200/70 block mb-1">{t.season}</label>
              <select name="season" value={formData.season} onChange={handleChange} className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500">
                <option value="kharif">{t.kharif}</option>
                <option value="rabi">{t.rabi}</option>
                <option value="zaid">{t.zaid}</option>
              </select>
            </div>

            <div className="py-4 border-t border-amber-900/30 my-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-amber-100/80 uppercase tracking-wider">Weather Data</span>
                <button
                  type="button" onClick={fetchWeatherAndLocation} disabled={locLoading}
                  className="flex items-center gap-1.5 text-[10px] font-medium bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 py-1.5 px-3 rounded-full border border-yellow-700/50 transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-3 h-3" />
                  {locLoading ? t.detecting : t.autoDetect}
                </button>
              </div>
              <NumberInput label={t.rainfall} name="rainfall" step="1" value={formData.rainfall} onChange={handleChange} unit={t.mm} />
              <NumberInput label={t.temperature} name="temperature" step="0.1" value={formData.temperature} onChange={handleChange} unit="°C" />
            </div>

            <NumberInput label={t.fertilizer} name="fertilizer" step="1" value={formData.fertilizer} onChange={handleChange} unit={t.kgHa} />
            <NumberInput label={t.pesticide} name="pesticide" step="0.1" value={formData.pesticide} onChange={handleChange} unit={t.kgHa} />
            <NumberInput label={t.area} name="area" step="0.1" value={formData.area} onChange={handleChange} unit={t.ha} />
            <NumberInput label={t.ph} name="ph" step="0.1" value={formData.ph} onChange={handleChange} />

            <div>
              <label className="text-xs text-amber-200/70 block mb-1">{t.irrigation}</label>
              <select name="irrigation" value={formData.irrigation} onChange={handleChange} className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500">
                <option value="rainfed">{t.rainfed}</option>
                <option value="canal">{t.canal}</option>
                <option value="tubewell">{t.tubewell}</option>
                <option value="drip">{t.drip}</option>
              </select>
            </div>
          </form>
        </div>
        
        <div className="p-4 border-t border-amber-900/30 bg-[#1a0f05]">
          <button 
            type="submit" form="agri-form" disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-500 text-amber-950 font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? t.analyzingBtn : t.analyzeBtn}
          </button>
          <p className="text-[10px] text-amber-200/50 text-center mt-2">{t.disclaimer}</p>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="absolute top-6 right-8 z-20">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-[#1a0f05] border border-amber-900/50 px-4 py-2 rounded-full text-sm font-medium text-amber-200 hover:text-yellow-500 hover:border-yellow-500/50 transition-colors shadow-lg"
          >
            <Languages className="w-4 h-4" />
            {lang === 'hi' ? 'English' : 'हिंदी'}
          </button>
        </div>

        {!results ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-60 mt-12">
            <Sprout className="w-24 h-24 text-yellow-600/50 mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-amber-100">{t.emptyTitle}</h2>
            <p className="text-amber-200/70 max-w-md text-center text-sm leading-relaxed">{t.emptyDesc}</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full p-8 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex space-x-6 border-b border-amber-900/50 mb-8 overflow-x-auto shrink-0 hide-scrollbar">
              <button 
                onClick={() => setActiveTab('summary')}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'summary' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-amber-200/60 hover:text-amber-100'}`}
              >
                {t.tabSummary}
              </button>
              <button 
                onClick={() => setActiveTab('whatif')}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'whatif' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-amber-200/60 hover:text-amber-100'}`}
              >
                {t.tabWhatIf}
              </button>
            </div>

            {activeTab === 'summary' && (
              <div className="space-y-8">
                <div className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-amber-200/70 mb-1">{t.estYield}</p>
                        <div className="flex items-baseline gap-2">
                          <h2 className="text-5xl font-bold text-yellow-500">{results?.details?.ml_prediction?.toFixed(2) || "--"}</h2>
                          <span className="text-amber-200/60">{lang === 'en' ? 'Q/ha' : 'क्विंटल/हे.'}</span>
                        </div>
                      </div>
                      <div className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-green-800/50 shrink-0">
                        <CheckCircle className="w-3 h-3" /> {results.summary_status || (lang === 'en' ? 'Optimal' : 'सर्वोत्तम')}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-amber-200/70 mb-2"><span>{t.currentYield}</span></div>
                        <div className="w-full bg-amber-950 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-amber-200/70 mb-2"><span>{t.potentialYield}</span></div>
                        <div className="w-full bg-amber-950 rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85%' }}></div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1f120a] border border-amber-900/40 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-amber-100 mb-4">{t.enteredInfo}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-amber-200/70">{t.crop}</p><span className="text-amber-50">{t[formData.crop]}</span></div>
                    <div><p className="text-amber-200/70">{t.soil}</p><span className="text-amber-50">{t[formData.soil]}</span></div>
                    <div><p className="text-amber-200/70">{t.season}</p><span className="text-amber-50">{t[formData.season]}</span></div>
                    <div><p className="text-amber-200/70">{t.rainfall}</p><span className="text-amber-50">{formData.rainfall} {t.mmYr}</span></div>
                    <div><p className="text-amber-200/70">{t.temperature}</p><span className="text-amber-50">{formData.temperature}°C</span></div>
                    <div><p className="text-amber-200/70">{t.fertilizer}</p><span className="text-amber-50">{formData.fertilizer} {t.kgHa}</span></div>
                    <div><p className="text-amber-200/70">{t.pesticide}</p><span className="text-amber-50">{formData.pesticide} {t.kgHa}</span></div>
                    <div><p className="text-amber-200/70">{t.ph}</p><span className="text-amber-50">{formData.ph}</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatif' && (
              <div className="space-y-6">
                {/* 🌱 Ideal Fertilizer Recommendation Section - FIXED ALL TRANSLATIONS */}
                <div className="bg-[#1f120a] border border-green-800/40 rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    🌱 {t.idealFertilizerTitle}
                  </h2>
                  <p className="text-2xl font-bold text-yellow-400 mb-3">
                    {t[results?.ideal_fertilizer_key] || results?.ideal_fertilizer || "N/A"}
                  </p>
                  <p className="text-sm text-amber-200/70 mb-2">
                    <strong>{t.verdictTitle}:</strong> {t[results?.verdict_key] || results?.verdict}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-amber-200/70 space-y-1">
                    {results?.explanation_keys ? results.explanation_keys.map((key, index) => (
                      <li key={index}>{t[key]}</li>
                    )) : results?.explanation?.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-amber-100 mb-2">{t.whatIfTitle}</h2>
                  <p className="text-sm text-amber-200/60">{t.whatIfDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results?.scenarios?.map((scenario, idx) => (
                    <div key={idx} className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-5 shadow-lg flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4">
                        {scenario?.type === 'irrigation' && <Droplet className="w-5 h-5 text-blue-400" />}
                        {scenario?.type === 'fertilizer' && <Beaker className="w-5 h-5 text-purple-400" />}
                        {scenario?.type === 'additional_irrigation' && <Sun className="w-5 h-5 text-yellow-400" />}
                        <h3 className="font-medium text-amber-100">{t[scenario?.title_key] || scenario?.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-200/80 mb-4 bg-[#150b06] p-2 rounded">
                        <span className="line-through opacity-60">{t[scenario?.old_key] || scenario?.old_val || scenario?.old_value}</span>
                        <ChevronRight className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-500 font-medium">{t[scenario?.new_key] || scenario?.new_val || scenario?.new_value}</span>
                      </div>
                      <div className="text-green-400 text-sm font-medium mb-3">{scenario?.benefit}</div>
                      <p className="text-xs text-amber-200/60 leading-relaxed flex-1">{t[scenario?.description_key] || scenario?.description}</p>
                      <div className="mt-4 pt-4 border-t border-amber-900/30">
                        <span className="inline-block text-[10px] px-2 py-1 rounded border border-green-500/50 text-green-400 bg-green-500/10">
                          {lang === 'hi' ? scenario?.impact_hi : scenario?.impact_en}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1f120a] border border-amber-900/40 rounded-xl p-6 shadow-lg mt-6">
                  <h3 className="text-lg font-semibold text-amber-100 mb-4">⚡ {t.suggestedImprovements}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#2a160c] p-4 rounded-lg border border-green-800/30">
                      <h4 className="text-green-400 font-semibold mb-2">{t.changeIrrigation}</h4>
                      <p className="text-sm text-amber-200/70 mb-2">{t.rainfedToDrip}</p>
                      <p className="text-green-300 text-sm font-medium">+25% {t.yieldImprovement}</p>
                    </div>
                    <div className="bg-[#2a160c] p-4 rounded-lg border border-green-800/30">
                      <h4 className="text-green-400 font-semibold mb-2">{t.optimizeFertilizer}</h4>
                      <p className="text-sm text-amber-200/70 mb-2">{t.optimizeDesc}</p>
                      <p className="text-green-300 text-sm font-medium">+15% {t.yieldImprovement}</p>
                    </div>
                    <div className="bg-[#2a160c] p-4 rounded-lg border border-yellow-800/30">
                      <h4 className="text-yellow-400 font-semibold mb-2">{t.increaseIrrigation}</h4>
                      <p className="text-sm text-amber-200/70 mb-2">{t.increaseWaterDesc}</p>
                      <p className="text-yellow-300 text-sm font-medium">+15% {t.yieldImprovement}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #452b18; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #5c3a21; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />
    </div>
  );
}