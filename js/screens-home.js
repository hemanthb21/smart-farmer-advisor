// ============================================================
// SCREENS-HOME.JS – Home Dashboard + Weather Screen
// ============================================================

function renderHome() {
  const s = document.getElementById('screen-home');
  if (!s) return;
  const f = STATE.farmer || { name: 'Farmer', avatar: '👨‍🌾', district: 'Guntur', state: 'Andhra Pradesh' };

  const modules = [
    { id:'crop',      emoji:'🌱', label: t('cropAdvisor'),    color:'#2E7D32' },
    { id:'disease',   emoji:'🍃', label: t('diseaseScan'),    color:'#C62828' },
    { id:'weather',   emoji:'🌦️', label: t('weather'),        color:'#0288D1' },
    { id:'mandi',     emoji:'💰', label: t('mandiPrices'),    color:'#F9A825' },
    { id:'schemes',   emoji:'🏛️', label: t('govSchemes'),     color:'#5D4037' },
    { id:'voice',     emoji:'🎙️', label: t('voiceHelp'),      color:'#4CAF50' },
    { id:'reminders', emoji:'⏰', label: t('reminders'),      color:'#FF6F00' },
    { id:'soil',      emoji:'🌍', label: t('soilHealth'),     color:'#5D4037' },
    { id:'analytics', emoji:'📊', label: t('analytics'),      color:'#0288D1' },
    { id:'marketplace',emoji:'🛒',label: t('marketplace'),    color:'#F9A825' },
    { id:'experts',   emoji:'🤝', label: t('expertConnect'),  color:'#2E7D32' },
    { id:'community', emoji:'🏆', label: t('community'),      color:'#FF6F00' },
  ];

  const weatherData = [18,22,30,27,25,24,26];
  const days = ['M','T','W','T','F','S','S'];

  s.innerHTML = `
    <div class="screen-content">
      <!-- TOP GRADIENT HEADER -->
      <div class="hero-gradient" style="padding:48px 16px 24px">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="font-display text-white" style="font-size:20px;font-weight:800;line-height:1.2">${greet(f.name)}</h1>
            <div class="flex items-center gap-2 mt-1">
              <span style="font-size:12px;color:rgba(255,255,255,0.8)">📍 ${f.district}, ${f.state}</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="relative">
              <button class="icon-btn" style="background:rgba(255,255,255,0.2);color:white" onclick="showToast('🔔 3 new alerts')">
                🔔
                <span class="notif-badge">${STATE.notifCount}</span>
              </button>
            </div>
            <div style="width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer" onclick="navigate('profile')">${f.avatar}</div>
          </div>
        </div>

        <!-- WEATHER STRIP -->
        <div class="card" style="padding:14px 16px;border-radius:18px" onclick="navigate('weather')">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <span style="font-size:36px">⛅</span>
              <div>
                <div class="font-display font-bold" style="font-size:22px">32°C</div>
                <div class="text-muted text-xs">Partly Cloudy • Guntur</div>
              </div>
            </div>
            <div style="text-align:right">
              <div class="chip chip-sky text-xs">💧 68% Humidity</div>
              <div class="text-xs text-muted mt-1">Wind: 12 km/h</div>
            </div>
          </div>
          <div style="background:rgba(2,136,209,0.08);border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:8px">
            <span>🌧️</span>
            <span class="text-sm font-semibold" style="color:var(--sky)">${t('aiAlert')}</span>
          </div>
          <div class="flex gap-2 mt-3">
            ${['Today','Wed','Thu'].map((d2,i) => `
              <div class="forecast-chip" style="flex:1;background:rgba(2,136,209,0.08);border-radius:10px;padding:6px;text-align:center">
                <div class="text-xs text-muted">${d2}</div>
                <div style="font-size:18px">${['⛅','☀️','🌧️'][i]}</div>
                <div class="font-mono text-xs font-bold">${[32,35,28][i]}°</div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- AI ALERT BANNER -->
      <div class="px-4 mt-4">
        <div class="alert-banner rain" style="cursor:pointer" onclick="navigate('weather')">
          <span style="font-size:20px">🌧️</span>
          <div>
            <div class="text-sm font-semibold">Heavy rain forecast in 48 hours</div>
            <div class="text-xs text-muted">Delay pesticide spraying. Check drainage. Tap for full forecast.</div>
          </div>
        </div>
      </div>

      <!-- QUICK STATS -->
      <div class="stats-row mt-3">
        <div class="stat-mini">
          <div class="stat-mini-val font-mono">${f.acres || 2}</div>
          <div class="stat-mini-label">Acres</div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-val font-mono">₹2,140</div>
          <div class="stat-mini-label">Paddy/Qtl</div>
        </div>
        <div class="stat-mini">
          <div class="stat-mini-val font-mono">72</div>
          <div class="stat-mini-label">Soil Score</div>
        </div>
      </div>

      <!-- MODULE GRID -->
      <div class="section-header mt-2">
        <span class="section-title font-display">📱 All Features</span>
        <span class="text-muted text-xs">${modules.length} modules</span>
      </div>
      <div class="module-grid">
        ${modules.map((m, i) => `
          <div class="module-item ${i<2?'featured':''}"
            onclick="navigate('${m.id}')"
            style="opacity:0;animation:fadeInUp 0.4s ease ${0.05 * i}s forwards">
            <div class="module-emoji" style="background:${m.color}18">
              <span>${m.emoji}</span>
            </div>
            <span class="module-label">${m.label}</span>
          </div>`).join('')}
      </div>

      <!-- RECENT ACTIVITY -->
      <div class="section-header mt-2">
        <span class="section-title font-display">⚡ Recent Activity</span>
      </div>
      <div class="px-4 mb-3">
        ${[
          { icon:'🍃', text:'Disease scan — Bacterial Blight detected', time:'2h ago', color:'#C62828' },
          { icon:'💰', text:'Mandi Alert — Rice ₹2,140 (↑3.2%)', time:'6h ago', color:'#2E7D32' },
          { icon:'🏛️', text:'PM-KISAN scheme payment due Jan 2026', time:'1d ago', color:'#F9A825' },
        ].map(a => `
          <div class="flex items-center gap-3 py-3" style="border-bottom:1px solid rgba(0,0,0,0.05)">
            <div style="width:36px;height:36px;border-radius:10px;background:${a.color}18;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${a.icon}</div>
            <div style="flex:1">
              <div class="text-sm font-semibold">${a.text}</div>
              <div class="text-xs text-muted">${a.time}</div>
            </div>
          </div>`).join('')}
      </div>

      <!-- GAMIFICATION BANNER -->
      <div class="px-4 mb-4">
        <div class="card card-gold flex items-center gap-3" style="padding:14px 16px;border-radius:16px">
          <span style="font-size:32px">🏅</span>
          <div>
            <div class="font-display font-bold text-white">Level 3 Farmer</div>
            <div style="color:rgba(255,255,255,0.85);font-size:12px">142 XP • Next badge: Elite Farmer at 200 XP</div>
            <div class="progress-bar mt-2" style="background:rgba(255,255,255,0.3)">
              <div class="progress-fill" style="width:71%;background:rgba(255,255,255,0.9)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// WEATHER SCREEN
// ============================================================

function renderWeather() {
  const s = document.getElementById('screen-weather');
  if (!s) return;

  const forecast = [
    { day: 'Mon', icon:'⛅', hi:32, lo:24, rain:10 },
    { day: 'Tue', icon:'☀️', hi:35, lo:26, rain:0 },
    { day: 'Wed', icon:'🌧️', hi:28, lo:22, rain:85 },
    { day: 'Thu', icon:'⛈️', hi:26, lo:20, rain:92 },
    { day: 'Fri', icon:'🌦️', hi:29, lo:23, rain:40 },
    { day: 'Sat', icon:'🌤️', hi:31, lo:25, rain:15 },
    { day: 'Sun', icon:'☀️', hi:34, lo:27, rain:5 },
  ];

  const alerts = [
    { type:'rain', icon:'🌧️', title:'Heavy Rain in 48 hrs', msg:'Delay pesticide spray. Ensure drainage channels are clear.', color:'var(--sky)' },
    { type:'heat', icon:'🌡️', title:'Heat Wave Next Week', msg:'Increase irrigation frequency. Use mulching to retain moisture.', color:'var(--accent-orange)' },
    { type:'wind', icon:'💨', title:'Strong Winds Saturday', msg:"Don't spray fertilizer — drift risk high above 20 km/h.", color:'var(--muted)' },
  ];

  const hourlyData = [28,29,31,33,35,35,33,31,30,28,26,24];
  const hourLabels = ['6a','8a','10a','12p','2p','4p','6p','8p','10p','12a','2a','4a'];

  s.innerHTML = `
    <div class="topbar">
      ${backBtn('home', '🌦️ Weather & Alerts')}
    </div>
    <div class="screen-content">
      <!-- Hero weather card -->
      <div class="hero-gradient" style="padding:24px 16px 28px">
        <div class="text-center">
          <div style="font-size:72px;animation:float 3s ease-in-out infinite">⛅</div>
          <div class="font-display text-white font-bold" style="font-size:52px;line-height:1">32°C</div>
          <div style="color:rgba(255,255,255,0.85);font-size:15px;margin-top:4px">Partly Cloudy • Guntur, AP</div>
          <div class="flex gap-3 justify-center mt-3">
            <div class="forecast-chip"><div class="text-xs">💧 Humidity</div><div class="font-mono font-bold text-white">68%</div></div>
            <div class="forecast-chip"><div class="text-xs">💨 Wind</div><div class="font-mono font-bold text-white">12 km/h</div></div>
            <div class="forecast-chip"><div class="text-xs">☀️ UV Index</div><div class="font-mono font-bold text-white">7 High</div></div>
          </div>
        </div>
      </div>

      <!-- 7-Day Forecast -->
      <div class="section-header"><span class="section-title font-display">📅 7-Day Forecast</span></div>
      <div class="px-4 mb-4">
        <div class="card" style="padding:8px 0">
          ${forecast.map((d2, i) => `
            <div class="flex items-center gap-3 ${i<forecast.length-1?'border-bottom':''}px-4 py-3" style="${i<forecast.length-1?'border-bottom:1px solid rgba(0,0,0,0.05)':''}">
              <div class="font-display font-semibold" style="width:38px;color:var(--muted)">${d2.day}</div>
              <div style="font-size:26px;flex-shrink:0">${d2.icon}</div>
              <div style="flex:1">
                <div class="progress-bar" style="height:6px">
                  <div class="progress-fill" style="width:${d2.rain}%;background:linear-gradient(90deg,var(--sky),#26C6DA)"></div>
                </div>
                <div class="text-xs text-muted mt-1">🌧️ ${d2.rain}% rain chance</div>
              </div>
              <div class="font-mono text-sm font-bold">${d2.hi}°<span class="text-muted">/${d2.lo}°</span></div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Hourly temp chart -->
      <div class="section-header"><span class="section-title font-display">📈 Today's Hourly Temp</span></div>
      <div class="px-4 mb-4">
        <div class="card" style="padding:16px">
          ${renderLineChart(hourlyData, '#2E7D32', 360, 80)}
          <div class="flex justify-between mt-2">
            ${hourLabels.filter((_,i)=>i%3===0).map(l=>`<span class="text-xs text-muted font-mono">${l}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- AI Farming Alerts -->
      <div class="section-header"><span class="section-title font-display">🤖 AI Farming Alerts</span></div>
      <div class="px-4 mb-4">
        ${alerts.map(a => `
          <div class="alert-banner ${a.type} mb-3" style="cursor:pointer">
            <span style="font-size:22px">${a.icon}</span>
            <div>
              <div class="font-semibold text-sm">${a.title}</div>
              <div class="text-xs text-muted">${a.msg}</div>
            </div>
          </div>`).join('')}
      </div>

      <!-- 30-day rainfall -->
      <div class="section-header"><span class="section-title font-display">🌊 30-Day Rainfall History</span></div>
      <div class="px-4 mb-4">
        <div class="card" style="padding:16px">
          ${renderLineChart([8,12,5,0,18,22,35,28,15,10,6,2,0,40,45,60,55,35,20,15,10,8,5,2,0,12,18,24,30,25],'#0288D1',360,70)}
          <div class="flex justify-between mt-2">
            ${['Week 1','Week 2','Week 3','Week 4'].map(l=>`<span class="text-xs text-muted">${l}</span>`).join('')}
          </div>
          <div class="text-xs text-muted text-center mt-2">Rainfall in mm</div>
        </div>
      </div>

      <!-- Risk Indicators -->
      <div class="section-header"><span class="section-title font-display">⚠️ Risk Indicators</span></div>
      <div class="grid-3 px-4 mb-6">
        ${[
          { label:'Flood Risk', val:'Low', color:'#2E7D32' },
          { label:'Drought Risk', val:'Medium', color:'#F9A825' },
          { label:'Frost Risk', val:'None', color:'#78909C' },
        ].map(r=>`
          <div class="stat-mini">
            <div class="font-display font-bold text-sm" style="color:${r.color}">${r.val}</div>
            <div class="stat-mini-label">${r.label}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
}
