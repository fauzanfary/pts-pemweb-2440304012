# KatalogBuku Store - Mini Project PTS Pemrograman Web

Repository ini berisi implementasi tugas Penilaian Tengah Semester (PTS) Mata Kuliah Pemrograman Web berbasis *Outcome-Based Education* (OBE). Proyek ini merupakan aplikasi *Interactive Data Dashboard & E-Commerce Catalog* yang terinspirasi dari antarmuka modern Gramedia.com, dibangun murni menggunakan HTML5, CSS3 modern, dan Vanilla JavaScript (ES6+).

## Informasi Mahasiswa

* **Nama:** Ahmad Fauzan Al Ghifari.
* **NPM:** 2440304012.
* **Program Studi:** Sarjana Teknik Komputer.
* **Universitas:** Universitas Borneo Tarakan (2026).

---

## Catatan Keputusan Desain (Design Decisions)

Dalam pengembangan UI/UX KatalogBuku, beberapa keputusan teknis diambil untuk memenuhi standar aksesibilitas, responsivitas, dan estetika toko buku profesional:

### 1. Arsitektur CSS & Custom Properties
Menggunakan pendekatan *CSS Variables* (`:root`) untuk membangun sistem desain yang konsisten. Palet warna diatur terpusat (seperti `--blue: #0b4ea2`, `--pink: #e11d48`, `--bg: #f5f6f8`, dan `--surface: #ffffff`), termasuk pengelolaan variabel `--radius`, `--shadow`, dan transition yang memudahkan pemeliharaan gaya visual.

### 2. Pendekatan Layout (Flexbox & CSS Grid)
* **Flexbox:** Digunakan pada komponen 1-dimensi seperti navigasi header, search bar, toolbar pengurutan, serta kartu buku pada mode baris (*List View*).
* **CSS Grid:** Diterapkan pada grid katalog produk (`.book-grid`) dengan teknik `repeat(auto-fill, minmax(170px, 1fr))` sehingga kartu buku berjejer rapi secara dinamis mengikuti lebar layar.

### 3. Responsive Design
Desain dibangun adaptif untuk berbagai ukuran layar dengan *Media Queries*:
* **Desktop ($\ge 1024\text{px}$):** Menampilkan grid buku leluasa hingga 5–6 kolom per baris.
* **Tablet ($768\text{px}$):** Statistik ringkas berubah menjadi 2 kolom dan padding kontainer disesuaikan.
* **Mobile ($\le 480\text{px}$):** Header bertumpuk rapi, search bar mengisi lebar penuh, kartu katalog tersusun 2 kolom proporsional, serta formulir usulan beralih ke 1 kolom vertikal tanpa terjadi *horizontal scrolling*.

---

## Perhitungan Variasi Soal Berdasarkan NIM

Tiga digit terakhir NIM adalah **012**, maka penentuan varian soal:
* **$X = 0$**
* **$Y = 1$**
* **$Z = 2$**

### Hasil Penentuan Komponen:
1. **Dataset ($X = 0$):** **Products** via REST API DummyJSON dengan tema **Dashboard Produk / Toko Buku**.
2. **Fitur Utama ($Y = 1$):** **Filter Data + Statistik Sederhana + Sorting (`.sort()`)**.
3. **Form & Validasi ($Z = 2$):** Formulir usulan buku dengan **Catatan Pengadaan minimal 30 karakter** serta tabel riwayat penyimpanan.
4. **Challenge ($C$):**
   $$S = X + Y + Z = 0 + 1 + 2 = 3$$
   $$C = S \pmod 4 = 3 \pmod 4 = \mathbf{3}$$
   * **Challenge $C = 3$:** **Toggle Grid/List; pilihan pengguna disimpan pada `localStorage`**.

---

## Dataset dan REST API yang Digunakan

