# LUMIÈRE — Luxury Essentials Store

A curated collection of luxury essentials built with **Nuxt 3** (Vue 3 + Vite). Shop jewellery, fashion, electronics, and more.

## Setup

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

This starts both the frontend and the API on the same server (Nuxt 3 Nitro). No proxy configuration needed.

**Database:** Start MySQL in XAMPP. The app uses database `demostore` (configurable via environment variables).

**Demo credentials:**
- Phone: `9876543210`
- Password: `demo123`

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | *(empty)* | MySQL password |
| `DB_NAME` | `demostore` | MySQL database name |
| `DB_PORT` | `3306` | MySQL port |
| `NODE_ENV` | `development` | `production` = stricter errors, no demo fallback |

## Deployment

Deployed to **Render** (`buyer-project.onrender.com`) via `render.yaml`.

- Build command: `npm install && rm -rf .nuxt .output && npm run build`
- Start command: `node .output/server/index.mjs`
- MySQL is required at runtime
