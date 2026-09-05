/**
 * WEDDING BAND PRICE INDEX - CORE APPLICATION
 * Japan vs Korea Price Comparison Engine
 */

// --- Default Fallback Presets ---
let PRESETS = [
  {
    id: 'cartier-love-sm',
    brand: 'Cartier',
    name: '러브 웨딩 밴드 (SM)',
    jpPrice: 193600,
    krPrice: 2050000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가'
  },
  {
    id: 'cartier-love-cl',
    brand: 'Cartier',
    name: '러브 링 (클래식)',
    jpPrice: 284900,
    krPrice: 2980000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가'
  },
  {
    id: 'chanel-coco-sm',
    brand: 'Chanel',
    name: '코코 크러쉬 링 (스몰)',
    jpPrice: 245300,
    krPrice: 2590000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가'
  },
  {
    id: 'boucheron-quatre',
    brand: 'Boucheron',
    name: '콰트로 클래식 스몰',
    jpPrice: 627000,
    krPrice: 6650000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능'
  },
  {
    id: 'tiffany-t-true',
    brand: 'Tiffany & Co.',
    name: 'T 트루 내로우 링',
    jpPrice: 214500,
    krPrice: 2270000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능'
  },
  {
    id: 'chaumet-bee',
    brand: 'Chaumet',
    name: '비 마이 러브 링',
    jpPrice: 163900,
    krPrice: 1740000,
    guestCardAllowed: true,
    tag: '백화점 5% 가능'
  },
  {
    id: 'tasaki-piano',
    brand: 'Tasaki',
    name: '피아노 링',
    jpPrice: 187000,
    krPrice: 1980000,
    guestCardAllowed: true,
    tag: '백화점 5% 가능'
  }
];

// --- State ---
let state = {
  mode: 1, // 1: single, 2: couple
  theme: 'dark',
  activePresetId: null,
  
  // Inputs
  jpPrice: 250000,
  krPrice: 2750000,
  
  // Japan Options
  hasGuestCard: false,
  taxFreeType: 'dept', // 'dept' (8.45%), 'boutique' (10%), 'none' (0%)
  cardFeeRate: 0, // 0%, 1.2%, 1.5%
  customsSelfDeclare: true, // 30% reduction up to 200,000 KRW
  
  // Korea Options
  giftDiscountType: '3.0',
  customGiftDiscount: 3.0,
  mileageRate: 0,
  
  // Exchange Rates
  jpyKrwRate: 915.0, // 100 JPY to KRW
  usdKrwRate: 1380.0, // 1 USD to KRW
  usdJpyRate: 150.8, // 1 USD to JPY
};

