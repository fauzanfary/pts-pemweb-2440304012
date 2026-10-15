# Mini Project PTS: KatalogBuku Store (Gramedia Style)

Dokumentasi resmi Mini Project Penilaian Tengah Semester (PTS) Mata Kuliah **Pemrograman Web (26TJ453127)**, Program Studi Teknik Komputer, Fakultas Teknik, Universitas Borneo Tarakan.

---

## 1. Identitas Mahasiswa
* **Nama Lengkap** : Ahmad Fauzan Al Ghifari
* **NIM / NPM** : 2440304012
* **Semester / Kelas** : 5 / Teknik Komputer
* **Dosen Pengampu** : Pengampu Pemrograman Web UBT

---

## 2. Nama Aplikasi dan Deskripsi Singkat
* **Nama Aplikasi** : **KatalogBuku**
* **Deskripsi** :  
  *KatalogBuku* adalah aplikasi *Interactive Data Dashboard & E-Commerce Catalog* berbasis web murni (HTML5 semantic, CSS3 modern, dan Vanilla JavaScript ES6+) yang mengusung antarmuka modern ala toko buku **Gramedia.com**. Aplikasi ini menyajikan 30 koleksi buku terkurasi dari 3 kategori utama (Komik, Buku Belajar, dan Novel), menghitung analisis statistik harga secara dinamis, menyediakan filter kategori dan pencarian instan, pengurutan produk, penyimpanan preferensi layout Grid/List di `localStorage`, serta form usulan buku tervalidasi dengan catatan kebutuhan minimal 30 karakter.

---

## 3. Perhitungan Variasi Soal Berdasarkan NIM
Tiga digit terakhir NIM adalah **012**, maka:
* **$X = 0$**
* **$Y = 1$**
* **$Z = 2$**

### Hasil Penentuan Komponen:
1. **Dataset ($X = 0$)**: **Products** (`https://dummyjson.com/products`) dengan tema **Dashboard Produk / Katalog Toko Buku**.
2. **Fitur Utama ($Y = 1$)**: **Filter Data + Statistik Sederhana + Sorting (`.sort()`)**.
3. **Form & Validasi ($Z = 2$)**: Validasi tambahan berupa **Catatan Usulan Buku minimal 30 karakter** dengan tabel riwayat usulan tersimpan.
4. **Challenge ($C$)**:
   $$\text{Hitung } S = X + Y + Z = 0 + 1 + 2 = 3$$
   $$C = S \pmod 4 = 3 \pmod 4 = 3$$
   * **Challenge $C = 3$**: **Toggle Grid/List; pilihan pengguna disimpan pada `localStorage`**.

---

## 4. Dataset dan REST API yang Digunakan
* **Penyedia REST API** : DummyJSON Products API
* **Endpoint Utama** : `https://dummyjson.com/products?limit=30&select=rating,stock`
* **Metode HTTP** : `GET`
* **Format Data** : JSON
* **Mata Uang & Format** : Dikonversi ke **Rupiah (Rp)** dengan standar Indonesia (`Intl.NumberFormat('id-ID')`).
* **Koleksi Produk Terkurasi (Tepat 10 Produk per Kategori = 30 Produk)**:
  1. *Komik* (10 Item): Dragon Ball Vol. 1, Attack on Titan Vol. 1, Demon Slayer Vol. 1, Jujutsu Kaisen Vol. 1, My Hero Academia Vol. 1, Spy x Family Vol. 1, Haikyu!! Vol. 1, Chainsaw Man Vol. 1, Death Note Vol. 1, One-Punch Man Vol. 1.
  2. *Buku Belajar* (10 Item): Clean Code, The Pragmatic Programmer, Eloquent JavaScript, Introduction to Algorithms, Head First Java, Python Crash Course, A Brief History of Time, Automate the Boring Stuff with Python, JavaScript: The Good Parts, Grokking Algorithms.
  3. *Novel* (10 Item): Bumi Manusia, Cantik Itu Luka, Laskar Pelangi, Laut Bercerita, Harry Potter and the Sorcerer's Stone, To Kill a Mockingbird, 1984, The Alchemist, The Hobbit, Norwegian Wood.
* **Integrasi Data Nyata**: Data rating dan stok disinkronkan secara live melalui REST API DummyJSON. Gambar sampul buku terhubung ke repositori Open Library melalui ISBN/Cover ID valid.
* **Fallback Data** : `data/products-fallback.json` (sebagai mitigasi gangguan jaringan eksternal sesuai Poin E.4 Soal).

---

