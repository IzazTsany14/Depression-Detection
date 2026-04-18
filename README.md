# Sistem Deteksi Dini Tingkat Depresi Mahasiswa

## 📋 Deskripsi Sistem

Sistem ini adalah aplikasi web untuk mendeteksi tingkat depresi mahasiswa menggunakan metode **DASS-21 (Depression, Anxiety, and Stress Scale)** dan **Logika Fuzzy** untuk memberikan hasil yang lebih akurat dan personalisasi.

## 🎯 Fitur Utama

### 1. **Tiga Tingkat Akses Pengguna**

#### a. Guest (Tamu)
- Akses tanpa registrasi
- Dapat mengikuti tes DASS-21
- Melihat hasil tes (tidak tersimpan)
- **Tidak ada** riwayat tes
- **Tidak ada** akses panduan personalisasi

#### b. Mahasiswa (Registered User)
- Harus registrasi dan login
- Akses tes DASS-21
- **Riwayat tes tersimpan**
- **Dashboard pribadi** dengan grafik perkembangan
- **Panduan personalisasi** berdasarkan hasil tes
- Akses dokumen referensi penelitian

#### c. Konselor BK (Bimbingan Konseling)
- Login dengan akun khusus BK
- **Interface dengan Sidebar** untuk navigasi mudah
- Melihat **daftar mahasiswa yang memerlukan perhatian**
- Filter berdasarkan tingkat keparahan:
  - Urgent (Sangat Berat)
  - Prioritas Tinggi (Berat)
  - Semua Kasus
- **Detail mahasiswa** dengan:
  - Info lengkap (NPM, Fakultas, Prodi, Semester)
  - Grafik riwayat skor tes
  - Trend perkembangan (improving/worsening/new)
  - Rekomendasi tindakan
- Aksi cepat untuk hubungi mahasiswa
- **✨ FITUR BARU: Rekam Medis Konsultasi**
  - Form lengkap untuk input data konsultasi mahasiswa
  - Menyimpan riwayat konsultasi dengan detail:
    - Data mahasiswa (nama, NPM, fakultas, prodi, semester, kontak)
    - Data konsultasi (tanggal, jenis, gejala, diagnosis)
    - Tingkat depresi hasil asesmen
    - Intervensi yang diberikan
    - Rekomendasi tindak lanjut
    - Jadwal follow-up
    - Catatan konselor
  - **Download otomatis ke PDF** dengan format profesional
  - Daftar rekam medis yang telah dibuat
  - Detail view untuk setiap rekam medis
  - Hapus rekam medis jika diperlukan
  - Data tersimpan di localStorage

#### d. Admin
- Login dengan akun admin
- **Interface dengan Sidebar** untuk navigasi mudah
- **Dashboard statistik lengkap**:
  - Total mahasiswa, tes, konselor BK
  - Kasus kritis yang memerlukan perhatian
  - Grafik distribusi tingkat depresi (bar chart & pie chart)
  - Trend tes bulanan (line chart)
  - Distribusi mahasiswa per fakultas
  - Aktivitas terbaru (10 tes terakhir)

## 🎨 Desain & Tema

### Palet Warna
- **Biru Tenang:** `#4A90E2`, `#E6F0FA` - untuk elemen utama
- **Hijau Mint:** `#28A745`, `#D4EDDA` - untuk status normal/positif
- **Lavender:** `#6F4E7C`, `#E6E6FA` - untuk aksen
- **Orange:** `#FF9800` - untuk warning/perhatian
- **Red:** `#F44336` - untuk kondisi berat
- **Purple:** `#9C27B0` - untuk kondisi sangat berat

### Prinsip Desain
- **Bersih & Minimalis**
- **Menenangkan** (tidak agresif)
- **Profesional** namun approachable
- **Responsive** (mobile-friendly)

## 🔢 Metode Perhitungan

### DASS-21 Scoring
Sistem menggunakan 21 pertanyaan dengan skala 0-3:
- 0: Tidak pernah
- 1: Kadang-kadang
- 2: Sering
- 3: Sangat sering

### Tingkat Depresi
Berdasarkan total skor:
- **Normal:** 0-9
- **Ringan:** 10-20
- **Sedang:** 21-27
- **Berat:** 28-55
- **Sangat Berat:** >55

