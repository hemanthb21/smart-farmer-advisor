// ============================================================
// SCREENS-VOICE.JS – Real Web Speech API Voice Assistant
// ============================================================

// Language codes for Indian languages (Web Speech API codes)
const SPEECH_LANG_CODES = {
  te: 'te-IN',  // Telugu
  hi: 'hi-IN',  // Hindi
  en: 'en-IN',  // English (India)
  ta: 'ta-IN',  // Tamil
  kn: 'kn-IN',  // Kannada
  mr: 'mr-IN',  // Marathi
};

// Voice assistant state
let recognition = null;
let synthesis = window.speechSynthesis;
let isSpeaking = false;
let isRecognizing = false;

// Sample Q&A in multiple languages for demo
function getVoiceSampleForLang(lang) {
  const samples = {
    te: { q:'నా పంటకు ఏ ఎరువు వేయాలి?',
          a:'మీ నేల రకాన్ని బట్టి, నత్రజని అధికంగా ఉన్న యూరియా మొదట వేయండి, తర్వాత DAP ఫాస్పరస్ కోసం.' },
    hi: { q:'मेरी फसल के लिए कौन सी खाद डालें?',
          a:'आपकी मिट्टी के प्रकार के अनुसार, पहले यूरिया डालें नाइट्रोजन के लिए, फिर DAP फॉस्फोरस के लिए।' },
    en: { q:'What fertilizer should I use for my crop?',
          a:'Based on your soil type, apply Urea first for nitrogen, then DAP for phosphorus. Test soil pH before applying.' },
    ta: { q:'என் பயிருக்கு என்ன உரம் போட வேண்டும்?',
          a:'உங்கள் மண் வகையை பொருத்து, முதலில் யூரியா நைட்ரஜனுக்கு, பிறகு DAP பாஸ்பரஸுக்கு போடுங்கள்.' },
    kn: { q:'ನನ್ನ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕು?',
          a:'ನಿಮ್ಮ ಮಣ್ಣಿನ ಪ್ರಕಾರ, ಮೊದಲು ಯೂರಿಯಾ ಸಾರಜನಕಕ್ಕಾಗಿ, ನಂತರ DAP ರಂಜಕಕ್ಕಾಗಿ ಹಾಕಿ.' },
    mr: { q:'माझ्या पिकाला कोणते खत द्यावे?',
          a:'तुमच्या मातीनुसार, प्रथम यूरिया नायट्रोजनसाठी, नंतर DAP फॉस्फरससाठी द्या.' },
  };
  return samples[lang] || samples.en;
}

function isSpeechSupported() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

function speakText(text, lang) {
  if (!synthesis) return;
  synthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG_CODES[lang] || 'en-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.onstart  = () => { isSpeaking = true;  updateVoiceOrbState('speaking'); };
  utterance.onend    = () => { isSpeaking = false;  updateVoiceOrbState('idle'); };
  utterance.onerror  = () => { isSpeaking = false;  updateVoiceOrbState('idle'); };
  synthesis.speak(utterance);
}

function updateVoiceOrbState(state) {
  const orb = document.getElementById('voice-orb');
  const statusText = document.getElementById('voice-status');
  const waveform = document.getElementById('voice-waveform');
  if (!orb) return;
  if (state === 'listening') {
    orb.style.background = 'radial-gradient(circle,#EF5350,#C62828)';
    orb.innerHTML = '<span style="font-size:42px">🔴</span>';
    if (statusText) statusText.textContent = 'Listening... speak now';
    if (waveform) waveform.style.display = 'flex';
  } else if (state === 'processing') {
    orb.style.background = 'radial-gradient(circle,#F9A825,#E65100)';
    orb.innerHTML = '<span style="font-size:42px">🤔</span>';
    if (statusText) statusText.textContent = 'Processing your question...';
    if (waveform) waveform.style.display = 'none';
  } else if (state === 'speaking') {
    orb.style.background = 'radial-gradient(circle,#0288D1,#01579B)';
    orb.innerHTML = '<span style="font-size:42px">🔊</span>';
    if (statusText) statusText.textContent = 'AI is speaking...';
    if (waveform) waveform.style.display = 'flex';
  } else {
    orb.style.background = 'radial-gradient(circle,rgba(255,255,255,0.3),rgba(255,255,255,0.1))';
    orb.innerHTML = '<span style="font-size:42px">🎙️</span>';
    if (statusText) statusText.textContent = isSpeechSupported()
      ? 'Tap mic to speak in your language'
      : '⚠️ Voice not supported in this browser. Use Chrome.';
    if (waveform) waveform.style.display = 'none';
  }
}

