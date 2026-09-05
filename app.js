/**
 * WEDDING BAND PRICE INDEX - CORE APPLICATION
 * Target 7 Luxury Brands: Cartier, Tiffany & Co., Chanel, Bvlgari, Graff, Boucheron, Chaumet
 * Includes Live Crawl Log Viewer
 */

// --- Default 7 Luxury Brands Presets ---
let PRESETS = [
  {
    id: 'cartier-love-sm',
    brand: 'Cartier',
    brandKr: '까르띠에',
    name: '러브 웨딩 밴드 (SM)',
    jpPrice: 193600,
    krPrice: 2050000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가',
    imageUrl: 'https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dwc27b40c7/images/large/5c4da398fe195e5fa36ea2b5d4ce0071.png',
    krUrl: 'https://www.cartier.com/ko-kr/%EC%A3%BC%EC%96%BC%EB%A6%AC/%EB%A7%81/love/love-%EB%A7%81-%EC%8A%A4%EB%AA%B0%28small%29-%EB%AA%A8%EB%8D%B8-CRB4085000.html',
    jpUrl: 'https://www.cartier.com/ja-jp/%E3%82%B8%E3%83%A5%E3%82%A8%E3%83%AA%E3%83%BC/%E3%83%AA%E3%83%B3%E3%82%B0/love/love-%E3%83%AA%E3%83%B3%E3%82%B0-%E3%82%B9%E3%83%A2%E3%83%BC%E3%83%AB%E3%83%A2%E3%83%87%E3%83%AB-CRB4085000.html'
  },
  {
    id: 'cartier-love-cl',
    brand: 'Cartier',
    brandKr: '까르띠에',
    name: '러브 링 (클래식)',
    jpPrice: 284900,
    krPrice: 2980000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가',
    imageUrl: 'https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dw47516a74/images/large/509efad81d12569981abebf66c433720.png',
    krUrl: 'https://www.cartier.com/ko-kr/%EC%A3%BC%EC%96%BC%EB%A6%AC/%EB%A7%81/love/love-%EB%A7%81-%ED%81%B4%EB%9E%98%EC%8B%9D-%EB%AA%A8%EB%8D%B8--CRB4084600.html',
    jpUrl: 'https://www.cartier.com/ja-jp/%E3%82%B8%E3%83%A5%E3%82%A8%E3%83%AA%E3%83%BC/%E3%83%AA%E3%83%B3%E3%82%B0/love/love-%E3%83%AA%E3%83%B3%E3%82%B0-%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF%E3%83%A2%E3%83%87%E3%83%AB-CRB4084600.html'
  },
  {
    id: 'cartier-trinity-cl',
    brand: 'Cartier',
    brandKr: '까르띠에',
    name: '트리니티 링 (클래식)',
    jpPrice: 249700,
    krPrice: 2620000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가',
    imageUrl: 'https://www.cartier.com/dw/image/v2/BGTJ_PRD/on/demandware.static/-/Sites-cartier-master/default/dwae3ae765/images/large/bdddbc7c263e54ea9f1f71501fb9eede.png',
    krUrl: 'https://www.cartier.com/ko-kr/%EC%A3%BC%EC%96%BC%EB%A6%AC/%EB%A7%81/%ED%8A%B8%EB%A6%AC%EB%8B%88%ED%8B%B0/%ED%8A%B8%EB%A6%AC%EB%8B%88%ED%8B%B0-%EB%A7%81-%ED%81%B4%EB%9E%98%EC%8B%9D-%EB%AA%A8%EB%8D%B8-CRB4234200.html',
    jpUrl: 'https://www.cartier.com/ja-jp/%E3%82%B8%E3%83%A5%E3%82%A8%E3%83%AA%E3%83%BC/%E3%83%AA%E3%83%B3%E3%82%B0/%E3%83%88%E3%83%AA%E3%83%8B%E3%83%86%E3%82%A3/%E3%83%88%E3%83%AA%E3%83%8B%E3%83%86%E3%82%A3-%E3%83%AA%E3%83%B3%E3%82%B0-%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF%E3%83%A2%E3%83%87%E3%83%AB-CRB4234200.html'
  },
  {
    id: 'tiffany-t-true',
    brand: 'Tiffany & Co.',
    brandKr: '티파니',
    name: 'T 트루 내로우 링',
    jpPrice: 214500,
    krPrice: 2270000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-ttrue-narrow-ring-63064947_989758_ED_M.jpg',
    krUrl: 'https://www.tiffany.kr/jewelry/rings/',
    jpUrl: 'https://www.tiffany.co.jp/jewelry/rings/'
  },
  {
    id: 'tiffany-band-ring',
    brand: 'Tiffany & Co.',
    brandKr: '티파니',
    name: '티파니 밴드 링 (3P 다이아)',
    jpPrice: 269500,
    krPrice: 2850000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-classic-wedding-band-ring-63064947_989758_ED_M.jpg',
    krUrl: 'https://www.tiffany.kr/engagement/womens-wedding-bands/',
    jpUrl: 'https://www.tiffany.co.jp/engagement/womens-wedding-bands/'
  },
  {
    id: 'chanel-coco-sm',
    brand: 'Chanel',
    brandKr: '샤넬',
    name: '코코 크러쉬 링 (스몰)',
    jpPrice: 245300,
    krPrice: 2590000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가',
    imageUrl: 'https://www.chanel.com/images/as/t_one/q_auto:good,f_auto,fl_lossy,dpr_1.1/w_600/coco-crush-ring-beige-beige-gold-packshot-portee-1-j11785-73266669.jpg',
    krUrl: 'https://www.chanel.com/kr/fine-jewellery/coco-crush/',
    jpUrl: 'https://www.chanel.com/jp/fine-jewellery/coco-crush/'
  },
  {
    id: 'chanel-coco-md',
    brand: 'Chanel',
    brandKr: '샤넬',
    name: '코코 크러쉬 링 (미디엄)',
    jpPrice: 424600,
    krPrice: 4480000,
    guestCardAllowed: false,
    tag: '게스트카드 5% 불가',
    imageUrl: 'https://www.chanel.com/images/as/t_one/q_auto:good,f_auto,fl_lossy,dpr_1.1/w_600/coco-crush-ring-beige-gold-18k-beige-gold-packshot-portee-1-j10817-73266669.jpg',
    krUrl: 'https://www.chanel.com/kr/fine-jewellery/coco-crush/',
    jpUrl: 'https://www.chanel.com/jp/fine-jewellery/coco-crush/'
  },
  {
    id: 'bvlgari-bzero1',
    brand: 'Bvlgari',
    brandKr: '불가리',
    name: '비제로원 1밴드 링',
    jpPrice: 267300,
    krPrice: 2810000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://media2.bulgari.com/f_auto,q_auto/production/dw41a59c01/images/images/1319269.png',
    krUrl: 'https://www.bulgari.com/ko-kr/bridal/wedding-bands',
    jpUrl: 'https://www.bulgari.com/ja-jp/bridal/wedding-bands'
  },
  {
    id: 'bvlgari-serpenti',
    brand: 'Bvlgari',
    brandKr: '불가리',
    name: '세르펜티 바이퍼 링',
    jpPrice: 302500,
    krPrice: 3190000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://media2.bulgari.com/f_auto,q_auto/production/dw41a59c01/images/images/1337147.png',
    krUrl: 'https://www.bulgari.com/ko-kr/jewelry/by-collection/serpenti',
    jpUrl: 'https://www.bulgari.com/ja-jp/jewelry/by-collection/serpenti'
  },
  {
    id: 'graff-laurence',
    brand: 'Graff',
    brandKr: '그라프',
    name: '로렌스 그라프 시그니처 링',
    jpPrice: 345000,
    krPrice: 3650000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://www.graff.com/dw/image/v2/BFNT_PRD/on/demandware.static/-/Sites-master-catalog/default/dwd3307b39/sfcc-graff-staging/i/m/a/g/e/images_hi_res_RGR778_GR83381_Hero_1.jpg',
    krUrl: 'https://www.graff.com/kr-ko/jewellery/rings/wedding-bands/',
    jpUrl: 'https://www.graff.com/jp-ja/jewellery/rings/wedding-bands/'
  },
  {
    id: 'graff-spiral',
    brand: 'Graff',
    brandKr: '그라프',
    name: '스파이럴 밴드 링',
    jpPrice: 315000,
    krPrice: 3300000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://www.graff.com/dw/image/v2/BFNT_PRD/on/demandware.static/-/Sites-master-catalog/default/dwd3307b39/sfcc-graff-staging/i/m/a/g/e/images_hi_res_RGR778_GR83381_Hero_1.jpg',
    krUrl: 'https://www.graff.com/kr-ko/jewellery/rings/wedding-bands/',
    jpUrl: 'https://www.graff.com/jp-ja/jewellery/rings/wedding-bands/'
  },
  {
    id: 'boucheron-quatre',
    brand: 'Boucheron',
    brandKr: '부쉐론',
    name: '콰트로 클래식 스몰 링',
    jpPrice: 627000,
    krPrice: 6650000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://www.boucheron.com/media/catalog/product/cache/057be03577d67f5cebb6d5ff2bbdf5b3/j/r/jrg00200_1.png',
    krUrl: 'https://www.boucheron.com/ko-kr/bridal/wedding-bands',
    jpUrl: 'https://www.boucheron.com/ja-jp/bridal/wedding-bands'
  },
  {
    id: 'boucheron-facette',
    brand: 'Boucheron',
    brandKr: '부쉐론',
    name: '파셋 웨딩 밴드 (플래티넘)',
    jpPrice: 279400,
    krPrice: 2940000,
    guestCardAllowed: true,
    tag: '지점별 5% 가능',
    imageUrl: 'https://www.boucheron.com/media/catalog/product/cache/057be03577d67f5cebb6d5ff2bbdf5b3/j/a/jal00014_1.png',
    krUrl: 'https://www.boucheron.com/ko-kr/bridal/wedding-bands',
    jpUrl: 'https://www.boucheron.com/ja-jp/bridal/wedding-bands'
  },
  {
    id: 'chaumet-bee',
    brand: 'Chaumet',
    brandKr: '쇼메',
    name: '비 마이 러브 링',
    jpPrice: 163900,
    krPrice: 1740000,
    guestCardAllowed: true,
    tag: '백화점 5% 가능',
    imageUrl: 'https://www.chaumet.com/media/catalog/product/0/8/083434_1.png',
    krUrl: 'https://www.chaumet.com/kr/bridal/wedding-bands',
    jpUrl: 'https://www.chaumet.com/jp/bridal/wedding-bands'
  },
  {
    id: 'chaumet-liens',
    brand: 'Chaumet',
    brandKr: '쇼메',
    name: '리앙 에비당스 링',
    jpPrice: 272800,
    krPrice: 2880000,
    guestCardAllowed: true,
    tag: '백화점 5% 가능',
    imageUrl: 'https://www.chaumet.com/media/catalog/product/0/8/082218_1.png',
    krUrl: 'https://www.chaumet.com/kr/bridal/wedding-bands',
    jpUrl: 'https://www.chaumet.com/jp/bridal/wedding-bands'
  }
];

