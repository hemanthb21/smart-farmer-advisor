// ============================================================
// SCREENS-VOICE.JS – Voice AI + Reminders + Soil + Analytics + Experts + Community
// ============================================================

// ---- VOICE ASSISTANT ----
function renderVoice() {
  const s = document.getElementById('screen-voice');
  if (!s) return;
  const isListening = STATE.voiceState === 'listening';
  const isResponding = STATE.voiceState === 'responding';
  const sample = STATE.voiceSample;

  s.innerHTML = `
    <div style="min-height:100%;background:linear-gradient(160deg,#1B5E20,#2E7D32 60%,#388E3C);display:flex;flex-direction:column">
      <div class="topbar" style="background:transparent;border:none">
        <button class="icon-btn" style="background:rgba(255,255,255,0.15);color:white" onclick="navigate('home','back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="topbar-title text-white font-display">🎙️ AI Voice Assistant</span>
        <div></div>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;align-items:center;padding:24px 24px 100px;gap:24px;overflow-y:auto">
        <!-- Language selector -->
        <div class="flex gap-2 flex-wrap justify-center">
          ${LANGUAGES.map(l => `
            <button class="lang-btn ${STATE.lang===l.code?'selected':''}" style="padding:6px 14px;font-size:12px"
              onclick="STATE.lang='${l.code}';renderVoice()">${l.label}</button>`).join('')}
        </div>

        <!-- Waveform orb -->
        <div style="position:relative;display:flex;align-items:center;justify-content:center;margin:16px 0">
          ${isListening || isResponding ? `
            <div class="voice-ripple"></div>
            <div class="voice-ripple delay"></div>` : ''}
          <div class="voice-orb ${isListening?'listening':''}" onclick="toggleVoice()">
            <span style="font-size:42px">${isListening?'🔴':isResponding?'🔊':'🎙️'}</span>
          </div>
        </div>

        <!-- Waveform animation -->
        ${isListening ? `
          <div class="waveform">
            ${Array.from({length:9},(_,i)=>`
              <div class="wave-bar" style="height:${16+Math.random()*28}px;animation:wave ${0.4+i*0.08}s ease-in-out infinite;animation-delay:${i*0.06}s"></div>`).join('')}
          </div>` : ''}

        <p class="text-white text-center text-sm" style="opacity:0.8">
          ${isListening ? 'Listening... hold to speak' : isResponding ? 'AI is responding...' : 'Hold the mic button to ask in your language'}
        </p>

        <!-- Response card -->
        ${sample ? `
          <div class="card w-full animate-fadeinup" style="background:rgba(255,255,255,0.95)">
            <div class="flex gap-2 mb-2">
              <span class="chip chip-sky text-xs">You asked</span>
              <span class="chip text-xs">${LANGUAGES.find(l=>l.code===sample.lang)?.label||'EN'}</span>
            </div>
            <p class="font-semibold text-sm mb-3" style="line-height:1.5">"${sample.q}"</p>
            <div style="height:1px;background:rgba(0,0,0,0.06);margin-bottom:12px"></div>
            <div class="chip chip-sky mb-2">🤖 AI Response</div>
            <p class="text-sm" style="line-height:1.6;color:var(--dark)">${sample.a}</p>
            <button class="btn btn-ghost btn-sm mt-3" onclick="showToast('🔊 Playing voice response...')">🔊 Play Voice</button>
          </div>` : ''}

        <!-- Sample queries -->
        <div class="w-full">
          <p class="text-white text-center" style="font-size:12px;opacity:0.7;margin-bottom:12px">Try asking (tap to demo):</p>
          ${VOICE_SAMPLES.map(vs => `
            <div class="card mb-2 cursor-pointer animate-fadeinup" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2)"
              onclick="demoVoiceQuery(${VOICE_SAMPLES.indexOf(vs)})">
              <p class="text-white text-sm" style="opacity:0.95">"${vs.q}"</p>
              <span class="chip" style="background:rgba(255,255,255,0.18);color:white;font-size:10px;margin-top:6px">
                ${LANGUAGES.find(l=>l.code===vs.lang)?.label} · Tap to demo
              </span>
            </div>`).join('')}
        </div>

        <!-- Escalate to expert -->
        <button class="btn w-full" style="background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.3)"
          onclick="showToast('📞 Connecting to human expert via WhatsApp...')">
          🤝 Escalate to Human Expert
        </button>
      </div>
    </div>
  `;
}