function startListening() {
  if (!isSpeechSupported()) {
    showToast('⚠️ Use Google Chrome for voice support');
    return;
  }
  if (synthesis) synthesis.cancel();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = SPEECH_LANG_CODES[STATE.lang] || 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = () => {
    isRecognizing = true;
    updateVoiceOrbState('listening');
  };

  recognition.onresult = (event) => {
    isRecognizing = false;
    const transcript = event.results[0][0].transcript;
    const confidence = Math.round(event.results[0][0].confidence * 100);
    updateVoiceOrbState('processing');

    // Show what was heard
    const heardEl = document.getElementById('voice-heard');
    if (heardEl) {
      heardEl.style.display = 'block';
      heardEl.innerHTML = `<span class="chip chip-sky">You said (${confidence}% confidence)</span><br>
        <p class="font-semibold mt-1">"${transcript}"</p>`;
    }

    // Simulate AI processing and generate answer
    setTimeout(() => {
      const answer = generateAIAnswer(transcript, STATE.lang);
      showVoiceResponse(transcript, answer);
      speakText(answer, STATE.lang);
    }, 800);
  };

  recognition.onerror = (event) => {
    isRecognizing = false;
    updateVoiceOrbState('idle');
    const errorMessages = {
      'network':       '🌐 No internet. Check your connection.',
      'not-allowed':   '🎤 Microphone blocked. Allow access in browser settings.',
      'no-speech':     '🔇 No speech detected. Try speaking louder.',
      'aborted':       '⏹️ Listening stopped.',
      'audio-capture': '🎤 Microphone not found.',
    };
    showToast(errorMessages[event.error] || '❌ Error: ' + event.error);
  };

  recognition.onend = () => {
    isRecognizing = false;
  };

  recognition.start();
}

function stopListening() {
  if (recognition) { recognition.stop(); recognition = null; }
  if (synthesis) synthesis.cancel();
  isRecognizing = false;
  isSpeaking = false;
  updateVoiceOrbState('idle');
}

function toggleListening() {
  if (isRecognizing) {
    stopListening();
  } else if (isSpeaking) {
    synthesis.cancel();
    isSpeaking = false;
    updateVoiceOrbState('idle');
  } else {
    startListening();
  }
}

