/**
 * KatalogBuku - logika utama aplikasi.
 * Mahasiswa: Ahmad Fauzan Al Ghifari (NPM: 2440304012)
 *
 * Variasi NIM 012: X=0 Products (DummyJSON) · Y=1 Filter + Statistik + Sorting
 * · Z=2 Catatan minimal 30 karakter · C=3 Toggle Grid/List di localStorage
 */

const API_URL = 'https://dummyjson.com/products?limit=30&select=rating,stock';
const LOCAL_DATA_URL = 'data/products-fallback.json';
const STORAGE_KEY_VIEW = 'katalog_view_mode';
const STORAGE_KEY_PROPOSALS = 'katalog_pengadaan_list';
const CATEGORIES = ['Komik', 'Buku Belajar', 'Novel'];
const MIN_TITLE_LENGTH = 3;
const MIN_NOTES_LENGTH = 30;
const SUCCESS_MESSAGE_MS = 5000;
const DEFAULT_TITLE = 'Rekomendasi Untukmu';

const appState = {
  allProducts: [],
  category: 'all',
  query: '',
  sortBy: 'default',
  proposals: loadProposals()
};

const DOM = {
  statTotal: document.getElementById('stat-total'),
  statTotalNote: document.getElementById('stat-total-note'),
  statAvgPrice: document.getElementById('stat-avg-price'),
  statAvgNote: document.getElementById('stat-avg-note'),
  statHighestPrice: document.getElementById('stat-highest-price'),
  statHighestTitle: document.getElementById('stat-highest-title'),
  statCategories: document.getElementById('stat-categories'),
  statCategoriesNote: document.getElementById('stat-categories-note'),
  countAll: document.getElementById('count-all'),
  countKomik: document.getElementById('count-komik'),
  countBelajar: document.getElementById('count-belajar'),
  countNovel: document.getElementById('count-novel'),

  categoryFilter: document.getElementById('category-filter'),
  searchInput: document.getElementById('search-input'),
  selectSort: document.getElementById('sort-by'),
  btnGrid: document.getElementById('btn-grid-view'),
  btnList: document.getElementById('btn-list-view'),
  catalogTitle: document.getElementById('catalog-title'),

  loadingIndicator: document.getElementById('loading-indicator'),
  errorMessage: document.getElementById('error-message'),
  errorText: document.getElementById('error-text'),
  btnRetry: document.getElementById('btn-retry'),
  productsList: document.getElementById('products-list'),

  form: document.getElementById('procurement-form'),
  inputName: document.getElementById('product-name'),
  selectCategory: document.getElementById('product-category'),
  inputNotes: document.getElementById('procurement-notes'),
  charCount: document.getElementById('char-count'),
  nameError: document.getElementById('name-error'),
  categoryError: document.getElementById('category-error'),
  notesError: document.getElementById('notes-error'),
  formSuccess: document.getElementById('form-success'),

  historyTbody: document.getElementById('history-tbody'),
  btnClearHistory: document.getElementById('btn-clear-history')
};

// ---------- Data ----------

function loadProposals() {
  try {
    const list = JSON.parse(getStorage(STORAGE_KEY_PROPOSALS, '[]'));
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn('Riwayat usulan rusak, diabaikan:', error);
    return [];
  }
}

// DummyJSON tidak punya data buku, jadi judul/sampul/harga berasal dari katalog lokal,
// sedangkan rating & stok diambil live dari REST API (dataset X = Products).
// Jika API gagal, nilai rating & stok bawaan katalog lokal yang dipakai.
async function fetchLiveRatingAndStock() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.products.map(({ rating, stock }) => ({ rating, stock }));
  } catch (error) {
    console.warn('DummyJSON tidak dapat diakses, memakai rating & stok lokal:', error);
    return [];
  }
}