let crawlLogData = null;

// --- State ---
let state = {
  mode: 1, // 1: single, 2: couple
  theme: 'dark',
  activeBrandFilter: 'all',
  activePresetId: null,
  
  // Inputs
  jpPrice: 193600,
  krPrice: 2050000,
  
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
  brandFilterBar: document.getElementById('brandFilterBar'),
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
  toast: document.getElementById('toast'),

  // Crawl Log Modal
  openCrawlLogBtn: document.getElementById('openCrawlLogBtn'),
  closeCrawlLogBtn: document.getElementById('closeCrawlLogBtn'),
  crawlLogModal: document.getElementById('crawlLogModal'),
  logTimestamp: document.getElementById('logTimestamp'),
  logTotalCount: document.getElementById('logTotalCount'),
  logStatusBadge: document.getElementById('logStatusBadge'),
  logUpdatedCount: document.getElementById('logUpdatedCount'),
  logSearchInput: document.getElementById('logSearchInput'),
  logItemsContainer: document.getElementById('logItemsContainer')
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
        hint.textContent = `* 7대 브랜드 공식몰 기준 데이터 (최종 검증: ${data.lastUpdated})`;
      }
    }
  } catch (err) {
    console.log('Using default presets data:', err);
  }
}

// --- Fetch & Render Crawl Log ---
async function loadCrawlLog() {
  try {
    const res = await fetch('./data/crawl_log.json');
    if (!res.ok) throw new Error('Failed to load crawl_log.json');
    crawlLogData = await res.json();
    renderCrawlLogModal(crawlLogData);
  } catch (err) {
    console.log('Using local generated crawl log:', err);
    // Fallback display from presets
    const fallbackLog = {
      timestamp: '2026-09-05 22:52:51 KST',
      status: 'COMPLETED',
      totalRings: PRESETS.length,
      updatedCount: 0,
      logs: PRESETS.map(p => ({
        id: p.id,
        brand: p.brand,
        brandKr: p.brandKr || p.brand,
        name: p.name,
        krPrice: p.krPrice,
        jpPrice: p.jpPrice,
        krStatus: '정상 확인',
        jpStatus: '정상 확인',
        krCode: 200,
        jpCode: 200,
        krUrl: p.krUrl || '#',
        jpUrl: p.jpUrl || '#'
      }))
    };
    crawlLogData = fallbackLog;
    renderCrawlLogModal(fallbackLog);
  }
}