### Fuzzy Logic
Sistem menggunakan fuzzy logic untuk:
- Memberikan nilai kontinu (fuzzy score 0-1)
- Menangani borderline cases dengan lebih baik
- Memberikan interpretasi yang lebih nuansa

## 📱 Halaman dalam Sistem

1. **Beranda** (`/`) - Landing page dengan informasi sistem
2. **Registrasi** (`/registration`) - Daftar akun mahasiswa
3. **Login** (`/login`) - Masuk ke sistem (semua role)
4. **Kuesioner DASS-21** (`/questionnaire`) - Tes depresi
5. **Hasil Guest** (`/result/guest`) - Hasil untuk tamu
6. **Hasil Registered** (`/result/registered`) - Hasil untuk mahasiswa
7. **Dashboard Mahasiswa** (`/dashboard`) - Dashboard pribadi mahasiswa
8. **Panduan** (`/guide`) - Panduan mengatasi depresi + PDF referensi
9. **Dashboard Admin** (`/admin`) - Dashboard untuk admin
10. **Dashboard BK** (`/bk`) - Dashboard untuk konselor BK
11. **Tentang DASS-21** (`/about`) - Informasi tentang metode

## 🚀 Cara Menggunakan Sistem

### Sebagai Mahasiswa
1. Klik "Daftar" atau "Login"
2. Isi data registrasi (jika baru)
3. Klik "Mulai Tes" di dashboard
4. Jawab 21 pertanyaan DASS-21
5. Lihat hasil dan rekomendasi
6. Akses panduan personalisasi
7. Lihat grafik perkembangan di dashboard

### Sebagai Konselor BK
1. Login dengan akun BK
2. Dashboard menampilkan mahasiswa yang perlu perhatian
3. Filter berdasarkan keparahan (Urgent/High/All)
4. Klik "Lihat Detail" pada mahasiswa
5. Lihat riwayat tes, trend, dan rekomendasi
6. Gunakan tombol "Hubungi" atau "Email"
7. **✨ Kelola Rekam Medis:**
   - Klik tab "Rekam Medis" di navigasi atas
   - Klik "Tambah Rekam Medis" untuk membuat rekam medis baru
   - Isi form dengan lengkap:
     - Data mahasiswa (nama, NPM, kontak)
     - Data konsultasi (tanggal, jenis, gejala, diagnosis)
     - Tingkat depresi hasil asesmen
     - Intervensi dan rekomendasi
     - Jadwal follow-up
     - Catatan konselor
   - Klik "Simpan Rekam Medis" untuk menyimpan
   - Data otomatis tersimpan dan dapat diunduh sebagai PDF
   - Gunakan "Unduh PDF" untuk mendapatkan file rekam medis
   - Gunakan "Lihat Detail" untuk melihat rekam medis lengkap
   - Gunakan tombol hapus untuk menghapus rekam medis (dengan konfirmasi)

### Sebagai Admin
1. Login dengan akun admin
2. Lihat statistik keseluruhan sistem
3. Monitor distribusi tingkat depresi
4. Analisis trend bulanan
5. Lihat aktivitas terbaru

## 📚 Teknologi yang Digunakan

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Charts:** Recharts
- **PDF Viewer:** react-pdf
- **PDF Generator:** jsPDF (untuk rekam medis)
- **UI Components:** Radix UI (shadcn/ui)
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)
- **Data Storage:** LocalStorage (untuk demo)

## 📖 Referensi Penelitian

Dokumen PDF penelitian dapat diakses melalui:
- **Halaman Panduan** → Tab "Referensi"
- File: `2024K_Kelompok_8.pdf`

## 🎓 Catatan Penting

1. **Data Dummy:** Sistem saat ini menggunakan data dummy di localStorage untuk demonstrasi. Dalam implementasi real, gunakan backend dan database yang proper.

2. **Keamanan:** Password tersimpan plain text untuk demo. Implementasi real harus menggunakan hashing (bcrypt, dll).

3. **Privasi:** Dalam implementasi real, pastikan data mahasiswa terenkripsi dan mematuhi regulasi privasi (GDPR, UU PDP, dll).

4. **Validitas Klinis:** Sistem ini adalah alat skrining, **BUKAN diagnosis klinis**. Selalu rujuk ke profesional kesehatan mental untuk assessment lengkap.

5. **Hotline Krisis:** Sistem menyediakan informasi hotline krisis 24/7 untuk kondisi darurat.

## 👥 Tim Pengembang

**Kelompok 8 - 2024K**

---