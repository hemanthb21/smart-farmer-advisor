// ============================================================
// SCREENS-CROP.JS – Crop Advisor + Disease Detection
// ============================================================

// ---- CROP RECOMMENDATION ----
function renderCropStep() {
  const s = document.getElementById('screen-crop');
  if (!s) return;
  const step = STATE.cropStep;
  const d = STATE.cropFormData;

  if (STATE.cropResults) { renderCropResults(s); return; }

  const steps = [
    // Step 1: Soil Type
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <p class="text-sm text-muted mb-3 px-4">Select your soil type</p>
      <div class="px-4"><div class="select-grid cols-3">
        ${SOIL_TYPES.map(st => `
          <div class="select-item ${d.soilType===st.id?'selected':''}"
            onclick="STATE.cropFormData.soilType='${st.id}';renderCropStep()">
            <span class="select-item-emoji">${st.emoji}</span>
            <span class="select-item-label">${st.label}</span>
          </div>`).join('')}
      </div></div>
    </div>`,

    // Step 2: Season
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <p class="text-sm text-muted mb-3 px-4">Choose current / upcoming season</p>
      <div class="px-4"><div class="select-grid">
        ${SEASONS.map(se => `
          <div class="select-item ${d.season===se.id?'selected':''}"
            onclick="STATE.cropFormData.season='${se.id}';renderCropStep()">
            <span class="select-item-emoji">${se.emoji}</span>
            <span class="select-item-label">${se.label}</span>
            <span class="text-xs text-muted">${se.months}</span>
          </div>`).join('')}
      </div></div>
    </div>`,

    // Step 3: Land size + Water
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <div class="px-4">
        <label class="text-sm font-semibold text-muted mb-2" id="acres-lbl" style="display:block">
          Land Size: <b class="text-primary">${d.acres} acres</b>
        </label>
        <input type="range" min="0.5" max="50" step="0.5" value="${d.acres}" class="mb-5"
          oninput="STATE.cropFormData.acres=parseFloat(this.value);document.getElementById('acres-lbl').innerHTML='Land Size: <b class=\\'text-primary\\'>'+this.value+' acres</b>'" />
        <p class="text-sm text-muted font-semibold mb-2">Water Availability</p>
        <div class="grid-2">
          ${WATER_SOURCES.map(w => `
            <div class="select-item ${d.water===w.id?'selected':''}"
              onclick="STATE.cropFormData.water='${w.id}';renderCropStep()">
              <span class="select-item-emoji">${w.emoji}</span>
              <span class="select-item-label">${w.label}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,

    // Step 4: Budget
    `<div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
      <div class="px-4">
        <label class="text-sm font-semibold text-muted mb-2" id="budget-lbl" style="display:block">
          Budget: <b class="text-primary">₹${fmtNum(d.budget)}</b>
        </label>
        <input type="range" min="5000" max="200000" step="1000" value="${d.budget}" class="mb-5"
          oninput="STATE.cropFormData.budget=parseInt(this.value);document.getElementById('budget-lbl').innerHTML='Budget: <b class=\\'text-primary\\'>₹'+parseInt(this.value).toLocaleString(\\'en-IN\\')+\\'</b>\\'" />
        <label class="text-sm font-semibold text-muted mb-2" style="display:block">Previous Crop (optional)</label>
        <div class="select-grid cols-3">
          ${CROPS_LIST.slice(0,6).map(c => `
            <div class="select-item ${d.prevCrop===c.id?'selected':''}"
              onclick="STATE.cropFormData.prevCrop='${c.id}';renderCropStep()">
              <span class="select-item-emoji">${c.emoji}</span>
              <span class="select-item-label">${c.label}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`,
  ];

  s.innerHTML = `
    <div class="topbar">
      ${step > 1
        ? `<button class="icon-btn" onclick="STATE.cropStep--;renderCropStep()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           </button>`
        : `<button class="icon-btn" onclick="navigate('home','back')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           </button>`}
      <span class="topbar-title font-display">🌱 ${t('cropAdvisor')}</span>
      <span class="text-muted text-sm">${step}/4</span>
    </div>
    <div class="px-4 pt-3 pb-2">
      <div class="steps-row" style="padding:0">
        ${[1,2,3,4].map(i=>`<div class="step-dot ${i===step?'active':i<step?'done':''}" style="flex:${i===step?2:1}"></div>`).join('')}
      </div>
    </div>
    <div style="min-height:calc(100vh - 200px);padding:8px 0">
      ${steps[step - 1]}
    </div>
    <div class="px-4 pb-6 pt-2">
      <button class="btn btn-primary btn-full font-display" style="font-size:17px" onclick="cropNext()">
        ${step === 4 ? '🌱 ' + t('getRecommendation') : 'Next →'}
      </button>
    </div>
  `;
}

function cropNext() {
  if (STATE.cropStep < 4) { STATE.cropStep++; renderCropStep(); return; }
  // Generate recommendation
  const s = document.getElementById('screen-crop');
  if (!s) return;
  s.innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:32px">
      <div style="font-size:72px;animation:leafGrow 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards">🌱</div>
      <div class="font-display text-xl font-bold text-primary text-center">${t('loading')}</div>
      <div class="progress-bar w-full" style="max-width:240px">
        <div class="progress-fill" id="ai-progress" style="width:0%;transition:width 2s ease"></div>
      </div>
      <div class="text-muted text-sm">Running AI crop model...</div>
    </div>
  `;
  requestAnimationFrame(() => {
    const p = document.getElementById('ai-progress');
    if (p) p.style.width = '100%';
  });
  setTimeout(() => {
    STATE.cropResults = MOCK_CROP_RECOMMENDATIONS[STATE.cropFormData.prevCrop] || MOCK_CROP_RECOMMENDATIONS.default;
    renderCropStep();
  }, 2200);
}

function renderCropResults(s) {
  const results = STATE.cropResults;
  s.innerHTML = `
    <div class="topbar">
      <button class="icon-btn" onclick="STATE.cropResults=null;STATE.cropStep=1;renderCropStep()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="topbar-title font-display">🤖 AI Recommendations</span>
      <button class="btn btn-ghost btn-sm" onclick="showToast('📄 PDF report downloaded!')">PDF</button>
    </div>
    <div class="screen-content pt-3">
      <div class="px-4 mb-3">
        <div class="chip chip-sky mb-3">✅ Analysis complete · ${STATE.cropFormData.acres} acres · ${STATE.cropFormData.season || 'Kharif'} season</div>
        ${results.map((c, i) => `
          <div class="crop-result-card animate-fadeinup" style="animation-delay:${i*0.12}s">
            <div class="crop-result-header">
              <div class="crop-badge">${c.emoji}</div>
              <div style="flex:1">
                <div class="font-display font-bold" style="font-size:16px">#${i+1} ${c.name}</div>
                <div class="text-xs text-muted">Recommended for your farm</div>
              </div>
              <div class="match-pill" style="background:linear-gradient(135deg,${matchColor(c.match)},${matchColor(c.match)}cc)">${c.match}% Match</div>
            </div>
            <div class="px-4 py-3">
              <div class="grid-2 mb-3">
                <div class="stat-mini"><div class="font-mono font-bold text-sm text-primary">${c.yield}</div><div class="stat-mini-label">Expected Yield</div></div>
                <div class="stat-mini"><div class="font-mono font-bold text-sm" style="color:var(--accent-gold)">${c.profit}</div><div class="stat-mini-label">Est. Profit</div></div>
              </div>
              <div class="flex gap-2 mb-3 flex-wrap">
                <span class="chip chip-sky">💧 ${c.water} Water</span>
                <span class="chip ${c.risk==='Low'?'':'chip-gold'}">⚠️ ${c.risk} Risk</span>
                <span class="chip">📈 Demand ${c.demand}/10</span>
              </div>
              <details>
                <summary class="text-sm font-semibold text-primary cursor-pointer" style="list-style:none;display:flex;align-items:center;gap:6px">
                  🤖 Why this crop? <span style="font-size:12px;color:var(--muted)">(AI explanation)</span>
                </summary>
                <p class="text-sm text-muted mt-2 mb-1" style="line-height:1.6">
                  Based on your <b>${STATE.cropFormData.soilType || 'black'} soil</b>, ${STATE.cropFormData.season || 'Kharif'} season conditions, and ₹${fmtNum(STATE.cropFormData.budget)} budget,
                  this crop offers the best return-on-investment for <b>${STATE.cropFormData.acres} acres</b>.
                  Market demand is strong at ${c.demand}/10, with prices likely to remain stable through harvest.
                </p>
                <button class="btn btn-ghost btn-sm mt-1" onclick="showToast('🔊 Text-to-speech: ${c.name} is recommended...')">🔊 Listen</button>
              </details>
              <button class="btn btn-outline btn-sm btn-full mt-3" onclick="showToast('📊 Compare view coming soon')">Compare Side-by-Side</button>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

// ============================================================
// DISEASE DETECTION SCREEN
// ============================================================

function resetDisease() {
  STATE.diseaseState = 'idle';
  STATE.diseaseResult = null;
  renderDisease();
}

function renderDisease() {
  const s = document.getElementById('screen-disease');
  if (!s) return;

  if (STATE.diseaseState === 'scanning') {
    s.innerHTML = `
      <div class="topbar">${backBtn('home', '🍃 ' + t('diseaseScan'))}</div>
      <div style="padding:32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:20px;min-height:80vh;justify-content:center">
        <div style="font-size:20px;font-weight:700;color:var(--primary);font-family:var(--font-display)">${t('loading')}</div>
        <div style="width:200px;height:200px;border-radius:20px;background:#1a1a1a;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center">
          <span style="font-size:80px">🌿</span>
          <div class="scan-line"></div>
          <div class="scan-corner corner-tl"></div><div class="scan-corner corner-tr"></div>
          <div class="scan-corner corner-bl"></div><div class="scan-corner corner-br"></div>
        </div>
        <div class="progress-bar" style="width:200px"><div class="progress-fill" id="scan-prog" style="width:0%;transition:width 2s ease"></div></div>
        <div class="text-muted text-sm">Running EfficientNet-B4 model...</div>
      </div>`;
    requestAnimationFrame(() => {
      const p = document.getElementById('scan-prog');
      if (p) p.style.width = '95%';
    });
    setTimeout(() => {
      STATE.diseaseState = 'result';
      STATE.diseaseResult = {
        name: 'Bacterial Leaf Blight',
        nameLocal: 'బాక్టీరియల్ ఆకు తెగులు',
        confidence: 94,
        severity: 'high',
        affected: 35,
        organic: ['Spray Copper Oxychloride 2.5g/L water', 'Remove infected leaves immediately', 'Ensure proper air circulation'],
        chemical: ['Streptocycline 500g/ha + Copper Oxychloride 2.5g/L', 'Spray after 10 days if symptoms persist', 'Avoid spraying before rain'],
      };
      renderDisease();
    }, 2500);
    return;
  }

  if (STATE.diseaseState === 'result' && STATE.diseaseResult) {
    const r = STATE.diseaseResult;
    const sevColors = { low:'#2E7D32', medium:'#F9A825', high:'#FF6F00', critical:'#C62828' };
    const col = sevColors[r.severity];
    s.innerHTML = `
      <div class="topbar">
        <button class="icon-btn" onclick="STATE.diseaseState='idle';renderDisease()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="topbar-title font-display">🔬 Scan Result</span>
        <button class="btn btn-ghost btn-sm" onclick="showToast('📤 Report shared via WhatsApp!')">Share</button>
      </div>
      <div class="screen-content pt-3">
        <div class="px-4">
          <!-- Scanned image -->
          <div style="width:100%;height:180px;border-radius:16px;background:linear-gradient(135deg,#1a1a1a,#2a2a2a);margin-bottom:16px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
            <span style="font-size:80px">🌾</span>
            <div style="position:absolute;top:12px;right:12px;background:${col};color:white;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700">${r.severity.toUpperCase()} SEVERITY</div>
            <div style="position:absolute;bottom:12px;left:12px;background:rgba(198,40,40,0.3);color:white;padding:4px 10px;border-radius:8px;font-size:11px">🔴 Infected area: ${r.affected}%</div>
          </div>

          <!-- Disease ID Card -->
          <div class="card mb-3" style="border-left:4px solid ${col}">
            <div class="flex items-center justify-between mb-2">
              <div>
                <div class="font-display font-bold text-lg">${r.name}</div>
                <div style="color:var(--muted);font-size:13px">${r.nameLocal}</div>
              </div>
              <div style="text-align:right">
                <div class="font-mono font-bold" style="fontSize:18px;color:${col}">${r.confidence}%</div>
                <div class="text-xs text-muted">Confidence</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:4px">
              ${['●','●','●','●','●'].map((_,i) => {
                const filled = r.severity==='critical'?5:r.severity==='high'?4:r.severity==='medium'?3:1;
                return `<span style="color:${i<filled?col:'rgba(0,0,0,0.12)'}">●</span>`;
              }).join('')}
              <span class="text-xs text-muted ml-1">${r.severity} severity</span>
            </div>
            <div class="progress-bar mt-2">
              <div class="progress-fill" style="width:${r.affected}%;background:${col}"></div>
            </div>
            <div class="text-xs text-muted mt-1">${r.affected}% of visible leaf area affected</div>
          </div>

          <!-- Treatment Toggle -->
          <div class="tabs mb-3" id="treat-tabs">
            <button class="tab active" onclick="switchTreatTab('organic',this)">🌿 Organic</button>
            <button class="tab" onclick="switchTreatTab('chemical',this)">⚗️ Chemical</button>
          </div>
          <div class="card mb-3" id="treatment-content">
            ${r.organic.map((step,i) => `
              <div class="flex gap-3 ${i>0?'mt-3':''}" style="${i>0?'border-top:1px solid rgba(0,0,0,0.05);padding-top:12px':''}">
                <div style="width:26px;height:26px;border-radius:50%;background:rgba(46,125,50,0.12);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--primary)">${i+1}</div>
                <p class="text-sm">${step}</p>
              </div>`).join('')}
          </div>

          <!-- Map + WhatsApp -->
          <div class="map-placeholder mb-3" onclick="showToast('🗺️ Maps opening...')">
            🗺️ Tap to find nearby agri stores
          </div>
          <button class="btn btn-primary btn-full mb-4" onclick="showToast('📤 Report sent via WhatsApp!')">
            📱 Share via WhatsApp
          </button>
        </div>
      </div>
    `;
    return;
  }

  // Idle state
  s.innerHTML = `
    <div class="topbar">${backBtn('home', '🍃 ' + t('diseaseScan'))}</div>
    <div class="screen-content">
      <div style="padding:32px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:24px">
        <div style="opacity:0;animation:fadeInUp 0.4s ease forwards">
          <div style="font-size:56px;margin-bottom:12px;animation:float 3s infinite">🔬</div>
          <h2 class="font-display font-bold text-xl mb-2">Scan Your Crop Leaf</h2>
          <p class="text-muted text-sm" style="max-width:280px;margin:0 auto">Take a clear photo of the affected leaf. AI detects 38+ diseases instantly.</p>
        </div>

        <!-- Camera area -->
        <div class="scan-frame" style="width:100%;max-width:320px;padding-top:52%;cursor:pointer" onclick="startScan()">
          <div class="scan-content">
            <div class="scan-corner corner-tl"></div><div class="scan-corner corner-tr"></div>
            <div class="scan-corner corner-bl"></div><div class="scan-corner corner-br"></div>
            <span style="font-size:48px;color:rgba(255,255,255,0.5)">📷</span>
            <p style="color:rgba(255,255,255,0.7);font-size:14px">Tap to capture photo</p>
          </div>
        </div>

        <div class="flex gap-3 w-full" style="max-width:320px">
          <button class="btn btn-primary btn-full" onclick="startScan()">📷 Open Camera</button>
          <button class="btn btn-outline" onclick="startScan()" style="flex:1">🖼️ Gallery</button>
        </div>

        <!-- Tips -->
        <div class="card w-full" style="text-align:left;max-width:320px">
          <p class="font-display font-bold text-sm mb-2">📸 Photo Tips</p>
          ${['Capture single leaf clearly', 'Ensure good lighting', 'Include both healthy & infected parts', 'Min resolution: 224×224px'].map(tip => `
            <div class="flex gap-2 text-sm text-muted mb-1"><span>✓</span><span>${tip}</span></div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function startScan() {
  STATE.diseaseState = 'scanning';
  renderDisease();
}

function switchTreatTab(type, el) {
  document.querySelectorAll('#treat-tabs .tab').forEach(t2 => t2.classList.remove('active'));
  el.classList.add('active');
  const content = document.getElementById('treatment-content');
  if (!content) return;
  const steps = type === 'organic' ? STATE.diseaseResult.organic : STATE.diseaseResult.chemical;
  content.innerHTML = steps.map((step,i) => `
    <div class="flex gap-3 ${i>0?'mt-3':''}" style="${i>0?'border-top:1px solid rgba(0,0,0,0.05);padding-top:12px':''}">
      <div style="width:26px;height:26px;border-radius:50%;background:rgba(46,125,50,0.12);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--primary)">${i+1}</div>
      <p class="text-sm">${step}</p>
    </div>`).join('');
}