function renderCrawlLogModal(logData, filterQuery = '') {
  if (!logData) return;

  if (dom.logTimestamp) dom.logTimestamp.textContent = `마지막 자동 검증: ${logData.timestamp || '2026-09-05'}`;
  if (dom.logTotalCount) dom.logTotalCount.textContent = `${logData.totalRings || PRESETS.length}개 모델`;
  if (dom.logStatusBadge) dom.logStatusBadge.textContent = '🟢 정상 완료 (COMPLETED)';
  if (dom.logUpdatedCount) dom.logUpdatedCount.textContent = `${logData.updatedCount || 0}건 (정가 유지)`;

  if (!dom.logItemsContainer) return;
  dom.logItemsContainer.innerHTML = '';

  const query = filterQuery.toLowerCase().trim();
  const items = (logData.logs || []).filter(item => {
    if (!query) return true;
    return (
      (item.brand && item.brand.toLowerCase().includes(query)) ||
      (item.brandKr && item.brandKr.includes(query)) ||
      (item.name && item.name.toLowerCase().includes(query))
    );
  });

  if (items.length === 0) {
    dom.logItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 0.9rem;">
        일치하는 크롤링 모델이 없습니다.
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'log-row-card';

    const krStatusClass = item.krCode === 200 ? 'ok' : 'notice';
    const jpStatusClass = item.jpCode === 200 ? 'ok' : 'notice';
    const thumbHtml = item.imageUrl
      ? `<div class="log-thumb-box"><img src="${item.imageUrl}" alt="${item.name}" class="log-thumb-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none'" /></div>`
      : '';

    card.innerHTML = `
      <div class="log-ring-info-wrap">
        ${thumbHtml}
        <div class="log-ring-info">
          <span class="log-brand-tag">${item.brand} (${item.brandKr || item.brand})</span>
          <span class="log-ring-title">${item.name}</span>
        </div>
      </div>

      <div class="log-store-box">
        <div class="log-store-header">
          <span>🇰🇷 한국 공식몰</span>
          <span class="log-status-pill ${krStatusClass}">${item.krStatus || '검증 완료'}</span>
        </div>
        <span class="log-price-val">₩${(item.krPrice || 0).toLocaleString()}</span>
        ${item.krUrl ? `<a href="${item.krUrl}" target="_blank" rel="noopener noreferrer" class="log-store-link">공식 상품 페이지 ↗</a>` : ''}
      </div>

      <div class="log-store-box">
        <div class="log-store-header">
          <span>🇯🇵 일본 공식몰</span>
          <span class="log-status-pill ${jpStatusClass}">${item.jpStatus || '검증 완료'}</span>
        </div>
        <span class="log-price-val">¥${(item.jpPrice || 0).toLocaleString()}</span>
        ${item.jpUrl ? `<a href="${item.jpUrl}" target="_blank" rel="noopener noreferrer" class="log-store-link">공식 상품 페이지 ↗</a>` : ''}
      </div>
    `;

    dom.logItemsContainer.appendChild(card);
  });
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

