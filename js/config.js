// ============================================================
// CONFIG.JS — API Keys & Firebase Configuration
// ============================================================
// ⚠️  FILL IN YOUR OWN KEYS BEFORE USING THE APP
// See SETUP.md for step-by-step instructions
// ============================================================

const APP_CONFIG = {

  // ──────────────────────────────────────────────────
  // FIREBASE (for real OTP SMS login)
  // Get from: https://console.firebase.google.com
  //   → Your Project → Settings (⚙️) → General → Your apps → Web app → firebaseConfig
  // ──────────────────────────────────────────────────
  firebase: {
    apiKey:            "PASTE_YOUR_FIREBASE_API_KEY_HERE",
    authDomain:        "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
    projectId:         "PASTE_YOUR_PROJECT_ID",
    storageBucket:     "PASTE_YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
    appId:             "PASTE_YOUR_APP_ID",
  },

  // ──────────────────────────────────────────────────
  // OPENWEATHERMAP (for real weather data)
  // Get from: https://openweathermap.org → My API Keys (free account)
  // Free tier: 1000 calls/day
  // ──────────────────────────────────────────────────
  openWeatherApiKey: "PASTE_YOUR_OPENWEATHER_API_KEY_HERE",

  // ──────────────────────────────────────────────────
  // FEATURE FLAGS — set to true once you add real keys
  // ──────────────────────────────────────────────────
  features: {
    realOTP:     false,  // ← set to true after adding Firebase keys
    realWeather: false,  // ← set to true after adding OpenWeather key
    realVoice:   true,   // Web Speech API — no key needed, works now!
    realCamera:  true,   // Browser Camera API — no key needed, works now!
    realGPS:     true,   // Browser Geolocation — no key needed, works now!
  },

  // Default fallback location (if GPS denied)
  defaultLocation: { city: 'Guntur', state: 'Andhra Pradesh', lat: 16.3, lon: 80.44 },
};