## 5. Fitur Utama dan Challenge Individual
1. **Statistik & Analisis Data Wajib (Soal Poin F)**:
   * **Total Buku**: Jumlah buku aktif yang sedang tampil.
   * **Rata-rata Harga**: Dihitung otomatis menggunakan `Array.prototype.reduce()` dalam format Rupiah.
   * **Buku Termahal**: Identifikasi buku dengan nilai nominal tertinggi beserta judulnya.
   * **Total Kategori**: Jumlah kategori unik dari data yang aktif menggunakan `Set` dan `.map()`.
2. **Filter & Sorting Interaktif (Fitur Y & Array Method `.sort()`)**:
   * Dropdown kategori ala Gramedia (Semua Kategori, Komik, Buku Belajar, Novel).
   * Fitur Search bar real-time untuk mencari judul buku atau nama penulis.
   * Dropdown pengurutan produk: *Urutan Rekomendasi*, *Harga Terendah*, *Harga Tertinggi*, dan *Rating Tertinggi* menggunakan `Array.prototype.sort()`.
3. **Challenge Individual (Challenge C = 3)**:
   * Tombol *Toggle View* untuk beralih antara tampilan **Grid View** (tampilan kartu ala etalase toko buku) dan **List View** (tampilan baris horizontal terperinci).
   * Status preferensi tampilan disimpan dalam `localStorage` (`katalog_view_mode`), sehingga saat browser dimuat ulang (*refresh*), tata letak tidak kembali ke awal.
4. **Form & Validasi Client-Side (Validasi Z = 2) + Riwayat Tersimpan**:
   * Formulir pengajuan usulan buku baru dengan aturan wajib: **Catatan alasan kebutuhan minimal 30 karakter**.
   * Indikator penghitung karakter (*character counter*) interaktif yang berubah menjadi warna hijau tebal saat batas minimal 30 karakter terpenuhi.
   * Pesan kesalahan informatif pada setiap field yang belum valid.
   * **Tabel Riwayat Usulan Buku**: Data yang berhasil disubmit disanitasi secara aman (mencegah XSS) dan disimpan secara persisten di `localStorage` (`katalog_pengadaan_list`).

---

## 6. Cara Menjalankan Project
Project dibangun murni menggunakan teknologi front-end standar (HTML5, CSS3, Vanilla JS):
1. **Cara 1 (Menggunakan VS Code Live Server / Local Dev Server - Sangat Direkomendasikan)**:
   * Buka folder project di VS Code.
   * Klik kanan pada `index.html` $\rightarrow$ pilih **"Open with Live Server"** (atau jalankan `npx http-server -p 5500`).
   * Aplikasi akan otomatis berjalan di `http://127.0.0.1:5500`.
   *(Catatan: Menjalankan lewat server lokal diperlukan agar browser mengizinkan pemanggilan REST API dan pembacaan berkas JSON lokal tanpa blokade CORS)*.
2. **Menjalankan Unit Test Logika (Node.js)**:
   * Buka terminal di folder project, lalu jalankan:
   ```bash
   node --test tests/utils.test.js
   ```

---

## 7. Screenshot Tampilan Aplikasi
*(File screenshot pengujian dapat disimpan di folder `screenshots/`)*
* **Desktop View (>= 1024px)**: `screenshots/desktop-grid.png` dan `screenshots/desktop-list.png`
* **Mobile View (<= 480px)**: `screenshots/mobile-view.png`

---

## 8. Endpoint REST API
* `GET https://dummyjson.com/products?limit=30&select=rating,stock`
* Format Data Respon: JSON

---

## 9. Jawaban 10 Pertanyaan Penjelasan Kode (Komponen 4)

### 1. Alur sejak halaman dibuka sampai data REST API tampil
Ketika browser selesai mem-parsing dokumen DOM, event `DOMContentLoaded` memicu fungsi `initApp()`. Pada fungsi tersebut:
1. `setViewMode(getStorage(STORAGE_KEY_VIEW, 'grid'))` dieksekusi untuk membaca preferensi layout terakhir dari `localStorage`.
2. Dipanggil fungsi `renderProposalHistory()` untuk menampilkan riwayat usulan buku yang tersimpan di `localStorage`.
3. Dipanggil fungsi asynchronous `fetchProducts()`.
4. `fetchProducts()` menampilkan animasi pemuatan melalui `DOM.loadingIndicator.hidden = false`.
5. Melakukan panggilan konkuren dengan `Promise.all()` untuk membaca data buku lokal (`fetch(LOCAL_DATA_URL)`) dan menyinkronkan metrik rating/stok terkini dari REST API DummyJSON (`fetch(API_URL)`).
6. Data digabungkan ke dalam `appState.allProducts`.
7. Dipanggil `applyFilterAndSort()` untuk menerapkan filter kategori, query pencarian, pengurutan data, menghitung statistik (`updateDashboardStats()`), dan merender elemen kartu buku ke DOM (`renderProducts()`).
8. Pada blok `finally`, indikator loading disembunyikan (`DOM.loadingIndicator.hidden = true`).

---

