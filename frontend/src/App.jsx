import React, { useState } from 'react';
import { Leaf, Droplet, Sun, Beaker, Activity, CheckCircle, ChevronRight, Sprout, Languages, MapPin, AlertCircle } from 'lucide-react';

const i18n = {
  en: {
    appTitle: "Smart Crop Recommendation System",
    crop: "Crop", wheat: "Wheat", paddy: "Paddy", maize: "Maize", sugarcane: "Sugarcane",
    soil: "Soil Type", loam: "Loam", black: "Black", red: "Red", sandy: "Sandy",
    season: "Season", kharif: "Kharif", rabi: "Rabi", zaid: "Zaid",
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
    disclaimer: "* These results are based on machine learning models.",
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
    suggestedImprovements: "Suggested Improvements",
    changeIrrigation: "Change Irrigation System",
    optimizeFertilizer: "Optimize Fertilizer",
    increaseIrrigation: "Increase Irrigation",
    yieldImprovement: "yield improvement",
    idealFertilizerTitle: "Ideal Fertilizer Recommendation",
    verdictTitle: "Verdict",
    explanationTitle: "Why this recommendation?",
    finalScore: "Final Score",
    costScore: "Cost Score",
    penaltyScore: "Condition Penalty",
    errorTitle: "Could not connect to backend",
    errorDesc: "Make sure your Flask server is running at http://localhost:5000",
    verdictHighly: "Highly Recommended",
    verdictRecommended: "Recommended",
    verdictModerate: "Moderately Suitable",
    verdictNot: "Not Recommended",
    expCostOk: "Fertilizer usage is cost-effective",
    expCostHigh: "Fertilizer usage is relatively high",
    expCondOk: "Soil and irrigation conditions are suitable",
    expCondBad: "Some conditions reduce effectiveness (low pH or flood irrigation)",
  },
  hi: {
    appTitle: "आधुनिक खेती के लिए स्मार्ट फसल सुझाव प्रणाली",
    crop: "फसल", wheat: "गेहूं", paddy: "धान", maize: "मक्का", sugarcane: "गन्ना",
    soil: "मिट्टी का प्रकार", loam: "दोमट", black: "काली", red: "लाल", sandy: "रेतीली",
    season: "फसल का मौसम", kharif: "खरीफ", rabi: "रबी", zaid: "जायद",
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
    disclaimer: "* यह परिणाम मशीन लर्निंग मॉडल पर आधारित हैं।",
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
    suggestedImprovements: "सुझाए गए सुधार",
    changeIrrigation: "सिंचाई प्रणाली बदलें",
    optimizeFertilizer: "उर्वरक अनुकूलित करें",
    increaseIrrigation: "सिंचाई बढ़ाएँ",
    yieldImprovement: "उपज में वृद्धि",
    idealFertilizerTitle: "आदर्श उर्वरक अनुशंसा",
    verdictTitle: "निर्णय",
    explanationTitle: "यह सुझाव क्यों?",
    finalScore: "अंतिम स्कोर",
    costScore: "लागत स्कोर",
    penaltyScore: "स्थिति दंड",
    errorTitle: "बैकएंड से कनेक्ट नहीं हो सका",
    errorDesc: "सुनिश्चित करें कि Flask सर्वर http://localhost:5000 पर चल रहा है",
    verdictHighly: "अत्यधिक अनुशंसित",
    verdictRecommended: "अनुशंसित",
    verdictModerate: "सामान्य रूप से उपयुक्त",
    verdictNot: "अनुशंसित नहीं",
    expCostOk: "उर्वरक उपयोग किफायती है",
    expCostHigh: "उर्वरक उपयोग अपेक्षाकृत अधिक है",
    expCondOk: "मिट्टी और सिंचाई की स्थिति उपयुक्त है",
    expCondBad: "कुछ परिस्थितियाँ प्रभावशीलता कम करती हैं (कम pH या बाढ़ सिंचाई)",
  }
};

