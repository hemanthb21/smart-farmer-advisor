// ============================================================
// SCREENS-SPLASH.JS – Splash screen + Language Onboarding
// ============================================================

function renderSplash() {
  const s = document.getElementById('screen-splash');
  if (!s) return;
  s.innerHTML = `
    <div style="position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;overflow:hidden">

      <!-- Animated background circles -->
      <div style="position:absolute;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.06);top:-80px;right:-80px;pointer-events:none"></div>
      <div style="position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.05);bottom:60px;left:-60px;pointer-events:none"></div>

      <!-- App Logo -->
      <div class="splash-logo" style="opacity:0;animation:leafGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s forwards">
        🌿
      </div>

      <!-- App Name -->
      <h1 class="font-display text-white text-center mb-2"
          style="font-size:26px;font-weight:800;opacity:0;animation:fadeInUp 0.5s ease 0.6s forwards">
        Smart Farmer Advisor
      </h1>

      <!-- Tagline -->
      <div class="splash-tagline mb-6" style="opacity:0;animation:fadeInUp 0.5s ease 0.8s forwards">
        <div style="font-size:18px;font-weight:700;color:rgba(255,255,255,0.95)">किसान का डिजिटल दोस्त</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7)">Farmer's Digital Friend</div>
      </div>

      <!-- Language selector -->
      <div style="width:100%;opacity:0;animation:fadeInUp 0.5s ease 1s forwards">
        <p class="text-white text-center text-sm mb-3" style="font-weight:600;opacity:0.85">Choose Your Language / अपनी भाषा चुनें</p>
        <div class="lang-grid mb-6">
          ${LANGUAGES.map(l => `
            <button class="lang-btn ${STATE.lang===l.code?'selected':''}"
              onclick="STATE.lang='${l.code}';renderSplash()">
              <div style="font-size:16px;font-weight:700">${l.label}</div>
              <div style="font-size:10px;opacity:0.75">${l.name}</div>
            </button>`).join('')}
        </div>
        <button class="btn btn-full font-display mb-3" style="background:white;color:var(--primary);font-size:17px"
          onclick="navigate('onboarding')">
          🚀 ${t('getStarted')}
        </button>
        <button class="btn btn-full font-display" style="background:rgba(255,255,255,0.15);color:white;font-size:14px"
          onclick="guestLogin()">
          ${t('guestMode')}
        </button>
      </div>

      <!-- Tractor animation -->
      <div class="tractor-wrap">
        <div class="tractor">🚜</div>
        <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.15);border-radius:2px"></div>
      </div>
    </div>
  `;
}

function guestLogin() {
  STATE.farmer = {
    name: 'Guest', avatar: '🧑‍🌾', state: 'Andhra Pradesh',
    district: 'Guntur', village: '', acres: 2,
    soilType: 'black', water: 'borewell', crops: ['paddy'],
  };
  navigate('home');
}

// ============================================================
// ONBOARDING (OTP Screen)
// ============================================================

function renderOnboarding() {
  const s = document.getElementById('screen-onboarding');
  if (!s) return;
  s.innerHTML = `
    <div style="min-height:100%;background:linear-gradient(160deg,#1B5E20,#2E7D32 50%,#43A047);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px">

      <div style="margin-bottom:32px;text-align:center;opacity:0;animation:fadeInUp 0.4s ease forwards">
        <div style="font-size:56px;margin-bottom:12px">📱</div>
        <h2 class="font-display text-white" style="font-size:24px;font-weight:800;margin-bottom:6px">Login with Mobile</h2>
        <p style="color:rgba(255,255,255,0.75);font-size:14px">No email needed — just your phone number</p>
      </div>

      <div style="width:100%;opacity:0;animation:fadeInUp 0.4s ease 0.2s forwards">
        <div style="position:relative;margin-bottom:16px">
          <div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:white;font-weight:700;font-size:16px;z-index:2">🇮🇳 +91</div>
          <input type="tel" class="input" id="phone-input" placeholder="98765 43210"
            style="padding-left:80px;background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.3);color:white;font-size:18px;letter-spacing:1px"
            maxlength="10" oninput="phoneChange(this)" />
        </div>

        <div id="otp-section" style="display:none;margin-bottom:16px;opacity:0;animation:fadeInUp 0.3s ease forwards">
          <p style="color:rgba(255,255,255,0.8);font-size:13px;text-align:center;margin-bottom:12px">
            OTP sent to +91 <span id="otp-phone"></span>
          </p>
          <div class="otp-inputs" id="otp-inputs">
            ${[0,1,2,3,4,5].map(i => `
              <input type="number" class="otp-input" maxlength="1"
                id="otp-${i}" oninput="otpInput(this,${i})" onkeydown="otpKey(event,${i})" />`).join('')}
          </div>
        </div>

        <button class="btn btn-full font-display mb-3" id="otp-btn"
          style="background:var(--accent-gold);color:white;font-size:16px"
          onclick="sendOTP()">
          Send OTP 📨
        </button>

        <div style="text-align:center">
          <button class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.1)"
            onclick="navigate('splash','back')">← Back</button>
        </div>
      </div>
    </div>
  `;
}

function phoneChange(el) {
  el.value = el.value.replace(/\D/g, '').slice(0, 10);
}

function sendOTP() {
  const phone = document.getElementById('phone-input')?.value || '';
  if (phone.length < 10) { showToast('⚠️ Enter a valid 10-digit number'); return; }
  const btn = document.getElementById('otp-btn');
  const sec = document.getElementById('otp-section');
  const ph = document.getElementById('otp-phone');
  if (!btn || !sec || !ph) return;
  btn.textContent = '⏳ Sending...'; btn.disabled = true;
  setTimeout(() => {
    sec.style.display = 'block';
    if (ph) ph.textContent = phone;
    btn.textContent = 'Verify OTP ✅'; btn.disabled = false;
    btn.onclick = verifyOTP;
    showToast('📱 OTP sent! (Demo: use 123456)');
  }, 1200);
}

function otpInput(el, i) {
  el.value = el.value.replace(/\D/g,'').slice(-1);
  if (el.value && i < 5) document.getElementById('otp-' + (i+1))?.focus();
}
function otpKey(e, i) {
  if (e.key === 'Backspace' && !e.target.value && i > 0) {
    document.getElementById('otp-' + (i-1))?.focus();
  }
}

function verifyOTP() {
  const otp = [0,1,2,3,4,5].map(i => document.getElementById('otp-'+i)?.value || '').join('');
  const btn = document.getElementById('otp-btn');
  if (!btn) return;
  btn.textContent = '🔄 Verifying...'; btn.disabled = true;
  setTimeout(() => {
    btn.disabled = false;
    if (otp === '123456') {
      showToast('✅ Login successful!');
      navigate('profile');
    } else {
      showToast('❌ Wrong OTP. Try 123456');
      btn.textContent = 'Verify OTP ✅';
    }
  }, 1000);
}