### 2. Mengapa setelah `fetch()` selesai masih perlu memeriksa `response.ok`?
Fungsi `fetch()` hanya akan melempar *rejection* ke blok `catch` apabila terjadi kegagalan jaringan fisik (misalnya offline total atau kesalahan DNS). Apabila server merespons dengan kode status kegagalan HTTP seperti **404 (Not Found)** atau **500 (Internal Server Error)**, `fetch()` tetap menganggap janji (*promise*) tersebut *resolved* dengan nilai properti `response.ok = false`.  
Oleh karena itu, pada kode program terdapat validasi eksplisit:
```javascript
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
```
Pemeriksaan `response.ok` wajib dilakukan agar aplikasi segera mengalihkan eksekusi ke blok penanganan error (`catch`) dan menampilkan status error yang ramah pengguna, bukan berusaha mengurai (*parse*) bodi respons yang rusak atau kosong.

---

### 3. Bagaimana data JSON diubah menjadi elemen DOM yang terlihat?
Pada fungsi `renderProducts(products)` dan `createBookCard(book)`:
1. Kontainer dibersihkan terlebih dahulu menggunakan metode modern `DOM.productsList.replaceChildren()`.
2. Setiap objek buku diiterasi menggunakan fungsi pembantu `createBookCard(book)` yang membuat elemen `<article class="book-card">` via `document.createElement('article')`.
3. Data properti buku seperti `title`, `author`, `thumbnail`, `priceIdr`, `originalPriceIdr`, diskon, dan `rating` dirangkai menjadi struktur kartu menggunakan template literals HTML.
4. Dipasang event listener `error` pada elemen gambar untuk mengaktifkan fallback visual teks judul buku jika gambar sampul jaringan mengalami kendala pemuatan.
5. Seluruh elemen kartu ditambahkan sekaligus ke dalam kontainer utama melalui `DOM.productsList.replaceChildren(...products.map(createBookCard))`.

---

### 4. Penanganan jika internet terputus, endpoint salah, atau server HTTP 404/500
Aplikasi menerapkan penanganan berjenjang yang tangguh:
1. **Pemisahan Sumber Data Resilient**: Jika pemanggilan REST API ke `DummyJSON` gagal atau offline, blok `fetchLiveRatingAndStock()` menangkap error dan mengembalikan array kosong sehingga aplikasi tetap dapat berjalan stabil menggunakan dataset cadangan lokal.
2. **Error State Komprehensif**: Jika pemuatan dataset lokal pun mengalami kendala (misal dibuka langsung via `file://` tanpa server lokal), blok `catch` pada `fetchProducts()` akan:
   * Menyembunyikan daftar produk yang kosong.
   * Menampilkan elemen pesan error (`#error-message`) dengan teks kendala yang informatif.
   * Menyediakan tombol **"Coba Lagi" (`#btn-retry`)** yang memungkinkan pengguna memanggil ulang fungsi `fetchProducts()` tanpa harus menyegarkan halaman.

---

### 5. Cara kerja fitur berdasarkan digit Y (Filter Data, Sorting, & Statistik Sederhana)
* **Filter Data & Pencarian**:
  * Elemen dropdown `<select id="category-filter">` dan `<input id="search-input">` masing-masing dipasangi event listener `change` dan `input` yang memanggil `applyFilterAndSort()`.
  * Fungsi murni `filterProducts()` menyaring array berdasarkan kesesuaian kategori dan kecocokan kata kunci pada judul maupun nama penulis menggunakan `Array.prototype.filter()`.
* **Pengurutan (Sorting)**:
  * Dropdown `<select id="sort-by">` memicu fungsi `sortProducts()` yang mengimplementasikan `Array.prototype.sort()` tanpa memutasi array asli (`[...products]`) untuk kategori harga termurah, termahal, maupun rating tertinggi.
* **Statistik Sederhana**:
  * Setiap kali data hasil filter dan sorting diperbarui, fungsi `updateDashboardStats()` memanggil `calculateStatistics()`.
  * Logika menggunakan `Array.prototype.reduce()` untuk menghitung rata-rata harga dan mencari produk berharga tertinggi, serta kombinasi `Array.prototype.map()` dan `Set` untuk menghitung variasi kategori unik yang sedang aktif.

---

### 6. Cara kerja validasi digit Z (Catatan Min. 30 Karakter) & Alasan input tidak valid dilarang diproses
* **Cara Kerja**:
  * Form menggunakan atribut `novalidate` agar penanganan validasi ditangani sepenuhnya secara seragam oleh JavaScript.
  * Event listener `input` pada textarea memantau panjang karakter `DOM.inputNotes.value.trim().length` dan memperbarui teks counter secara real-time. Jika panjang $\ge 30$, counter berubah warna menjadi hijau tebal.
  * Saat submit, fungsi `handleFormSubmit(event)` memanggil `event.preventDefault()`. Nilai catatan diuji: jika kurang dari 30 karakter, field diberi class `.input-invalid` dan pesan kesalahan ditampilkan pada elemen error di bawah textarea.
  * Jika seluruh input valid, objek usulan disimpan ke `localStorage` dan dimasukkan ke tabel riwayat.
