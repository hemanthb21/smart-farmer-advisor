// ============================================================
// DATA.JS – Static data, translations, mock data
// ============================================================

const LANG = {
  en: {
    appName: 'Smart Farmer Advisor',
    tagline: 'Kisan ka Digital Dost\n(Farmer\'s Digital Friend)',
    getStarted: 'Get Started',
    guestMode: 'Continue as Guest',
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    selectLang: 'Choose Your Language',
    home: 'Home', myFarm: 'My Farm', askAI: 'Ask AI', schemes: 'Schemes', profile: 'Profile',
    cropAdvisor: 'Crop Advisor', diseaseScan: 'Disease Scan', weather: 'Weather',
    mandiPrices: 'Mandi Prices', govSchemes: 'Gov Schemes', voiceHelp: 'Voice Help',
    reminders: 'Reminders', soilHealth: 'Soil Health', analytics: 'Analytics',
    marketplace: 'Marketplace', expertConnect: 'Expert Connect', community: 'Community',
    aiAlert: '🌧️ Rain expected in 2 days — prepare drainage',
    scanCrop: 'Scan Your Crop',
    getRecommendation: 'Get AI Advice',
    loading: 'Analyzing your crop... 🔍',
    name: 'Your Name', state: 'State', district: 'District', village: 'Village',
    landSize: 'Land Size', soilType: 'Soil Type', waterSource: 'Water Source',
    primaryCrops: 'Primary Crops', saveProfile: 'Save Profile',
    step: 'Step', of: 'of',
  },
  hi: {
    appName: 'स्मार्ट किसान सलाहकार',
    tagline: 'किसान का डिजिटल दोस्त',
    getStarted: 'शुरू करें',
    guestMode: 'अतिथि के रूप में जारी रखें',
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
    selectLang: 'अपनी भाषा चुनें',
    home: 'होम', myFarm: 'मेरी खेती', askAI: 'AI पूछें', schemes: 'योजनाएं', profile: 'प्रोफाइल',
    cropAdvisor: 'फसल सलाह', diseaseScan: 'रोग जांच', weather: 'मौसम',
    mandiPrices: 'मंडी भाव', govSchemes: 'सरकारी योजना', voiceHelp: 'आवाज़ सहायता',
    reminders: 'याद दिलाएं', soilHealth: 'मिट्टी स्वास्थ्य', analytics: 'विश्लेषण',
    marketplace: 'बाज़ार', expertConnect: 'विशेषज्ञ', community: 'समुदाय',
    aiAlert: '🌧️ 2 दिन में बारिश — जल निकासी तैयार करें',
    getRecommendation: 'AI सलाह लें',
    loading: 'आपकी फसल का विश्लेषण हो रहा है... 🔍',
    name: 'आपका नाम', state: 'राज्य', district: 'जिला', village: 'गांव',
    landSize: 'ज़मीन का आकार', soilType: 'मिट्टी का प्रकार', waterSource: 'जल स्रोत',
    primaryCrops: 'प्रमुख फसलें', saveProfile: 'प्रोफाइल सेव करें',
    step: 'चरण', of: 'का',
  },
  te: {
    appName: 'స్మార్ట్ రైతు సలహాదారు',
    tagline: 'కిసాన్ కా డిజిటల్ దోస్త్\n(రైతు యొక్క డిజిటల్ మిత్రుడు)',
    getStarted: 'ప్రారంభించండి',
    guestMode: 'అతిథిగా కొనసాగించండి',
    goodMorning: 'శుభోదయం',
    goodAfternoon: 'నమస్కారం',
    goodEvening: 'శుభ సాయంత్రం',
    selectLang: 'మీ భాషను ఎంచుకోండి',
    home: 'హోమ్', myFarm: 'నా పొలం', askAI: 'AI అడగండి', schemes: 'పథకాలు', profile: 'ప్రొఫైల్',
    cropAdvisor: 'పంట సలహా', diseaseScan: 'వ్యాధి పరీక్ష', weather: 'వాతావరణం',
    mandiPrices: 'మందీ ధర', govSchemes: 'ప్రభుత్వ పథకాలు', voiceHelp: 'వాయిస్ సహాయం',
    reminders: 'రిమైండర్లు', soilHealth: 'నేల ఆరోగ్యం', analytics: 'విశ్లేషణ',
    marketplace: 'మార్కెట్', expertConnect: 'నిపుణులు', community: 'సమాజం',
    aiAlert: '🌧️ 2 రోజుల్లో వర్షం — డ్రైనేజీ సిద్ధం చేయండి',
    getRecommendation: 'AI సలహా తీసుకోండి',
    loading: 'మీ పంటను విశ్లేషిస్తున్నాం... 🔍',
    name: 'మీ పేరు', state: 'రాష్ట్రం', district: 'జిల్లా', village: 'గ్రామం',
    landSize: 'భూమి పరిమాణం', soilType: 'నేల రకం', waterSource: 'నీటి వనరు',
    primaryCrops: 'ప్రధాన పంటలు', saveProfile: 'ప్రొఫైల్ సేవ్ చేయండి',
    step: 'దశ', of: 'లో',
  },
  ta: {
    appName: 'ஸ்மார்ட் விவசாயி ஆலோசகர்',
    tagline: 'கிசான் கா டிஜிட்டல் தோஸ்த்',
    getStarted: 'தொடங்குங்கள்',
    guestMode: 'விருந்தினராக தொடரவும்',
    goodMorning: 'காலை வணக்கம்',
    home: 'முகப்பு', myFarm: 'என் வயல்', askAI: 'AI கேளுங்கள்', schemes: 'திட்டங்கள்', profile: 'சுயவிவரம்',
    cropAdvisor: 'பயிர் ஆலோசகர்', diseaseScan: 'நோய் பரிசோதனை', weather: 'வானிலை',
    mandiPrices: 'சந்தை விலை', govSchemes: 'அரசு திட்டங்கள்', voiceHelp: 'குரல் உதவி',
    reminders: 'நினைவூட்டல்கள்', soilHealth: 'மண் ஆரோக்கியம்', analytics: 'பகுப்பாய்வு',
    marketplace: 'சந்தை', expertConnect: 'நிபுணர்', community: 'சமுதாயம்',
    aiAlert: '🌧️ 2 நாட்களில் மழை — வடிகால் தயார் செய்யுங்கள்',
    getRecommendation: 'AI ஆலோசனை பெறுங்கள்',
    loading: 'உங்கள் பயிர் பகுப்பாய்வு செய்யப்படுகிறது... 🔍',
    name: 'உங்கள் பெயர்', state: 'மாநிலம்', district: 'மாவட்டம்', village: 'கிராமம்',
    saveProfile: 'சுயவிவரம் சேமி',
    step: 'படி', of: 'இல்',
  },
  kn: {
    appName: 'ಸ್ಮಾರ್ಟ್ ರೈತ ಸಲಹೆಗಾರ',
    tagline: 'ಕಿಸಾನ್ ಕಾ ಡಿಜಿಟಲ್ ದೋಸ್ತ್',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    guestMode: 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಸಿ',
    goodMorning: 'ಶುಭೋದಯ',
    home: 'ಮನೆ', myFarm: 'ನನ್ನ ಜಮೀನು', askAI: 'AI ಕೇಳಿ', schemes: 'ಯೋಜನೆಗಳು', profile: 'ಪ್ರೊಫೈಲ್',
    cropAdvisor: 'ಬೆಳೆ ಸಲಹೆ', diseaseScan: 'ರೋಗ ಪರೀಕ್ಷೆ', weather: 'ಹವಾಮಾನ',
    mandiPrices: 'ಮಂಡಿ ಬೆಲೆ', govSchemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆ', voiceHelp: 'ಧ್ವನಿ ಸಹಾಯ',
    reminders: 'ನೆನಪೂಸುವಿಕೆಗಳು', soilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ', analytics: 'ವಿಶ್ಲೇಷಣೆ',
    marketplace: 'ಮಾರುಕಟ್ಟೆ', expertConnect: 'ತಜ್ಞರು', community: 'ಸಮುದಾಯ',
    aiAlert: '🌧️ 2 ದಿನಗಳಲ್ಲಿ ಮಳೆ — ಒಳಚರಂಡಿ ತಯಾರಿಸಿ',
    getRecommendation: 'AI ಸಲಹೆ ಪಡೆಯಿರಿ',
    loading: 'ನಿಮ್ಮ ಬೆಳೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ... 🔍',
    name: 'ನಿಮ್ಮ ಹೆಸರು', state: 'ರಾಜ್ಯ', district: 'ಜಿಲ್ಲೆ', village: 'ಗ್ರಾಮ',
    saveProfile: 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    step: 'ಹಂತ', of: 'ರ',
  },
  mr: {
    appName: 'स्मार्ट शेतकरी सल्लागार',
    tagline: 'किसान का डिजिटल दोस्त',
    getStarted: 'सुरू करा',
    guestMode: 'पाहुणे म्हणून सुरू ठेवा',
    goodMorning: 'शुभ प्रभात',
    home: 'होम', myFarm: 'माझेत', askAI: 'AI विचारा', schemes: 'योजना', profile: 'प्रोफाइल',
    cropAdvisor: 'पीक सल्ला', diseaseScan: 'रोग तपासणी', weather: 'हवामान',
    mandiPrices: 'बाजार भाव', govSchemes: 'सरकारी योजना', voiceHelp: 'आवाज मदत',
    reminders: 'आठवण', soilHealth: 'मातीचे आरोग्य', analytics: 'विश्लेषण',
    marketplace: 'बाजार', expertConnect: 'तज्ञ', community: 'समुदाय',
    aiAlert: '🌧️ २ दिवसांत पाऊस — ड्रेनेज तयार करा',
    getRecommendation: 'AI सल्ला घ्या',
    loading: 'तुमच्या पिकाचे विश्लेषण होत आहे... 🔍',
    name: 'तुमचे नाव', state: 'राज्य', district: 'जिल्हा', village: 'गाव',
    saveProfile: 'प्रोफाइल सेव्ह करा',
    step: 'पायरी', of: 'पैकी',
  }
};

