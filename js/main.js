// ============================================================
// MAIN.JS – App Bootstrap: builds all screen HTML, mounts SPA
// ============================================================

function buildAppShell() {
  const app = document.getElementById('app');
  if (!app) return;

  // Generate all screen container divs
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
  `).join('') + `
    <!-- BOTTOM NAV (global, outside screens) -->
    <nav class="bottom-nav" id="bottom-nav"></nav>
  `;
}

function initApp() {
  buildAppShell();

  // Render initial screens
  renderSplash();
  renderOnboarding();
  renderProfileScreen();

  // Render bottom nav
  renderBottomNav();

  // Override profile navigate to handle profile-view
  const origNavigate = window.navigate;

  // Patch profile nav item to show profile-view if farmer exists
  document.getElementById('bottom-nav')?.addEventListener('click', (e) => {
    // Already handled by onclick
  });

  // Once user lands on home, render all screens lazily
  // They are rendered on navigate() via refreshScreen()

  // Hide bottom nav on certain screens
  const navHiddenScreens = ['splash','onboarding','profile','voice'];
  const origRefresh = window.refreshScreen || function(){};

  window.updateBottomNavVisibility = function(screenId) {
    const nav = document.getElementById('bottom-nav');
    if (!nav) return;
    nav.style.display = navHiddenScreens.includes(screenId) ? 'none' : 'flex';
  };

  // Wrap navigate to also update nav visibility
  const _navigate = navigate;
  window.navigate = function(screenId, direction) {
    // Special case: profile from bottom nav should show profile-view if farmer exists
    if (screenId === 'profile' && STATE.farmer && STATE.currentScreen !== 'profile') {
      const s = document.getElementById('screen-profile-view');
      if (s) {
        renderProfileView();
        _navigate('profile-view', direction);
        return;
      }
    }
    _navigate(screenId, direction);
    window.updateBottomNavVisibility(screenId);
  };
  window.updateBottomNavVisibility('splash');
}

// ---- HANDLE INITIAL LOAD ----
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Auto-advance splash after 2.8s (optional – user may interact)
  // Uncomment below to auto-advance:
  // setTimeout(() => { if (STATE.currentScreen === 'splash') navigate('onboarding'); }, 3500);
});

// Expose key functions globally for inline onclick handlers
window.navigate = function(screenId, direction = 'forward') {
  const navHiddenScreens = ['splash','onboarding','profile','voice'];
  if (screenId === 'profile' && STATE.farmer && STATE.currentScreen !== 'profile') {
    const s = document.getElementById('screen-profile-view');
    if (s) {
      renderProfileView();
    }
    // Use core navigate to profile-view
    const current = document.getElementById('screen-' + STATE.currentScreen);
    const next = document.getElementById('screen-profile-view');
    if (!next) { return; }
    next.classList.remove('hidden','slide-left','slide-right');
    next.style.zIndex = 10;
    if (current) current.style.zIndex = 5;
    next.getBoundingClientRect();
    if (direction === 'forward') {
      next.classList.add('slide-right');
      requestAnimationFrame(() => { requestAnimationFrame(() => { next.classList.remove('slide-right'); }); });
    }
    setTimeout(() => {
      if (current) { current.classList.add('hidden'); current.style.zIndex = ''; }
      next.style.zIndex = '';
    }, 400);
    STATE.currentScreen = 'profile-view';
    updateBottomNav('profile');
    const nav = document.getElementById('bottom-nav');
    if (nav) nav.style.display = 'flex';
    return;
  }

  // Core navigate
  const current = document.getElementById('screen-' + STATE.currentScreen);
  const next = document.getElementById('screen-' + screenId);
  if (!next || screenId === STATE.currentScreen) return;

  next.classList.remove('hidden', 'slide-left', 'slide-right');
  next.style.zIndex = 10;
  if (current) current.style.zIndex = 5;
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

  // Nav visibility
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.style.display = navHiddenScreens.includes(screenId) ? 'none' : 'flex';
};
