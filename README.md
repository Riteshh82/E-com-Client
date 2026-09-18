# Coppera — Copper Tiles Product Catalog & Admin UI

A premium, responsive product-catalog / B2B website UI for a copper tiles company, plus a
complete admin dashboard UI. Built with React, TypeScript, Tailwind CSS, React Router and
Recharts, using realistic mock data — no backend required.

This is a **UI-only** project: there is no real checkout. "Buy" buttons link out to Amazon /
Flipkart (mock URLs), and bulk customers submit an inquiry form (stored only in memory for
this demo).

## What's included

**Customer site** (`/`)
- Sticky header with mobile drawer navigation
- Hero, trust strip, featured products, collections, "why choose us", bulk-order CTA
- Product listing with category filter + search (`/products`)
- Product detail page with image gallery, specs, Amazon/Flipkart buttons, bulk CTA
- Collections page (`/collections`)
- About page (`/about`)
- Bulk order inquiry form (`/bulk-orders`)
- Contact page with form, map embed and WhatsApp link (`/contact`)

**Admin dashboard** (`/admin`)
- Login screen (demo — any email/password signs you in) at `/admin/login`
- Dashboard home with stat cards + charts (`/admin`)
- Product management: table, filters, add/edit form with drag-and-drop image upload UI
- Category management: cards with add/edit modal
- Bulk order management: table + detail drawer with status updates and notes
- Contact message management: table + read/reply modal
- Settings page for company info, socials and marketplace store links

All data lives in `src/data/mockData.ts` — edit it directly to change products, categories,
inquiries, messages or company details.

## Requirements

- Node.js 20 or newer (Node 22 LTS recommended)
- npm 10 or newer

## Setup

1. Unzip the project and open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the printed local URL (usually `http://localhost:5173`).
   - Customer site: `http://localhost:5173/`
   - Admin dashboard: `http://localhost:5173/admin/login` (enter any email + password)

## Other scripts

```bash
npm run build     # type-check and build a production bundle into dist/
npm run preview   # serve the production build locally to sanity-check it
npm run lint      # run oxlint
```

## Project structure

```
src/
  components/
    ui/        Shared primitives: Button, Card, Badge, Input, Modal, Drawer, Toast, Skeleton…
    site/      Header, Footer, ProductCard, MarketplaceButtons, ContactForm, ProductGallery…
    admin/     AdminSidebar, AdminHeader, StatsCard
  layouts/     SiteLayout, AdminLayout (admin routes require a logged-in session)
  pages/site/  Home, Products, ProductDetail, Collections, About, BulkOrder, Contact, NotFound
  pages/admin/ Login, Dashboard, ProductsAdmin, ProductForm, CategoriesAdmin,
               BulkOrdersAdmin, MessagesAdmin, Settings
  data/mockData.ts   All mock products, categories, bulk orders, messages, chart data, settings
  context/     ToastContext (notifications), AdminAuthContext (demo session, sessionStorage)
```

## Notes for connecting a real backend later

- Replace the arrays in `src/data/mockData.ts` with API calls (e.g. React Query / fetch) —
  component props and shapes already match the `Product`, `Category`, `BulkOrder` and
  `ContactMessage` types defined in that file, so most UI code won't need to change.
- The admin login is a demo stand-in (`AdminAuthContext`, backed by `sessionStorage`) — swap
  it for real authentication (JWT/session cookies) when a backend is ready.
- Forms (bulk order, contact, product add/edit) currently just show a success state / toast —
  wire their `onSubmit` handlers to your API.
- Product images use Unsplash placeholder URLs — swap in your own hosted images or an upload
  pipeline for the "Add/Edit Product" image uploader.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router v7 · Recharts · lucide-react
# E-com-Client
