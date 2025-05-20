# ARevents – Mini Project Fullstack Web App 🎯

ARevents adalah platform manajemen event berbasis web yang dikembangkan dalam rangka mini project fullstack web development. Platform ini mendukung peran **Customer** dan **Organizer**, serta menyediakan sistem transaksi, referral, profil, dan dashboard berbasis role.

---

## 🔖 Pembagian Fitur (Sesuai Dokumen Mini Project.pdf)

### 🟦 Feature 1 – Umum / Customer Experience
- Landing page dengan daftar event
- Pencarian event (dengan debounce)
- Halaman detail event
- Transaksi event (voucher, poin, upload bukti bayar)
- Review & rating setelah hadir di event

### 🟩 Feature 2 – User System & Organizer Dashboard
- Registrasi & login (dengan kode referral opsional)
- Role-based system: Customer dan Organizer
- Halaman profil (edit nama, upload foto)
- Organizer dashboard: kelola event, peserta, transaksi
- Notifikasi toast + proteksi halaman via middleware

---

## 💡 Tech Stack

| Layer       | Teknologi                           |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript |
| Styling     | Tailwind CSS                        |
| State Mgmt  | Redux Toolkit                       |
| Form        | React Hook Form + Zod               |
| Auth        | JWT (cookie-based), middleware      |
| Upload      | Cloudinary (foto profil/event)      |
| API Client  | Axios                               |

---

## 🚀 Fitur Lengkap

### 👤 Customer
- Register/login
- Akses daftar & detail event
- Beli tiket dan bayar (dengan poin/voucher)
- Review dan rating
- Edit profil pribadi

### 🧑‍💼 Organizer
- Login ke dashboard organizer
- Buat event (dengan gambar), edit, dan hapus
- Melihat daftar transaksi event
- Lihat peserta (attendees)
- Edit profil penyelenggara

---

## 📦 Cara Menjalankan Project

```bash
# 1. Clone repo frontend
git clone https://github.com/adlinoor/miniproject-web.git
cd miniproject-web
npm install

# 2. Setup environment
# Isi URL backend sesuai environment Anda
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 3. Jalankan development server
npm run dev
```

---

## 🌐 Demo & Backend

- Frontend: [https://miniproject-web.vercel.app](https://miniproject-web.vercel.app)
- Backend Repo: [https://github.com/adlinoor/miniproject-api](https://github.com/adlinoor/miniproject-api)

---

## 📂 Struktur Folder Frontend

```
src/
├── app/                # Routing (Next.js App Router)
├── components/         # Komponen UI, form, guards
├── lib/redux/          # Auth state (authSlice)
├── services/           # Panggilan API (event, dashboard)
├── interfaces/         # Interface user dan role
├── types/              # Type objek event, transaksi
├── hooks/              # Custom hook pencarian
├── middleware.ts       # Proteksi halaman via role
```

---

## 🔐 Silahkan Register/Login Akun Dummy (untuk testing)

| Role      | Email               | Password |
|-----------|---------------------|----------|
| Customer  | customer@mail.com   | 12345678 |
| Organizer | organizer@mail.com  | 12345678 |

---

## 🧪 Testing Manual

- Validasi form via Zod (di halaman register, login, event form)
- Middleware Next.js: blokir akses halaman yang tidak sesuai role
- Protected route juga divalidasi via Redux + cookie

---

## 🎥 Presentasi

Demo aplikasi direkam bersama tim, menampilkan:
- Login Customer dan Organizer
- Alur pembelian tiket
- Dashboard Organizer (buat event, kelola transaksi)
- Validasi akses halaman & proteksi berdasarkan role

---