// --- DOM Elements ---
const dom = {
  singleModeBtn: document.getElementById('singleModeBtn'),
  coupleModeBtn: document.getElementById('coupleModeBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  presetGrid: document.getElementById('presetGrid'),
  
  jpPrice: document.getElementById('jpPrice'),
  krPrice: document.getElementById('krPrice'),
  jpGuestCard: document.getElementById('jpGuestCard'),
  guestCardNote: document.getElementById('guestCardNote'),
  jpTaxFreeType: document.getElementById('jpTaxFreeType'),
  jpCardFee: document.getElementById('jpCardFee'),
  customsSelfDeclare: document.getElementById('customsSelfDeclare'),
  
  krGiftDiscount: document.getElementById('krGiftDiscount'),
  krCustomGiftWrap: document.getElementById('krCustomGiftWrap'),
  krCustomGift: document.getElementById('krCustomGift'),
  krMileage: document.getElementById('krMileage'),
  
  jpyKrwRate: document.getElementById('jpyKrwRate'),
  usdKrwRate: document.getElementById('usdKrwRate'),
  usdJpyRate: document.getElementById('usdJpyRate'),
  rateTimestamp: document.getElementById('rateTimestamp'),
  refreshRateBtn: document.getElementById('refreshRateBtn'),
  
  // Verdict
  verdictBanner: document.getElementById('verdictBanner'),
  verdictTrophy: document.getElementById('verdictTrophy'),
  verdictWinnerBadge: document.getElementById('verdictWinnerBadge'),
  verdictDiffAmount: document.getElementById('verdictDiffAmount'),
  verdictDiffPercent: document.getElementById('verdictDiffPercent'),
  travelMsg: document.getElementById('travelMsg'),
  barJpTotal: document.getElementById('barJpTotal'),
  barKrTotal: document.getElementById('barKrTotal'),
  visualJpBar: document.getElementById('visualJpBar'),
  visualKrBar: document.getElementById('visualKrBar'),
  
  // Receipts
  jpReceiptLines: document.getElementById('jpReceiptLines'),
  krReceiptLines: document.getElementById('krReceiptLines'),
  jpFinalTotal: document.getElementById('jpFinalTotal'),
  krFinalTotal: document.getElementById('krFinalTotal'),
  
  // Actions
  copyResultBtn: document.getElementById('copyResultBtn'),
  shareUrlBtn: document.getElementById('shareUrlBtn'),
  toast: document.getElementById('toast')
};

// --- Formatting Helpers ---
function formatKRW(num) {
  return Math.round(num).toLocaleString('ko-KR') + '원';
}

function formatJPY(num) {
  return '¥' + Math.round(num).toLocaleString('ja-JP');
}

function formatUSD(num) {
  return '$' + Number(num.toFixed(1)).toLocaleString('en-US');
}

function parseNumber(str) {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(str.replace(/[^0-9.-]/g, '')) || 0;
}

// --- Fetch External Data (rings.json) ---
async function loadExternalRingsData() {
  try {
    const res = await fetch('./data/rings.json');
    if (!res.ok) throw new Error('Failed to load rings.json');
    const data = await res.json();
    if (data && data.rings && Array.isArray(data.rings)) {
      PRESETS = data.rings;
      renderPresets();
      
      const hint = document.querySelector('.preset-hint');
      if (hint && data.lastUpdated) {
        hint.textContent = `* 공식몰 기준 데이터 (최종 검증: ${data.lastUpdated})`;
      }
    }
  } catch (err) {
    console.log('Using default presets data:', err);
  }
}

// --- Live Currency Fetcher ---
async function fetchLiveExchangeRates() {
  dom.rateTimestamp.textContent = '최신 환율 조회 중...';
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('API response failed');
    const data = await res.json();
    
    if (data && data.rates) {
      const usdKrw = data.rates.KRW;
      const usdJpy = data.rates.JPY;
      
      if (usdKrw && usdJpy) {
        const jpy100Krw = (usdKrw / usdJpy) * 100;
        
        state.usdKrwRate = Math.round(usdKrw * 10) / 10;
        state.usdJpyRate = Math.round(usdJpy * 10) / 10;
        state.jpyKrwRate = Math.round(jpy100Krw * 10) / 10;
        
        dom.usdKrwRate.value = state.usdKrwRate;
        dom.usdJpyRate.value = state.usdJpyRate;
        dom.jpyKrwRate.value = state.jpyKrwRate;
        
        const now = new Date();
        dom.rateTimestamp.textContent = `실시간 연동 완료 (${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')})`;
        calculateAndRender();
        return;
      }
    }
  } catch (err) {
    console.warn('Currency fetch failed, using fallback defaults:', err);
    dom.rateTimestamp.textContent = '기본 환율 적용 중';
  }
}

// --- Render Presets ---
function renderPresets() {
  dom.presetGrid.innerHTML = '';
  PRESETS.forEach(item => {
    const card = document.createElement('div');
    card.className = `preset-card ${state.activePresetId === item.id ? 'active' : ''}`;
    card.dataset.id = item.id;
    
    const tagClass = item.guestCardAllowed ? 'guest-ok' : 'no-guest';
    
    card.innerHTML = `
      <div class="preset-brand">${item.brand}</div>
      <div class="preset-name">${item.name}</div>
      <div class="preset-prices">
        <span>🇯🇵 ¥${item.jpPrice.toLocaleString()}</span>
        <span>🇰🇷 ₩${item.krPrice.toLocaleString()}</span>
      </div>
      <span class="preset-badge-tag ${tagClass}">${item.tag}</span>
    `;
    
    card.addEventListener('click', () => {
      applyPreset(item);
    });
    
    dom.presetGrid.appendChild(card);
  });
}

