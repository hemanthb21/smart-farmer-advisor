// ============================================================
// CORE.JS – Router, BottomNav, and utility renderers
// ============================================================

const SCREENS = ['splash','onboarding','profile','home','crop','disease','weather','mandi','schemes','voice','reminders','soil','analytics','marketplace','experts','community'];

function navigate(screenId, direction = 'forward') {
  const current = document.getElementById('screen-' + STATE.currentScreen);
  const next = document.getElementById('screen-' + screenId);
  if (!next || screenId === STATE.currentScreen) return;

  next.classList.remove('hidden', 'slide-left', 'slide-right');
  next.style.zIndex = 10;
  if (current) current.style.zIndex = 5;

  // Trigger reflow
  next.getBoundingClientRect();
  if (direction === 'forward') {
    next.classList.add('slide-right');
    requestAnimationFrame(() => { requestAnimationFrame(() => { next.classList.remove('slide-right'); }); });
  } else {
    next.classList.add('slide-left');
    requestAnimationFrame(() => { requestAnimationFrame(() => { next.classList.remove('slide-left'); }); });
  }

  setTimeout(() => {
    if (current) { current.classList.add('hidden'); current.style.zIndex = ''; }
    next.style.zIndex = '';
  }, 400);

  STATE.currentScreen = screenId;
  updateBottomNav(screenId);
  refreshScreen(screenId);
}

function refreshScreen(id) {
  if (id === 'home') renderHome();
  if (id === 'crop') renderCropStep();
  if (id === 'mandi') renderMandi();
  if (id === 'schemes') renderSchemes();
  if (id === 'marketplace') renderMarketplace();
  if (id === 'experts') renderExperts();
  if (id === 'community') renderCommunity();
  if (id === 'analytics') renderAnalytics();
  if (id === 'soil') renderSoil();
  if (id === 'reminders') renderReminders();
  if (id === 'weather') renderWeather();
  if (id === 'voice') renderVoice();
  if (id === 'disease') resetDisease();
}

// ---- BOTTOM NAV ----
const NAV_ITEMS = [
  { id: 'home',      icon: '🏠', label: 'Home' },
  { id: 'crop',      icon: '🌱', label: 'My Farm' },
  { id: 'voice',     icon: '🎙️', label: 'Ask AI' },
  { id: 'schemes',   icon: '📋', label: 'Schemes' },
  { id: 'profile',   icon: '👤', label: 'Profile' },
];

function renderBottomNav() {
  const el = document.getElementById('bottom-nav');
  if (!el) return;
  el.innerHTML = NAV_ITEMS.map(item => `
    <button class="nav-item ${STATE.currentScreen === item.id ? 'active' : ''}"
      onclick="navigate('${item.id}')" aria-label="${item.label}">
      <div class="nav-icon-wrap">
        <span class="nav-icon" style="font-size:22px">${item.icon}</span>
      </div>
      <span class="nav-label">${item.label}</span>
    </button>
  `).join('');
}

function updateBottomNav(screenId) {
  document.querySelectorAll('.nav-item').forEach((el, i) => {
    el.classList.toggle('active', NAV_ITEMS[i].id === screenId);
  });
}

// ---- BACK BUTTON HELPER ----
function backBtn(target, label = '') {
  return `<button class="icon-btn" onclick="navigate('${target}','back')" aria-label="Back">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <span class="topbar-title font-display">${label}</span>`;
}

// ---- SPARKLINE ----
function renderSparkline(data, color = '#4CAF50') {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return `<div class="sparkline-wrap">
    ${data.map((v, i) => {
      const h = Math.round(((v - min) / range) * 40 + 8);
      const isLast = i === data.length - 1;
      return `<div class="sparkline-bar" style="height:${h}px;background:${isLast ? color : color + '60'}"></div>`;
    }).join('')}
  </div>`;
}

