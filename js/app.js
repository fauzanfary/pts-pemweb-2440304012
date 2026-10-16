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
  statAvgPrice: document.getElementById('stat-avg-price'),
  statHighestPrice: document.getElementById('stat-highest-price'),
  statHighestTitle: document.getElementById('stat-highest-title'),
  statCategories: document.getElementById('stat-categories'),

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
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Buku tidak ditemukan. Coba kata kunci atau kategori lain.';
    DOM.productsList.replaceChildren(empty);
    return;
  }
  DOM.productsList.replaceChildren(...products.map(createBookCard));
}

function updateDashboardStats(products) {
  const stats = calculateStatistics(products);
  DOM.statTotal.textContent = `${stats.total} Buku`;
  DOM.statAvgPrice.textContent = formatRupiah(stats.avgPrice);
  DOM.statHighestPrice.textContent = formatRupiah(stats.highestProduct?.priceIdr ?? 0);
  DOM.statHighestTitle.textContent = stats.highestProduct?.title ?? '';
  DOM.statCategories.textContent = `${stats.totalCategories} Kategori`;
}

// ---------- Filter, sorting, toggle view ----------

function applyFilterAndSort() {
  const filtered = filterProducts(appState.allProducts, appState.category, appState.query);
  const result = sortProducts(filtered, appState.sortBy);

  DOM.catalogTitle.textContent = appState.category === 'all' ? DEFAULT_TITLE : appState.category;
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

  renderProposalHistory();
  fetchProducts();
}

document.addEventListener('DOMContentLoaded', initApp);
