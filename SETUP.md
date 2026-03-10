# Smart Farmer Advisor – Setup Guide

## 🚀 Run the App (No Setup Needed)

```bash
# Navigate to project folder and start server:
python -m http.server 8080
```
Then open **http://localhost:8080** in Google Chrome.

> **Demo OTP:** `123456` (works without Firebase setup)

---

## 🔥 Step 1: Firebase Setup — Real Phone OTP (Free, ~3 minutes)

### 1.1 Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `smart-farmer-advisor` → Click Continue → Create
3. Wait for project to be created, then click **"Continue"**

### 1.2 Enable Phone Authentication
1. In the left sidebar → **Authentication** → **Get started**  
2. Click **"Sign-in method"** tab
3. Click **"Phone"** → Toggle **Enable** → Click **Save**

### 1.3 Get Your Firebase Config
1. Click the **⚙️ Settings icon** → **Project settings**
2. Scroll to **"Your apps"** section → Click **`</>`** (Web app)
3. Enter app nickname: `smart-farmer-web` → Click **"Register app"**
4. Copy the `firebaseConfig` object shown (looks like this):
```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "smart-farmer-advisor.firebaseapp.com",
  projectId: "smart-farmer-advisor",
  storageBucket: "smart-farmer-advisor.appspot.com",
  messagingSenderId: "12345...",
  appId: "1:12345...:web:abc..."
};
```

### 1.4 Add to App Config
Open `js/config.js` and paste your values:
```javascript
firebase: {
  apiKey:            "AIza....",         // ← paste yours
  authDomain:        "smart-farmer-advisor.firebaseapp.com",
  projectId:         "smart-farmer-advisor",
  storageBucket:     "smart-farmer-advisor.appspot.com",
  messagingSenderId: "12345...",
  appId:             "1:12345...:web:abc...",
},
```
Then set:
```javascript
features: {
  realOTP: true,    // ← change false to true
  ...
}
```

### 1.5 Add localhost as Authorized Domain
1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"** → Click **"Add domain"**
3. Add: `localhost`

✅ **Real OTP now works!** Every farmer will get an SMS on their real mobile number.

---

## 🌤️ Step 2: OpenWeatherMap — Real Weather (Free, ~2 minutes)

### 2.1 Get API Key
1. Go to [openweathermap.org](https://openweathermap.org) → **Sign Up** (free)
2. Check your email and verify your account
3. Go to **My API Keys** → Copy the **Default** key

### 2.2 Add to App Config
Open `js/config.js`:
```javascript
openWeatherApiKey: "your_key_here",   // ← paste your key
```
Then set:
```javascript
features: {
  realWeather: true,   // ← change false to true
  ...
}
```

> ⏳ **Note:** New API keys take up to 2 hours to activate after signup.

✅ **Real weather now shows** your actual location's temperature, humidity, wind speed, and 5-day forecast!

---

## 🎤 Voice Assistant (Zero Setup!)
Works out of the box in **Google Chrome**.
- Open app → **Ask AI** (bottom nav)  
- Tap the mic button → Speak in Telugu, Hindi, English, Tamil, Kannada, or Marathi
- AI responds and reads the answer aloud in your language

> ⚠️ Does **not** work in Firefox or Safari (Chrome only)

---

## 📷 Disease Scan Camera (Zero Setup!)
- Go to **Disease Scan** → Tap **Open Camera**  
- Allow camera permission → Take a photo of any diseased leaf
- Currently shows simulated AI result (Plant.id API integration coming soon)

---

## 💾 Data Persistence (Zero Setup!)
All farmer data is saved automatically:
- ✅ Farmer profile (name, location, farm size, crops)
- ✅ Reminders 
- ✅ Soil health NPK values
- ✅ Language preference

Data survives browser restarts. Returning users skip directly to Home dashboard.

---

## 📱 Deploy to Production

### Option A: GitHub Pages (Free)
```bash
git add .
git commit -m "Add real API configs"
git push
```
Then in GitHub repo → **Settings** → **Pages** → Source: `main` branch → Save.
Your app will be at: `https://hemanthb21.github.io/smart-farmer-advisor`

### Option B: Netlify (Free, Recommended)
1. Go to [netlify.com](https://netlify.com) → Login with GitHub
2. Click **"Add new site"** → **"Import existing project"** → Connect GitHub
3. Select `smart-farmer-advisor` → Click **Deploy**
Done! You get a free HTTPS URL instantly.

> ⚠️ For production deploy, add your actual domain to Firebase's **Authorized Domains** list.

---

## 🔑 File Summary

| File | Purpose |
|------|---------|
| `js/config.js` | **API keys go here** — Firebase + OpenWeatherMap |
| `js/firebase-auth.js` | Real OTP authentication logic |
| `js/real-api.js` | Weather API, GPS, LocalStorage |
| `js/screens-splash.js` | OTP login screen (connected to Firebase) |
| `js/screens-voice.js` | Voice assistant (Web Speech API) |
| `js/main.js` | App bootstrap with auto-login |