* **Penyedia REST API:** DummyJSON Products API.
* **Endpoint Utama:** `https://dummyjson.com/products?limit=30&select=rating,stock`
* **Metode HTTP:** `GET` (Format Data: JSON).
* **Format Mata Uang:** Standar Rupiah Indonesia menggunakan `Intl.NumberFormat('id-ID')`.
* **Katalog 30 Buku Terkurasi (Tepat 10 Item per Kategori):**
  1. **Komik (10 Item):** Dragon Ball Vol. 1, Attack on Titan Vol. 1, Demon Slayer Vol. 1, Jujutsu Kaisen Vol. 1, My Hero Academia Vol. 1, Spy x Family Vol. 1, Haikyu!! Vol. 1, Chainsaw Man Vol. 1, Death Note Vol. 1, One-Punch Man Vol. 1.
  2. **Buku Belajar (10 Item):** Clean Code, The Pragmatic Programmer, Eloquent JavaScript, Introduction to Algorithms, Head First Java, Python Crash Course, A Brief History of Time, Automate the Boring Stuff with Python, JavaScript: The Good Parts, Grokking Algorithms.
  3. **Novel (10 Item):** Bumi Manusia, Cantik Itu Luka, Laskar Pelangi, Laut Bercerita, Harry Potter and the Sorcerer's Stone, To Kill a Mockingbird, 1984, The Alchemist, The Hobbit, Norwegian Wood.
* **Sampul Buku:** Terhubung langsung ke repositori Open Library menggunakan ISBN/Cover ID terverifikasi.
* **Fallback Data:** `data/products-fallback.json` sebagai mitigasi resiliensi jika jaringan eksternal mengalami kendala (Sesuai Poin E.4 Soal).

---

## Fitur Utama dan Challenge Individual

### 1. Statistik & Analisis Data Wajib (Poin F)
* **Total Buku:** Menghitung jumlah item buku yang sedang aktif ditampilkan.
* **Rata-rata Harga:** Dihitung otomatis menggunakan `Array.prototype.reduce()` dalam format Rupiah.
* **Buku Termahal:** Menemukan buku bernilai nominal tertinggi beserta judulnya.
* **Total Kategori Unik:** Menghitung variasi kategori yang sedang tampil menggunakan kombinasi `Set` dan `Array.prototype.map()`.

### 2. Filter & Sorting Interaktif (Fitur Y)
* **Filter Kategori:** Dropdown filter untuk beralih antara Semua Kategori, Komik, Buku Belajar, dan Novel.
* **Pencarian Real-Time:** Input search bar untuk memfilter judul buku dan nama penulis secara instan.
* **Sorting Produk:** Pengurutan berdasarkan Harga Terendah, Harga Tertinggi, dan Rating Tertinggi menggunakan `Array.prototype.sort()` tanpa memutasi array asli (`[...products]`).

### 3. Challenge Individual (Challenge C = 3)
* Tombol switch tampilan untuk beralih antara **Grid View** (kartu etalase) dan **List View** (tampilan baris lengkap dengan sinopsis buku).
* Preferensi tampilan disimpan di `localStorage` (`katalog_view_mode`), sehingga layout tidak kembali ke awal saat halaman di-refresh.

### 4. Form & Validasi Client-Side (Validasi Z = 2)
* Formulir usulan penambahan buku baru dengan validasi catatan alasan **minimal 30 karakter**.
* Dilengkapi *real-time character counter* interaktif yang berubah menjadi warna hijau tebal saat batas terpenuhi.
* Data usulan tersimpan secara persisten di `localStorage` (`katalog_pengadaan_list`) dan ditampilkan pada tabel riwayat yang aman dari serangan XSS (menggunakan `textContent`).

---

## Cara Menjalankan Project

1. **Menggunakan VS Code Live Server (Direkomendasikan):**
   * Buka folder project di VS Code.
   * Klik kanan pada `index.html` $\rightarrow$ pilih **"Open with Live Server"**.
   * Aplikasi berjalan pada alamat `http://127.0.0.1:5500`.