async function fetchProducts() {
  DOM.loadingIndicator.hidden = false;
  DOM.errorMessage.hidden = true;
  DOM.productsList.replaceChildren();

  try {
    const [localResponse, liveData] = await Promise.all([fetch(LOCAL_DATA_URL), fetchLiveRatingAndStock()]);
    if (!localResponse.ok) throw new Error(`HTTP ${localResponse.status} saat memuat ${LOCAL_DATA_URL}`);

    const { products } = await localResponse.json();
    appState.allProducts = products.map((book, i) => ({ ...book, ...liveData[i] }));
    updateCategoryCounts();
    applyFilterAndSort();
  } catch (error) {
    console.error('Gagal memuat katalog:', error);
    DOM.errorText.textContent = `Katalog gagal dimuat (${error.message}). Pastikan halaman dibuka lewat Live Server, bukan file://.`;
    DOM.errorMessage.hidden = false;
  } finally {
    DOM.loadingIndicator.hidden = true;
  }
}

// ---------- Render ----------

// innerHTML aman di sini karena isinya hanya dari katalog lokal milik sendiri, bukan input pengguna.
function createBookCard(book) {
  const discount = discountPercent(book.priceIdr, book.originalPriceIdr);
  const card = document.createElement('article');
  card.className = 'book-card';
  card.innerHTML = `
    <div class="book-cover" data-title="${book.title}">
      <img src="${book.thumbnail}" alt="Sampul ${book.title}" loading="lazy" width="180" height="270">
      ${discount ? `<span class="discount-badge">${discount}%</span>` : ''}
    </div>
    <div class="book-info">
      <p class="book-author">${book.author}</p>
      <h3 class="book-title">${book.title}</h3>
      <p class="book-desc">${book.description}</p>
      <p class="book-price">${formatRupiah(book.priceIdr)}</p>
      ${discount ? `<s class="book-original-price">${formatRupiah(book.originalPriceIdr)}</s>` : ''}
      <p class="book-meta">${book.category} · <span aria-label="Rating ${book.rating.toFixed(1)} dari 5">★ ${book.rating.toFixed(1)}</span> · Stok ${book.stock}</p>
    </div>`;

  card.querySelector('img').addEventListener('error', event => {
    event.target.remove();
    card.querySelector('.book-cover').classList.add('cover-missing');
  }, { once: true });

  return card;
}

