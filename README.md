# Mini Project - Next.js Admin/Product App

A Next.js App Router project with:

- Product listing and product detail pages
- User listing and user detail pages
- Admin dashboard for product CRUD (create, update, delete)
- Image upload + category selection in admin form

The app is currently wired to the Fake Store API from Escuelajs.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form + Zod

## Main Routes

- `/` - Home
- `/products` - Product list
- `/products/[id]` - Product detail
- `/users` - User list
- `/users/[id]` - User detail
- `/admin` - Admin dashboard (CRUD)

## Environment Variables

Create a `.env.local` file in the project root.

Use one of the following (first found will be used):

```env
NEXT_PUBLIC_API=https://api.escuelajs.co
# or
NEXT_PUBLIC_API_URL=https://api.escuelajs.co
# optional server-side fallback
NEXT_FAKE_API=https://api.escuelajs.co
```

If none are set, the app currently falls back to:

```txt
https://api.escuelajs.co
```

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open: `http://localhost:3000`

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- Admin upload form shows friendly error messages:
  - `Product already exist.`
  - `Product fail to upload.`
- Success and error alerts auto-hide after 5 seconds.
- File input is reset after submit/reset.