function toggleVoice() {
  if (STATE.voiceState === 'idle') {
    STATE.voiceState = 'listening';
    renderVoice();
    setTimeout(() => {
      STATE.voiceState = 'responding';
      renderVoice();
      setTimeout(() => {
        STATE.voiceState = 'idle';
        STATE.voiceSample = VOICE_SAMPLES.find(v => v.lang === STATE.lang) || VOICE_SAMPLES[2];
        renderVoice();
      }, 1500);
    }, 2000);
  } else {
    STATE.voiceState = 'idle';
    renderVoice();
  }
}

function demoVoiceQuery(idx) {
  STATE.voiceState = 'responding';
  renderVoice();
  setTimeout(() => {
    STATE.voiceState = 'idle';
    STATE.voiceSample = VOICE_SAMPLES[idx];
    renderVoice();
  }, 1200);
}

// ============================================================
// SMART REMINDERS SCREEN
// ============================================================

function renderReminders() {
  const s = document.getElementById('screen-reminders');
  if (!s) return;
  const today = new Date();
  const calDays = Array.from({length:30}, (_, i) => i + 1);

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '⏰ Reminders')}</div>
    <div class="screen-content pt-3">
      <!-- Mini calendar -->
      <div class="card mx-4 mb-3" style="padding:12px">
        <div class="flex items-center justify-between mb-2">
          <button class="icon-btn" onclick="showToast('← Previous month')">‹</button>
          <div class="font-display font-bold">March 2026</div>
          <button class="icon-btn" onclick="showToast('Next month →')">›</button>
        </div>
        <div class="cal-grid">
          ${['S','M','T','W','T','F','S'].map(d => `<div class="text-center text-xs text-muted font-bold py-1">${d}</div>`).join('')}
          ${Array.from({length: 6}).map(()=>`<div></div>`).slice(0, new Date(2026,2,1).getDay()).join('')}
          ${calDays.map(d => `
            <div class="cal-day ${d===10?'today':''} ${[7,14,21].includes(d)?'has-reminder':''}">
              ${d}
            </div>`).join('')}
        </div>
      </div>

      <!-- AI Suggest -->
      <div class="px-4 mb-3">
        <button class="btn btn-outline btn-full" onclick="aiSuggestReminders()">🤖 AI Auto-Suggest Reminders</button>
      </div>

      <!-- Upcoming reminders -->
      <div class="section-header"><span class="section-title font-display">📋 Upcoming Reminders</span></div>
      <div class="px-4">
        ${STATE.reminders.map((r, i) => {
          const type = REMINDER_TYPES.find(t => t.id === r.type) || REMINDER_TYPES[0];
          return `
            <div class="reminder-item">
              <div class="reminder-icon" style="background:${type.bg}">
                <span>${type.emoji}</span>
              </div>
              <div style="flex:1;min-width:0">
                <div class="font-semibold text-sm">${r.title}</div>
                <div class="text-xs text-muted">${r.time} · ${r.crop}</div>
              </div>
              <div class="flex gap-2">
                <button class="icon-btn" onclick="showToast('✏️ Edit reminder')">✏️</button>
                <button class="icon-btn" onclick="deleteReminder(${i})">🗑️</button>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Add reminder -->
      <div class="section-header mt-2"><span class="section-title font-display">➕ Add Reminder</span></div>
      <div class="px-4 mb-2">
        <p class="text-sm text-muted mb-2">Select type:</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
          ${REMINDER_TYPES.map(t => `
            <div class="select-item" style="padding:10px 6px" onclick="showToast('➕ Adding ${t.label} reminder...')">
              <span style="font-size:22px">${t.emoji}</span>
              <span style="font-size:10px;font-weight:600;margin-top:2px">${t.label}</span>
            </div>`).join('')}
        </div>
        <input class="input mb-2" placeholder="Reminder title" />
        <input type="datetime-local" class="input mb-3" />
        <button class="btn btn-primary btn-full" onclick="addReminder()">➕ Add Reminder</button>
      </div>
    </div>
  `;
}

function aiSuggestReminders() {
  STATE.reminders.push({ type:'irrigation', title:'AI: Irrigate Field B — Soil dry forecast', time:'Wed 6:00 AM', crop:'🌾' });
  STATE.reminders.push({ type:'fertilizer', title:'AI: Post-rain DAP top-dressing', time:'Friday 8:00 AM', crop:'🌸' });
  renderReminders();
  showToast('🤖 AI suggested 2 new reminders based on weather!');
}

function deleteReminder(i) {
  STATE.reminders.splice(i, 1);
  renderReminders();
  showToast('🗑️ Reminder deleted');
}

function addReminder() {
  STATE.reminders.unshift({ type:'sowing', title:'Custom Reminder', time:'Tomorrow 7:00 AM', crop:'🌱' });
  renderReminders();
  showToast('✅ Reminder added!');
}

// ============================================================
// SOIL HEALTH SCREEN
// ============================================================

function renderSoil() {
  const s = document.getElementById('screen-soil');
  if (!s) return;
  const d = STATE.soilData;
  const score = Math.round((d.ph/14)*20 + (d.n/100)*30 + (d.p/50)*25 + (d.k/200)*25);

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🌍 Soil Health')}</div>
    <div class="screen-content pt-3">
      <!-- Score Gauge -->
      <div class="card mx-4 mb-3" style="text-align:center;padding:24px">
        ${renderGauge(score, 100, score>70?'#2E7D32':score>45?'#F9A825':'#C62828')}
        <div class="font-display font-bold text-xl mt-2">${score<45?'🔴 Poor':score<70?'🟡 Moderate':'🟢 Healthy'} Soil</div>
        <p class="text-sm text-muted mt-1">Soil health score for your farm</p>
      </div>

      <!-- NPK Input -->
      <div class="section-header"><span class="section-title font-display">🧪 Nutrient Levels (Manual Input)</span></div>
      <div class="card mx-4 mb-3" style="padding:16px">
        ${[
          { key:'ph', label:'pH Level', min:0, max:14, step:0.1, unit:'', color:'#0288D1' },
          { key:'n', label:'Nitrogen (N)', min:0, max:100, step:1, unit:'ppm', color:'#2E7D32' },
          { key:'p', label:'Phosphorus (P)', min:0, max:50, step:1, unit:'ppm', color:'#F9A825' },
          { key:'k', label:'Potassium (K)', min:0, max:200, step:5, unit:'ppm', color:'#C62828' },
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
                oninput="STATE.soilData.${n.key}=parseFloat(this.value);renderSoil()" />
            </div>`;
        }).join('')}
      </div>

      <!-- Upload Report -->
      <div class="px-4 mb-3">
        <button class="btn btn-outline btn-full" onclick="showToast('📄 Upload soil test PDF → AI extracts NPK automatically')">
          📄 Upload Soil Test PDF (AI Parser)
        </button>
      </div>

      <!-- AI Recommendation -->
      <div class="section-header"><span class="section-title font-display">🤖 AI Recommendations</span></div>
      <div class="card mx-4 mb-4" style="background:linear-gradient(135deg,rgba(46,125,50,0.06),rgba(76,175,80,0.04))">
        ${[
          d.n < 40 ? '🟡 Add Urea 20kg/acre before next irrigation' : '✅ Nitrogen levels optimal',
          d.p < 15 ? '🔴 Phosphorus deficient — Apply DAP 15kg/acre' : '✅ Phosphorus adequate',
          d.k < 60 ? '🟡 Potassium low — Add MOP 10kg/acre' : '✅ Potassium adequate',
          `💧 Soil pH ${d.ph} — ${d.ph<6?'Add lime to raise pH':'pH within optimal range'}`,
        ].map((rec, i) => `
          <div class="flex gap-2 mb-2 ${i>0?'pt-2':''}" style="${i>0?'border-top:1px solid rgba(0,0,0,0.05)':''}">
            <div class="text-sm">${rec}</div>
          </div>`).join('')}

        <div class="flex gap-2 mt-3">
          <button class="btn btn-primary btn-sm" onclick="showToast('💰 Fertilizer cost: ~₹1,240/acre')">💰 Estimate Cost</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('📄 Report saved!')">💾 Save Report</button>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// FARM ANALYTICS SCREEN
// ============================================================

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
      <!-- Season summary -->
      <div class="stats-row mb-3">
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--primary)">₹1.8L</div><div class="stat-mini-label">Total Income</div></div>
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--danger)">₹63k</div><div class="stat-mini-label">Total Expense</div></div>
        <div class="stat-mini"><div class="stat-mini-val font-mono" style="color:var(--accent-gold)">₹1.17L</div><div class="stat-mini-label">Net Profit</div></div>
      </div>

      <!-- Income/Expense chart -->
      <div class="section-header"><span class="section-title font-display">📈 Kharif 2025 Season</span></div>
      <div class="card mx-4 mb-3" style="padding:16px">
        <div class="flex gap-4 mb-3">
          <div class="flex items-center gap-2"><div style="width:12px;height:12px;border-radius:3px;background:var(--primary)"></div><span class="text-xs text-muted">Income (₹000s)</span></div>
          <div class="flex items-center gap-2"><div style="width:12px;height:12px;border-radius:3px;background:var(--danger)"></div><span class="text-xs text-muted">Expense</span></div>
        </div>
        <div class="chart-bar-wrap" style="height:120px">
          ${months.map((m, i) => {
            const iH = Math.round((income[i] / imax) * 110);
            const eH = Math.round((expense[i] / imax) * 110);
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

      <!-- Crop-wise breakdown -->
      <div class="section-header"><span class="section-title font-display">🌾 Crop Performance</span></div>
      <div class="px-4 mb-3">
        ${[
          { crop:'Paddy', emoji:'🌾', area:'2 acres', yield:'44 qtl', rev:'₹94,160', margin:'62%', color:'#2E7D32' },
          { crop:'Cotton', emoji:'🌸', area:'1 acre', yield:'8 qtl', rev:'₹54,560', margin:'54%', color:'#F9A825' },
          { crop:'Tomato', emoji:'🍅', area:'0.5 acre', yield:'120 qtl', rev:'₹50,400', margin:'68%', color:'#C62828' },
        ].map(c => `
          <div class="card mb-2" style="border-left:3px solid ${c.color};padding:12px 14px">
            <div class="flex items-center gap-3">
              <span style="font-size:24px">${c.emoji}</span>
              <div style="flex:1">
                <div class="font-display font-bold">${c.crop} · ${c.area}</div>
                <div class="text-xs text-muted">Yield: ${c.yield} · Revenue: ${c.rev}</div>
                <div class="progress-bar mt-2" style="height:6px">
                  <div class="progress-fill" style="width:${c.margin};background:${c.color}"></div>
                </div>
              </div>
              <div style="text-align:right">
                <div class="font-mono font-bold text-sm" style="color:${c.color}">${c.margin}</div>
                <div class="text-xs text-muted">Margin</div>
              </div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Yield trend -->
      <div class="section-header"><span class="section-title font-display">📉 Yield Trend (3 Seasons)</span></div>
      <div class="card mx-4 mb-3" style="padding:16px">
        ${renderLineChart([16,19,22], '#2E7D32', 360, 60)}
        <div class="flex justify-between mt-2">
          ${['Rabi 2024','Kharif 2024','Kharif 2025'].map(l=>`<span class="text-xs text-muted">${l}</span>`).join('')}
        </div>
        <div class="text-xs text-muted text-center mt-1">Paddy yield in quintals/acre</div>
      </div>

      <!-- Export -->
      <div class="px-4 mb-4 flex gap-2">
        <button class="btn btn-outline" style="flex:1" onclick="showToast('📄 PDF exported!')">📄 Export PDF</button>
        <button class="btn btn-outline" style="flex:1" onclick="showToast('📊 Excel downloaded!')">📊 Excel</button>
      </div>
    </div>
  `;
}

// ============================================================
// EXPERT CONNECT SCREEN
// ============================================================

function renderExperts() {
  const s = document.getElementById('screen-experts');
  if (!s) return;
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🤝 Expert Connect')}</div>
    <div class="screen-content pt-3">
      <div class="px-4 mb-3">
        <div class="input-group">
          <span class="input-icon">🔍</span>
          <input class="input" placeholder="Search by crop specialty, language..." />
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-row mb-3">
        ${['All','Free','Rice','Cotton','Organic','Soil'].map(f => `
          <button class="filter-pill ${f==='All'?'active':''}" onclick="showToast('Filtering by ${f}...')">${f}</button>`).join('')}
      </div>

      <!-- Expert Cards -->
      <div class="px-4">
        ${MOCK_EXPERTS.map((e, i) => `
          <div class="expert-card animate-fadeinup" style="animation-delay:${i*0.08}s">
            <div class="expert-avatar">${e.emoji}</div>
            <div style="flex:1;min-width:0">
              <div class="font-display font-bold text-sm">${e.name}</div>
              <div class="text-xs text-muted mb-1">${e.spec} · ${e.exp} exp</div>
              <div class="flex gap-1 mb-1">
                ${'★'.repeat(Math.round(e.rating)).split('').map((_) => `<span class="star">★</span>`).join('')}
                <span class="text-xs text-muted ml-1">${e.rating} (${e.reviews})</span>
              </div>
              <div class="text-xs text-muted">🗣️ ${e.lang}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div class="font-semibold text-sm ${e.free?'text-primary':'text-gold'}">${e.fee}</div>
              <div class="flex flex-col gap-1 mt-2">
                <button class="btn btn-primary btn-sm" style="height:34px;font-size:11px"
                  onclick="showToast('📅 Booking ${e.name}...')">Book Call</button>
                <button class="btn btn-ghost btn-sm" style="height:34px;font-size:11px"
                  onclick="showToast('💬 Opening chat...')">Chat</button>
              </div>
            </div>
          </div>`).join('')}
      </div>

      <!-- Become expert CTA -->
      <div class="card mx-4 mb-4 mt-2" style="text-align:center;padding:20px;border:2px dashed var(--muted)">
        <div style="font-size:32px;margin-bottom:8px">🌾</div>
        <div class="font-display font-bold mb-1">Are You an Agronomist?</div>
        <p class="text-sm text-muted mb-3">Join our expert network. Help farmers, earn income.</p>
        <button class="btn btn-outline btn-full" onclick="showToast('📝 Expert registration form opening...')">Register as Expert</button>
      </div>
    </div>
  `;
}

// ============================================================
// FARMER COMMUNITY SCREEN
// ============================================================

function renderCommunity() {
  const s = document.getElementById('screen-community');
  if (!s) return;
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🏆 Farmer Community')}</div>
    <div class="screen-content pt-3">
      <!-- Post question CTA -->
      <div class="px-4 mb-3">
        <div class="card" style="display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer" onclick="showToast('📝 Post your question...')">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-light));display:flex;align-items:center;justify-content:center;font-size:18px;color:white;font-weight:700;font-family:var(--font-display)">${(STATE.farmer?.name||'F')[0]}</div>
          <div style="flex:1;color:var(--muted);font-size:14px">Ask your farming question...</div>
          <button class="btn btn-primary btn-sm">Post</button>
        </div>
      </div>

      <!-- Filter by district -->
      <div class="filter-row mb-3">
        ${['All','Guntur', 'Warangal','Nashik','Coimbatore','Kurnool'].map((d,i) => `
          <button class="filter-pill ${i===0?'active':''}" onclick="showToast('Filtering ${d} posts...')">${d}</button>`).join('')}
      </div>

      <!-- Posts -->
      <div class="px-4">
        ${MOCK_COMMUNITY.map((p, i) => `
          <div class="post-card animate-fadeinup" style="animation-delay:${i*0.08}s">
            <div class="post-author-row">
              <div class="post-avatar">${p.author}</div>
              <div style="flex:1;min-width:0">
                <div class="font-semibold text-sm">${p.name}</div>
                <div class="text-xs text-muted">${p.district} · ${p.time}</div>
              </div>
              <div>
                <span class="chip text-xs">${p.crop}</span>
                ${p.resolved ? '<span class="chip chip-sky text-xs ml-1">✅ Solved</span>' : ''}
              </div>
            </div>
            <p class="text-sm" style="line-height:1.6">${p.question}</p>
            <div class="post-image">${p.emoji}</div>
            <div class="flex items-center gap-3 mt-2">
              <button class="upvote-btn ${STATE.communityUpvoted[i]?'active':''}"
                onclick="communityUpvote(${i},this)" style="${STATE.communityUpvoted[i]?'background:rgba(46,125,50,0.18)':''}">
                <span>${STATE.communityUpvoted[i]?'▲':'△'}</span>
                <span id="upvote-${i}">${p.upvotes + (STATE.communityUpvoted[i]?1:0)}</span> Helpful
              </button>
              <button class="upvote-btn" style="background:rgba(2,136,209,0.08);color:var(--sky)"
                onclick="showToast('💬 Opening ${p.answers} answers...')">
                💬 ${p.answers} Answers
              </button>
            </div>
          </div>`).join('')}
      </div>

      <!-- Success Stories -->
      <div class="section-header"><span class="section-title font-display">🌟 Success Stories</span></div>
      <div class="px-4 mb-4">
        <div class="card card-green" style="padding:18px">
          <div class="font-display font-bold text-white mb-1">🏆 Ramaiah Kumar — Guntur, AP</div>
          <p class="text-sm" style="color:rgba(255,255,255,0.9);line-height:1.6">
            "Used AI Disease Scan early — saved ₹8,000. Sold rice at ₹2,310/qtl using the price alert. All in Telugu, no English needed!"
          </p>
          <div class="chip mt-2" style="background:rgba(255,255,255,0.2);color:white">🌾 3.5 acres Paddy | Kharif 2025</div>
        </div>
      </div>
    </div>
  `;
}

function communityUpvote(i, btn) {
  STATE.communityUpvoted[i] = !STATE.communityUpvoted[i];
  const el = document.getElementById('upvote-' + i);
  if (el) el.textContent = MOCK_COMMUNITY[i].upvotes + (STATE.communityUpvoted[i] ? 1 : 0);
  if (btn) {
    btn.style.background = STATE.communityUpvoted[i] ? 'rgba(46,125,50,0.18)' : 'rgba(46,125,50,0.08)';
    btn.querySelector('span').textContent = STATE.communityUpvoted[i] ? '▲' : '△';
    showToast(STATE.communityUpvoted[i] ? '▲ Marked as helpful!' : '↩ Removed vote');
  }
}

// ---- PROFILE SCREEN (view mode) ----
function renderProfileView() {
  const s = document.getElementById('screen-profile-view');
  if (!s) return;
  const f = STATE.farmer || {};
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '👤 My Profile')}</div>
    <div class="screen-content">
      <!-- Avatar section -->
      <div class="hero-gradient" style="padding:40px 24px 32px;text-align:center">
        <div style="font-size:72px;margin-bottom:12px">${f.avatar||'👨‍🌾'}</div>
        <div class="font-display text-white font-bold text-2xl">${f.name||'Farmer'}</div>
        <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px">📍 ${f.district}, ${f.state}</div>
        <div class="chip mt-3" style="background:rgba(255,255,255,0.2);color:white;cursor:pointer" onclick="showToast('⭐ Free plan · Upgrade to Premium')">
          ⭐ Free Plan · Upgrade
        </div>
      </div>
      <!-- Farm details -->
      <div class="px-4 pt-4">
        ${[
          { icon:'🌾', label:'Farm Size', val:`${f.acres||2} acres` },
          { icon:'🏔️', label:'Soil Type', val:(SOIL_TYPES.find(s2=>s2.id===f.soilType)||{label:'Not set'}).label },
          { icon:'💧', label:'Water Source', val:(WATER_SOURCES.find(w=>w.id===f.water)||{label:'Not set'}).label },
          { icon:'🌿', label:'Primary Crops', val: f.crops?.length ? f.crops.map(id => CROPS_LIST.find(c=>c.id===id)?.emoji||id).join(' ')||'Set up crops' : 'None selected' },
        ].map(row=>`
          <div class="flex items-center gap-3 py-3" style="border-bottom:1px solid rgba(0,0,0,0.05)">
            <span style="font-size:24px;width:36px;text-align:center">${row.icon}</span>
            <div style="flex:1"><div class="text-xs text-muted">${row.label}</div><div class="font-semibold">${row.val}</div></div>
            <button class="icon-btn" onclick="showToast('✏️ Edit ${row.label}')">✏️</button>
          </div>`).join('')}
      </div>
      <div class="px-4 mt-4 mb-4">
        <button class="btn btn-outline btn-full mb-2" onclick="STATE.profileStep=1;navigate('profile')">✏️ Edit Profile</button>
        <button class="btn btn-ghost btn-full" style="color:var(--danger)" onclick="showToast('👋 Logged out')">🚪 Logout</button>
      </div>
    </div>
  `;
}
