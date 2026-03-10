// ============================================================
// MAIN.JS – App Bootstrap with Auto-Login from LocalStorage
// ============================================================

function buildAppShell() {
  const app = document.getElementById('app');
  if (!app) return;

  const screenDefs = [
    { id: 'splash',       bg: 'linear-gradient(160deg,#1B5E20,#2E7D32 40%,#F9A825)' },
    { id: 'onboarding',   bg: 'var(--cream)' },
    { id: 'profile',      bg: 'var(--cream)' },
    { id: 'home',         bg: 'var(--cream)' },
    { id: 'crop',         bg: 'var(--cream)' },
    { id: 'disease',      bg: 'var(--cream)' },
    { id: 'weather',      bg: 'var(--cream)' },
    { id: 'mandi',        bg: 'var(--cream)' },
    { id: 'schemes',      bg: 'var(--cream)' },
    { id: 'voice',        bg: 'linear-gradient(160deg,#1B5E20,#2E7D32)' },
    { id: 'reminders',    bg: 'var(--cream)' },
    { id: 'soil',         bg: 'var(--cream)' },
    { id: 'analytics',    bg: 'var(--cream)' },
    { id: 'marketplace',  bg: 'var(--cream)' },
    { id: 'experts',      bg: 'var(--cream)' },
    { id: 'community',    bg: 'var(--cream)' },
    { id: 'profile-view', bg: 'var(--cream)' },
  ];

  app.innerHTML = screenDefs.map(sc => `
    <div id="screen-${sc.id}" class="screen ${sc.id !== 'splash' ? 'hidden' : ''}"
      style="background:${sc.bg}"></div>
  `).join('') + `<nav class="bottom-nav" id="bottom-nav"></nav>`;
}

const NAV_HIDDEN_SCREENS = ['splash', 'onboarding', 'profile', 'voice'];

// ── CORE NAVIGATE (overrides the stub in core.js) ──
function navigate(screenId, direction = 'forward') {
  const navHidden = NAV_HIDDEN_SCREENS.includes(screenId);

  // Profile → show profile-view if farmer is set
  if (screenId === 'profile' && STATE.farmer && STATE.currentScreen !== 'profile') {
    screenId = 'profile-view';
  }

  const current = document.getElementById('screen-' + STATE.currentScreen);
  const next    = document.getElementById('screen-' + screenId);
  if (!next || screenId === STATE.currentScreen) return;

  next.classList.remove('hidden', 'slide-left', 'slide-right');
  next.style.zIndex = 10;
  if (current) current.style.zIndex = 5;
  next.getBoundingClientRect(); // force reflow

  const animClass = direction === 'back' ? 'slide-left' : 'slide-right';
  next.classList.add(animClass);
  requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove(animClass)));

  setTimeout(() => {
    if (current) { current.classList.add('hidden'); current.style.zIndex = ''; }
    next.style.zIndex = '';
  }, 400);

  STATE.currentScreen = screenId;
  updateBottomNav(screenId);
  refreshScreen(screenId);

  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = navHidden ? 'none' : 'flex';
}

function refreshScreen(screenId) {
  const fn = {
    home:         renderHome,
    crop:         () => renderCropStep(STATE.cropStep || 1),
    disease:      renderDisease,
    weather:      renderWeather,
    mandi:        renderMandi,
    schemes:      renderSchemes,
    voice:        renderVoice,
    reminders:    renderReminders,
    soil:         renderSoil,
    analytics:    renderAnalytics,
    marketplace:  renderMarketplace,
    experts:      renderExperts,
    community:    renderCommunity,
    'profile-view': renderProfileView,
    profile:      renderProfileScreen,
    onboarding:   renderOnboarding,
    splash:       renderSplash,
  }[screenId];
  if (fn) fn();
}

// ── APP INIT ──
async function initApp() {
  buildAppShell();

  // Load saved language
  const savedLang = loadLang();
  if (savedLang) STATE.lang = savedLang;

  // Load saved farmer profile
  const savedFarmer = loadFarmerData();
  if (savedFarmer) STATE.farmer = savedFarmer;

  // Load saved reminders
  STATE.reminders = loadReminders();

  // Load saved soil data
  const savedSoil = loadSoilData();
  if (savedSoil) Object.assign(STATE.soilData, savedSoil);

  // Render bottom nav
  renderBottomNav();
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = 'none'; // hidden on splash

  // Initialize Firebase (if configured)
  if (isFirebaseConfigured()) initFirebase();

  // Decide start screen
  if (savedFarmer && savedFarmer.name && savedFarmer.name !== 'Guest') {
    // Returning user — skip straight to home
    STATE.currentScreen = 'home';
    const splashEl = document.getElementById('screen-splash');
    const homeEl   = document.getElementById('screen-home');
    if (splashEl) splashEl.classList.add('hidden');
    if (homeEl)   homeEl.classList.remove('hidden');
    if (nav)      nav.style.display = 'flex';
    updateBottomNav('home');
    renderHome(); // async — will also fetch weather
    showToast(`🌱 Welcome back, ${savedFarmer.name}!`);
  } else {
    // First time — show splash
    renderSplash();
    renderOnboarding();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
