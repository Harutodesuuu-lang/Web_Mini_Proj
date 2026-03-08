# Mini Project - Next.js Product/Admin Dashboard

A Next.js App Router project for browsing products/users and managing products from an admin panel.

## Features

- Product list and product detail pages
- User list and user detail pages
- Admin dashboard with product create, update, and delete
- Product image upload flow
- Category selection in admin form
- Route-level loading and error UI (`admin`, `products`, `users`)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- React Hook Form + Zod

## Routes

- `/` - Home
- `/products` - Product list
- `/products/[id]` - Product detail
- `/users` - User list
- `/users/[id]` - User detail
- `/admin` - Admin dashboard

## Folder Structure

```txt
mini-proj/
├─ app/
│  ├─ admin/
│  │  ├─ error.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ products/
│  │  ├─ [id]/
│  │  │  ├─ not-found.tsx
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ users/
│  │  ├─ [id]/
│  │  │  ├─ not-found.tsx
│  │  │  └─ page.tsx
│  │  ├─ error.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ admin/
│  │  └─ admin-dashboard-client.tsx
│  ├─ ui/
│  │  └─ ...shared UI components
│  ├─ product-card.tsx
│  ├─ profile-card.tsx
│  ├─ skeleton-card.tsx
│  ├─ theme-provider.tsx
│  └─ user-skeleton.tsx
├─ lib/
│  ├─ type/
│  │  ├─ product.ts
│  │  └─ user.ts
│  ├─ admin-products.ts
│  └─ utils.ts
├─ public/
├─ next.config.ts
├─ package.json
└─ README.md
```

## Environment Variables

Create `.env.local` in the project root:

```env
# Client-side API base (first priority)
NEXT_PUBLIC_API=https://api.escuelajs.co

# Client-side fallback
NEXT_PUBLIC_API_URL=https://api.escuelajs.co

# Server-side API base used by admin product requests
NEXT_FAKE_API=https://api.escuelajs.co
```

If `NEXT_PUBLIC_API` and `NEXT_PUBLIC_API_URL` are missing, client fetches default to:

```txt
https://api.escuelajs.co
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Remote images use Next.js `next/image` allowlist in `next.config.ts`.
- If you change `next.config.ts`, restart the dev server.
- Admin success/error messages auto-hide after 5 seconds.
