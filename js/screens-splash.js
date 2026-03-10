// ============================================================
// SCREENS-SPLASH.JS – Splash + Real Firebase Phone OTP Login
// ============================================================

// LANGUAGES array is defined in data.js — do NOT redeclare here
// (data.js uses { code, label, name } — splash.js uses label + sub for display)
// We'll use a local display map for the 'sub' labels:
const LANG_SUBS = { te:'Telugu', hi:'Hindi', en:'English', ta:'Tamil', kn:'Kannada', mr:'Marathi' };


function renderSplash() {
  const s = document.getElementById('screen-splash');
  if (!s) return;
  s.innerHTML = `
    <div style="min-height:100%;background:linear-gradient(160deg,#1B5E20 0%,#2E7D32 45%,#F9A825 100%);
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                padding:40px 24px;position:relative;overflow:hidden">

      <!-- Background grain -->
      <div class="bg-grain"></div>

      <!-- Animated tractor -->
      <div class="tractor-anim" style="font-size:32px;margin-bottom:4px">🚜</div>

      <!-- App logo -->
      <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);
                  border-radius:28px;padding:20px;margin-bottom:18px;margin-top:8px;
                  box-shadow:0 8px 32px rgba(0,0,0,0.18)">
        <div style="font-size:56px;line-height:1">🌿</div>
      </div>

      <h1 class="font-display text-white text-center" style="font-size:28px;font-weight:800;margin:0 0 6px">
        Smart Farmer Advisor
      </h1>
      <div class="text-white text-center font-display" style="font-size:17px;opacity:0.9;margin-bottom:4px">
        ${t('tagline') || 'किसान का डिजिटल दोस्त'}
      </div>
      <div class="text-white text-center" style="font-size:13px;opacity:0.7;margin-bottom:28px">
        Farmer's Digital Friend
      </div>

      <!-- Language selector -->
      <div class="text-white text-center" style="font-size:12px;opacity:0.75;margin-bottom:10px">
        Choose Your Language / अपनी भाषा चुनें
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:320px;margin-bottom:28px">
        ${LANGUAGES.map(l => `
          <button class="lang-btn ${STATE.lang===l.code?'selected':''}"
            onclick="STATE.lang='${l.code}';saveLang('${l.code}');renderSplash()">
            <span style="font-size:16px;font-weight:700;display:block">${l.label}</span>
            <span style="font-size:10px;opacity:0.7">${LANG_SUBS[l.code]||l.name||l.code}</span>
          </button>`).join('')}
      </div>

      <!-- CTA Buttons -->
      <div style="width:100%;max-width:340px">
        <button class="btn w-full" style="background:white;color:var(--primary);font-size:17px;
          height:56px;font-weight:700;font-family:var(--font-display);border-radius:18px;
          box-shadow:0 4px 20px rgba(0,0,0,0.15);margin-bottom:12px"
          onclick="navigate('onboarding')">
          🚀 ${t('getStarted') || 'Get Started'}
        </button>
        <button class="btn w-full" style="background:rgba(255,255,255,0.15);color:white;
          border:1.5px solid rgba(255,255,255,0.4);height:48px;border-radius:14px"
          onclick="guestLogin()">
          ${t('guestLogin') || 'Continue as Guest'}
        </button>
      </div>

      <!-- Version -->
      <div style="position:absolute;bottom:16px;color:rgba(255,255,255,0.45);font-size:11px">
        v1.0 · Made for Indian Farmers 🇮🇳
      </div>
    </div>
  `;
}

function guestLogin() {
  STATE.farmer = { name:'Guest', avatar:'👨‍🌾', district:'India', state:'', acres:2, crops:[], soilType:'black', water:'rain' };
  saveFarmerData(STATE.farmer);
  navigate('home');
}

// ============================================================
// OTP LOGIN SCREEN — Real Firebase Phone Auth
// ============================================================
let otpSending = false;