const LANGUAGES = [
  { code: 'te', label: 'తెలుగు', name: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { code: 'en', label: 'English', name: 'English' },
  { code: 'ta', label: 'தமிழ்', name: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { code: 'mr', label: 'मराठी', name: 'Marathi' },
];

const SOIL_TYPES = [
  { id: 'black',  emoji: '🖤', label: 'Black Soil',   color: '#1a1a1a', bg: 'rgba(0,0,0,0.08)' },
  { id: 'red',    emoji: '🔴', label: 'Red Soil',     color: '#C62828', bg: 'rgba(198,40,40,0.1)' },
  { id: 'sandy',  emoji: '🏖️', label: 'Sandy Soil',   color: '#F9A825', bg: 'rgba(249,168,37,0.12)' },
  { id: 'loamy',  emoji: '🟤', label: 'Loamy Soil',   color: '#5D4037', bg: 'rgba(93,64,55,0.1)' },
  { id: 'clay',   emoji: '🏺', label: 'Clay Soil',    color: '#546E7A', bg: 'rgba(84,110,122,0.1)' },
  { id: 'alluvial',emoji:'🌊', label: 'Alluvial',     color: '#0288D1', bg: 'rgba(2,136,209,0.1)' },
];

const WATER_SOURCES = [
  { id: 'borewell', emoji: '⛏️', label: 'Borewell' },
  { id: 'river',    emoji: '🏞️', label: 'River' },
  { id: 'rain',     emoji: '🌧️', label: 'Rainwater' },
  { id: 'canal',    emoji: '🚰', label: 'Canal' },
];

const CROPS_LIST = [
  { id: 'paddy',    emoji: '🌾', label: 'Paddy / Rice' },
  { id: 'wheat',    emoji: '🌿', label: 'Wheat' },
  { id: 'cotton',   emoji: '🌸', label: 'Cotton' },
  { id: 'sugarcane',emoji: '🎋', label: 'Sugarcane' },
  { id: 'maize',    emoji: '🌽', label: 'Maize' },
  { id: 'tomato',   emoji: '🍅', label: 'Tomato' },
  { id: 'chilli',   emoji: '🌶️', label: 'Chilli' },
  { id: 'groundnut',emoji: '🥜', label: 'Groundnut' },
  { id: 'soybean',  emoji: '🫘', label: 'Soybean' },
  { id: 'onion',    emoji: '🧅', label: 'Onion' },
  { id: 'potato',   emoji: '🥔', label: 'Potato' },
  { id: 'banana',   emoji: '🍌', label: 'Banana' },
];

const SEASONS = [
  { id: 'kharif',  emoji: '☔', label: 'Kharif',  months: 'Jun–Oct' },
  { id: 'rabi',    emoji: '❄️', label: 'Rabi',    months: 'Nov–Mar' },
  { id: 'zaid',    emoji: '☀️', label: 'Zaid / Summer',  months: 'Mar–Jun' },
  { id: 'monsoon', emoji: '🌧️', label: 'Monsoon', months: 'Jul–Sep' },
];

const MOCK_CROP_RECOMMENDATIONS = {
  paddy: [
    { name: 'Paddy (BPT-5204)', emoji: '🌾', match: 92, yield: '22 quintals/acre', profit: '₹48,000', water: 'High', risk: 'Low', demand: 9.1 },
    { name: 'Sona Masuri Rice', emoji: '🍚', match: 85, yield: '18 quintals/acre', profit: '₹42,000', water: 'High', risk: 'Medium', demand: 8.7 },
    { name: 'Maize (DHM-117)',  emoji: '🌽', match: 74, yield: '30 quintals/acre', profit: '₹36,000', water: 'Medium', risk: 'Low', demand: 8.2 },
  ],
  cotton: [
    { name: 'Bt Cotton (NHH-44)', emoji: '🌸', match: 89, yield: '12 quintals/acre', profit: '₹55,000', water: 'Medium', risk: 'Medium', demand: 8.9 },
    { name: 'Paddy (BPT-5204)',   emoji: '🌾', match: 78, yield: '20 quintals/acre', profit: '₹40,000', water: 'High',   risk: 'Low', demand: 9.0 },
    { name: 'Groundnut',          emoji: '🥜', match: 70, yield: '8 quintals/acre',  profit: '₹28,000', water: 'Low',    risk: 'Low', demand: 7.8 },
  ],
  default: [
    { name: 'Paddy (BPT-5204)', emoji: '🌾', match: 87, yield: '20 quintals/acre', profit: '₹44,000', water: 'High', risk: 'Low', demand: 9.1 },
    { name: 'Cotton (Bt-553)',  emoji: '🌸', match: 74, yield: '10 quintals/acre', profit: '₹52,000', water: 'Medium', risk: 'Medium', demand: 8.5 },
    { name: 'Maize (DHM-117)', emoji: '🌽', match: 68, yield: '28 quintals/acre', profit: '₹34,000', water: 'Medium', risk: 'Low', demand: 8.2 },
  ]
};

const MOCK_MANDI_PRICES = [
  { crop: 'Paddy', emoji: '🌾', price: 2140, unit: 'quintal', trend: 'up',   pct: '+3.2%', mandi: 'Guntur APMC', dist: '4.2 km',  data: [1900,1950,2000,1980,2050,2100,2140] },
  { crop: 'Cotton', emoji: '🌸', price: 6820, unit: 'quintal', trend: 'down', pct: '-1.1%', mandi: 'Warangal Mandi', dist: '12 km',  data: [7000,6950,6900,6880,6850,6900,6820] },
  { crop: 'Maize',  emoji: '🌽', price: 1820, unit: 'quintal', trend: 'up',   pct: '+0.8%', mandi: 'Kurnool APMC',  dist: '8.5 km',  data: [1700,1720,1750,1780,1800,1810,1820] },
  { crop: 'Tomato', emoji: '🍅', price: 840,  unit: 'quintal', trend: 'up',   pct: '+12%',  mandi: 'Madanapalle',   dist: '5.1 km',  data: [500,560,620,700,760,800,840] },
  { crop: 'Onion',  emoji: '🧅', price: 1240, unit: 'quintal', trend: 'stable',pct: '0%',   mandi: 'Kurnool APMC',  dist: '8.5 km',  data: [1200,1220,1230,1240,1250,1230,1240] },
  { crop: 'Chilli', emoji: '🌶️', price: 9500, unit: 'quintal', trend: 'up',   pct: '+5.6%', mandi: 'Guntur APMC',   dist: '4.2 km',  data: [8000,8400,8700,9000,9200,9400,9500] },
  { crop: 'Wheat',  emoji: '🌿', price: 2015, unit: 'quintal', trend: 'stable',pct: '+0.2%', mandi: 'Hyderabad',     dist: '18 km',   data: [1980,1990,2000,2010,2005,2010,2015] },
];

const MOCK_SCHEMES = [
  { name: 'PM-KISAN Yojana', icon: '🏛️', ministry: 'Agriculture', benefit: '₹6,000/year direct cash transfer to farmer families', eligibility: ['All Farmers', 'Land Owner'], deadline: null, category: 'Subsidy', urgent: false, docs: ['Aadhaar Card', 'Bank Account', 'Land Records'] },
  { name: 'Pradhan Mantri Fasal Bima Yojana', icon: '🛡️', ministry: 'Agriculture', benefit: 'Full crop insurance against natural calamities at subsidised premium', eligibility: ['Small Farmer', 'Marginal Farmer'], deadline: '2026-03-31', category: 'Insurance', urgent: true, docs: ['Aadhaar', 'Bank Passbook', 'Khasra (Land record)', 'Sowing certificate'] },
  { name: 'Kisan Credit Card', icon: '💳', ministry: 'Finance', benefit: 'Short-term credit up to ₹3 lakh at 4% interest per annum', eligibility: ['All Farmers'], deadline: null, category: 'Loan', urgent: false, docs: ['KYC Documents', 'Land ownership proof', 'Passport photo'] },
  { name: 'PM Krishi Sinchai Yojana', icon: '💧', ministry: 'Jal Shakti', benefit: 'Micro-irrigation subsidy — Drip & sprinkler at 50–90% subsidy', eligibility: ['Small Farmer', 'Marginal Farmer', 'All'], deadline: '2026-04-15', category: 'Subsidy', urgent: true, docs: ['Aadhaar', 'Land Records', 'Bank Account'] },
  { name: 'Soil Health Card Scheme', icon: '🌱', ministry: 'Agriculture', benefit: 'Free soil testing + Soil Health Card with fertilizer recommendations', eligibility: ['All Farmers'], deadline: null, category: 'Training', urgent: false, docs: ['Aadhaar', 'Land Details'] },
  { name: 'e-NAM (National Agri Market)', icon: '🏪', ministry: 'Agriculture', benefit: 'Sell produce directly on national digital market, better prices', eligibility: ['All Farmers'], deadline: null, category: 'Subsidy', urgent: false, docs: ['Aadhaar', 'Bank Account', 'Produce details'] },
];

const MOCK_EXPERTS = [
  { name: 'Dr. Venkat Rao', emoji: '👨‍🔬', spec: 'Rice & Paddy Specialist', exp: '14 yrs', rating: 4.8, reviews: 342, lang: 'Telugu, English', free: true,  fee: 'Free' },
  { name: 'Dr. Priya Sharma', emoji: '👩‍🔬', spec: 'Soil & Organic Farming', exp: '9 yrs',  rating: 4.9, reviews: 218, lang: 'Hindi, English', free: false, fee: '₹99/session' },
  { name: 'Agr. Suresh Kumar', emoji: '👨‍🌾', spec: 'Cotton & Horticulture', exp: '11 yrs', rating: 4.7, reviews: 185, lang: 'Telugu, Kannada', free: false, fee: '₹149/session' },
  { name: 'Dr. Lakshmi Devi', emoji: '👩‍💼', spec: 'Plant Pathology', exp: '16 yrs', rating: 5.0, reviews: 410, lang: 'Tamil, English', free: false, fee: '₹199/session' },
];

const MOCK_COMMUNITY = [
  { author: 'R', name: 'Ramaiah K.', district: 'Guntur, AP', time: '2h ago', crop: '🌾 Paddy', question: 'Yellow leaves on paddy after 3rd week? See photo below. Used urea but no improvement.', emoji: '🌾', upvotes: 24, answers: 7, resolved: true },
  { author: 'S', name: 'Suresh P.', district: 'Warangal, TS', time: '5h ago', crop: '🌸 Cotton', question: 'Cotton bollworm infestation — organic treatment that actually works?', emoji: '🦋', upvotes: 18, answers: 12, resolved: false },
  { author: 'M', name: 'Meera Devi', district: 'Nashik, MH', time: '1d ago', crop: '🧅 Onion', question: 'Best variety for storage — which onion holds price for 3 months without rotting?', emoji: '🧅', upvotes: 41, answers: 19, resolved: true },
  { author: 'K', name: 'Kumar S.', district: 'Coimbatore, TN', time: '2d ago', crop: '🍌 Banana', question: 'Banana bunch size reduced this harvest — soil issue or water stress? pH is 6.5', emoji: '🍌', upvotes: 15, answers: 8, resolved: false },
];

const MOCK_MARKETPLACE = [
  { name: 'BPT-5204 Paddy Seeds', category: 'Seeds', emoji: '🌾', price: '₹480/kg',  seller: 'AgriMart Guntur', verified: true,  cod: true,  badge: 'Bestseller' },
  { name: 'DAP Fertilizer 50kg', category: 'Fertilizer', emoji: '🧪', price: '₹1,350/bag', seller: 'Kisan Store',  verified: true,  cod: true,  badge: null },
  { name: 'Neem Oil Pesticide 1L', category: 'Pesticide', emoji: '🌿', price: '₹320/L',  seller: 'Organic Farms',  verified: true,  cod: false, badge: 'Organic' },
  { name: 'Drip Irrigation Kit 1 acre', category: 'Tools', emoji: '💧', price: '₹4,200', seller: 'IrrigationWorld', verified: false, cod: true,  badge: '30% off Subsidy' },
  { name: 'Sprayer Pump 16L', category: 'Tools', emoji: '🔫', price: '₹1,800',  seller: 'AgriEquip',  verified: true,  cod: true,  badge: null },
  { name: 'Urea Fertilizer 50kg', category: 'Fertilizer', emoji: '🧴', price: '₹320/bag', seller: 'Kisan Store',  verified: true,  cod: true,  badge: null },
];

const REMINDER_TYPES = [
  { id: 'irrigation',  emoji: '🚿', label: 'Irrigation',  color: '#0288D1', bg: 'rgba(2,136,209,0.12)' },
  { id: 'fertilizer',  emoji: '🧪', label: 'Fertilizer',  color: '#2E7D32', bg: 'rgba(46,125,50,0.12)' },
  { id: 'pesticide',   emoji: '🐛', label: 'Pesticide',   color: '#C62828', bg: 'rgba(198,40,40,0.10)' },
  { id: 'pruning',     emoji: '✂️', label: 'Pruning',     color: '#5D4037', bg: 'rgba(93,64,55,0.10)' },
  { id: 'harvest',     emoji: '🌾', label: 'Harvest',     color: '#F9A825', bg: 'rgba(249,168,37,0.12)' },
  { id: 'sowing',      emoji: '🌱', label: 'Sowing',      color: '#4CAF50', bg: 'rgba(76,175,80,0.12)' },
  { id: 'soil',        emoji: '💊', label: 'Soil Care',   color: '#FF6F00', bg: 'rgba(255,111,0,0.10)' },
  { id: 'market',      emoji: '📦', label: 'Market Sale', color: '#0288D1', bg: 'rgba(2,136,209,0.10)' },
];

const MOCK_REMINDERS = [
  { type: 'irrigation', title: 'Irrigate Paddy Field A', time: 'Tomorrow 6:00 AM', crop: '🌾' },
  { type: 'fertilizer', title: 'Apply DAP Fertilizer', time: 'Sunday 8:00 AM', crop: '🌸' },
  { type: 'pesticide',  title: 'Spray Neem Oil – Block B', time: 'Monday 7:00 AM', crop: '🌿' },
  { type: 'harvest',    title: 'Harvest Window Opens', time: 'Oct 15, 2026', crop: '🌾' },
];

const VOICE_SAMPLES = [
  { lang: 'te', q: 'మా జిల్లాలో ఈ సీజన్లో ఏ పంట వేయాలి?', a: 'మీ జిల్లాలో ఈ ఖరీఫ్ సీజన్లో వరి, పత్తి మరియు మొక్కజొన్న అనుకూలంగా ఉంటాయి.' },
  { lang: 'hi', q: 'मेरी फसल में पीले पत्ते क्यों हो रहे हैं?', a: 'पीले पत्ते नाइट्रोजन की कमी या जल-जमाव का संकेत हो सकते हैं। यूरिया 20kg/एकड़ डालें।' },
  { lang: 'en', q: 'What is the price of tomato in Guntur today?', a: 'Today tomato price in Guntur APMC is ₹840 per quintal, up 12% from yesterday.' },
  { lang: 'en', q: 'When should I irrigate my paddy crop?', a: 'Irrigate tomorrow at 6 AM. Rain is expected Thursday, so no need until next week after that.' },
  { lang: 'en', q: 'Which government scheme gives free soil testing?', a: 'The Soil Health Card Scheme by Ministry of Agriculture gives free soil testing to all farmers.' },
];

// App State
const STATE = {
  currentScreen: 'splash',
  lang: 'en',
  farmer: null,
  selectedAvatar: 0,
  profileStep: 1,
  profileData: { name: '', state: '', district: '', village: '', acres: 2, soilType: '', waterSource: '', crops: [] },
  cropStep: 1,
  cropFormData: { soilType: '', season: '', acres: 2, water: '', budget: 25000, prevCrop: '' },
  cropResults: null,
  diseaseState: 'idle', // idle | scanning | result
  diseaseResult: null,
  voiceState: 'idle', // idle | listening | responding
  voiceSample: null,
  activeTab: { mandi: 'all', schemes: 'All', marketplace: 'All' },
  soilData: { ph: 6.5, n: 42, p: 18, k: 65, om: 1.8 },
  reminders: [...MOCK_REMINDERS],
  communityUpvoted: {},
  analyticsTab: 'income',
  notifCount: 3,
  searchMandi: '',
  filterScheme: 'All',
  weatherTab: 'forecast',
};

function t(key) {
  const l = LANG[STATE.lang] || LANG.en;
  const base = LANG.en;
  return l[key] || base[key] || key;
}

function greet(name) {
  const h = new Date().getHours();
  const g = h < 12 ? t('goodMorning') : h < 17 ? (t('goodAfternoon') || 'Good Afternoon') : (t('goodEvening') || 'Good Evening');
  return `${g}${name ? ', ' + name : ''}! ` + (h < 12 ? '🌅' : h < 17 ? '☀️' : '🌙');
}

function fmtNum(n) { return n.toLocaleString('en-IN'); }

function showToast(msg, dur = 2200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
