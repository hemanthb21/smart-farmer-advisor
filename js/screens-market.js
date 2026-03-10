// ============================================================
// SCREENS-MARKET.JS – Mandi Prices + Gov Schemes + Marketplace
// ============================================================

// ---- MANDI PRICES ----
function renderMandi() {
  const s = document.getElementById('screen-mandi');
  if (!s) return;
  const q = STATE.searchMandi.toLowerCase();
  const prices = q ? MOCK_MANDI_PRICES.filter(p => p.crop.toLowerCase().includes(q)) : MOCK_MANDI_PRICES;

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '💰 Mandi Prices')}</div>
    <div class="screen-content pt-3">
      <!-- Search -->
      <div class="px-4 mb-3">
        <div class="input-group">
          <span class="input-icon">🔍</span>
          <input class="input" placeholder="Search crop..." value="${STATE.searchMandi}"
            oninput="STATE.searchMandi=this.value;renderMandi()" />
        </div>
      </div>

      <!-- Location chip -->
      <div class="px-4 mb-3">
        <span class="chip chip-sky">📍 Guntur, AP • Updated 2h ago</span>
        <span class="chip chip-gold ml-2">🔔 3 Price Alerts</span>
      </div>

      <!-- Summary strip -->
      <div class="stats-row mb-3">
        <div class="stat-mini"><div class="stat-mini-val price-up font-mono">↑ 4</div><div class="stat-mini-label">Rising Today</div></div>
        <div class="stat-mini"><div class="stat-mini-val price-down font-mono">↓ 1</div><div class="stat-mini-label">Falling</div></div>
        <div class="stat-mini"><div class="stat-mini-val price-stable font-mono">→ 2</div><div class="stat-mini-label">Stable</div></div>
      </div>

      <!-- Price List -->
      <div class="px-4">
        ${prices.map((p, i) => `
          <div class="price-card mb-3 animate-fadeinup" style="animation-delay:${i*0.06}s" onclick="showPriceDetail('${p.crop}')">
            <div class="price-emoji">${p.emoji}</div>
            <div style="flex:1;min-width:0">
              <div class="font-display font-bold">${p.crop}</div>
              <div class="text-xs text-muted">${p.mandi} · ${p.dist}</div>
              ${renderSparkline(p.data, p.trend==='up'?'#2E7D32':p.trend==='down'?'#C62828':'#0288D1')}
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div class="font-mono font-bold text-lg price-${p.trend}">₹${fmtNum(p.price)}</div>
              <div class="text-xs font-mono price-${p.trend}">${p.trend==='up'?'▲':p.trend==='down'?'▼':'→'} ${p.pct}</div>
              <div class="text-xs text-muted">per quintal</div>
              <button class="btn btn-ghost btn-sm mt-1" style="height:32px;font-size:11px;padding:0 10px"
                onclick="event.stopPropagation();showToast('🔔 Price alert set for ${p.crop}!')">Alert 🔔</button>
            </div>
          </div>`).join('')}
      </div>

      <!-- AI Insight -->
      <div class="px-4 mb-4">
        <div class="card card-green">
          <div class="font-display font-bold mb-1">🤖 AI Price Insight</div>
          <p class="text-sm" style="color:rgba(255,255,255,0.9)">
            Paddy prices are trending up — peaked during Oct-Nov. Best time to sell is in the next <b>3–5 days</b> before monsoon arrivals soften demand.
          </p>
        </div>
      </div>
    </div>
  `;
}

function showPriceDetail(crop) {
  const p = MOCK_MANDI_PRICES.find(x => x.crop === crop);
  if (!p) return;
  showToast(`📊 ${crop}: ₹${fmtNum(p.price)}/qtl · ${p.mandi} · ${p.trend==='up'?'↑ Rising':'↓ Falling'}`);
}

// ---- GOVERNMENT SCHEMES ----
function renderSchemes() {
  const s = document.getElementById('screen-schemes');
  if (!s) return;
  const cats = ['All','Insurance','Subsidy','Loan','Training'];
  const filtered = STATE.filterScheme === 'All'
    ? MOCK_SCHEMES
    : MOCK_SCHEMES.filter(sc => sc.category === STATE.filterScheme);

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🏛️ Gov Schemes')}</div>
    <div class="screen-content pt-3">
      <!-- Search + Filter -->
      <div class="px-4 mb-3">
        <div class="input-group mb-3">
          <span class="input-icon">🔍</span>
          <input class="input" placeholder="Search schemes..." />
        </div>
        <div class="filter-row">
          ${cats.map(c => `
            <button class="filter-pill ${STATE.filterScheme===c?'active':''}"
              onclick="STATE.filterScheme='${c}';renderSchemes()">${c}</button>`).join('')}
        </div>
      </div>

      <!-- PM-KISAN Checker -->
      <div class="px-4 mb-4">
        <div class="card" style="background:linear-gradient(135deg,#1B5E20,#2E7D32);color:white">
          <div class="font-display font-bold mb-1">🔍 PM-KISAN Status Check</div>
          <p class="text-sm mb-2" style="opacity:0.85">Enter Aadhaar number to check payment status</p>
          <div class="flex gap-2">
            <input class="input" placeholder="XXXX XXXX XXXX"
              style="background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.3);color:white;flex:1" />
            <button class="btn btn-gold btn-sm" onclick="showToast('✅ PM-KISAN: Next payment ₹2,000 due Jan 2026')">Check</button>
          </div>
        </div>
      </div>

      <!-- Eligibility Quiz -->
      <div class="px-4 mb-3">
        <button class="btn btn-outline btn-full" onclick="showToast('🤖 AI eligibility quiz → You qualify for 6 schemes!')">
          🤖 Check My Eligibility (AI Powered)
        </button>
      </div>

      <!-- Schemes List -->
      <div class="px-4">
        ${filtered.map((sc, i) => {
          const days = daysUntil(sc.deadline);
          const isUrgent = days !== null && days < 30;
          return `<div class="scheme-card ${isUrgent?'urgent':''} animate-fadeinup" style="animation-delay:${i*0.08}s">
            <div class="flex items-center gap-3 mb-2">
              <span style="font-size:28px">${sc.icon}</span>
              <div style="flex:1">
                <div class="font-display font-bold" style="font-size:15px">${sc.name}</div>
                <div class="text-xs text-muted">${sc.ministry}</div>
              </div>
              ${isUrgent ? `<span class="chip chip-danger" style="white-space:nowrap">⏰ ${days}d left</span>` : ''}
            </div>
            <p class="text-sm text-muted mb-2">${sc.benefit}</p>
            <div class="flex gap-2 flex-wrap mb-2">
              ${sc.eligibility.map(e => `<span class="chip" style="font-size:11px">${e}</span>`).join('')}
            </div>
            <details>
              <summary class="text-xs font-semibold text-primary cursor-pointer" style="list-style:none">📋 Documents needed ▾</summary>
              <ul style="margin-top:6px;padding-left:16px">
                ${sc.docs.map(d => `<li class="text-xs text-muted py-1">${d}</li>`).join('')}
              </ul>
            </details>
            <button class="btn btn-primary btn-full mt-3" style="height:44px;font-size:14px"
              onclick="showToast('🔗 Opening application for ${sc.name}...')">
              Apply Now →
            </button>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

