# Buyer Project (Vue + Vite)

## Setup

Install dependencies:

```bash
npm install
```

## Run Development

Single command (**frontend + API**). This avoids proxy errors such as `ECONNREFUSED` on `/api/products`:

```bash
npm run dev
```

Optional:

- Frontend only — `npm run dev:vite-only` (needs `npm run dev:api` in another terminal, or `/api` will fail)
- API only — `npm run dev:api`

If port 3000 is already taken, Vite uses the next free port (for example `3001`). The API stays on **4001**.

**Database:** Start MySQL in XAMPP. The API uses database `demostore` (`server/utils/db.js`)—adjust if your phpMyAdmin database name differs.

**Categories:** The API reads MySQL column `products.category` when present. If that column does not exist, it falls back to inferring categories from names. Homepage filter chips include **Men, Women, Jewellery, Electronics** (plus any extras returned by your API).

**Product images:** Relative filenames in DB are served from `server/uploads/` at `/uploads/<filename>`; add a PNG/JPG file there matching the stored name, use a full `http(s)` URL, or rely on the included placeholder SVG if the file is missing.

## Build

```bash
npm run build
npm run preview
```
# Buyer-project