function applyPreset(preset) {
  state.activePresetId = preset.id;
  state.jpPrice = preset.jpPrice;
  state.krPrice = preset.krPrice;
  
  dom.jpPrice.value = preset.jpPrice.toLocaleString();
  dom.krPrice.value = preset.krPrice.toLocaleString();
  
  // Set guest card default for this brand
  state.hasGuestCard = preset.guestCardAllowed;
  dom.jpGuestCard.checked = preset.guestCardAllowed;
  
  if (preset.guestCardAllowed) {
    dom.guestCardNote.textContent = '백화점 5% 할인 적용 가능 브랜드';
    dom.guestCardNote.style.color = '#34D399';
  } else {
    dom.guestCardNote.textContent = `${preset.brand}는 대부분 5% 할인 제외 매장입니다.`;
    dom.guestCardNote.style.color = '#F87171';
  }
  
  renderPresets();
  calculateAndRender();
  showToast(`[${preset.brand}] ${preset.name} 가격이 적용되었습니다.`);
}

// --- Calculation Logic ---
function calculatePrices() {
  const multiplier = state.mode; // 1 for single, 2 for couple
  
  // Base raw inputs
  const rawJpPrice = parseNumber(dom.jpPrice.value);
  const rawKrPrice = parseNumber(dom.krPrice.value);
  
  // Multiplied prices for couple/single
  const baseJp = rawJpPrice * multiplier;
  const baseKr = rawKrPrice * multiplier;
  
  // Exchange Rates
  const jpyKrwRate = parseFloat(dom.jpyKrwRate.value) || 915.0; // per 100 JPY
  const usdKrwRate = parseFloat(dom.usdKrwRate.value) || 1380.0;
  const usdJpyRate = parseFloat(dom.usdJpyRate.value) || 150.8;
  
  // -------------------------------------------------------------
  // 🇯🇵 JAPAN CALCULATION
  // -------------------------------------------------------------
  
  // 1. Guest Card 5% Discount
  const guestDiscountRate = state.hasGuestCard ? 0.05 : 0;
  const jpGuestDiscountJPY = Math.floor(baseJp * guestDiscountRate);
  const jpAfterGuestJPY = baseJp - jpGuestDiscountJPY;
  
  // 2. Tax Free Refund (Based on Pre-tax price)
  const jpPreTaxJPY = jpAfterGuestJPY / 1.10;
  let taxRefundRate = 0;
  if (state.taxFreeType === 'dept') {
    taxRefundRate = 0.084545; // 10% tax minus ~1.545% dept fee
  } else if (state.taxFreeType === 'boutique') {
    taxRefundRate = 0.10; // full 10% refund on pre-tax
  }
  
  const jpTaxRefundJPY = Math.floor(jpPreTaxJPY * taxRefundRate);
  const jpStoreNetJPY = jpAfterGuestJPY - jpTaxRefundJPY;
  
  // 3. Payment Card Fee
  const cardFeePercent = parseFloat(dom.jpCardFee.value) || 0;
  const jpCardFeeJPY = Math.floor(jpStoreNetJPY * (cardFeePercent / 100));
  const jpTotalSpentJPY = jpStoreNetJPY + jpCardFeeJPY;
  
  // 4. KRW Conversion for Japan Payment
  const jpPaidKRW = Math.round(jpTotalSpentJPY * (jpyKrwRate / 100));
  
  // 5. Korean Customs Duty & VAT Calculation
  const purchaseUSD = jpStoreNetJPY / usdJpyRate;
  const dutyFreeAllowanceUSD = 800 * multiplier; // $800 per person
  const taxableUSD = Math.max(0, purchaseUSD - dutyFreeAllowanceUSD);
  const taxableKRW = Math.round(taxableUSD * usdKrwRate);
  
  let customsDuty = 0;
  let customsVAT = 0;
  let customsReduction = 0;
  let finalCustomsTax = 0;
  
  if (taxableKRW > 0) {
    // Jewelry Standard Tariff: Duty 8% + VAT 10%
    customsDuty = Math.floor(taxableKRW * 0.08);
    customsVAT = Math.floor((taxableKRW + customsDuty) * 0.10);
    const baseCustomsTax = customsDuty + customsVAT;
    
    // Self-Declaration 30% discount (Max 200,000 KRW per person)
    if (state.customsSelfDeclare) {
      const maxReduction = 200000 * multiplier;
      customsReduction = Math.min(Math.floor(baseCustomsTax * 0.30), maxReduction);
    }
    
    finalCustomsTax = Math.max(0, baseCustomsTax - customsReduction);
  }
  
  // Final Japan Total Cost
  const totalJapanKRW = jpPaidKRW + finalCustomsTax;
  
  // -------------------------------------------------------------
  // 🇰🇷 KOREA CALCULATION
  // -------------------------------------------------------------
  
  let giftDiscountRate = 0;
  if (dom.krGiftDiscount.value === 'custom') {
    giftDiscountRate = parseFloat(dom.krCustomGift.value) || 0;
  } else {
    giftDiscountRate = parseFloat(dom.krGiftDiscount.value) || 0;
  }
  
  const mileageRate = parseFloat(dom.krMileage.value) || 0;
  const totalKrDiscountPercent = giftDiscountRate + mileageRate;
  
  const krDiscountKRW = Math.round(baseKr * (totalKrDiscountPercent / 100));
  const totalKoreaKRW = baseKr - krDiscountKRW;
  
  // -------------------------------------------------------------
  // COMPARISON & DIFFERENCE
  // -------------------------------------------------------------
  
  const diffKRW = totalKoreaKRW - totalJapanKRW;
  const savePercent = totalKoreaKRW > 0 ? (Math.abs(diffKRW) / totalKoreaKRW) * 100 : 0;
  
  return {
    multiplier,
    rawJpPrice,
    rawKrPrice,
    baseJp,
    baseKr,
    
    // Japan Breakdown
    jpGuestDiscountJPY,
    jpAfterGuestJPY,
    jpTaxRefundJPY,
    jpStoreNetJPY,
    jpCardFeeJPY,
    jpTotalSpentJPY,
    jpPaidKRW,
    
    // Customs
    purchaseUSD,
    dutyFreeAllowanceUSD,
    taxableUSD,
    taxableKRW,
    customsDuty,
    customsVAT,
    customsReduction,
    finalCustomsTax,
    totalJapanKRW,
    
    // Korea Breakdown
    totalKrDiscountPercent,
    krDiscountKRW,
    totalKoreaKRW,
    
    // Diff
    diffKRW,
    savePercent
  };
}