// ---- MARKETPLACE ----
function renderMarketplace() {
  const s = document.getElementById('screen-marketplace');
  if (!s) return;
  const cats = ['All','Seeds','Fertilizer','Pesticide','Tools'];
  const filtered = STATE.activeTab.marketplace === 'All'
    ? MOCK_MARKETPLACE
    : MOCK_MARKETPLACE.filter(m => m.category === STATE.activeTab.marketplace);

  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🛒 AgriMarket')}</div>
    <div class="screen-content pt-3">
      <!-- Search -->
      <div class="px-4 mb-3">
        <div class="input-group mb-3">
          <span class="input-icon">🔍</span>
          <input class="input" placeholder="Search seeds, fertilizer, tools..." />
        </div>
        <div class="filter-row">
          ${cats.map(c => `
            <button class="filter-pill ${STATE.activeTab.marketplace===c?'active':''}"
              onclick="STATE.activeTab.marketplace='${c}';renderMarketplace()">${c}</button>`).join('')}
        </div>
      </div>

      <!-- Banner -->
      <div class="px-4 mb-3">
        <div class="card" style="background:linear-gradient(135deg,#F9A825,#FF6F00);padding:14px;border-radius:16px">
          <div class="font-display font-bold text-white mb-1">🎉 Kharif Season Sale</div>
          <p class="text-sm text-white" style="opacity:0.9">Up to 40% off on seeds & fertilizers • COD available</p>
        </div>
      </div>

      <!-- Product Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 16px">
        ${filtered.map((m, i) => `
          <div class="market-card animate-fadeinup" style="animation-delay:${i*0.06}s;cursor:pointer"
            onclick="showToast('🛒 Added to cart: ${m.name}')">
            <div class="market-img">${m.emoji}</div>
            <div class="market-body">
              <div class="font-display font-semibold text-sm mb-1" style="line-height:1.3">${m.name}</div>
              <div class="text-xs text-muted mb-1">${m.seller} ${m.verified?'✅':''}</div>
              ${m.badge ? `<span class="chip chip-gold" style="font-size:10px;margin-bottom:6px">${m.badge}</span>` : ''}
              <div class="flex items-center justify-between mt-2">
                <div class="font-mono font-bold text-primary">${m.price}</div>
                ${m.cod ? '<span style="font-size:10px;color:var(--muted)">COD ✓</span>' : ''}
              </div>
              <button class="btn btn-primary w-full mt-2" style="height:36px;font-size:12px">Add to Cart</button>
            </div>
          </div>`).join('')}
      </div>

      <!-- Sell your produce -->
      <div class="px-4 mt-4 mb-4">
        <div class="card" style="border:2px dashed var(--primary);text-align:center;padding:20px">
          <div style="font-size:40px;margin-bottom:8px">🌾</div>
          <div class="font-display font-bold text-primary mb-1">Sell Your Produce</div>
          <p class="text-sm text-muted mb-3">List your harvest directly. Reach 50,000+ verified buyers.</p>
          <button class="btn btn-primary btn-full" onclick="showToast('📋 Create listing form opening...')">+ Create Listing</button>
        </div>
      </div>
    </div>
  `;
}
