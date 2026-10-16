// Jalankan: node --test tests/utils.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { discountPercent, calculateStatistics, filterProducts, sortProducts } = require('../js/utils.js');

const books = [
  { title: 'Naruto', author: 'Kishimoto', category: 'Komik', priceIdr: 40000, rating: 4.5 },
  { title: 'Clean Code', author: 'Robert Martin', category: 'Buku Belajar', priceIdr: 400000, rating: 4.8 },
  { title: 'Laskar Pelangi', author: 'Andrea Hirata', category: 'Novel', priceIdr: 80000, rating: 4.9 }
];

test('discountPercent membulatkan dan menolak harga coret yang tidak valid', () => {
  assert.equal(discountPercent(86250, 115000), 25);
  assert.equal(discountPercent(50000, 50000), 0);
  assert.equal(discountPercent(50000, undefined), 0);
  assert.equal(discountPercent(60000, 50000), 0);
});

test('filterProducts menggabungkan kategori dan kata kunci (judul/penulis)', () => {
  assert.deepEqual(filterProducts(books, 'Novel', '').map(b => b.title), ['Laskar Pelangi']);
  assert.deepEqual(filterProducts(books, 'all', '  MARTIN ').map(b => b.title), ['Clean Code']);
  assert.equal(filterProducts(books, 'Komik', 'clean').length, 0);
});

test('sortProducts tidak memutasi array asli', () => {
  const sorted = sortProducts(books, 'price-desc');
  assert.deepEqual(sorted.map(b => b.priceIdr), [400000, 80000, 40000]);
  assert.equal(books[0].title, 'Naruto');
  assert.equal(sortProducts(books, 'rating-desc')[0].title, 'Laskar Pelangi');
});

test('calculateStatistics menangani data kosong dan normal', () => {
  assert.equal(calculateStatistics([]).highestProduct, null);
  const stats = calculateStatistics(books);
  assert.equal(stats.avgPrice, 520000 / 3);
  assert.equal(stats.highestProduct.title, 'Clean Code');
  assert.equal(stats.totalCategories, 3);
});