// --- Render Results ---
function calculateAndRender() {
  const data = calculatePrices();
  
  // Update Verdict Banner
  if (data.diffKRW > 0) {
    dom.verdictTrophy.textContent = '🏆';
    dom.verdictWinnerBadge.textContent = '일본 구매 강력 추천!';
    dom.verdictWinnerBadge.style.color = '#34D399';
    dom.verdictDiffAmount.textContent = formatKRW(data.diffKRW);
    dom.verdictDiffAmount.style.color = '#FCD34D';
    dom.verdictDiffPercent.textContent = `(${data.savePercent.toFixed(1)}% 절약)`;
    
    if (data.diffKRW >= 800000) {
      dom.travelMsg.textContent = `🎉 차액(${formatKRW(data.diffKRW)})으로 2인 일본 왕복 항공권 + 5성급 호텔 숙박비가 나옵니다!`;
    } else if (data.diffKRW >= 350000) {
      dom.travelMsg.textContent = `✈️ 차액(${formatKRW(data.diffKRW)})으로 도쿄/오사카 왕복 항공권 1인 비용을 뽑을 수 있습니다!`;
    } else {
      dom.travelMsg.textContent = `🍣 차액(${formatKRW(data.diffKRW)})으로 일본 고급 오마카세 2인 식사 비용을 절약합니다!`;
    }
  } else if (data.diffKRW < 0) {
    dom.verdictTrophy.textContent = '🇰🇷';
    dom.verdictWinnerBadge.textContent = '한국 백화점 구매 추천!';
    dom.verdictWinnerBadge.style.color = '#60A5FA';
    dom.verdictDiffAmount.textContent = formatKRW(Math.abs(data.diffKRW));
    dom.verdictDiffAmount.style.color = '#93C5FD';
    dom.verdictDiffPercent.textContent = `(한국이 ${data.savePercent.toFixed(1)}% 더 저렴)`;
    dom.travelMsg.textContent = '국내 백화점 상품권 할인 및 웨딩 마일리지를 활용해 국내에서 구매하는 것이 더 유리합니다.';
  } else {
    dom.verdictTrophy.textContent = '⚖️';
    dom.verdictWinnerBadge.textContent = '일본과 한국 가격이 동일합니다';
    dom.verdictDiffAmount.textContent = '0원';
    dom.verdictDiffPercent.textContent = '';
    dom.travelMsg.textContent = '국내외 총 결제 비용이 동일하므로 A/S 편의성에 따라 선택하세요.';
  }
  
  // Progress Comparison Bar
  dom.barJpTotal.textContent = formatKRW(data.totalJapanKRW);
  dom.barKrTotal.textContent = formatKRW(data.totalKoreaKRW);
  
  const sum = data.totalJapanKRW + data.totalKoreaKRW;
  const jpWidth = sum > 0 ? (data.totalJapanKRW / sum) * 100 : 50;
  const krWidth = sum > 0 ? (data.totalKoreaKRW / sum) * 100 : 50;
  
  dom.visualJpBar.style.width = `${jpWidth}%`;
  dom.visualKrBar.style.width = `${krWidth}%`;
  
  // Render Japan Detailed Receipt
  let jpLinesHTML = `
    <div class="receipt-line">
      <span class="r-label">일본 정가 (${data.multiplier === 2 ? '2인 페어링' : '1인'})</span>
      <span class="r-val">${formatJPY(data.baseJp)}</span>
    </div>
  `;
  
  if (data.jpGuestDiscountJPY > 0) {
    jpLinesHTML += `
      <div class="receipt-line">
        <span class="r-label">백화점 게스트카드 5% 할인</span>
        <span class="r-val discount">-${formatJPY(data.jpGuestDiscountJPY)}</span>
      </div>
    `;
  }
  
  if (data.jpTaxRefundJPY > 0) {
    const typeTxt = state.taxFreeType === 'dept' ? '백화점 8.45%' : '부티크 10%';
    jpLinesHTML += `
      <div class="receipt-line">
        <span class="r-label">Tax Free 환급 (${typeTxt})</span>
        <span class="r-val discount">-${formatJPY(data.jpTaxRefundJPY)}</span>
      </div>
    `;
  }
  
  if (data.jpCardFeeJPY > 0) {
    jpLinesHTML += `
      <div class="receipt-line">
        <span class="r-label">해외 결제 수수료 (${dom.jpCardFee.value}%)</span>
        <span class="r-val tax">+${formatJPY(data.jpCardFeeJPY)}</span>
      </div>
    `;
  }
  
  jpLinesHTML += `
    <div class="receipt-line">
      <span class="r-label">일본 매장 최종 결제액 (JPY)</span>
      <span class="r-val">${formatJPY(data.jpTotalSpentJPY)}</span>
    </div>
    <div class="receipt-line sub-line">
      <span class="r-label">↳ 원화 환산 (${dom.jpyKrwRate.value}원/100엔 기준)</span>
      <span class="r-val">${formatKRW(data.jpPaidKRW)}</span>
    </div>
    
    <div class="receipt-divider"></div>
    
    <div class="receipt-line">
      <span class="r-label">입국 세관 예상 납부세액</span>
      <span class="r-val ${data.finalCustomsTax > 0 ? 'tax' : 'discount'}">
        ${data.finalCustomsTax > 0 ? '+' + formatKRW(data.finalCustomsTax) : '0원 (면세 범위 내)'}
      </span>
    </div>
  `;
  
  if (data.finalCustomsTax > 0) {
    jpLinesHTML += `
      <div class="receipt-line sub-line">
        <span class="r-label">↳ 면세한도($${data.dutyFreeAllowanceUSD}) 초과 과세액</span>
        <span class="r-val">${formatUSD(data.taxableUSD)} (${formatKRW(data.taxableKRW)})</span>
      </div>
      <div class="receipt-line sub-line">
        <span class="r-label">↳ 관세(8%) + 부가세(10%)</span>
        <span class="r-val">${formatKRW(data.customsDuty + data.customsVAT)}</span>
      </div>
    `;
    
    if (data.customsReduction > 0) {
      jpLinesHTML += `
        <div class="receipt-line sub-line">
          <span class="r-label">↳ 자진신고 30% 감면 혜택</span>
          <span class="r-val discount">-${formatKRW(data.customsReduction)}</span>
        </div>
      `;
    }
  }
  
  dom.jpReceiptLines.innerHTML = jpLinesHTML;
  dom.jpFinalTotal.textContent = formatKRW(data.totalJapanKRW);
  
  // Render Korea Detailed Receipt
  let krLinesHTML = `
    <div class="receipt-line">
      <span class="r-label">한국 정가 (${data.multiplier === 2 ? '2인 페어링' : '1인'})</span>
      <span class="r-val">${formatKRW(data.baseKr)}</span>
    </div>
  `;
  
  if (data.krDiscountKRW > 0) {
    krLinesHTML += `
      <div class="receipt-line">
        <span class="r-label">상품권/마일리지 할인 (${data.totalKrDiscountPercent.toFixed(1)}%)</span>
        <span class="r-val discount">-${formatKRW(data.krDiscountKRW)}</span>
      </div>
    `;
  } else {
    krLinesHTML += `
      <div class="receipt-line">
        <span class="r-label">적용된 할인</span>
        <span class="r-val">0원 (정가 결제)</span>
      </div>
    `;
  }
  
  dom.krReceiptLines.innerHTML = krLinesHTML;
  dom.krFinalTotal.textContent = formatKRW(data.totalKoreaKRW);
  
  updateURLQuery();
}