function renderOnboarding() {
  const s = document.getElementById('screen-onboarding');
  if (!s) return;
  const isFirebaseReady = isFirebaseConfigured();

  s.innerHTML = `
    <div style="min-height:100%;background:var(--cream);display:flex;flex-direction:column">
      <!-- Top wave -->
      <div style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:40px 24px 50px;
                  clip-path:ellipse(100% 85% at 50% 0%);text-align:center;position:relative">
        <div style="font-size:48px;margin-bottom:8px">📱</div>
        <h2 class="text-white font-display" style="font-size:22px;margin:0 0 4px">
          ${t('loginTitle') || 'Enter Your Mobile Number'}
        </h2>
        <p class="text-white" style="opacity:0.8;font-size:14px;margin:0">
          ${t('loginSub') || 'We\'ll send you a one-time password'}
        </p>
        ${!isFirebaseReady ? `<div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:8px 14px;margin-top:12px;font-size:12px;color:rgba(255,255,255,0.9)">
          🔑 Demo Mode — OTP is <b>123456</b> · Add Firebase keys for real SMS</div>` : ''}
      </div>

      <!-- Phone form -->
      <div style="padding:32px 24px;flex:1" id="otp-phone-section">
        <div style="background:white;border-radius:20px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
          <label class="font-semibold text-sm" style="display:block;margin-bottom:8px;color:var(--dark)">
            📞 Mobile Number
          </label>
          <div style="display:flex;gap:10px;margin-bottom:20px">
            <div style="background:var(--cream);border:1.5px solid var(--border);border-radius:12px;
                        padding:14px 12px;font-weight:700;font-size:15px;white-space:nowrap;
                        display:flex;align-items:center;gap:6px">
              🇮🇳 +91
            </div>
            <input id="phone-input" type="tel" class="input" placeholder="9876543210" maxlength="10"
              style="flex:1;font-size:18px;letter-spacing:2px;font-family:var(--font-mono)"
              oninput="this.value=this.value.replace(/\D/g,'').slice(0,10)"
              onkeydown="if(event.key==='Enter')sendOTPClick()" />
          </div>

          <button id="send-otp-btn" class="btn btn-primary btn-full" style="height:52px;font-size:16px"
            onclick="sendOTPClick()">
            📨 Send OTP
          </button>

          <p class="text-center text-muted" style="font-size:12px;margin-top:12px">
            By continuing, you agree to our Terms of Service.<br>Standard SMS rates may apply.
          </p>
        </div>

        <!-- OTP verification section (hidden initially) -->
        <div id="otp-verify-section" style="display:none;margin-top:20px">
          <div style="background:white;border-radius:20px;padding:24px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
            <div style="text-align:center;margin-bottom:16px">
              <div style="font-size:36px;margin-bottom:6px">✉️</div>
              <div class="font-display font-bold" style="font-size:16px">OTP Sent!</div>
              <div id="otp-sent-to" class="text-muted text-sm"></div>
            </div>

            <!-- OTP boxes -->
            <div class="otp-row" id="otp-boxes">
              ${[0,1,2,3,4,5].map(i => `
                <input type="tel" maxlength="1" class="otp-box" id="otp-${i}"
                  oninput="otpBoxInput(this,${i})"
                  onkeydown="otpBoxKey(event,${i})"
                  style="font-size:22px;font-family:var(--font-mono)" />`).join('')}
            </div>

            <!-- Timer -->
            <div id="otp-timer" class="text-center text-muted text-sm" style="margin:12px 0">
              Resend OTP in <span id="timer-count" style="color:var(--primary);font-weight:700">60</span>s
            </div>

            <!-- Error display -->
            <div id="otp-error" style="display:none;color:var(--danger);font-size:13px;
              text-align:center;margin-bottom:8px;padding:8px;background:rgba(198,40,40,0.06);
              border-radius:8px"></div>

            <button id="verify-otp-btn" class="btn btn-primary btn-full" style="height:52px;font-size:16px"
              onclick="verifyOTPClick()">
              ✅ Verify OTP
            </button>

            <button id="resend-otp-btn" class="btn btn-ghost btn-full" style="display:none;margin-top:8px"
              onclick="resendOTPClick()">🔄 Resend OTP</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

let otpTimer = null;

async function sendOTPClick() {
  if (otpSending) return;
  const phoneInput = document.getElementById('phone-input');
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!phone || phone.length !== 10) {
    showToast('❌ Enter a valid 10-digit mobile number');
    return;
  }

  otpSending = true;
  const btn = document.getElementById('send-otp-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Sending...'; }

  const result = await sendRealOTP(phone);

  otpSending = false;
  if (btn) { btn.disabled = false; btn.textContent = '📨 Send OTP'; }

  if (result.success) {
    STATE.pendingPhone = phone;
    // Show OTP section
    const verifySection = document.getElementById('otp-verify-section');
    if (verifySection) {
      verifySection.style.display = 'block';
      verifySection.scrollIntoView({ behavior:'smooth' });
    }
    const sentTo = document.getElementById('otp-sent-to');
    if (sentTo) sentTo.textContent = `OTP sent to +91-${phone}${result.demo?' (Demo: 123456)':''}`;

    // Focus first OTP box
    setTimeout(() => { const b = document.getElementById('otp-0'); if(b) b.focus(); }, 300);

    // Start countdown timer
    startOTPTimer();
    showToast(result.demo ? '📨 Demo OTP: 123456' : '📨 OTP sent! Check your SMS');
  } else {
    showToast(result.error || '❌ Failed to send OTP');
    const errEl = document.getElementById('otp-error');
    if (errEl) { errEl.textContent = result.error; errEl.style.display = 'block'; }
  }
}

function startOTPTimer(seconds = 60) {
  if (otpTimer) clearInterval(otpTimer);
  let remaining = seconds;
  const timerEl = document.getElementById('timer-count');
  const timerRow = document.getElementById('otp-timer');
  const resendBtn = document.getElementById('resend-otp-btn');

  otpTimer = setInterval(() => {
    remaining--;
    if (timerEl) timerEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(otpTimer);
      if (timerRow) timerRow.style.display = 'none';
      if (resendBtn) resendBtn.style.display = 'block';
    }
  }, 1000);
}

function otpBoxInput(el, idx) {
  el.value = el.value.replace(/\D/g,'').slice(-1);
  // Clear error on type
  const errEl = document.getElementById('otp-error');
  if (errEl) errEl.style.display = 'none';
  // Move to next box
  if (el.value && idx < 5) {
    const next = document.getElementById('otp-' + (idx + 1));
    if (next) next.focus();
  }
  // Auto-verify when all 6 digits entered
  if (idx === 5 && el.value) {
    setTimeout(verifyOTPClick, 300);
  }
}

function otpBoxKey(e, idx) {
  if (e.key === 'Backspace') {
    const el = document.getElementById('otp-' + idx);
    if (el && !el.value && idx > 0) {
      const prev = document.getElementById('otp-' + (idx - 1));
      if (prev) { prev.value = ''; prev.focus(); }
    }
  }
  if (e.key === 'Enter') verifyOTPClick();
}

function getEnteredOTP() {
  return [0,1,2,3,4,5].map(i => {
    const el = document.getElementById('otp-' + i);
    return el ? el.value : '';
  }).join('');
}

async function verifyOTPClick() {
  const otp = getEnteredOTP();
  if (otp.length < 6) { showToast('❌ Enter all 6 digits'); return; }

  const btn = document.getElementById('verify-otp-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Verifying...'; }

  const result = await verifyRealOTP(otp);

  if (btn) { btn.disabled = false; btn.textContent = '✅ Verify OTP'; }

  if (result.success) {
    clearInterval(otpTimer);
    // Save user ID and phone if real Firebase
    if (!result.demo && result.uid) {
      localStorage.setItem('sfa_uid', result.uid);
      localStorage.setItem('sfa_phone', result.phone);
    }
    showToast('✅ Verified! Setting up your profile...');
    setTimeout(() => {
      STATE.profileStep = 1;
      // Check if profile already saved
      const saved = loadFarmerData();
      if (saved && saved.name && saved.name !== 'Guest') {
        STATE.farmer = saved;
        navigate('home');
      } else {
        navigate('profile');
      }
    }, 800);
  } else {
    const errEl = document.getElementById('otp-error');
    if (errEl) { errEl.textContent = result.error || '❌ Invalid OTP'; errEl.style.display = 'block'; }
    showToast(result.error || '❌ Invalid OTP');
    // Shake OTP boxes
    const boxes = document.getElementById('otp-boxes');
    if (boxes) { boxes.style.animation = 'shake 0.4s'; setTimeout(() => boxes.style.animation='', 500); }
  }
}

async function resendOTPClick() {
  const resendBtn = document.getElementById('resend-otp-btn');
  const timerRow  = document.getElementById('otp-timer');
  if (resendBtn) resendBtn.style.display = 'none';
  if (timerRow)  timerRow.style.display = 'block';
  // Clear boxes
  [0,1,2,3,4,5].forEach(i => { const el = document.getElementById('otp-' + i); if(el) el.value = ''; });
  await sendOTPClick();
}
