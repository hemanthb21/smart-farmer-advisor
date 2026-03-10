// ============================================================
// REAL-API.JS — Live API calls: Weather, GPS, LocalStorage
// ============================================================

// ---- LOCAL STORAGE ---- //
const LS_KEYS = {
  farmer:    'sfa_farmer',
  reminders: 'sfa_reminders',
  soilData:  'sfa_soil',
  lang:      'sfa_lang',
  uid:       'sfa_uid',
};

function saveFarmerData(data) {
  try { localStorage.setItem(LS_KEYS.farmer, JSON.stringify(data)); } catch(e) {}
}
function loadFarmerData() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.farmer)); } catch(e) { return null; }
}
function saveReminders(data) {
  try { localStorage.setItem(LS_KEYS.reminders, JSON.stringify(data)); } catch(e) {}
}
function loadReminders() {
  try {
    const r = JSON.parse(localStorage.getItem(LS_KEYS.reminders));
    return r && r.length ? r : [...MOCK_REMINDERS];
  } catch(e) { return [...MOCK_REMINDERS]; }
}
function saveLang(lang) { localStorage.setItem(LS_KEYS.lang, lang); }
function loadLang()     { return localStorage.getItem(LS_KEYS.lang) || 'en'; }
function saveSoilData(data) {
  try { localStorage.setItem(LS_KEYS.soilData, JSON.stringify(data)); } catch(e) {}
}
function loadSoilData() {
  try { return JSON.parse(localStorage.getItem(LS_KEYS.soilData)) || null; } catch(e) { return null; }
}
function clearAllData() {
  Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
}

// ---- GEOLOCATION ---- //
let cachedLocation = null;

function getUserLocation() {
  return new Promise((resolve) => {
    if (cachedLocation) { resolve(cachedLocation); return; }
    if (!navigator.geolocation) {
      resolve(APP_CONFIG.defaultLocation); return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cachedLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          city: null, state: null,
        };
        resolve(cachedLocation);
      },
      () => resolve(APP_CONFIG.defaultLocation),
      { timeout: 8000, maximumAge: 300000 }
    );
  });
}

// ---- WEATHER API ---- //
let cachedWeather = null;
let weatherFetchedAt = 0;

async function fetchRealWeather(lat, lon) {
  const now = Date.now();
  if (cachedWeather && (now - weatherFetchedAt) < 30 * 60 * 1000) {
    return cachedWeather; // cache 30 min
  }

  if (!APP_CONFIG.features.realWeather ||
      APP_CONFIG.openWeatherApiKey === 'PASTE_YOUR_OPENWEATHER_API_KEY_HERE') {
    return null; // use mock
  }

  try {
    const key = APP_CONFIG.openWeatherApiKey;
    // Current weather
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=en`
    );
    if (!res.ok) throw new Error('Weather API error: ' + res.status);
    const data = await res.json();

    // 5-day forecast
    const fRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric&cnt=7`
    );
    const fData = fRes.ok ? await fRes.json() : null;

    const weatherIconMap = {
      '01':'☀️','02':'🌤️','03':'⛅','04':'☁️',
      '09':'🌧️','10':'🌦️','11':'⛈️','13':'❄️','50':'🌫️'
    };
    const iconCode = (data.weather[0].icon || '01').slice(0, 2);

    cachedWeather = {
      temp:      Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity:  data.main.humidity,
      windSpeed: Math.round(data.wind?.speed * 3.6 || 0), // m/s → km/h
      desc:      data.weather[0].description,
      icon:      weatherIconMap[iconCode] || '⛅',
      city:      data.name,
      country:   data.sys.country,
      uvIndex:   null, // needs One Call API
      forecast:  fData ? fData.list.slice(0, 5).map((f, i) => {
        const fc = (f.weather[0].icon || '01').slice(0, 2);
        const days = ['Today', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          day:  days[i] || 'Day ' + (i+1),
          icon: weatherIconMap[fc] || '⛅',
          hi:   Math.round(f.main.temp_max),
          lo:   Math.round(f.main.temp_min),
          rain: Math.round((f.pop || 0) * 100),
        };
      }) : [],
    };
    weatherFetchedAt = now;
    return cachedWeather;
  } catch (e) {
    console.warn('Weather fetch failed, using mock:', e.message);
    return null;
  }
}

// ---- AI SMART WEATHER ALERT GENERATOR ---- //
function generateFarmingAlerts(weather) {
  if (!weather) return [
    { type:'rain', icon:'🌧️', title:'Heavy Rain in 48 hrs', msg:'Delay pesticide spray. Ensure drainage channels are clear.' },
    { type:'heat', icon:'🌡️', title:'Heat Wave Next Week',  msg:'Increase irrigation frequency. Use mulching to retain moisture.' },
    { type:'wind', icon:'💨', title:'Strong Winds Saturday', msg:"Don't spray fertilizer — drift risk high above 20 km/h." },
  ];

  const alerts = [];
  if (weather.rain > 60)
    alerts.push({ type:'rain', icon:'🌧️', title:`Heavy rain forecast (${weather.rain}% chance)`,
      msg:'Delay pesticide and fertilizer application. Check field drainage.' });
  if (weather.temp > 38)
    alerts.push({ type:'heat', icon:'🌡️', title:`High temperature: ${weather.temp}°C`,
      msg:'Increase irrigation. Apply mulch to reduce soil moisture loss.' });
  if (weather.windSpeed > 20)
    alerts.push({ type:'wind', icon:'💨', title:`Wind speed: ${weather.windSpeed} km/h`,
      msg:"Avoid spraying today — chemicals will drift. Plan for calmer morning." });
  if (weather.humidity > 80)
    alerts.push({ type:'pest', icon:'🦠', title:`High humidity: ${weather.humidity}%`,
      msg:'Favorable for fungal diseases. Monitor crops closely. Plan preventive spray.' });
  if (alerts.length === 0)
    alerts.push({ type:'rain', icon:'✅', title:'Good farming conditions today',
      msg:'Weather is suitable for spraying, irrigation, and field work.' });
  return alerts;
}

// ---- REVERSE GEOCODING (lat/lon → city name) ---- //
async function reverseGeocode(lat, lon) {
  try {
    if (!APP_CONFIG.features.realWeather ||
        APP_CONFIG.openWeatherApiKey === 'PASTE_YOUR_OPENWEATHER_API_KEY_HERE') {
      return APP_CONFIG.defaultLocation;
    }
    const key = APP_CONFIG.openWeatherApiKey;
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`
    );
    const data = await res.json();
    if (data && data[0]) {
      return { city: data[0].name, state: data[0].state || '', lat, lon };
    }
  } catch (e) {}
  return { ...APP_CONFIG.defaultLocation, lat, lon };
}
