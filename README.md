# Todo App
Aplikasi Todo List sederhana yang dibangun dengan Next.js, Tailwind CSS, dan Supabase. Aplikasi ini memiliki fitur CRUD (Create, Read, Update, Delete) lengkap dengan otentikasi pengguna.

## Fitur

- ✅ Autentikasi pengguna (email/password)
- ✅ Login/Registrasi dengan Google
- ✅ Manajemen todo (tambah, edit, hapus, tandai selesai)
- ✅ Real-time database dengan Supabase
- ✅ UI responsif dan modern dengan Tailwind CSS dan Shadcn UI
- ✅ Proteksi data per pengguna
- ✅ Notifikasi toast untuk feedback

## Teknologi yang Digunakan

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com) - Reusable UI components
- [Supabase](https://supabase.com) - Open source Firebase alternative
- [TypeScript](https://www.typescriptlang.org) - JavaScript with syntax for types

## Setup Proyek

### Prasyarat

- Node.js (versi 16.x atau lebih baru)
- NPM atau Yarn
- Akun Supabase

### Instalasi

1. Clone repositori

```bash
git clone https://github.com/ahyrnsrlh/crud_sederhana.git
cd crud_sederhana
```

2. Install dependencies

```bash
npm install
# atau
yarn install
```

3. Setup Supabase
   - Buat project baru di [Supabase](https://app.supabase.io)
   - Buat tabel `todos` dengan struktur berikut:

```sql
create table todos (
  id bigint primary key generated always as identity,
  title text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id)
);

-- Setup Row Level Security
alter table todos enable row level security;

create policy "Users can create their own todos"
on todos for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own todos"
on todos for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own todos"
on todos for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can delete their own todos"
on todos for delete
to authenticated
using (auth.uid() = user_id);
```

4. Konfigurasi Auth Provider (untuk login Google)

   - Di dashboard Supabase, pergi ke Authentication > Providers
   - Aktifkan Email/Password authentication
   - Aktifkan Google provider dan isi Client ID & Client Secret dari Google Cloud Console

5. Setup Google OAuth (untuk login dengan Google)

   - Buat project di [Google Cloud Console](https://console.cloud.google.com/)
   - Aktifkan Google OAuth API
   - Buat OAuth Client ID dengan tipe "Web application"
   - Tambahkan authorized origins: `https://[YOUR-PROJECT-REF].supabase.co`
   - Tambahkan redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Salin Client ID dan Client Secret ke Supabase dashboard

6. Buat file `.env.local` dan isi dengan kredensial Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

### Menjalankan Aplikasi

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

## Deployment ke Vercel

Aplikasi ini dapat dengan mudah di-deploy ke Vercel dengan mengikuti langkah-langkah berikut:

1. Buat akun di [Vercel](https://vercel.com)

2. Instal Vercel CLI:

```bash
npm install -g vercel
```

3. Login ke Vercel melalui CLI:

```bash
vercel login
```

4. Deploy aplikasi:

```bash
vercel
```

5. Tambahkan Environment Variables di dashboard Vercel:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Untuk production deployment:

```bash
vercel --prod
```

Alternatif, Anda juga bisa melakukan deployment langsung dari GitHub repository dengan mengikuti langkah-langkah di [dokumentasi Vercel](https://vercel.com/docs/git/vercel-for-github).

### URL Konfigurasi untuk Supabase setelah deploy

Setelah aplikasi di-deploy ke Vercel, Anda perlu:

1. Tambahkan domain Vercel Anda (mis. `your-app.vercel.app`) di konfigurasi Google OAuth
2. Update Site URL di Supabase Auth Settings ke domain Vercel Anda
3. Tambahkan URL callback di Google Cloud Console: `https://your-app.vercel.app/auth/callback`

## Struktur Proyek

```
/app                  # Next.js app directory
  /auth               # Auth page
  /components         # Reusable components
  /globals.css        # Global styles
  /layout.tsx         # Root layout
  /page.tsx           # Main page (Todo List)
/components
  /ui                 # Shadcn UI components
/lib
  /supabase.ts        # Supabase client
  /utils.ts           # Utility functions
/types                # TypeScript type definitions
```

## Penggunaan

1. Buka aplikasi dan register akun baru atau login dengan Google
2. Tambahkan todo baru menggunakan form di bagian atas
3. Edit todo dengan mengklik tombol "Edit"
4. Tandai todo selesai dengan mengklik checkbox
5. Hapus todo dengan mengklik tombol "Delete"
6. Logout dari aplikasi menggunakan tombol di pojok kanan atas

## Fitur yang Dapat Dikembangkan

- Menambahkan fitur kategori/tag untuk todo
- Implementasi pencarian dan filter
- Dark mode
- Notifikasi deadline/reminder
- Penambahan fitur share todo dengan pengguna lain

## Lisensi

MIT
