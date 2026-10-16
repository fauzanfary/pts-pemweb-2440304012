/**
 * Nama: Ahmad Fauzan Al Ghifari (NPM: 2440304012)
 */

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

function formatRupiah(amount) {
  return Number.isFinite(amount) ? rupiahFormatter.format(amount) : 'Rp 0';
}

function formatDateTime(date) {
  return new Date(date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

// localStorage bisa melempar error (mode privat / kuota penuh), jadi dibungkus try/catch.
function getStorage(key, fallbackValue) {
  try {
    return localStorage.getItem(key) ?? fallbackValue;
  } catch (error) {
    console.warn(`Gagal membaca localStorage [${key}]:`, error);
    return fallbackValue;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Gagal menyimpan ke localStorage [${key}]:`, error);
  }
}

/** Persentase diskon dibulatkan; 0 jika tidak ada harga coret yang lebih tinggi. */
function discountPercent(price, originalPrice) {
  if (!(originalPrice > price) || !(price >= 0)) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

/** Statistik wajib: total, rata-rata harga (.reduce), termahal (.reduce), kategori unik (.map + Set). */
function calculateStatistics(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return { total: 0, avgPrice: 0, highestProduct: null, totalCategories: 0 };
  }

  const totalPrice = products.reduce((sum, item) => sum + item.priceIdr, 0);
  const highestProduct = products.reduce((max, item) => (item.priceIdr > max.priceIdr ? item : max));

  return {
    total: products.length,
    avgPrice: totalPrice / products.length,
    highestProduct,
    totalCategories: new Set(products.map(item => item.category)).size
  };
}

/** Filter berdasarkan kategori ('all' = semua) dan kata kunci judul/penulis (tidak peka huruf besar). */
function filterProducts(products, category, query) {
  const keyword = query.trim().toLowerCase();
  return products.filter(item =>
    (category === 'all' || item.category === category) &&
    (!keyword || `${item.title} ${item.author}`.toLowerCase().includes(keyword))
  );
}

/** Mengembalikan array baru terurut (Array.prototype.sort) tanpa memutasi array asli. */
function sortProducts(products, sortBy) {
  const comparators = {
    'price-asc': (a, b) => a.priceIdr - b.priceIdr,
    'price-desc': (a, b) => b.priceIdr - a.priceIdr,
    'rating-desc': (a, b) => b.rating - a.rating
  };
  const copy = [...products];
  return comparators[sortBy] ? copy.sort(comparators[sortBy]) : copy;
}

// Ekspor hanya untuk pengujian di Node (tests/utils.test.js); diabaikan di browser.
if (typeof module !== 'undefined') {
  module.exports = { formatRupiah, discountPercent, calculateStatistics, filterProducts, sortProducts };
}
