# AI Usage Log - Mini Project PTS Pemrograman Web

**Nama Mahasiswa** : Ahmad Fauzan Al Ghifari  
**NIM** : 2440304012  
**Mata Kuliah** : Pemrograman Web (26TJ453127)  
**Program Studi** : Teknik Komputer, Universitas Borneo Tarakan  

Dokumen ini disusun sebagai bentuk transparansi dan kepatuhan terhadap **Kebijakan Penggunaan AI (Poin I Dokumen Soal PTS)**. Penggunaan AI dibatasi hanya sebagai teman diskusi konsep, pemecahan kendala (troubleshooting), dan verifikasi logika. Seluruh implementasi kode ditulis, dipahami, dan diuji secara mandiri oleh mahasiswa.

---

| Tanggal | AI / Tool | Tujuan | Prompt / Ringkasan | Bagian Digunakan | Verifikasi / Modifikasi oleh Mahasiswa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **14 Okt 2026** | Antigravity AI | Verifikasi Rumus Variasi NIM | "Cek rumus variasi NIM 2440304012 apakah nilai X, Y, Z dan C sudah sesuai ketentuan modul" | Perencanaan tugas (README) | Menghitung ulang secara manual $S = 0 + 1 + 2 = 3$ dan $C = 3 \pmod 4 = 3$. Memastikan dataset yang digunakan adalah Products dan Challenge adalah Toggle Grid/List. |
| **15 Okt 2026** | Antigravity AI | Konsultasi Konsep CSS Grid & State Toggle | "Bagaimana prinsip CSS Grid yang baik agar layout kartu buku bisa berganti ke baris memanjang (list view) dengan class toggle?" | `styles.css` | Menerapkan struktur CSS Grid mandiri untuk kartu buku, menambahkan styling list view (`.is-list`), serta menguji responsivitasnya pada ukuran layar ponsel (400px). |
| **15 Okt 2026** | Antigravity AI | Diskusi Penanganan Edge Case pada Array Methods | "Contoh penanganan error pada Array.reduce jika array kosong agar tidak terjadi type error" | `js/utils.js` | Menulis fungsi `calculateStatistics()` dengan pengecekan array awal, menghitung nilai rata-rata harga dan mencari buku termahal tanpa library eksternal. |
| **16 Okt 2026** | Antigravity AI | Troubleshooting Keamanan Form DOM | "Mengapa textContent lebih disarankan dibanding innerHTML saat merender input pengguna ke tabel?" | `js/app.js` | Mempelajari risiko celah XSS, kemudian mengubah perenderan riwayat usulan buku agar menggunakan DOM native (`insertRow`, `insertCell`, dan `textContent`). |

---

### Pernyataan Mahasiswa
Dengan ini saya menyatakan bahwa kode yang dihasilkan merupakan hasil pengerjaan mandiri dengan bimbingan konseptual AI seperlunya. Saya memahami seluruh alur logika, struktur DOM, manipulasi array, dan siap mempertanggungjawabkan setiap baris kode dalam video presentasi maupun sesi *code defense* bersama dosen pengampu.
