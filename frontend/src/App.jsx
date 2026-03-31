import React, { useState } from 'react';
import { Leaf, Droplets, Sun, FlaskConical, CheckCircle, ChevronRight, Sprout, Languages } from 'lucide-react';

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
    whatIfDesc: "These changes have immense potential to improve your yield."
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
    whatIfDesc: "इन बदलावों से आपकी उपज में सुधार की अपार संभावना है।"
  }
};

export default function App() {
  const [lang, setLang] = useState('hi');
  const t = i18n[lang]; // active translation dictionary

  const [loading, setLoading] = useState(false);
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
    setResults(null); // Clear results to encourage re-fetch in new language
  };

  // Fallback function to simulate the backend if Flask isn't running locally
  const simulateBackend = (data) => {
    const lang = data.lang || 'hi';
    const crop = data.crop || 'wheat';
    const fertilizer = parseFloat(data.fertilizer || 120);
    const rainfall = parseFloat(data.rainfall || 200);
    const irrigation = data.irrigation || 'rainfed';

    let base_yield = 40.0;
    if (crop === 'wheat') base_yield += 5.0;
    else if (crop === 'sugarcane') base_yield += 30.0;

    const current_yield = base_yield + (fertilizer * 0.08) + (rainfall * 0.035);
    const potential_yield = current_yield + 25.4;

    const strings = {
      en: {
        unit: 'Quintal / Hectare', status: 'Average',
        irrigation_title: 'Change Irrigation System', irrigation_new: 'Drip Irrigation',
        irrigation_ben: `+27.6 Q/ha estimated gain`, irrigation_desc: 'Drip irrigation saves water and maintains moisture up to 60%. Roots develop well.',
        fert_title: 'Optimize Fertilizer', fert_new: `${fertilizer + 60} kg/ha`,
        fert_ben: `+13.7 Q/ha estimated gain`, fert_desc: 'Adding extra 60 kg/ha urea will optimize nitrogen needs and accelerate plant growth.',
        rain_title: 'Additional Irrigation', rain_new: `${rainfall + 500} mm/year (Est.)`,
        rain_ben: `+5.7 Q/ha estimated gain`, rain_desc: 'Provide 3-4 additional irrigations during crop development. Prevents drought stress.',
        impact_high: 'High Impact', impact_med: 'Medium Impact'
      },
      hi: {
        unit: 'क्विंटल / हेक्टेयर', status: 'औसत',
        irrigation_title: 'सिंचाई प्रणाली बदलें', irrigation_new: 'टपक सिंचाई (ड्रिप)',
        irrigation_ben: `+27.6 क्विंटल/हेक्टेयर का अनुमानित लाभ`, irrigation_desc: 'टपक सिंचाई से पानी की बचत होती है और नमी 60% तक बनी रहती है। इससे जड़ें अच्छी तरह विकसित होती हैं।',
        fert_title: 'उर्वरक बदलें', fert_new: `${fertilizer + 60} किग्रा/हेक्टेयर`,
        fert_ben: `+13.7 क्विंटल/हेक्टेयर का अनुमानित लाभ`, fert_desc: 'अतिरिक्त 60 किग्रा/हेक्टेयर यूरिया डालने से नाइट्रोजन आवश्यकता बेहतर होगी और पौधे तेजी से बढ़ेंगे।',
        rain_title: 'अतिरिक्त सिंचाई करें', rain_new: `${rainfall + 500} मिमी/वर्ष (अनुमानित)`,
        rain_ben: `+5.7 क्विंटल/हेक्टेयर का अनुमानित लाभ`, rain_desc: 'फसल के विकास के 3-4 अतिरिक्त सिंचाई करें। कम पानी से फसल सूखे का शिकार होती है।',
        impact_high: 'अधिक प्रभाव', impact_med: 'मध्यम प्रभाव'
      }
    };
    
    const s = strings[lang];
    const irrigation_labels = {
      en: { rainfed: 'Rainfed', canal: 'Canal', tubewell: 'Tube well', drip: 'Drip Irrigation' },
      hi: { rainfed: 'वर्षा पर निर्भर', canal: 'नहर', tubewell: 'नलकूप', drip: 'टपक सिंचाई (ड्रिप)' }
    };

    return {
      summary: {
        estimated_yield: parseFloat(current_yield.toFixed(1)),
        unit: s.unit,
        status: s.status,
        potential_yield: parseFloat(potential_yield.toFixed(1))
      },
      inputs: data,
      scenarios: [
        { type: "irrigation", title: s.irrigation_title, old_value: irrigation_labels[lang][irrigation] || irrigation, new_value: s.irrigation_new, benefit: s.irrigation_ben, description: s.irrigation_desc, impact: s.impact_high },
        { type: "fertilizer", title: s.fert_title, old_value: `${fertilizer} ${lang === 'en' ? 'kg/ha' : 'किग्रा/हेक्टेयर'}`, new_value: s.fert_new, benefit: s.fert_ben, description: s.fert_desc, impact: s.impact_high },
        { type: "additional_irrigation", title: s.rain_title, old_value: `${rainfall} ${lang === 'en' ? 'mm/yr' : 'मिमी/वर्ष'}`, new_value: s.rain_new, benefit: s.rain_ben, description: s.rain_desc, impact: s.impact_med }
      ]
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Attempt to hit the Flask Backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }) 
      });
      
      if (!response.ok) throw new Error("Server response wasn't ok");

      const data = await response.json();
      setResults(data);
      setActiveTab('summary');
      setLoading(false);
    } catch (error) {
      console.warn("Backend not detected. Falling back to internal JS simulation.", error);
      // Gracefully fallback to simulated logic
      setTimeout(() => {
        const mockData = simulateBackend({ ...formData, lang });
        setResults(mockData);
        setActiveTab('summary');
        setLoading(false);
      }, 800);
    }
  };

  const RangeInput = ({ label, name, min, max, step, value, onChange, unit }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-amber-200/70 mb-1">
        <label>{label} {unit && `(${unit})`}</label>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="range" name={name} min={min} max={max} step={step} value={value} onChange={onChange}
          className="w-full h-1 bg-amber-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <input 
          type="number" name={name} value={value} onChange={onChange}
          className="w-16 bg-[#2a1a10] border border-amber-900/50 rounded p-1 text-sm text-center text-amber-100 focus:outline-none focus:border-yellow-500"
        />
      </div>
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
            
            <div className="space-y-4">
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
            </div>

            <div className="py-2 border-t border-amber-900/30 my-4"></div>

            <RangeInput label={t.rainfall} name="rainfall" min="0" max="1000" step="10" value={formData.rainfall} onChange={handleChange} unit={t.mm} />
            <RangeInput label={t.temperature} name="temperature" min="0" max="50" step="0.5" value={formData.temperature} onChange={handleChange} unit="°C" />
            <RangeInput label={t.fertilizer} name="fertilizer" min="0" max="300" step="5" value={formData.fertilizer} onChange={handleChange} unit={t.kgHa} />
            <RangeInput label={t.pesticide} name="pesticide" min="0" max="20" step="0.1" value={formData.pesticide} onChange={handleChange} unit={t.kgHa} />
            <RangeInput label={t.area} name="area" min="0" max="50" step="1" value={formData.area} onChange={handleChange} unit={t.ha} />
            
            <div className="mb-4">
              <label className="text-xs text-amber-200/70 block mb-1">{t.ph}</label>
              <input 
                type="number" name="ph" step="0.1" value={formData.ph} onChange={handleChange}
                className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500"
              />
            </div>

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
          <p className="text-[10px] text-amber-200/50 text-center mt-2">
            {t.disclaimer}
          </p>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        
        {/* Language Toggle Button */}
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
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-60 mt-12">
            <Sprout className="w-24 h-24 text-yellow-600/50 mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-amber-100">{t.emptyTitle}</h2>
            <p className="text-amber-200/70 max-w-md text-center text-sm leading-relaxed">
              {t.emptyDesc}
            </p>
          </div>
        ) : (
          // Results State
          <div className="max-w-5xl mx-auto w-full p-8 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Tabs Navigation */}
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
                {/* Yield Card */}
                <div className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-6 shadow-lg flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-amber-200/70 mb-1">{t.estYield}</p>
                        <div className="flex items-baseline gap-2">
                          <h2 className="text-5xl font-bold text-yellow-500">{results.summary.estimated_yield}</h2>
                          <span className="text-amber-200/60">{results.summary.unit}</span>
                        </div>
                      </div>
                      <div className="bg-green-900/40 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-green-800/50 shrink-0">
                        <CheckCircle className="w-3 h-3" /> {results.summary.status}
                      </div>
                    </div>
  
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-amber-200/70 mb-2">
                          <span>{t.currentYield}</span>
                        </div>
                        <div className="w-full bg-amber-950 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-amber-200/70 mb-2">
                          <span>{t.potentialYield}</span>
                        </div>
                        <div className="w-full bg-amber-950 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entered Info Summary */}
                <div className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-semibold text-amber-100 mb-4 pb-2 border-b border-amber-900/30">{t.enteredInfo}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm">
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.crop}</span>
                      <span className="text-amber-50">{t[results.inputs.crop]}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.soil}</span>
                      <span className="text-amber-50">{t[results.inputs.soil]}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.season}</span>
                      <span className="text-amber-50">{t[results.inputs.season]}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.rainfall}</span>
                      <span className="text-amber-50">{results.inputs.rainfall} {t.mmYr}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.temperature}</span>
                      <span className="text-amber-50">{results.inputs.temperature}°C</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.fertilizer}</span>
                      <span className="text-amber-50">{results.inputs.fertilizer} {t.kgHa}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.pesticide}</span>
                      <span className="text-amber-50">{results.inputs.pesticide} {t.kgHa}</span>
                    </div>
                    <div>
                      <span className="block text-amber-200/50 text-xs mb-1">{t.ph}</span>
                      <span className="text-amber-50">{results.inputs.ph}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3 md:col-span-4">
                      <span className="block text-amber-200/50 text-xs mb-1">{t.irrigation}</span>
                      <span className="text-amber-50">{t[results.inputs.irrigation]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatif' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-amber-100 mb-2">{t.whatIfTitle}</h2>
                  <p className="text-sm text-amber-200/60">{t.whatIfDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.scenarios.map((scenario, idx) => (
                    <div key={idx} className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-5 shadow-lg flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4">
                        {scenario.type === 'irrigation' && <Droplets className="w-5 h-5 text-blue-400 shrink-0" />}
                        {scenario.type === 'fertilizer' && <FlaskConical className="w-5 h-5 text-purple-400 shrink-0" />}
                        {scenario.type === 'additional_irrigation' && <Sun className="w-5 h-5 text-yellow-400 shrink-0" />}
                        <h3 className="font-medium text-amber-100">{scenario.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-amber-200/80 mb-4 bg-[#150b06] p-2 rounded">
                        <span className="line-through opacity-60">{scenario.old_value}</span>
                        <ChevronRight className="w-4 h-4 text-yellow-600 shrink-0" />
                        <span className="text-yellow-500 font-medium">{scenario.new_value}</span>
                      </div>
                      
                      <div className="text-green-400 text-sm font-medium mb-3">
                        {scenario.benefit}
                      </div>
                      
                      <p className="text-xs text-amber-200/60 leading-relaxed flex-1">
                        {scenario.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-amber-900/30">
                        <span className={`inline-block text-[10px] px-2 py-1 rounded border ${scenario.impact === 'अधिक प्रभाव' || scenario.impact === 'High Impact' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'}`}>
                          {scenario.impact}
                        </span>
                      </div>
                    </div>
                  ))}
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
      `}} />
    </div>
  );
}