// ---- SVG LINE CHART ----
function renderLineChart(data, color = '#2E7D32', width = 320, height = 80) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  const areaClose = `${width},${height} 0,${height}`;
  return `<svg viewBox="0 0 ${width} ${height}" class="chart-svg" style="width:100%;height:${height}px">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    <polygon points="${pts} ${areaClose}" fill="url(#cg)"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${data.map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 10) - 5;
      const isLast = i === data.length - 1;
      return isLast ? `<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="white" stroke-width="2"/>` : '';
    }).join('')}
  </svg>`;
}

// ---- GAUGE SVG ----
function renderGauge(value, max = 100, color = '#2E7D32') {
  const pct = Math.min(value / max, 1);
  const r = 52; const cx = 64; const cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75;
  const gap = circ - dash;
  const offset = circ * 0.125;
  return `<svg width="128" height="128" viewBox="0 0 128 128">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="12" stroke-dasharray="${circ*0.75} ${circ*0.25}" stroke-dashoffset="${-offset}" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="12"
      stroke-dasharray="${dash} ${gap + circ*0.25}" stroke-dashoffset="${-offset}" stroke-linecap="round"
      style="transition:stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle"
      font-family="'Baloo 2',sans-serif" font-weight="800" font-size="24" fill="${color}">${value}</text>
    <text x="${cx}" y="${cy+20}" text-anchor="middle" font-family="'Noto Sans',sans-serif" font-size="11" fill="#78909C">/ ${max}</text>
  </svg>`;
}

// ---- CROP MATCH BADGE ----
function matchColor(pct) {
  if (pct >= 80) return '#2E7D32';
  if (pct >= 65) return '#F9A825';
  return '#C62828';
}