// --- URL State Sync & Sharing ---
function updateURLQuery() {
  const params = new URLSearchParams();
  params.set('mode', state.mode);
  params.set('jp', parseNumber(dom.jpPrice.value));
  params.set('kr', parseNumber(dom.krPrice.value));
  params.set('gc', dom.jpGuestCard.checked ? 1 : 0);
  params.set('tf', dom.jpTaxFreeType.value);
  params.set('sd', dom.customsSelfDeclare.checked ? 1 : 0);
  params.set('gd', dom.krGiftDiscount.value);
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

function loadStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.toString()) return false;
  
  if (params.has('mode')) {
    setMode(parseInt(params.get('mode')) || 1);
  }
  if (params.has('jp')) {
    const val = parseInt(params.get('jp'));
    dom.jpPrice.value = val.toLocaleString();
  }
  if (params.has('kr')) {
    const val = parseInt(params.get('kr'));
    dom.krPrice.value = val.toLocaleString();
  }
  if (params.has('gc')) {
    dom.jpGuestCard.checked = params.get('gc') === '1';
    state.hasGuestCard = dom.jpGuestCard.checked;
  }
  if (params.has('tf')) {
    dom.jpTaxFreeType.value = params.get('tf');
    state.taxFreeType = params.get('tf');
  }
  if (params.has('sd')) {
    dom.customsSelfDeclare.checked = params.get('sd') === '1';
    state.customsSelfDeclare = dom.customsSelfDeclare.checked;
  }
  if (params.has('gd')) {
    dom.krGiftDiscount.value = params.get('gd');
    state.giftDiscountType = params.get('gd');
  }
  return true;
}