function generateAIAnswer(question, lang) {
  const q = question.toLowerCase();
  const answers = {
    en: {
      fertilizer: 'For paddy, apply 100kg Urea, 50kg DAP, and 40kg MOP per hectare. Split Urea into 3 doses: at planting, at tillering, and at panicle initiation.',
      disease:    'To identify crop disease, take a clear photo of the affected leaf in the Disease Scan section. Our AI will diagnose it instantly.',
      rain:       'Based on current weather patterns, light rain is expected this week. Avoid foliar spraying for the next 48 hours.',
      price:      `Current market price for paddy is around ₹2,100–2,300 per quintal at local APMC mandis. Prices are rising — good time to sell.`,
      scheme:     'You may be eligible for PM-KISAN (₹6,000/year), PMFBY crop insurance, and Rythu Bandhu scheme. Check the Schemes section for details.',
      soil:       'Your soil needs nitrogen and phosphorus. Apply 20kg Urea and 15kg DAP per acre before the next irrigation.',
      water:      'Based on your crop stage, irrigate every 5–7 days. Use drip irrigation to save 40% water.',
      default:    'I understand your question about farming. Please check the relevant section in the app for detailed guidance, or connect with an expert.',
    },
    te: {
      fertilizer: 'వరికి హెక్టారుకు 100kg యూరియా, 50kg DAP, 40kg MOP వేయండి. యూరియాను నాటేటప్పుడు, తిల్లరింగ్ వేళలో, మరియు పానికల్ మొదలికి 3 దఫాలుగా వేయండి.',
      disease:    'పంట రోగాన్ని గుర్తించడానికి, Disease Scan లో ఆకు ఫోటో తీయండి. మా AI వెంటనే నిర్ధారిస్తుంది.',
      rain:       'ప్రస్తుత వాతావరణ నమూనాల ప్రకారం, ఈ వారం తేలికపాటి వర్షం పడే అవకాశం ఉంది. 48 గంటలు పిచికారీ చేయకండి.',
      price:      'ప్రస్తుత మంది ధర: వరి ₹2,100–2,300/క్వింటాల్. ధరలు పెరుగుతున్నాయి — అమ్మడానికి మంచి సమయం.',
      default:    'మీ వ్యవసాయ ప్రశ్నను అర్థం చేసుకున్నాను. వివరణాత్మక సమాచారం కోసం సంబంధిత విభాగాన్ని చూడండి.',
    },
    hi: {
      fertilizer: 'धान के लिए प्रति हेक्टेयर 100kg यूरिया, 50kg DAP, 40kg MOP डालें। यूरिया को 3 बार में बाँटें।',
      disease:    'फसल रोग पहचानने के लिए, Disease Scan में पत्ती की फोटो लें। AI तुरंत बता देगा।',
      price:      'मंडी में धान का भाव अभी ₹2,100–2,300/क्विंटल है। कीमतें बढ़ रही हैं — बेचने का अच्छा समय।',
      default:    'आपका खेती से जुड़ा सवाल समझ गया। ऐप में संबंधित सेक्शन में जाएं, या विशेषज्ञ से जुड़ें।',
    },
  };

  const langAnswers = answers[lang] || answers.en;

  if (q.match(/fertiliz|ureа|dap|खाद|ఎరువు|உரம்|ಗೊಬ್ಬರ|खत/)) return langAnswers.fertilizer || answers.en.fertilizer;
  if (q.match(/disease|pest|rot|fungal|రోగ|நோய்|ರೋಗ|blight|borer/)) return langAnswers.disease || answers.en.disease;
  if (q.match(/rain|weather|forecast|వర్షం|மழை|ಮಳೆ|बारिश/)) return langAnswers.rain || answers.en.rain;
  if (q.match(/price|mandi|rate|ధర|விலை|ದರ|भाव|market/)) return langAnswers.price || answers.en.price;
  if (q.match(/scheme|subsidy|pm.kisan|yojana|స్కీమ్|திட்டம்/)) return langAnswers.scheme || answers.en.scheme;
  if (q.match(/soil|npk|ph|నేల|மண்|ಮಣ್ಣು|मिट्टी/)) return langAnswers.soil || answers.en.soil;
  if (q.match(/water|irrigat|నీరు|தண்ணீர்|ನೀರು|पानी/)) return langAnswers.water || answers.en.water;
  return langAnswers.default || answers.en.default;
}

function showVoiceResponse(question, answer) {
  const responseEl = document.getElementById('voice-response');
  if (!responseEl) return;
  responseEl.style.display = 'block';
  responseEl.innerHTML = `
    <div class="card animate-fadeinup" style="background:rgba(255,255,255,0.95)">
      <div class="flex gap-2 mb-2">
        <span class="chip chip-sky text-xs">You asked</span>
        <span class="chip text-xs">${LANGUAGES.find(l=>l.code===STATE.lang)?.label||'EN'}</span>
      </div>
      <p class="font-semibold text-sm mb-3" style="line-height:1.5">"${question}"</p>
      <div style="height:1px;background:rgba(0,0,0,0.06);margin-bottom:12px"></div>
      <div class="chip chip-sky mb-2">🤖 AI Response</div>
      <p class="text-sm" style="line-height:1.6;color:var(--dark)">${answer}</p>
      <button class="btn btn-ghost btn-sm mt-3" onclick="speakText('${answer.replace(/'/g,"\\'").replace(/\n/g,' ')}','${STATE.lang}')">
        🔊 Read Aloud Again
      </button>
    </div>
  `;
}

