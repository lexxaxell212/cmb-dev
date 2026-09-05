# api-coffee — Egi-Coffee REST API

Backend REST API untuk situs Egi-Coffee. Dibangun dengan **Express + MongoDB (Mongoose)**, berjalan di **port 3001**.

## Struktur

```
api-coffee/
├── src/
│   ├── server.js        # entry point (load .env, connect DB, listen)
│   ├── app.js           # konfigurasi express, cors, token, routes
│   ├── db.js            # koneksi MongoDB
│   ├── seed.js          # impor data awal dari src/data/*.json
│   ├── models/          # Product, News, Setting (Mongoose)
│   ├── routes/          # products, news, settings (CRUD)
│   └── data/            # salinan data awal (dari proyek web)
├── .env.example         # contoh konfigurasi
└── package.json
```

## Persiapan

```bash
cd api-coffee
cp .env.example .env    # lalu isi MONGO_URI dengan koneksi MongoDB kamu
npm install
```

## Jalankan

```bash
npm start        # mode production
npm run dev      # mode development (auto-restart)
npm run seed     # isi data awal (produk, berita, pengaturan) ke MongoDB
```

## Variabel environment (.env)

| Var          | Default                                  | Keterangan                                  |
| ------------ | ---------------------------------------- | ------------------------------------------- |
| `PORT`       | `3001`                                   | Port server                                 |
| `HOST`       | `127.0.0.1`                              | Binding host (arahkan ke localhost saja + Nginx reverse proxy) |
| `MONGO_URI`  | `mongodb://127.0.0.1:27017/egycoffee`    | Koneksi MongoDB                             |
| `JWT_SECRET` | (wajib diisi)                            | Rahasia tanda tangan token JWT (`openssl rand -hex 32`) |
| `JWT_EXPIRES_IN` | `2h`                                 | Masa berlaku token login (mis. `8h`, `1d`)  |
| `ADMIN_USERNAME` | `admin`                              | Username admin pertama (dibuat otomatis saat boot) |
| `ADMIN_PASSWORD` | (wajib diisi)                          | Password admin pertama (min. 8 karakter)    |
| `CORS_ORIGIN`| `*`                                      | Origin yang diizinkan (pisahkan dengan koma) |

## Endpoint

Semua endpoint di bawah `/api` (kecuali `/api/health` dan `/api/auth/login`) wajib menyertakan header `Authorization: Bearer <token>` — **kecuali untuk `GET` pada `/api/products`, `/api/news`, `/api/settings` yang bersifat publik** (dibaca situs web tanpa token). Hanya operasi tulis (POST/PUT/DELETE) yang perlu login.

| Method | Endpoint             | Keterangan                              |
| ------ | -------------------- | --------------------------------------- |
| GET    | `/api/health`        | Cek status server                       |
| POST   | `/api/auth/login`    | Login admin → token JWT (rate-limited)  |
| GET    | `/api/products`      | Daftar produk                           |
| POST   | `/api/products`      | Tambah produk (id otomatis dari nama bila kosong) |
| PUT    | `/api/products/:id`  | Update produk (`id` = field `id`)       |
| DELETE | `/api/products/:id`  | Hapus produk                            |
| GET    | `/api/news`          | Daftar berita                           |
| POST   | `/api/news`          | Tambah berita                           |
| PUT    | `/api/news/:id`      | Update berita                           |
| DELETE | `/api/news/:id`      | Hapus berita                            |
| GET    | `/api/settings`      | Data kontak, alamat, jam buka           |
| PUT    | `/api/settings`      | Perbarui data kontak & jam buka         |

### Autentikasi (cara kerja & cara buat admin)

Admin disimpan di MongoDB dalam koleksi `admins` — **tapi Anda tidak perlu mengedit MongoDB secara manual**:

1. **Bootstrap dari .env (otomatis):** isi `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di `.env`, lalu jalankan server. Saat pertama kali menyala, server otomatis membuat admin tersebut (password di-hash bcrypt). Tidak dibuat ulang jika username sudah ada.
2. **Tambah admin via CLI:** jalankan di server produksi:
   ```bash
   npm run add-admin -- nama-admin password-kamu
   ```
3. Login: `POST /api/auth/login` dengan `{ "username": "...", "password": "..." }` → dapat token JWT. Token berlaku sesuai `JWT_EXPIRES_IN` (default 2 jam).
4. Setiap request CRUD wajib kirim header: `Authorization: Bearer <token>`. Login dibatasi 10 percobaan per 15 menit per IP.

> Perlu diingat: **jangan pernah commit `JWT_SECRET` atau `ADMIN_PASSWORD` ke GitHub** — file `.env` sudah otomatis diabaikan.

### Contoh request

```bash
# Login dulu untuk mendapat token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password-rahasia"}'
# → {"token":"...."}

# Tambah produk (id otomatis dari nama bila kosong)
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Americano","category":"coffee","price":20000,"description":{"id":"...","en":"..."},"tags":["Smooth"]}'

# Update berita
curl -X PUT http://localhost:3001/api/news/berita-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":{"id":"...","en":"..."}}'

# Hapus produk
curl -X DELETE http://localhost:3001/api/products/espresso \
  -H "Authorization: Bearer <token>"
```

> **Satu sumber data:** situs web (`web/`) kini tidak lagi memakai file JSON statis — data produk, berita, dan kontak diambil langsung dari API ini (lihat `web/.env.example`, var `VITE_API_URL`). Jadi **satu-satunya cara** untuk menambah / mengedit / menghapus data yang tampil di situs adalah lewat **panel admin** (MongoDB). File `src/data/*.json` hanya dipakai sekali oleh `npm run seed` sebagai data awal.

## Deploy ke server produksi

1. Push repo ke GitHub.
2. Clone di server: `git clone <repo-mu>`
3. Masuk ke `api-coffee`, `cp .env.example .env`, isi `MONGO_URI`, `JWT_SECRET`, dan `ADMIN_PASSWORD`.
4. `npm install && npm run seed`
5. Jalankan dengan process manager (contoh):

```bash
npm install -g pm2
pm2 start src/server.js --name api-coffee
pm2 save && pm2 startup
```

6. Saran: pasang reverse proxy (Nginx) sehingga API bisa diakses lewat domain, lalu arahkan panel admin ke domain API tersebut.

---

## admin/ — Panel Admin (React)

Folder `admin/` berisi panel manajemen yang dibangun dengan **Vite + React + TypeScript + Tailwind v4** (sama dengan proyek web).

Fitur:
- **Login** — wajib login (username + password) sebelum melihat data; token JWT disimpan dan otomatis dipakai sebagai header `Authorization`. Saat token kedaluwarsa, panel kembali ke layar login.
- **Produk** — tambah, edit, hapus barang + toggle best seller
- **Berita** — kelola judul, ringkasan, isi lengkap (terjemahan ID/EN)
- **Pengaturan** — alamat, telepon, email, WhatsApp, Instagram, jam buka

Cara menjalankan:

```bash
cd admin
npm install
npm run dev      # pengembangan (default http://localhost:5173)
npm run build    # build produksi → dist/
```

Build hasil (`admin/dist`) bisa disajikan lewat Nginx, lalu arahkan **API URL**-nya (di layar login) ke `https://api.egicoffee.id/api`.

> **Lapisan keamanan yang disarankan:** panel ini memakai auth JWT pada API, tapi path `/admin` di server tetap disarankan dikunci di level Nginx (mis. auth basic/htpasswd) supaya file panel tidak bisa diakses sembarang orang.