2. **Menjalankan Unit Test (Node.js):**
   * Jalankan pengujian logika perhitungan dan filter:
   ```bash
   node --test tests/utils.test.js
   ```

---

## Screenshot Tampilan Aplikasi

* **Desktop View:** `screenshots/desktop-grid.png` dan `screenshots/desktop-list.png`
* **Mobile View:** `screenshots/mobile-view.png`

---

## Jawaban 10 Pertanyaan Penjelasan Kode (Komponen 4)

### 1. Alur sejak halaman dibuka sampai data REST API tampil
Ketika dokumen DOM selesai dimuat, event `DOMContentLoaded` memicu `initApp()`:
1. `setViewMode()` membaca preferensi tampilan terakhir dari `localStorage`.
2. `renderProposalHistory()` menampilkan data riwayat usulan dari `localStorage`.
3. `fetchProducts()` menampilkan animasi loading (`DOM.loadingIndicator.hidden = false`).
4. Menggunakan `Promise.all()` untuk membaca dataset buku lokal sekaligus meminta metrik rating/stok terkini dari REST API DummyJSON.
5. Memanggil `applyFilterAndSort()` untuk menerapkan filter, pencarian, sorting, kalkulasi statistik (`updateDashboardStats()`), serta merender kartu buku ke DOM (`renderProducts()`).
6. Di blok `finally`, indikator loading disembunyikan.

### 2. Mengapa setelah fetch() selesai masih perlu memeriksa response.ok?
Fungsi `fetch()` hanya melempar error ke blok `catch` saat terjadi kegagalan jaringan fisik (koneksi terputus total atau DNS gagal). Jika server merespons kode status HTTP error seperti **404 (Not Found)** atau **500 (Internal Server Error)**, `fetch()` tetap menganggap janji (*promise*) terselesaikan (*resolved*).  
Pemeriksaan `if (!response.ok)` wajib dilakukan agar aplikasi segera beralih ke penanganan `catch` dan menampilkan pesan ramah pengguna alih-alih memproses respons yang rusak.

### 3. Bagaimana data JSON diubah menjadi elemen DOM yang terlihat?
Pada fungsi `renderProducts(products)` dan `createBookCard(book)`:
1. Kontainer dibersihkan menggunakan metode modern `DOM.productsList.replaceChildren()`.
2. Setiap objek buku diiterasi untuk membuat elemen kartu `<article class="book-card">` menggunakan `document.createElement('article')`.
3. Properti seperti `title`, `author`, `thumbnail`, `priceIdr`, dan `rating` dirangkai ke dalam template string HTML.
4. Seluruh elemen kartu digabungkan sekaligus ke dalam kontainer utama melalui `DOM.productsList.replaceChildren(...products.map(createBookCard))`.

### 4. Penanganan jika internet terputus, endpoint salah, atau server HTTP 404/500
* **Resiliensi Data:** Jika panggilan ke DummyJSON gagal atau offline, fungsi `fetchLiveRatingAndStock()` menangkap error dan mengembalikan array kosong sehingga aplikasi tetap berjalan memakai dataset lokal.
* **Error State di UI:** Jika pemuatan lokal pun terkendala, blok `catch` akan menampilkan kotak `#error-message` dengan pesan jelas dan menyediakan tombol **"Coba Lagi" (`#btn-retry`)** untuk memanggil ulang `fetchProducts()`.

### 5. Cara kerja fitur berdasarkan digit Y (Filter Data, Sorting, & Statistik Sederhana)
* **Filter Data & Pencarian:** Dropdown kategori (`change`) dan input search (`input`) memicu `applyFilterAndSort()`. Fungsi `filterProducts()` menyaring array berdasarkan kategori dan kecocokan teks judul/penulis menggunakan `Array.prototype.filter()`.
* **Sorting Produk:** Dropdown sort memicu `sortProducts()` yang mengurutkan data berdasarkan harga atau rating via `Array.prototype.sort()` tanpa memutasi data asli.
* **Statistik Sederhana:** Fungsi `calculateStatistics()` menghitung rata-rata harga dan mencari buku termahal menggunakan `.reduce()`, serta menghitung jumlah kategori unik menggunakan `.map()` dan `Set`.