function renderVoice() {
  const s = document.getElementById('screen-voice');
  if (!s) return;

  s.innerHTML = `
    <div style="min-height:100%;background:linear-gradient(160deg,#1B5E20,#2E7D32 60%,#388E3C);
                display:flex;flex-direction:column">
      <div class="topbar" style="background:transparent;border:none">
        <button class="icon-btn" style="background:rgba(255,255,255,0.15);color:white"
          onclick="stopListening();navigate('home','back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="topbar-title text-white font-display">🎙️ Voice Assistant</span>
        <div></div>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;align-items:center;
                  padding:16px 24px 100px;gap:16px;overflow-y:auto">

        <!-- Language selector -->
        <div class="flex gap-2 flex-wrap justify-center">
          ${LANGUAGES.map(l => `
            <button class="lang-btn ${STATE.lang===l.code?'selected':''}" style="padding:6px 14px;font-size:12px"
              onclick="STATE.lang='${l.code}';saveLang('${l.code}');
                if(recognition){recognition.lang='${SPEECH_LANG_CODES[l.code]||'en-IN'}'}
                renderVoice()">${l.label}</button>`).join('')}
        </div>

        <!-- Speech support warning -->
        ${!isSpeechSupported() ? `
          <div style="background:rgba(255,152,0,0.2);border:1px solid rgba(255,152,0,0.4);
                      border-radius:12px;padding:12px 16px;text-align:center;color:white">
            ⚠️ Voice requires <b>Google Chrome</b> browser.<br>
            <span style="font-size:12px;opacity:0.8">Firefox/Safari have limited support.</span>
          </div>` : ''}

        <!-- Voice orb with ripples -->
        <div style="position:relative;display:flex;align-items:center;justify-content:center;margin:8px 0">
          <div class="voice-ripple"></div>
          <div class="voice-ripple delay"></div>
          <div id="voice-orb" class="voice-orb" onclick="toggleListening()"
               style="cursor:pointer;background:radial-gradient(circle,rgba(255,255,255,0.3),rgba(255,255,255,0.1))">
            <span style="font-size:42px">🎙️</span>
          </div>
        </div>

        <!-- Waveform -->
        <div id="voice-waveform" class="waveform" style="display:none">
          ${Array.from({length:9},(_,i)=>`
            <div class="wave-bar" style="animation:wave ${0.4+i*0.08}s ease-in-out infinite;
              animation-delay:${i*0.06}s"></div>`).join('')}
        </div>

        <!-- Status text -->
        <p id="voice-status" class="text-white text-center text-sm" style="opacity:0.85;min-height:20px">
          ${isSpeechSupported() ? 'Tap mic to speak in your language' : '⚠️ Use Chrome for voice support'}
        </p>

        <!-- What was heard -->
        <div id="voice-heard" style="display:none;width:100%;background:rgba(255,255,255,0.12);
          border-radius:14px;padding:12px 14px;color:white;font-size:14px"></div>

        <!-- Response card -->
        <div id="voice-response" style="display:none;width:100%"></div>

        <!-- Sample questions -->
        <div class="w-full">
          <p class="text-white text-center" style="font-size:12px;opacity:0.65;margin-bottom:10px">
            💡 Try saying these in your language:
          </p>
          ${[
            { emoji:'🌾', q:'What fertilizer for paddy?' },
            { emoji:'💰', q:'Paddy price in my mandi?' },
            { emoji:'🍃', q:'How to treat leaf blight?' },
            { emoji:'💧', q:'When should I irrigate?' },
          ].map(ex => `
            <div class="flex items-center gap-3 py-2" style="border-bottom:1px solid rgba(255,255,255,0.1)">
              <span style="font-size:20px">${ex.emoji}</span>
              <span class="text-white text-sm" style="opacity:0.85">"${ex.q}"</span>
            </div>`).join('')}
        </div>

        <!-- Escalate -->
        <button class="btn w-full" style="background:rgba(255,255,255,0.15);color:white;
          border:1px solid rgba(255,255,255,0.3);margin-top:8px"
          onclick="showToast('📞 Connecting to human expert via WhatsApp...')">
          🤝 Connect to Human Expert
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// REMINDERS (moved from screens-misc) with LocalStorage
// ============================================================

function renderReminders() {
  const s = document.getElementById('screen-reminders');
  if (!s) return;
  // Load from localStorage
  if (!STATE.reminders || STATE.reminders.length === 0) {
    STATE.reminders = loadReminders();
  }
  const calDays = Array.from({length:30}, (_, i) => i + 1);
  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  const now = new Date();
  const monthName = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '⏰ Reminders')}</div>
    <div class="screen-content pt-3">
      <!-- Mini calendar -->
      <div class="card mx-4 mb-3" style="padding:12px">
        <div class="flex items-center justify-between mb-2">
          <button class="icon-btn">‹</button>
          <div class="font-display font-bold">${monthName} ${year}</div>
          <button class="icon-btn">›</button>
        </div>
        <div class="cal-grid">
          ${['S','M','T','W','T','F','S'].map(d=>`<div class="text-center text-xs text-muted font-bold py-1">${d}</div>`).join('')}
          ${Array.from({length:firstDay}).map(()=>`<div></div>`).join('')}
          ${calDays.map(d => {
            const hasReminder = STATE.reminders.some(r => {
              const rd = new Date(r.dateTime || '');
              return rd.getDate() === d && rd.getMonth() === now.getMonth();
            });
            return `<div class="cal-day ${d===now.getDate()?'today':''} ${hasReminder?'has-reminder':''}">${d}</div>`;
          }).join('')}
        </div>
      </div>

      <div class="px-4 mb-3">
        <button class="btn btn-outline btn-full" onclick="aiSuggestReminders()">🤖 AI Auto-Suggest Reminders</button>
      </div>

      <div class="section-header"><span class="section-title font-display">📋 Your Reminders</span></div>
      <div class="px-4">
        ${STATE.reminders.length === 0 ? `<div class="text-center text-muted py-6">No reminders yet. Add one below!</div>` :
          STATE.reminders.map((r, i) => {
            const type = REMINDER_TYPES.find(t => t.id === r.type) || REMINDER_TYPES[0];
            return `
              <div class="reminder-item">
                <div class="reminder-icon" style="background:${type.bg}"><span>${type.emoji}</span></div>
                <div style="flex:1;min-width:0">
                  <div class="font-semibold text-sm">${r.title}</div>
                  <div class="text-xs text-muted">${r.time} · ${r.crop}</div>
                </div>
                <button class="icon-btn" onclick="deleteReminder(${i})">🗑️</button>
              </div>`;
          }).join('')}
      </div>

      <!-- Add reminder form -->
      <div class="section-header mt-2"><span class="section-title font-display">➕ Add Reminder</span></div>
      <div class="px-4 mb-2">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
          ${REMINDER_TYPES.map(t => `
            <div class="select-item ${STATE.newReminderType===t.id?'selected':''}"
              style="padding:10px 6px" onclick="STATE.newReminderType='${t.id}';renderReminders()">
              <span style="font-size:22px">${t.emoji}</span>
              <span style="font-size:10px;font-weight:600;margin-top:2px">${t.label}</span>
            </div>`).join('')}
        </div>
        <input id="new-reminder-title" class="input mb-2" placeholder="Reminder title (e.g. Apply pesticide on Field A)" />
        <input id="new-reminder-datetime" type="datetime-local" class="input mb-3" />
        <button class="btn btn-primary btn-full" onclick="addReminder()">➕ Save Reminder</button>
      </div>
    </div>
  `;
}

function aiSuggestReminders() {
  const suggestions = [
    { type:'irrigation', title:'AI: Irrigate Field B — Soil dry forecast', time:'Tomorrow 6:00 AM', crop:'🌾', dateTime: new Date(Date.now()+86400000).toISOString() },
    { type:'fertilizer', title:'AI: Post-rain DAP top-dressing', time:'In 3 days 8:00 AM', crop:'🌸', dateTime: new Date(Date.now()+3*86400000).toISOString() },
  ];
  suggestions.forEach(sug => STATE.reminders.unshift(sug));
  saveReminders(STATE.reminders);
  renderReminders();
  showToast('🤖 AI suggested 2 reminders based on weather!');
}

function deleteReminder(i) {
  STATE.reminders.splice(i, 1);
  saveReminders(STATE.reminders);
  renderReminders();
  showToast('🗑️ Reminder deleted');
}

function addReminder() {
  const title = document.getElementById('new-reminder-title')?.value.trim();
  const dt    = document.getElementById('new-reminder-datetime')?.value;
  if (!title) { showToast('❌ Enter a reminder title'); return; }
  const type = STATE.newReminderType || 'sowing';
  const typeObj = REMINDER_TYPES.find(t => t.id === type) || REMINDER_TYPES[0];
  const timeStr = dt ? new Date(dt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }) : 'No time set';
  STATE.reminders.unshift({ type, title, time: timeStr, crop: typeObj.emoji, dateTime: dt || '' });
  saveReminders(STATE.reminders);
  renderReminders();
  showToast('✅ Reminder saved!');
}

// ============================================================
// SOIL HEALTH with LocalStorage
// ============================================================
function renderSoil() {
  const s = document.getElementById('screen-soil');
  if (!s) return;
  // Load saved soil data
  const saved = loadSoilData();
  if (saved) Object.assign(STATE.soilData, saved);
  const d = STATE.soilData;
  const score = Math.min(100, Math.round((d.ph >= 6 && d.ph <= 7.5 ? 25 : 10) +
    (d.n / 100) * 30 + (d.p / 50) * 25 + (d.k / 200) * 25));

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🌍 Soil Health')}</div>
    <div class="screen-content pt-3">
      <div class="card mx-4 mb-3" style="text-align:center;padding:24px">
        ${renderGauge(score, 100, score>70?'#2E7D32':score>45?'#F9A825':'#C62828')}
        <div class="font-display font-bold text-xl mt-2">${score<45?'🔴 Poor':score<70?'🟡 Moderate':'🟢 Healthy'} Soil</div>
        <p class="text-sm text-muted mt-1">Based on your last soil test</p>
      </div>

      <div class="section-header"><span class="section-title font-display">🧪 Enter NPK Values</span></div>
      <div class="card mx-4 mb-3" style="padding:16px">
        ${[
          { key:'ph', label:'pH Level',       min:0, max:14, step:0.1, unit:'',    color:'#0288D1' },
          { key:'n',  label:'Nitrogen (N)',    min:0, max:100,step:1,  unit:'ppm', color:'#2E7D32' },
          { key:'p',  label:'Phosphorus (P)',  min:0, max:50, step:1,  unit:'ppm', color:'#F9A825' },
          { key:'k',  label:'Potassium (K)',   min:0, max:200,step:5,  unit:'ppm', color:'#C62828' },
        ].map(n => {
          const pct = Math.round(((d[n.key] - n.min) / (n.max - n.min)) * 100);
          return `
            <div class="mb-4">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-semibold">${n.label}</span>
                <span class="font-mono text-sm font-bold" style="color:${n.color}">${d[n.key]}${n.unit}</span>
              </div>
              <div class="nutrient-bar">
                <span class="nutrient-label" style="color:${n.color}">${n.key.toUpperCase()}</span>
                <div class="nutrient-track"><div class="nutrient-fill" style="width:${pct}%;background:${n.color}"></div></div>
                <span class="text-xs text-muted">${pct<30?'⬇️ Low':pct>80?'⬆️ High':'✅ OK'}</span>
              </div>
              <input type="range" min="${n.min}" max="${n.max}" step="${n.step}" value="${d[n.key]}"
                oninput="STATE.soilData.${n.key}=parseFloat(this.value);saveSoilData(STATE.soilData);renderSoil()" />
            </div>`;
        }).join('')}
        <button class="btn btn-outline btn-full mt-2" onclick="showToast('📄 Upload PDF → AI extracts NPK values automatically')">
          📄 Upload Soil Test Report (PDF)
        </button>
      </div>

      <div class="section-header"><span class="section-title font-display">🤖 AI Fertilizer Recommendation</span></div>
      <div class="card mx-4 mb-4">
        ${[
          d.n < 40 ? { icon:'🟡', msg:`Nitrogen low (${d.n} ppm) — Apply Urea 20kg/acre` }
                   : { icon:'✅', msg:`Nitrogen adequate (${d.n} ppm)` },
          d.p < 15 ? { icon:'🔴', msg:`Phosphorus low (${d.p} ppm) — Apply DAP 15kg/acre` }
                   : { icon:'✅', msg:`Phosphorus adequate (${d.p} ppm)` },
          d.k < 60 ? { icon:'🟡', msg:`Potassium low (${d.k} ppm) — Apply MOP 10kg/acre` }
                   : { icon:'✅', msg:`Potassium adequate (${d.k} ppm)` },
          (d.ph < 6 || d.ph > 7.5) ? { icon:'⚠️', msg:`pH ${d.ph} — ${d.ph < 6 ? 'Add lime to raise' : 'Add gypsum to lower'} pH` }
                                    : { icon:'✅', msg:`pH ${d.ph} — Optimal range (6.0–7.5)` },
        ].map((rec, i) => `
          <div class="flex gap-3 py-2" style="${i>0?'border-top:1px solid rgba(0,0,0,0.05)':''}">
            <span style="font-size:18px">${rec.icon}</span>
            <span class="text-sm">${rec.msg}</span>
          </div>`).join('')}
        <div class="flex gap-2 mt-3">
          <button class="btn btn-primary btn-sm" onclick="showToast('💰 Estimated fertilizer cost: ₹1,240/acre')">💰 Cost Estimate</button>
          <button class="btn btn-ghost btn-sm" onclick="saveSoilData(STATE.soilData);showToast('💾 Soil data saved!')">💾 Save</button>
        </div>
      </div>
    </div>
  `;
}