function renderProducts(products) {
  if (products.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p>Buku tidak ditemukan. Coba kata kunci atau kategori lain.</p>
      <a href="#usulan-buku" class="btn btn-outline empty-proposal-btn">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Buku belum ada? Usulkan di sini</span>
      </a>
    `;
    DOM.productsList.replaceChildren(empty);
    return;
  }
  DOM.productsList.replaceChildren(...products.map(createBookCard));
}

function updateDashboardStats(products) {
  const stats = calculateStatistics(products);
  const isAll = appState.category === 'all';

  DOM.statTotal.textContent = `${stats.total} Buku`;
  if (DOM.statTotalNote) {
    DOM.statTotalNote.textContent = isAll
      ? 'Semua katalog aktif'
      : `Kategori: ${appState.category}`;
  }

  DOM.statAvgPrice.textContent = formatRupiah(stats.avgPrice);
  if (DOM.statAvgNote) {
    DOM.statAvgNote.textContent = isAll
      ? 'Rata-rata seluruh buku'
      : `Rata-rata ${appState.category}`;
  }

  DOM.statHighestPrice.textContent = formatRupiah(stats.highestProduct?.priceIdr ?? 0);
  DOM.statHighestTitle.textContent = stats.highestProduct?.title ?? '-';

  if (isAll) {
    DOM.statCategories.textContent = `${stats.totalCategories} Kategori`;
    if (DOM.statCategoriesNote) {
      DOM.statCategoriesNote.textContent = 'Komik · Belajar · Novel';
    }
  } else {
    DOM.statCategories.textContent = appState.category;
    if (DOM.statCategoriesNote) {
      DOM.statCategoriesNote.textContent = `${stats.total} buku dalam kategori ini`;
    }
  }
}

// ---------- Filter, sorting, toggle view ----------

function updateCategoryPills(activeCategory) {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    const isSelected = pill.dataset.category === activeCategory;
    pill.classList.toggle('active', isSelected);
    pill.setAttribute('aria-selected', String(isSelected));
  });
}

function updateCategoryCounts() {
  const counts = { all: appState.allProducts.length, Komik: 0, 'Buku Belajar': 0, Novel: 0 };
  for (const book of appState.allProducts) {
    if (counts[book.category] !== undefined) {
      counts[book.category]++;
    }
  }
  if (DOM.countAll) DOM.countAll.textContent = counts.all;
  if (DOM.countKomik) DOM.countKomik.textContent = counts.Komik;
  if (DOM.countBelajar) DOM.countBelajar.textContent = counts['Buku Belajar'];
  if (DOM.countNovel) DOM.countNovel.textContent = counts.Novel;
}

function setupCategoryPills() {
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selected = pill.dataset.category;
      if (appState.category === selected) return;
      appState.category = selected;
      DOM.categoryFilter.value = selected;
      applyFilterAndSort();
    });
  });
}

function applyFilterAndSort() {
  const filtered = filterProducts(appState.allProducts, appState.category, appState.query);
  const result = sortProducts(filtered, appState.sortBy);

  DOM.catalogTitle.textContent = appState.category === 'all' ? DEFAULT_TITLE : appState.category;
  DOM.categoryFilter.value = appState.category;
  updateCategoryPills(appState.category);
  renderProducts(result);
  updateDashboardStats(result);
}

function setViewMode(mode) {
  const isList = mode === 'list';
  setStorage(STORAGE_KEY_VIEW, isList ? 'list' : 'grid');
  DOM.productsList.classList.toggle('is-list', isList);
  DOM.btnGrid.setAttribute('aria-pressed', String(!isList));
  DOM.btnList.setAttribute('aria-pressed', String(isList));
}

// ---------- Form usulan (validasi Z) ----------

function setFieldError(inputEl, errorEl, message) {
  inputEl.classList.toggle('input-invalid', Boolean(message));
  inputEl.setAttribute('aria-invalid', String(Boolean(message)));
  errorEl.textContent = message;
}

function handleNotesInput() {
  const length = DOM.inputNotes.value.trim().length;
  DOM.charCount.textContent = length;
  DOM.charCount.parentElement.classList.toggle('valid', length >= MIN_NOTES_LENGTH);
  if (length >= MIN_NOTES_LENGTH) setFieldError(DOM.inputNotes, DOM.notesError, '');
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = DOM.inputName.value.trim();
  const category = DOM.selectCategory.value;
  const notes = DOM.inputNotes.value.trim();

  const errors = {
    name: name.length < MIN_TITLE_LENGTH ? `Judul buku minimal ${MIN_TITLE_LENGTH} karakter.` : '',
    category: CATEGORIES.includes(category) ? '' : 'Pilih salah satu kategori.',
    notes: notes.length < MIN_NOTES_LENGTH
      ? `Alasan minimal ${MIN_NOTES_LENGTH} karakter (sekarang ${notes.length}).`
      : ''
  };

  setFieldError(DOM.inputName, DOM.nameError, errors.name);
  setFieldError(DOM.selectCategory, DOM.categoryError, errors.category);
  setFieldError(DOM.inputNotes, DOM.notesError, errors.notes);

  const firstInvalid = [DOM.inputName, DOM.selectCategory, DOM.inputNotes].find(el => el.classList.contains('input-invalid'));
  if (firstInvalid) {
    DOM.formSuccess.hidden = true;
    firstInvalid.focus();
    return;
  }

  appState.proposals.unshift({ id: Date.now(), date: new Date().toISOString(), name, category, notes });
  setStorage(STORAGE_KEY_PROPOSALS, JSON.stringify(appState.proposals));
  renderProposalHistory();

  DOM.form.reset();
  handleNotesInput();
  DOM.formSuccess.hidden = false;
  setTimeout(() => { DOM.formSuccess.hidden = true; }, SUCCESS_MESSAGE_MS);
}

// ---------- Riwayat usulan (localStorage) ----------

// Isi riwayat berasal dari input pengguna, jadi dirender lewat textContent agar tidak bisa menyisipkan HTML (XSS).
function renderProposalHistory() {
  DOM.historyTbody.replaceChildren();
  DOM.btnClearHistory.disabled = appState.proposals.length === 0;

  if (appState.proposals.length === 0) {
    const cell = DOM.historyTbody.insertRow().insertCell();
    cell.colSpan = 4;
    cell.className = 'empty-cell';
    cell.textContent = 'Belum ada usulan.';
    return;
  }

  appState.proposals.forEach(item => {
    const row = DOM.historyTbody.insertRow();
    [formatDateTime(item.date), item.name, item.category, item.notes].forEach(text => {
      row.insertCell().textContent = text;
    });
  });
}

function handleClearHistory() {
  if (!confirm('Hapus semua riwayat usulan?')) return;
  appState.proposals = [];
  setStorage(STORAGE_KEY_PROPOSALS, '[]');
  renderProposalHistory();
}

// ---------- Navigasi usulan buku ----------

function setupProposalNavigation() {
  const floatingNav = document.getElementById('floating-nav');
  const proposalSection = document.getElementById('usulan-buku');
  const formCard = document.querySelector('.proposal-form-card');

  // Delegasi klik link usulan buku (termasuk link dinamis di empty state)
  document.addEventListener('click', event => {
    const targetLink = event.target.closest('a[href="#usulan-buku"]');
    if (!targetLink) return;

    // Jika datang dari tombol saran pencarian kosong, prefill nama buku dari query
    if (targetLink.classList.contains('empty-proposal-btn') && appState.query) {
      if (DOM.inputName && !DOM.inputName.value) {
        DOM.inputName.value = appState.query;
      }
    }

    // Efek highlight pulse pada card formulir
    if (formCard) {
      formCard.classList.remove('highlight-pulse');
      void formCard.offsetWidth; // trigger reflow
      formCard.classList.add('highlight-pulse');
    }

    // Fokus ke field judul buku setelah scroll selesai
    setTimeout(() => {
      DOM.inputName?.focus();
    }, 450);
  });

  // Tombol navigasi melayang responsif (beralih fungsi antara usul buku dan ke atas)
  if (floatingNav && proposalSection) {
    const handleScroll = () => {
      const rect = proposalSection.getBoundingClientRect();
      const isNearProposal = rect.top <= window.innerHeight * 0.45;

      if (isNearProposal) {
        floatingNav.href = '#katalog';
        floatingNav.setAttribute('aria-label', 'Kembali ke katalog buku');
        floatingNav.setAttribute('title', 'Kembali ke katalog');
        floatingNav.classList.add('is-back-top');
        floatingNav.innerHTML = `
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
          <span class="floating-nav-text">Ke Atas</span>
        `;
      } else {
        floatingNav.href = '#usulan-buku';
        floatingNav.setAttribute('aria-label', 'Lompat ke form usulan buku');
        floatingNav.setAttribute('title', 'Usulkan Buku Baru');
        floatingNav.classList.remove('is-back-top');
        floatingNav.innerHTML = `
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span class="floating-nav-text">Usul Buku</span>
        `;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

// ---------- Init ----------

function initApp() {
  setViewMode(getStorage(STORAGE_KEY_VIEW, 'grid'));

  DOM.categoryFilter.addEventListener('change', event => {
    appState.category = event.target.value;
    applyFilterAndSort();
  });
  // shortcut: filter tanpa debounce, tambahkan debounce jika katalog > ~1000 buku
  DOM.searchInput.addEventListener('input', event => {
    appState.query = event.target.value;
    applyFilterAndSort();
  });
  DOM.selectSort.addEventListener('change', event => {
    appState.sortBy = event.target.value;
    applyFilterAndSort();
  });
  DOM.btnGrid.addEventListener('click', () => setViewMode('grid'));
  DOM.btnList.addEventListener('click', () => setViewMode('list'));
  DOM.btnRetry.addEventListener('click', fetchProducts);

  DOM.inputNotes.addEventListener('input', handleNotesInput);
  DOM.form.addEventListener('submit', handleFormSubmit);
  DOM.btnClearHistory.addEventListener('click', handleClearHistory);

  setupCategoryPills();
  setupProposalNavigation();
  renderProposalHistory();
  fetchProducts();
}

document.addEventListener('DOMContentLoaded', initApp);