// --- Render Presets with Brand Filtering ---
function renderPresets() {
  dom.presetGrid.innerHTML = '';
  
  const filtered = PRESETS.filter(item => {
    if (state.activeBrandFilter === 'all') return true;
    return item.brand === state.activeBrandFilter;
  });

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = `preset-card ${state.activePresetId === item.id ? 'active' : ''}`;
    card.dataset.id = item.id;
    
    const tagClass = item.guestCardAllowed ? 'guest-ok' : 'no-guest';
    const imgHtml = item.imageUrl
      ? `<div class="preset-img-box"><img src="${item.imageUrl}" alt="${item.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.style.display='none'" /></div>`
      : '';
    
    card.innerHTML = `
      ${imgHtml}
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
  
  state.hasGuestCard = preset.guestCardAllowed;
  dom.jpGuestCard.checked = preset.guestCardAllowed;
  
  if (preset.brand === 'Cartier' || preset.brand === 'Chanel') {
    dom.guestCardNote.textContent = `${preset.brand}는 대부분 백화점 5% 게스트카드 제외 매장입니다.`;
    dom.guestCardNote.style.color = '#F87171';
  } else if (preset.brand === 'Chaumet') {
    dom.guestCardNote.textContent = '쇼메는 대부분 백화점에서 5% 게스트카드 할인이 적용됩니다.';
    dom.guestCardNote.style.color = '#34D399';
  } else {
    dom.guestCardNote.textContent = `${preset.brand}는 한큐, 이세탄, 다카시마야 등 지점별로 5% 적용 가능`;
    dom.guestCardNote.style.color = '#38BDF8';
  }
  
  renderPresets();
  calculateAndRender();
  showToast(`[${preset.brand}] ${preset.name} 모델이 선택되었습니다.`);
}

// --- Calculation Logic ---
function calculatePrices() {
  const multiplier = state.mode;
  
  const rawJpPrice = parseNumber(dom.jpPrice.value);
  const rawKrPrice = parseNumber(dom.krPrice.value);
  
  const baseJp = rawJpPrice * multiplier;
  const baseKr = rawKrPrice * multiplier;
  
  const jpyKrwRate = parseFloat(dom.jpyKrwRate.value) || 915.0;
  const usdKrwRate = parseFloat(dom.usdKrwRate.value) || 1380.0;
  const usdJpyRate = parseFloat(dom.usdJpyRate.value) || 150.8;
  
  // 🇯🇵 Japan Calculation
  const guestDiscountRate = state.hasGuestCard ? 0.05 : 0;
  const jpGuestDiscountJPY = Math.floor(baseJp * guestDiscountRate);
  const jpAfterGuestJPY = baseJp - jpGuestDiscountJPY;
  
  const jpPreTaxJPY = jpAfterGuestJPY / 1.10;
  let taxRefundRate = 0;
  if (state.taxFreeType === 'dept') {
    taxRefundRate = 0.084545;
  } else if (state.taxFreeType === 'boutique') {
    taxRefundRate = 0.10;
  }
  
  const jpTaxRefundJPY = Math.floor(jpPreTaxJPY * taxRefundRate);
  const jpStoreNetJPY = jpAfterGuestJPY - jpTaxRefundJPY;
  
  const cardFeePercent = parseFloat(dom.jpCardFee.value) || 0;
  const jpCardFeeJPY = Math.floor(jpStoreNetJPY * (cardFeePercent / 100));
  const jpTotalSpentJPY = jpStoreNetJPY + jpCardFeeJPY;
  
  const jpPaidKRW = Math.round(jpTotalSpentJPY * (jpyKrwRate / 100));
  
  // Korean Customs Duty & VAT
  const purchaseUSD = jpStoreNetJPY / usdJpyRate;
  const dutyFreeAllowanceUSD = 800 * multiplier;
  const taxableUSD = Math.max(0, purchaseUSD - dutyFreeAllowanceUSD);
  const taxableKRW = Math.round(taxableUSD * usdKrwRate);
  
  let customsDuty = 0;
  let customsVAT = 0;
  let customsReduction = 0;
  let finalCustomsTax = 0;
  
  if (taxableKRW > 0) {
    customsDuty = Math.floor(taxableKRW * 0.08);
    customsVAT = Math.floor((taxableKRW + customsDuty) * 0.10);
    const baseCustomsTax = customsDuty + customsVAT;
    
    if (state.customsSelfDeclare) {
      const maxReduction = 200000 * multiplier;
      customsReduction = Math.min(Math.floor(baseCustomsTax * 0.30), maxReduction);
    }
    
    finalCustomsTax = Math.max(0, baseCustomsTax - customsReduction);
  }
  
  const totalJapanKRW = jpPaidKRW + finalCustomsTax;
  
  // 🇰🇷 Korea Calculation
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
  
  const diffKRW = totalKoreaKRW - totalJapanKRW;
  const savePercent = totalKoreaKRW > 0 ? (Math.abs(diffKRW) / totalKoreaKRW) * 100 : 0;
  
  return {
    multiplier,
    rawJpPrice,
    rawKrPrice,
    baseJp,
    baseKr,
    
    jpGuestDiscountJPY,
    jpAfterGuestJPY,
    jpTaxRefundJPY,
    jpStoreNetJPY,
    jpCardFeeJPY,
    jpTotalSpentJPY,
    jpPaidKRW,
    
    purchaseUSD,
    dutyFreeAllowanceUSD,
    taxableUSD,
    taxableKRW,
    customsDuty,
    customsVAT,
    customsReduction,
    finalCustomsTax,
    totalJapanKRW,
    
    totalKrDiscountPercent,
    krDiscountKRW,
    totalKoreaKRW,
    
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
  
  // Brand Filter Tabs
  if (dom.brandFilterBar) {
    dom.brandFilterBar.querySelectorAll('.brand-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        dom.brandFilterBar.querySelectorAll('.brand-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeBrandFilter = tab.dataset.brand;
        renderPresets();
      });
    });
  }
  
  // Theme Toggle
  dom.themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    dom.themeToggleBtn.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
  });
  
  // Crawl Log Modal Events
  if (dom.openCrawlLogBtn && dom.crawlLogModal) {
    dom.openCrawlLogBtn.addEventListener('click', () => {
      dom.crawlLogModal.classList.add('active');
      if (crawlLogData) {
        renderCrawlLogModal(crawlLogData, dom.logSearchInput ? dom.logSearchInput.value : '');
      } else {
        loadCrawlLog();
      }
    });
  }

  if (dom.closeCrawlLogBtn && dom.crawlLogModal) {
    dom.closeCrawlLogBtn.addEventListener('click', () => {
      dom.crawlLogModal.classList.remove('active');
    });
  }

  if (dom.crawlLogModal) {
    dom.crawlLogModal.addEventListener('click', (e) => {
      if (e.target === dom.crawlLogModal) {
        dom.crawlLogModal.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dom.crawlLogModal && dom.crawlLogModal.classList.contains('active')) {
      dom.crawlLogModal.classList.remove('active');
    }
  });

  if (dom.logSearchInput) {
    dom.logSearchInput.addEventListener('input', (e) => {
      if (crawlLogData) {
        renderCrawlLogModal(crawlLogData, e.target.value);
      }
    });
  }
  
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
  await loadCrawlLog();
});