// ---- PROFILE SCREEN ----
function renderProfileScreen() {
  const s = document.getElementById('screen-profile');
  if (!s) return;
  const d = STATE.profileData;
  const step = STATE.profileStep;
  const avatars = ['👨‍🌾','👩‍🌾','🧑‍🌾','👴','👵','🧑','👨','👩'];

  const steps = [
    // Step 1: Avatar + Name
    `<div class="text-center mb-6" style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <p class="text-muted text-sm mb-4">Choose your avatar</p>
      <div class="avatar-grid px-4">
        ${avatars.map((a, i) => `
          <div class="avatar-item ${STATE.selectedAvatar===i?'selected':''}" onclick="STATE.selectedAvatar=${i};renderProfileScreen()">
            <span style="font-size:36px">${a}</span>
          </div>`).join('')}
      </div>
      <div class="p-4 mt-2">
        <label class="text-sm font-semibold text-muted mb-2" style="display:block">${t('name')}</label>
        <input class="input" placeholder="e.g. Ramaiah Kumar" value="${d.name}"
          oninput="STATE.profileData.name=this.value" />
      </div>
    </div>`,

    // Step 2: Location
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <div class="p-4">
        <label class="text-sm font-semibold text-muted mb-2" style="display:block">${t('state')}</label>
        <select class="input mb-3" onchange="STATE.profileData.state=this.value">
          <option value="">Select State</option>
          ${['Andhra Pradesh','Telangana','Karnataka','Tamil Nadu','Maharashtra','Madhya Pradesh','Uttar Pradesh','Punjab','Rajasthan','Gujarat','Odisha','Bihar']
            .map(s2 => `<option ${d.state===s2?'selected':''}>${s2}</option>`).join('')}
        </select>
        <label class="text-sm font-semibold text-muted mb-2" style="display:block">${t('district')}</label>
        <input class="input mb-3" placeholder="e.g. Guntur" value="${d.district}" oninput="STATE.profileData.district=this.value" />
        <label class="text-sm font-semibold text-muted mb-2" style="display:block">${t('village')}</label>
        <input class="input" placeholder="e.g. Tadepalli" value="${d.village}" oninput="STATE.profileData.village=this.value" />
      </div>
    </div>`,

    // Step 3: Land + Soil
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <div class="p-4">
        <label class="text-sm font-semibold text-muted mb-1" style="display:block">${t('landSize')}: <b class="text-primary">${d.acres} acres</b></label>
        <input type="range" min="0.5" max="50" step="0.5" value="${d.acres}" class="mb-4"
          oninput="STATE.profileData.acres=parseFloat(this.value);this.previousElementSibling.innerHTML='${t('landSize')}: <b class=\\'text-primary\\'>'+this.value+' acres</b>'" />
        <p class="text-sm font-semibold text-muted mb-2">${t('soilType')}</p>
        <div class="select-grid cols-3">
          ${SOIL_TYPES.map(s2 => `
            <div class="select-item ${d.soilType===s2.id?'selected':''}" onclick="STATE.profileData.soilType='${s2.id}';renderProfileScreen()">
              <span class="select-item-emoji">${s2.emoji}</span>
              <span class="select-item-label">${s2.label}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

    // Step 4: Water + Crops
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <div class="p-4">
        <p class="text-sm font-semibold text-muted mb-2">${t('waterSource')}</p>
        <div class="grid-2 mb-4">
          ${WATER_SOURCES.map(w => `
            <div class="select-item ${d.waterSource===w.id?'selected':''}" onclick="STATE.profileData.waterSource='${w.id}';renderProfileScreen()">
              <span class="select-item-emoji">${w.emoji}</span>
              <span class="select-item-label">${w.label}</span>
            </div>`).join('')}
        </div>
        <p class="text-sm font-semibold text-muted mb-2">${t('primaryCrops')} (select all)</p>
        <div class="select-grid cols-3">
          ${CROPS_LIST.map(c => {
            const sel = d.crops.includes(c.id);
            return `<div class="select-item ${sel?'selected':''}" onclick="toggleCrop('${c.id}')">
              <span class="select-item-emoji">${c.emoji}</span>
              <span class="select-item-label">${c.label}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`,
  ];

  s.innerHTML = `
    <div class="hero-gradient" style="padding:48px 24px 32px">
      <div class="flex items-center justify-between mb-4">
        ${step > 1 ? `<button class="icon-btn" style="background:rgba(255,255,255,0.2);color:white" onclick="STATE.profileStep--;renderProfileScreen()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>` : '<div></div>'}
        <span class="text-white text-sm font-semibold font-display">${t('step')} ${step} ${t('of')} 4</span>
        <div></div>
      </div>
      <h1 class="font-display text-2xl text-white font-bold mb-1">Set Up Your Farm Profile</h1>
      <p class="text-white text-sm" style="opacity:0.8">Personalize your AI farming experience</p>
      <div class="steps-row mt-4">
        ${[1,2,3,4].map(i => `<div class="step-dot ${i===step?'active':i<step?'done':''}" style="flex:${i===step?2:1}"></div>`).join('')}
      </div>
    </div>

    <div style="padding-bottom:100px">
      ${steps[step - 1]}
      <div class="p-4">
        <button class="btn btn-primary btn-full font-display" onclick="profileNext()">
          ${step === 4 ? '🌱 ' + t('saveProfile') : 'Continue →'}
        </button>
      </div>
    </div>
  `;
}

function toggleCrop(id) {
  const arr = STATE.profileData.crops;
  const idx = arr.indexOf(id);
  if (idx >= 0) arr.splice(idx, 1); else arr.push(id);
  renderProfileScreen();
}

function profileNext() {
  if (STATE.profileStep < 4) {
    STATE.profileStep++;
    renderProfileScreen();
  } else {
    // Save profile
    STATE.farmer = {
      name: STATE.profileData.name || 'Farmer',
      avatar: ['👨‍🌾','👩‍🌾','🧑‍🌾','👴','👵','🧑','👨','👩'][STATE.selectedAvatar],
      state: STATE.profileData.state || 'Andhra Pradesh',
      district: STATE.profileData.district || 'Guntur',
      village: STATE.profileData.village,
      acres: STATE.profileData.acres,
      soilType: STATE.profileData.soilType,
      water: STATE.profileData.waterSource,
      crops: STATE.profileData.crops,
    };
    showToast('✅ Profile saved! Welcome ' + STATE.farmer.name);
    navigate('home');
  }
}
