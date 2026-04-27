<div align='center'>
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=600&size=38&pause=1000&color=0B84F3&center=true&vCenter=true&width=800&height=70&lines=MindCheck;Sistem+Deteksi+Dini+Tingkat+Depresi;Logika+Fuzzy+%2B+Instrumen+DASS-21" alt="Typing SVG" />
  </a>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2FNext.js-61DAFB?style=for-the-badge&logo=react" alt="React Badge">
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript Badge">
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css" alt="Tailwind Badge">
  <img src="https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django" alt="Django Badge">
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql" alt="MySQL Badge">
</p>

---

## 🌐 Tentang Proyek

**MindCheck** adalah platform berbasis web yang dikembangkan untuk mendeteksi tingkat depresi secara dini pada mahasiswa, khususnya di lingkungan **Universitas Negeri Surabaya (UNESA)**. 

Sistem ini mengintegrasikan instrumen psikometrik **DASS-21** (Depression Anxiety Stress Scale-21) dengan **Logika Fuzzy** sebagai inti penalaran untuk menangani subjektivitas dan ketidakpastian jawaban pengguna. 

**Disclaimer**: Proyek ini merupakan instrumen skrining awal dan tidak menggantikan diagnosis klinis dari tenaga profesional (psikolog/psikiater).

---

## ⚙️ Fitur Utama

✅ **Asesmen DASS-21**: 21 pertanyaan tervalidasi dengan skala Likert 0-3.
🧠 **Fuzzy Inference Engine**: Komputasi sisi klien menggunakan metode *Mamdani* (Fuzzifikasi, 125 Aturan, Defuzzifikasi CoA).
📊 **Dashboard Personalisasi**: Statistik riwayat tes, tren kondisi mental, dan ringkasan aktivitas.
📑 **Laporan PDF**: Unduhan hasil skrining resmi untuk keperluan dokumentasi atau rujukan.
🚨 **Protokol Darurat**: Notifikasi otomatis dengan kontak bantuan (119 ext 8 & BK UNESA) untuk kategori hasil "Parah" dan "Sangat Parah".
🛡️ **Keamanan & Privasi**: Pengolahan data jawaban di sisi klien (*client-side*) dan enkripsi password.

---

## 🧩 Teknologi yang Digunakan

| Komponen | Teknologi |
|-----------|------------|
| **Frontend** | React, Next.js, TypeScript, Tailwind CSS, Shadcn/UI |
| **Logic Engine** |JavaScript (Fuzzy Logic Implementation) |
| **Backend** | Python (Django Framework)  |
| **Database** | MySQL (Main DB) & Redis (Caching) |
| **UI/UX** | Figma (Design System)  |

---

## 🧑‍💻 Tim Kontributor (Kelompok 8 - 2024K)

Berdasarkan dokumen SRS **Sistem Deteksi Dini Tingkat Depresi Mahasiswa**:

| Nama | NIM | Peran |
| ------- | -------- | ------- |
| **[Izaz Tsany Rismawan](https://github.com/IzazTsany14)** | 25051204355 | Fullstack Developer / Lead |
| **[Lufita Setiati](https://github.com/lupitaaasetia)** | 25051204304 | System Analyst / Documentation |
| **[Fearda Agnessiya Putri Dardiri](https://github.com/feardaa)** | 25051204332 | UI/UX Designer / Researcher |

**Dosen Pengampu**: Saifudin Yahya, S.Kom., M.T.I.

---

## 🚀 Status Proyek

🟢 **Phase: Implementation & Testing** Sistem saat ini sedang dalam tahap integrasi modul logika fuzzy dan validasi konten klinis oleh Unit BK UNESA.

---

## 🛠️ Setup Project (Frontend)

Pastikan Anda memiliki Node.js terinstal di perangkat Anda.

```bash
# Clone repositori
git clone https://github.com/IzazTsany14/Depression-Detection.git


# Install dependensi (menggunakan npm atau yarn)
npm install

# Jalankan server pengembangan
npm run dev