* **Mengapa input tidak valid dilarang diproses?**
  * Memproses input yang tidak valid akan merusak integritas data, menghasilkan entri kosong/tidak bermakna pada sistem katalog, dan berpotensi menimbulkan celah injeksi keamanan. Validasi client-side memberikan umpan balik langsung kepada pengguna agar data yang masuk ke sistem selalu bersih dan sesuai spesifikasi.

---

### 7. Penggunaan `localStorage` pada Project
Aplikasi memanfaatkan `localStorage` pada dua fitur esensial:
1. **Preferensi Tampilan (Challenge C = 3)**:
   * **Key**: `'katalog_view_mode'` bernilai `'grid'` atau `'list'`.
   * **Waktu Baca/Ubah**: Dibaca saat inisialisasi awal (`initApp()`) dan diperbarui saat pengguna menekan tombol Grid/List View (`setViewMode()`).
   * **Alasan**: Menjaga kenyamanan pengguna agar preferensi tata letak tetap tersimpan saat pengguna kembali membuka atau me-refresh halaman.
2. **Riwayat Usulan Buku (Form Z = 2)**:
   * **Key**: `'katalog_pengadaan_list'` berisi array JSON dari usulan buku yang pernah diajukan.
   * **Waktu Baca/Ubah**: Dibaca saat halaman dibuka (`loadProposals()`) dan diperbarui setiap kali form disubmit atau tombol hapus riwayat ditekan.
   * **Alasan**: Menyediakan rekaman data persisten di sisi klien tanpa ketergantungan pada basis data server eksternal.

---

### 8. Potongan Fungsi JavaScript Penting (Maksimal 15 Baris)
Potongan fungsi pengurutan dari [js/utils.js](file:///d:/KULIAH/TUGAS%20PERKULIAHAN/SEMESTER%205/PROGRAMAN%20WEB/PTS/js/utils.js):

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
* **Input** : Array of objects `products` dan string kriteria pengurutan `sortBy`.
* **Proses** : Membuat salinan dangkal array `[...products]` agar tidak terjadi mutasi data asli, lalu memanggil method `.sort()` menggunakan dictionary fungsi pembanding berdasarkan selisih numerik harga atau rating.
* **Output** : Array baru yang telah terurut rapi sesuai opsi pengguna.

---

### 9. Bug/Error Paling Sulit Selama Pengerjaan, Penyebab, dan Solusinya
* **Bug/Kendala** : Penanganan kerentanan Cross-Site Scripting (XSS) pada perenderan tabel riwayat usulan buku saat pengguna menginput karakter tanda kurung siku dan tag HTML.
* **Penyebab** : Penggunaan properti `innerHTML` pada perakitan baris tabel riwayat yang secara otomatis mem-parsing string input pengguna menjadi elemen DOM HTML aktif.
* **Cara Menemukan** : Melakukan pengujian keamanan form dengan memasukkan string payload `<img src=x onerror=alert(1)>` pada judul buku.
* **Solusi** : Merombak fungsi `renderProposalHistory()` agar membuat baris dan sel tabel menggunakan metode DOM native (`insertRow()`, `insertCell()`) dan menetapkan nilai hanya melalui properti `textContent` yang secara inheren memperlakukan seluruh karakter sebagai teks biasa yang aman.

---

### 10. Dua Perbaikan Teknis Jika Diberi Waktu Satu Minggu Lagi
1. **Implementasi Debounce Helper pada Input Pencarian**:
   * Menambahkan fungsi penundaan eksekusi (*debounce*) sekitar 250-300ms pada event pencarian judul/penulis guna menghemat siklus komputasi perenderan DOM saat pengguna mengetik secara cepat pada dataset berjumlah ribuan.
2. **Penyimpanan Usulan ke IndexedDB dengan Fitur Ekspor CSV**:
   * Mengembangkan penyimpanan usulan buku dari `localStorage` ke `IndexedDB` agar mampu menampung kapasitas data yang jauh lebih besar dan menambahkan fitur unduh daftar usulan dalam format spreadsheet CSV.

---

## 10. Catatan Penggunaan AI
Penggunaan kecerdasan buatan dalam pengerjaan project ini telah didokumentasikan secara transparan pada berkas [`AI_USAGE_LOG.md`](./AI_USAGE_LOG.md) sesuai dengan kebijakan akademik PTS.
#   p t s - p e m w e b - 2 4 4 0 3 0 4 0 1 2  
 