// ── ANALYTICS, EXPERTS, COMMUNITY — same as before but with persistence ──

function renderAnalytics() {
  const s = document.getElementById('screen-analytics');
  if (!s) return;
  const months = ['Jul','Aug','Sep','Oct','Nov','Dec'];
  const income  = [18,22,28,45,38,30];
  const expense = [8, 9, 12, 15, 10, 9];
  const imax = Math.max(...income, ...expense);

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '📊 Farm Analytics')}</div>
    <div class="screen-content pt-3">
      <div class="stats-row mb-3">
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--primary)">₹1.8L</div><div class="stat-mini-label">Total Income</div></div>
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--danger)">₹63k</div><div class="stat-mini-label">Expenses</div></div>
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--accent-gold)">₹1.17L</div><div class="stat-mini-label">Net Profit</div></div>
      </div>
      <div class="section-header"><span class="section-title font-display">📈 Kharif 2025 Season</span></div>
      <div class="card mx-4 mb-3" style="padding:16px">
        <div class="flex gap-4 mb-3">
          <div class="flex items-center gap-2"><div style="width:12px;height:12px;border-radius:3px;background:var(--primary)"></div><span class="text-xs text-muted">Income (₹000s)</span></div>
          <div class="flex items-center gap-2"><div style="width:12px;height:12px;border-radius:3px;background:var(--danger)"></div><span class="text-xs text-muted">Expense</span></div>
        </div>
        <div class="chart-bar-wrap" style="height:120px">
          ${months.map((m,i) => {
            const iH = Math.round((income[i]/imax)*110);
            const eH = Math.round((expense[i]/imax)*110);
            return `<div class="chart-bar-col">
              <div style="display:flex;align-items:flex-end;gap:2px;flex:1">
                <div class="chart-bar income" style="height:${iH}px;flex:1"></div>
                <div class="chart-bar expense" style="height:${eH}px;flex:1"></div>
              </div>
              <span class="chart-label">${m}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div class="px-4 mb-4 flex gap-2">
        <button class="btn btn-outline" style="flex:1" onclick="showToast('📄 PDF exported!')">📄 Export PDF</button>
        <button class="btn btn-outline" style="flex:1" onclick="showToast('📊 Excel downloaded!')">📊 Excel</button>
      </div>
    </div>
  `;
}

function renderExperts() {
  const s = document.getElementById('screen-experts');
  if (!s) return;
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🤝 Expert Connect')}</div>
    <div class="screen-content pt-3">
      <div class="px-4 mb-3">
        <div class="input-group"><span class="input-icon">🔍</span>
        <input class="input" placeholder="Search by specialty, language..." /></div>
      </div>
      <div class="px-4">
        ${MOCK_EXPERTS.map((e,i) => `
          <div class="expert-card animate-fadeinup" style="animation-delay:${i*0.08}s">
            <div class="expert-avatar">${e.emoji}</div>
            <div style="flex:1;min-width:0">
              <div class="font-display font-bold text-sm">${e.name}</div>
              <div class="text-xs text-muted mb-1">${e.spec} · ${e.exp}</div>
              <div class="flex gap-1 mb-1">${'★'.repeat(Math.round(e.rating)).split('').map(()=>`<span class="star">★</span>`).join('')}
                <span class="text-xs text-muted ml-1">${e.rating} (${e.reviews})</span></div>
              <div class="text-xs text-muted">🗣️ ${e.lang}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div class="font-semibold text-sm ${e.free?'text-primary':'text-gold'}">${e.fee}</div>
              <div class="flex flex-col gap-1 mt-2">
                <button class="btn btn-primary btn-sm" style="height:34px;font-size:11px"
                  onclick="showToast('📅 Booking video call with ${e.name}...')">📹 Book Call</button>
                <a class="btn btn-ghost btn-sm" style="height:34px;font-size:11px;display:flex;align-items:center;justify-content:center"
                  href="https://wa.me/91${Math.floor(Math.random()*9000000000+1000000000)}"
                  onclick="event.preventDefault();showToast('💬 Opening WhatsApp to chat with ${e.name}...')">
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function renderCommunity() {
  const s = document.getElementById('screen-community');
  if (!s) return;
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🏆 Community')}</div>
    <div class="screen-content pt-3">
      <div class="px-4 mb-3">
        <div class="card" style="display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer"
          onclick="showToast('📝 Opening post editor...')">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-light));
            display:flex;align-items:center;justify-content:center;font-size:20px;color:white">
            ${(STATE.farmer?.name||'F')[0].toUpperCase()}
          </div>
          <div style="flex:1;color:var(--muted);font-size:14px">Ask the farming community...</div>
          <button class="btn btn-primary btn-sm">Post</button>
        </div>
      </div>
      <div class="px-4">
        ${MOCK_COMMUNITY.map((p,i) => `
          <div class="post-card animate-fadeinup" style="animation-delay:${i*0.08}s">
            <div class="post-author-row">
              <div class="post-avatar">${p.author}</div>
              <div style="flex:1;min-width:0">
                <div class="font-semibold text-sm">${p.name}</div>
                <div class="text-xs text-muted">${p.district} · ${p.time}</div>
              </div>
              <div>
                <span class="chip text-xs">${p.crop}</span>
                ${p.resolved?'<span class="chip chip-sky text-xs ml-1">✅ Solved</span>':''}
              </div>
            </div>
            <p class="text-sm" style="line-height:1.6">${p.question}</p>
            <div class="post-image">${p.emoji}</div>
            <div class="flex items-center gap-3 mt-2">
              <button class="upvote-btn ${STATE.communityUpvoted[i]?'active':''}"
                onclick="communityUpvote(${i},this)">
                <span>${STATE.communityUpvoted[i]?'▲':'△'}</span>
                <span id="upvote-${i}">${p.upvotes+(STATE.communityUpvoted[i]?1:0)}</span> Helpful
              </button>
              <button class="upvote-btn" style="background:rgba(2,136,209,0.08);color:var(--sky)"
                onclick="showToast('💬 Opening answers...')">
                💬 ${p.answers} Answers
              </button>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function communityUpvote(i, btn) {
  STATE.communityUpvoted[i] = !STATE.communityUpvoted[i];
  const el = document.getElementById('upvote-' + i);
  if (el) el.textContent = MOCK_COMMUNITY[i].upvotes + (STATE.communityUpvoted[i] ? 1 : 0);
  if (btn) {
    btn.style.background = STATE.communityUpvoted[i]?'rgba(46,125,50,0.18)':'rgba(46,125,50,0.08)';
    btn.querySelector('span').textContent = STATE.communityUpvoted[i]?'▲':'△';
    showToast(STATE.communityUpvoted[i]?'▲ Marked as helpful!':'↩ Removed vote');
  }
}

function renderProfileView() {
  const s = document.getElementById('screen-profile-view');
  if (!s) return;
  const f = STATE.farmer || {};
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '👤 My Profile')}</div>
    <div class="screen-content">
      <div class="hero-gradient" style="padding:40px 24px 32px;text-align:center">
        <div style="font-size:72px;margin-bottom:12px">${f.avatar||'👨‍🌾'}</div>
        <div class="font-display text-white font-bold text-2xl">${f.name||'Farmer'}</div>
        <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px">📍 ${f.district||'India'}, ${f.state||''}</div>
        <div class="chip mt-3" style="background:rgba(255,255,255,0.2);color:white">
          ⭐ Free Plan · Upgrade for Premium AI Features
        </div>
      </div>
      <div class="px-4 pt-4">
        ${[
          { icon:'🌾',label:'Farm Size',val:`${f.acres||2} acres` },
          { icon:'🏔️',label:'Soil Type',val:(SOIL_TYPES.find(s2=>s2.id===f.soilType)||{label:'Not set'}).label },
          { icon:'💧',label:'Water Source',val:(WATER_SOURCES.find(w=>w.id===f.water)||{label:'Not set'}).label },
          { icon:'📱',label:'Mobile',val:STATE.pendingPhone?'+91-'+STATE.pendingPhone:'Not saved' },
        ].map(row=>`
          <div class="flex items-center gap-3 py-3" style="border-bottom:1px solid rgba(0,0,0,0.05)">
            <span style="font-size:24px;width:36px;text-align:center">${row.icon}</span>
            <div style="flex:1"><div class="text-xs text-muted">${row.label}</div>
            <div class="font-semibold">${row.val}</div></div>
          </div>`).join('')}
      </div>
      <div class="px-4 mt-4 mb-4">
        <button class="btn btn-outline btn-full mb-2" onclick="STATE.profileStep=1;navigate('profile')">✏️ Edit Profile</button>
        <button class="btn btn-ghost btn-full" style="color:var(--danger)" onclick="signOutUser()">🚪 Logout</button>
      </div>
    </div>
  `;
}