const ScoreBar = ({ label, value, max = 1, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-amber-200/70 mb-1">
      <span>{label}</span>
      <span>{typeof value === 'number' ? value.toFixed(3) : '--'}</span>
    </div>
    <div className="w-full bg-amber-950 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
      />
    </div>
  </div>
);

const NumberInput = ({ label, name, step, value, onChange, unit }) => (
  <div className="mb-4">
    <label className="text-xs text-amber-200/70 block mb-1">{label} {unit && `(${unit})`}</label>
    <input
      type="number" name={name} step={step} value={value} onChange={onChange}
      className="w-full bg-[#2a1a10] border border-amber-900/50 rounded p-2 text-sm text-amber-100 focus:outline-none focus:border-yellow-500 transition-colors"
    />
  </div>
);

export default function App() {
  const [lang, setLang] = useState('hi');
  const t = i18n[lang];

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const [formData, setFormData] = useState({
    crop: 'wheat', soil: 'loam', season: 'kharif',
    rainfall: 200, temperature: 30, fertilizer: 120,
    pesticide: 8.0, area: 5, ph: 6.5, irrigation: 'rainfed'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = () => setLang(prev => prev === 'hi' ? 'en' : 'hi');

  const [detecting, setDetecting] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const fetchWeatherAndLocation = () => {
    if (!navigator.geolocation) {
      setWeatherError(lang === 'hi' ? 'जियोलोकेशन समर्थित नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const lat = latitude.toFixed(4);
        const lon = longitude.toFixed(4);
        try {
          // --- Step 1: Current temperature via wttr.in (very generous rate limits) ---
          const wttrRes = await fetch(
            `https://wttr.in/${lat},${lon}?format=j1`,
            { headers: { 'Accept': 'application/json' } }
          );
          if (!wttrRes.ok) throw new Error(`Weather service error: ${wttrRes.status}`);
          const wttrData = await wttrRes.json();
          const currentTemp = parseFloat(wttrData.current_condition?.[0]?.temp_C ?? null);
          if (isNaN(currentTemp)) throw new Error('Temperature data unavailable');

          // --- Step 2: Annual rainfall via Open-Meteo Archive API (separate quota, not forecast) ---
          // Uses the historical climate archive endpoint which has independent rate limits
          const today = new Date();
          const endDate = today.toISOString().slice(0, 10);
          const startDate = new Date(today.setFullYear(today.getFullYear() - 1))
            .toISOString().slice(0, 10);

          const archiveUrl = new URL('https://archive-api.open-meteo.com/v1/archive');
          archiveUrl.searchParams.set('latitude', lat);
          archiveUrl.searchParams.set('longitude', lon);
          archiveUrl.searchParams.set('start_date', startDate);
          archiveUrl.searchParams.set('end_date', endDate);
          archiveUrl.searchParams.set('daily', 'precipitation_sum');
          archiveUrl.searchParams.set('timezone', 'auto');

          const archiveRes = await fetch(archiveUrl.toString());
          let annualRainfall = 0;
          if (archiveRes.ok) {
            const archiveData = await archiveRes.json();
            const dailyPrecip = archiveData.daily?.precipitation_sum ?? [];
            annualRainfall = Math.round(
              dailyPrecip.filter(v => v != null).reduce((sum, v) => sum + v, 0)
            );
          }
          // If archive also fails, annualRainfall stays 0 — user can edit manually

          setFormData(prev => ({
            ...prev,
            temperature: parseFloat(currentTemp.toFixed(1)),
            rainfall: annualRainfall,
          }));
        } catch (err) {
          setWeatherError(lang === 'hi'
            ? `मौसम डेटा प्राप्त नहीं हुआ: ${err.message}`
            : `Could not fetch weather data: ${err.message}`);
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        setWeatherError(lang === 'hi'
          ? `स्थान प्राप्त नहीं हुआ: ${err.message}`
          : `Location access denied: ${err.message}`);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soil_pH: parseFloat(formData.ph),
          irrigation_type: formData.irrigation,
          Annual_Rainfall: parseFloat(formData.rainfall),
          temperature: parseFloat(formData.temperature),
          Area: parseFloat(formData.area),
          Pesticide: parseFloat(formData.pesticide),
          Fertilizer: parseFloat(formData.fertilizer),
          soil_type: formData.soil,
          Crop: formData.crop,
          Season: formData.season,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) throw new Error(data.error || "Unknown error from model");

      setResults(data.data);
      setActiveTab('summary');

    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buildScenarios = (results) => {
    if (!results) return [];
    const d = results.details;
    return [
      {
        type: 'irrigation',
        title: lang === 'hi' ? 'सिंचाई प्रणाली बदलें' : 'Change Irrigation System',
        old_val: t[formData.irrigation] || formData.irrigation,
        new_val: lang === 'hi' ? 'टपक सिंचाई (ड्रिप)' : 'Drip Irrigation',
        impact: lang === 'hi' ? 'अधिक प्रभाव' : 'High Impact',
        description: lang === 'hi'
          ? 'ड्रिप सिंचाई पानी की बर्बादी कम करती है और जड़ों तक सीधे पानी पहुँचाती है।'
          : 'Drip irrigation reduces water wastage and delivers water directly to roots.',
      },
      {
        type: 'fertilizer',
        title: lang === 'hi' ? 'उर्वरक अनुकूलित करें' : 'Optimize Fertilizer',
        old_val: `${formData.fertilizer} kg/ha`,
        new_val: `${Math.round(parseFloat(formData.fertilizer) * 1.15)} kg/ha`,
        impact: lang === 'hi' ? 'मध्यम प्रभाव' : 'Medium Impact',
        description: lang === 'hi'
          ? `मॉडल की सिफारिश: ${results.ideal_fertilizer}। सही मात्रा में उर्वरक उपज बढ़ाता है।`
          : `Model recommends: ${results.ideal_fertilizer}. Correct fertilizer quantity improves yield.`,
      },
      {
        type: 'additional_irrigation',
        title: lang === 'hi' ? 'वार्षिक वर्षा / सिंचाई बढ़ाएँ' : 'Increase Annual Irrigation',
        old_val: `${formData.rainfall} mm`,
        new_val: `${Math.round(parseFloat(formData.rainfall) + 100)} mm`,
        impact: d?.penalty > 0
          ? (lang === 'hi' ? 'उच्च प्रभाव (दंड सक्रिय)' : 'High Impact (Penalty Active)')
          : (lang === 'hi' ? 'मध्यम प्रभाव' : 'Medium Impact'),
        description: lang === 'hi'
          ? 'वर्षा या सिंचाई बढ़ाने से उपज में उल्लेखनीय सुधार हो सकता है।'
          : 'Increasing rainfall or supplemental irrigation can meaningfully improve yield.',
      }
    ];
  };

  const verdictColor = (verdictKey) => {
    if (!verdictKey) return 'text-amber-300';
    if (verdictKey === 'verdictHighly')      return 'text-green-400';
    if (verdictKey === 'verdictRecommended') return 'text-green-300';
    if (verdictKey === 'verdictModerate')    return 'text-yellow-400';
    if (verdictKey === 'verdictNot')         return 'text-red-400';
    return 'text-amber-300';
  };

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
                  type="button" onClick={fetchWeatherAndLocation} disabled={detecting}
                  className="flex items-center gap-1.5 text-[10px] font-medium bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 py-1.5 px-3 rounded-full border border-yellow-700/50 transition-colors disabled:opacity-50"
                >
                  {detecting
                    ? <><span className="w-3 h-3 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin inline-block" />{t.detecting}</>
                    : <><MapPin className="w-3 h-3" />{t.autoDetect}</>
                  }
                </button>
              </div>
              {weatherError && (
                <p className="text-[10px] text-red-400/80 mb-3 flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />{weatherError}
                </p>
              )}
              <NumberInput label={t.rainfall} name="rainfall" step="1" value={formData.rainfall} onChange={handleChange} unit={t.mmYr} />
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

        {/* ERROR STATE */}
        {error && (
          <div className="m-8 mt-20 bg-red-950/40 border border-red-700/50 rounded-xl p-6 flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">{t.errorTitle}</h3>
              <p className="text-sm text-red-200/70">{t.errorDesc}</p>
              <p className="text-xs text-red-400/60 mt-2 font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!results && !error && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-60 mt-12">
            <Sprout className="w-24 h-24 text-yellow-600/50 mb-6" />
            <h2 className="text-2xl font-bold mb-3 text-amber-100">{t.emptyTitle}</h2>
            <p className="text-amber-200/70 max-w-md text-center text-sm leading-relaxed">{t.emptyDesc}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-yellow-600/30 border-t-yellow-500 rounded-full animate-spin mb-4" />
            <p className="text-amber-200/60 text-sm">{t.analyzingBtn}</p>
          </div>
        )}

        {/* RESULTS */}
        {results && !loading && (
          <div className="max-w-5xl mx-auto w-full p-8 pt-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex space-x-6 border-b border-amber-900/50 mb-8 overflow-x-auto shrink-0 hide-scrollbar">
              {[['summary', t.tabSummary], ['whatif', t.tabWhatIf]].map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === key ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-amber-200/60 hover:text-amber-100'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* SUMMARY TAB */}
            {activeTab === 'summary' && (
              <div className="space-y-8">
                <div className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <p className="text-sm text-amber-200/70 mb-1">{t.estYield}</p>
                      <div className="flex items-baseline gap-2 mb-6">
                        <h2 className="text-5xl font-bold text-yellow-500">
                          {results?.details?.ml_prediction != null
                            ? results.details.ml_prediction.toFixed(2)
                            : '--'}
                        </h2>
                        <span className="text-amber-200/60">{lang === 'en' ? 'Q/ha' : 'क्विंटल/हे.'}</span>
                        <span className={`ml-auto text-xs font-medium px-3 py-1 rounded-full border border-current bg-black/20 ${verdictColor(results?.verdict_key)}`}>
                          {t[results?.verdict_key] || '--'}
                        </span>
                      </div>
                      <ScoreBar label={t.finalScore} value={results?.details?.final_score} color="bg-yellow-500" />
                      <ScoreBar label={t.costScore} value={results?.details?.cost_score} color="bg-green-500" />
                      <ScoreBar label={t.penaltyScore} value={results?.details?.penalty} max={0.5} color="bg-red-500" />
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

            {/* WHAT IF TAB */}
            {activeTab === 'whatif' && (
              <div className="space-y-6">
                <div className="bg-[#1f120a] border border-green-800/40 rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">🌱 {t.idealFertilizerTitle}</h2>
                  <p className="text-2xl font-bold text-yellow-400 mb-3">
                    {results?.ideal_fertilizer || 'N/A'}
                  </p>
                  <p className={`text-sm font-medium mb-3 ${verdictColor(results?.verdict_key)}`}>
                    <strong>{t.verdictTitle}:</strong> {t[results?.verdict_key] || results?.verdict_key || '--'}
                  </p>
                  <p className="text-xs text-amber-200/60 uppercase tracking-wider mb-2">{t.explanationTitle}</p>
                  <ul className="list-disc pl-5 text-sm text-amber-200/70 space-y-1">
                    {Array.isArray(results?.explanation_keys)
                      ? results.explanation_keys.map((key, idx) => (
                          <li key={idx}>
                            {key === 'expYield'
                              ? (lang === 'hi'
                                  ? `अनुमानित उपज ${results.yield_value} Q/ha है`
                                  : `Predicted yield is ${results.yield_value} Q/ha`)
                              : (t[key] || key.replace(/([A-Z])/g, ' $1').trim())}
                          </li>
                        ))
                      : <li>{lang === 'hi' ? 'कोई स्पष्टीकरण उपलब्ध नहीं।' : 'No explanation available.'}</li>}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-amber-100 mb-2">{t.whatIfTitle}</h2>
                  <p className="text-sm text-amber-200/60">{t.whatIfDesc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {buildScenarios(results).map((scenario, idx) => (
                    <div key={idx} className="bg-[#1f120a] border border-amber-900/30 rounded-xl p-5 shadow-lg flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4">
                        {scenario.type === 'irrigation' && <Droplet className="w-5 h-5 text-blue-400" />}
                        {scenario.type === 'fertilizer' && <Beaker className="w-5 h-5 text-purple-400" />}
                        {scenario.type === 'additional_irrigation' && <Sun className="w-5 h-5 text-yellow-400" />}
                        <h3 className="font-medium text-amber-100">{scenario.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-amber-200/80 mb-4 bg-[#150b06] p-2 rounded">
                        <span className="line-through opacity-60">{scenario.old_val}</span>
                        <ChevronRight className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-500 font-medium">{scenario.new_val}</span>
                      </div>
                      <p className="text-xs text-amber-200/60 leading-relaxed flex-1">{scenario.description}</p>
                      <div className="mt-4 pt-4 border-t border-amber-900/30">
                        <span className="inline-block text-[10px] px-2 py-1 rounded border border-green-500/50 text-green-400 bg-green-500/10">
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
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />
    </div>
  );
}