# Maru Bharuch (Helpers Directory)

A mobile-first community web app for **Bharuch** to discover local service providers (“helpers”) and add trusted contacts to a shared directory. Built with **React** and **Supabase**, deployable as a **PWA** on Vercel.

**Live app:** https://helpers-tawny.vercel.app/

---

## Overview

| Item | Detail |
|------|--------|
| **Purpose** | Browse helpers by category/service, search, call/WhatsApp, contribute new entries |
| **Audience** | Community members (e.g. helping-group data) |
| **City** | Bharuch (`src/lib/config.js`) |
| **Auth** | Optional login/register; browsing and adding helpers does **not** require sign-in |

### Service logins (emails only)

| Platform | Email |
|----------|--------|
| Supabase | `marubharuch@gmail.com` |
| GitHub, Vercel, Cloudinary | `szrsmjsangh@gmail.com` |

Full notes + dashboard links: **[docs/SERVICE_ACCOUNTS.md](docs/SERVICE_ACCOUNTS.md)**  
Local env template: **`.env.example`**

---

## Features

### Directory (Home)

- Hero, search (multi-token AND search on name, service, area, description, phone)
- Horizontal **category** scroller; **service type** chips after a category is selected
- Default view: **recent helpers** (limited fetch); full list loads when user searches or filters
- Helper cards: call, WhatsApp, detail modal (share, about, area)

### Add helpers (`/add-helper`)

1. **Select from Contacts** (Contact Picker API on supported mobile browsers)
2. **Manual entry** form (optional photo via Cloudinary)

Contact flow:

- Keyword-based **service suggestion** from contact name (`helperCategoryMatcher.js`)
- Fallback: category **Others** + service **Other Service** (must exist in Supabase)
- **Quick submit** (name + mobile, suggested/default category) or **review** then submit
- Batch import with per-contact edit (name, mobile, WhatsApp, category, service, area, description)

### Other

- **Languages:** English, Gujarati, Hindi (category/service labels; `LanguageContext` + `localStorage`)
- **PWA:** installable on HTTPS; header **Install** button (hidden when already installed; iOS shows Add to Home Screen steps)
- **Caching:** TanStack Query + `localStorage` persist for categories, service types, and recent helpers

### Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/category/:categoryId` | Category + service filter |
| `/add-helper` | Add helpers |
| `/login` | Login / register |
| `/about` | About |
| `*` | 404 |

---

## Tech stack

- **UI:** React 19, React Router 7, Tailwind CSS 4, Lucide icons
- **Build:** Vite 8
- **Backend:** Supabase (Postgres, Auth, RPC)
- **Media:** Cloudinary (unsigned upload preset)
- **Data client:** TanStack React Query + persist client
- **PWA:** `vite-plugin-pwa` (Workbox)

---

## Project structure

```
src/
  main.jsx              # Router, QueryProvider, Auth, Language
  router/AppRouter.jsx
  pages/                # Home, Category, AddHelper, Login, About, 404
  components/
    layout/             # MobileLayout, Header, BottomNav
    directory/          # Cards, search, modals
    add-helper/         # ContactPicker, success UI
    auth/               # Login / register forms
    common/             # Inputs, InstallAppButton, etc.
  context/              # AuthContext, LanguageContext
  hooks/                # useCategories, usePwaInstall, …
  services/             # Supabase + Cloudinary API wrappers
  lib/                  # supabase client, queryClient, config
  providers/QueryProvider.jsx
  utils/                # phone, validation, helperCategoryMatcher
  locales/              # en, gu, hi (lightweight)
supabase/
  verify_and_setup.sql  # DB verify, seed Others/Other Service, RPC/RLS reference
  part3_rpc_fix.sql     # DROP function before RPC recreate (if needed)
public/
  icons.svg             # PWA / branding icon
```

---

## Supabase integration

### Tables (read by the app)

| Table | Usage |
|-------|--------|
| `categories` | Active categories, ordered by `sort_order` |
| `service_types` | Services per `category_id` |
| `directory_people` | Helpers; hidden when `status = 'hidden'` |

### Writes

- RPC **`submit_directory_helper`** with parameters:  
  `p_name`, `p_mobile`, `p_whatsapp`, `p_category_id`, `p_service_type_id`,  
  `p_area`, `p_description`, `p_photo_url`, `p_submitted_name`

The deployed database may return a JSON payload (e.g. `success`, `directory_person_id`); the app only checks for RPC errors.

### Required seed rows (contact import)

- Category: **`Others`** (`name_en`)
- Service: **`Other Service`** under that category  

See `supabase/verify_and_setup.sql` for checks and optional setup.

### Auth

- Email/password via `authService.js`; session in `AuthContext`
- Not required for directory browse or submit in the current UI

---

## Environment variables

Create `.env` in the project root (never commit secrets):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

On **Vercel**, add the same variables in Project → Settings → Environment Variables, then redeploy.

---

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # serve dist locally (good for PWA smoke test)
npm run lint
```

**Note:** PWA install prompts and service workers are most reliable on **`npm run build` + preview** or a **HTTPS** deployment, not always in dev mode.

---

## Deploy (GitHub → Vercel)

1. Push to GitHub; connect the repo in Vercel.
2. **Build command:** `npm run build`
3. **Output directory:** `dist`
4. Set all `VITE_*` env vars for Production (and Preview if needed).

For client-side routing, add `vercel.json` if direct URLs return 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

After deploy, test **Install** on the live HTTPS URL. For best install support on Android Chrome, add **192×192** and **512×512** PNG icons to `public/` and reference them in `vite.config.js` PWA manifest (SVG-only may be insufficient on some devices).

---

## Data loading & cache behaviour

| Query key | Content | Stale time (typical) | Persisted locally |
|-----------|---------|----------------------|-------------------|
| `categories` | All active categories | 30 min | Yes |
| `serviceTypes` | All active service types | 30 min | Yes |
| `helpers/recent` | Latest ~20 helpers | 5 min | Yes |
| `helpers/all` | Full directory | 5 min | No (size) |
| `helpers/category/:id` | Per-category list | 5 min | No |

On window focus, stale queries **revalidate** in the background. After a successful helper submit, helper queries are **invalidated** so lists refresh.

---

## Contact import requirements

- **Contact Picker API:** `navigator.contacts.select` — mainly **Chrome on Android** (and some mobile browsers).
- Desktop or unsupported browsers: use **manual entry**; Install flow on iOS uses **Share → Add to Home Screen**.

---

## Scripts reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build + PWA assets |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## License & attribution

Private project (`package.json`: `"private": true`). Header credits community data source as configured in the app UI.

---

## Related SQL

- **`supabase/verify_and_setup.sql`** — verify schema, seed Others/Other Service, optional RPC/RLS (adapt to your existing `submit_directory_helper` if it already works).
- **`supabase/part3_rpc_fix.sql`** — drop old RPC signature before changing return type (`42P13`).

If submit works in the SQL editor with your current RPC, you may not need to replace the function from the script.

**Batch contact upload:** run `supabase/submit_directory_helpers.sql` once, then see **[docs/BATCH_RPC_SETUP.md](docs/BATCH_RPC_SETUP.md)**.