### 6. Cara kerja validasi digit Z (Catatan Min. 30 Karakter) & Alasan input tidak valid dilarang diproses
* **Cara Kerja:** Event `input` pada textarea memantau panjang string `DOM.inputNotes.value.trim().length` dan memperbarui teks counter secara real-time. Saat disubmit, `handleFormSubmit()` memeriksa apakah panjang karakter $\ge 30$. Jika belum, class `.input-invalid` dan pesan kesalahan ditampilkan.
* **Mengapa input tidak valid dilarang diproses:** Untuk menjaga integritas data, mencegah entri kosong atau ambigu pada katalog, serta menghindari celah keamanan injeksi data.

### 7. Penggunaan localStorage pada Project
1. **Preferensi Tampilan (Challenge C):** Key `'katalog_view_mode'` menyimpan string `'grid'` atau `'list'` agar preferensi layout pengguna tetap bertahan saat halaman dimuat ulang.
2. **Riwayat Usulan Buku (Form Z):** Key `'katalog_pengadaan_list'` menyimpan array JSON dari seluruh usulan yang disubmit agar data tersimpan persisten di peramban tanpa database server.

### 8. Potongan Fungsi JavaScript Penting (Maksimal 15 Baris)
Fungsi pengurutan array dari `js/utils.js`:

```javascript
function sortProducts(products, sortBy) {
  const comparators = {
    'price-asc': (a, b) => a.priceIdr - b.priceIdr,
    'price-desc': (a, b) => b.priceIdr - a.priceIdr,
    'rating-desc': (a, b) => b.rating - a.rating
  };
  const copy = [...products];
  return comparators[sortBy] ? copy.sort(comparators[sortBy]) : copy;
}
```
* **Input:** Array of objects `products` dan string kriteria `sortBy`.
* **Proses:** Membuat salinan array `[...products]` agar tidak memutasi data asli, lalu memanggil `.sort()` dengan kamus fungsi pembanding selisih numerik.
* **Output:** Array baru yang telah terurut rapi.

### 9. Bug/Error Paling Sulit Selama Pengerjaan, Penyebab, dan Solusinya
* **Bug/Kendala:** Potensi celah keamanan *Cross-Site Scripting* (XSS) pada perenderan tabel riwayat saat pengguna menginput karakter tag HTML pada judul buku.
* **Penyebab:** Penggunaan properti `innerHTML` pada perakitan baris tabel riwayat yang dapat mengeksekusi tag skrip tak terduga.
* **Solusi:** Merombak fungsi perenderan riwayat menggunakan metode DOM native (`insertRow()`, `insertCell()`) dan menetapkan nilai hanya melalui `textContent` sehingga karakter input diperlakukan sebagai teks biasa.

### 10. Dua Perbaikan Teknis Jika Diberi Waktu Satu Minggu Lagi
1. **Penerapan Debounce pada Fitur Pencarian:** Menambahkan fungsi penundaan eksekusi (*debounce*) 300ms pada event search bar agar mengurangi beban komputasi filter saat pengguna mengetik cepat pada ribuan item.
2. **Penyimpanan IndexedDB dan Ekspor CSV:** Memperluas penyimpanan usulan buku ke basis data *IndexedDB* serta menyediakan tombol ekspor data ke file spreadsheet CSV.

---

## Catatan Penggunaan AI

Penggunaan kecerdasan buatan dalam pengerjaan project ini telah didokumentasikan secara transparan pada berkas [`AI_USAGE_LOG.md`](./AI_USAGE_LOG.md) sesuai dengan kebijakan akademik PTS.