// --- Mode Toggle (Single vs Couple) ---
function setMode(modeNum) {
  state.mode = modeNum;
  if (modeNum === 1) {
    dom.singleModeBtn.classList.add('active');
    dom.coupleModeBtn.classList.remove('active');
  } else {
    dom.coupleModeBtn.classList.add('active');
    dom.singleModeBtn.classList.remove('active');
  }
  calculateAndRender();
}

// --- Toast Notification ---
function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add('show');
  setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 2400);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  dom.singleModeBtn.addEventListener('click', () => setMode(1));
  dom.coupleModeBtn.addEventListener('click', () => setMode(2));
  
  dom.themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    dom.themeToggleBtn.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
  });
  
  [dom.jpPrice, dom.krPrice].forEach(input => {
    input.addEventListener('input', (e) => {
      const num = parseNumber(e.target.value);
      if (!isNaN(num)) {
        e.target.value = num.toLocaleString();
      }
      state.activePresetId = null;
      renderPresets();
      calculateAndRender();
    });
  });
  
  document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const addVal = parseInt(btn.dataset.add) || 0;
      const targetInput = document.getElementById(targetId);
      const curr = parseNumber(targetInput.value);
      targetInput.value = (curr + addVal).toLocaleString();
      calculateAndRender();
    });
  });
  
  document.querySelectorAll('.quick-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      document.getElementById(targetId).value = '0';
      calculateAndRender();
    });
  });
  
  dom.jpGuestCard.addEventListener('change', (e) => {
    state.hasGuestCard = e.target.checked;
    calculateAndRender();
  });
  
  dom.jpTaxFreeType.addEventListener('change', (e) => {
    state.taxFreeType = e.target.value;
    calculateAndRender();
  });
  
  dom.jpCardFee.addEventListener('change', () => calculateAndRender());
  dom.customsSelfDeclare.addEventListener('change', () => calculateAndRender());
  
  dom.krGiftDiscount.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      dom.krCustomGiftWrap.classList.remove('hidden');
    } else {
      dom.krCustomGiftWrap.classList.add('hidden');
    }
    calculateAndRender();
  });
  
  dom.krCustomGift.addEventListener('input', () => calculateAndRender());
  dom.krMileage.addEventListener('change', () => calculateAndRender());
  
  [dom.jpyKrwRate, dom.usdKrwRate, dom.usdJpyRate].forEach(input => {
    input.addEventListener('input', () => calculateAndRender());
  });
  
  dom.refreshRateBtn.addEventListener('click', () => {
    fetchLiveExchangeRates();
  });
  
  dom.copyResultBtn.addEventListener('click', () => {
    const data = calculatePrices();
    const modeStr = data.multiplier === 2 ? '2인 커플 (웨딩페어)' : '1인 싱글';
    
    let summaryText = `💍 [웨딩밴드 한일 가격비교 결과]\n`;
    summaryText += `구분: ${modeStr}\n`;
    summaryText += `----------------------------\n`;
    summaryText += `🇯🇵 일본 실구매가: ${formatKRW(data.totalJapanKRW)} (결제 ${formatJPY(data.jpTotalSpentJPY)} + 세관 ${formatKRW(data.finalCustomsTax)})\n`;
    summaryText += `🇰🇷 한국 실구매가: ${formatKRW(data.totalKoreaKRW)}\n`;
    summaryText += `----------------------------\n`;
    
    if (data.diffKRW > 0) {
      summaryText += `🏆 일본에서 구매 시 약 ${formatKRW(data.diffKRW)} 절약 (${data.savePercent.toFixed(1)}% Save)!\n`;
      summaryText += `✈️ ${dom.travelMsg.textContent}\n`;
    } else {
      summaryText += `🇰🇷 한국 백화점에서 구매하는 것이 약 ${formatKRW(Math.abs(data.diffKRW))} 더 유리합니다!\n`;
    }
    summaryText += `🔗 링크: ${window.location.href}`;
    
    navigator.clipboard.writeText(summaryText).then(() => {
      showToast('📋 결과 요약이 클립보드에 복사되었습니다!');
    }).catch(() => {
      showToast('복사 권한이 없습니다.');
    });
  });
  
  dom.shareUrlBtn.addEventListener('click', () => {
    updateURLQuery();
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('🔗 현재 비교 링크가 복사되었습니다!');
    }).catch(() => {
      showToast('복사 권한이 없습니다.');
    });
  });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  renderPresets();
  setupEventListeners();
  
  const loadedFromUrl = loadStateFromURL();
  if (!loadedFromUrl) {
    applyPreset(PRESETS[0]);
  }
  
  calculateAndRender();
  fetchLiveExchangeRates();
  await loadExternalRingsData();
});
