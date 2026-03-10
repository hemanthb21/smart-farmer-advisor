// ============================================================
// CONFIG.JS — API Keys & Firebase Configuration
// ============================================================
// Firebase keys are configured for: smart-farmer-advisor project
// ============================================================

const APP_CONFIG = {

  // ──────────────────────────────────────────────────
  // FIREBASE (Real OTP SMS via Firebase Phone Auth)
  // Project: smart-farmer-advisor
  // Console: https://console.firebase.google.com/project/smart-farmer-advisor
  // ──────────────────────────────────────────────────
  firebase: {
    apiKey:            "AIzaSyDDISryZJLG_YuYWXiGFtdmFNKDW6_f0v0",
    authDomain:        "smart-farmer-advisor.firebaseapp.com",
    projectId:         "smart-farmer-advisor",
    storageBucket:     "smart-farmer-advisor.firebasestorage.app",
    messagingSenderId: "31534077436",
    appId:             "1:31534077436:web:f167217b1d13d7aee24e79",
  },

  // ──────────────────────────────────────────────────
  // OPENWEATHERMAP (for real weather data)
  // Get from: https://openweathermap.org → My API Keys (free account)
  // Free tier: 1000 calls/day
  // ──────────────────────────────────────────────────
  openWeatherApiKey: "PASTE_YOUR_OPENWEATHER_API_KEY_HERE",

  // ──────────────────────────────────────────────────
  // FEATURE FLAGS
  // ──────────────────────────────────────────────────
  features: {
    realOTP:     false,  // ← set to true to enable real Firebase SMS OTP
    realWeather: false,  // ← set to true after adding OpenWeather key
    realVoice:   true,   // Web Speech API — works in Chrome now!
    realCamera:  true,   // Browser Camera API — works now!
    realGPS:     true,   // Browser Geolocation — works now!
  },

  // Default fallback location (if GPS denied)
  defaultLocation: { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3, lon: 80.44 },
};
