# Service accounts (Maru Bharuch)

Quick reference for **which email owns which platform**.  
**Do not store passwords or API keys in this repo.** Use a password manager or each provider’s dashboard.

## Live links (bookmarks)

| What | URL |
|------|-----|
| **Production app (Vercel)** | https://helpers-tawny.vercel.app/ |
| **GitHub repository** | https://github.com/szrsmjsangh-art/helpers |
| **Vercel dashboard** | https://vercel.com/dashboard (project linked to repo above) |
| **Supabase project** | https://supabase.com/dashboard/project/hleipppzfeqmfuxwcpns |
| **Supabase API settings** | https://supabase.com/dashboard/project/hleipppzfeqmfuxwcpns/settings/api |
| **Supabase API URL** (public) | `https://hleipppzfeqmfuxwcpns.supabase.co` |
| **Supabase project ref / ID** | `hleipppzfeqmfuxwcpns` |
| **Cloudinary console** | https://console.cloudinary.com/ |

| Service | Login email | Used for | Notes |
|---------|-------------|----------|--------|
| **Supabase** | `marubharuch@gmail.com` | Database, Auth, RPC, API keys | Project ref `hleipppzfeqmfuxwcpns` → Vercel env `VITE_SUPABASE_*` |
| **GitHub** | `szrsmjsangh@gmail.com` | Source code, push → Vercel deploy | https://github.com/szrsmjsangh-art/helpers |
| **Vercel** | `szrsmjsangh@gmail.com` | Hosting, production URL, env vars | Build: `npm run build`, output: `dist` |
| **Cloudinary** | `szrsmjsangh@gmail.com` | Helper photo uploads | `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` |

## Where secrets live

| Secret | Where to find | Where the app reads it |
|--------|----------------|-------------------------|
| Supabase URL & publishable key | Supabase → Project Settings → API | Vercel env + local `.env` |
| Cloudinary cloud name & upload preset | Cloudinary dashboard | Vercel env + local `.env` |
| GitHub / Vercel tokens | Not in repo; provider UI or password manager | — |

## Local `.env` (never commit)

Copy from Vercel or Supabase/Cloudinary dashboards:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## If someone else needs access

- **Supabase:** Dashboard → Organization/Project → invite `szrsmjsangh@gmail.com` (or team email) as member  
- **GitHub:** Repo → Settings → Collaborators  
- **Vercel:** Project → Settings → Team / members  
- **Cloudinary:** Settings → User management  

## Recovery

- Supabase/GitHub/Vercel/Cloudinary: use each provider’s **“Forgot password”** on the email listed above.  
- Keep 2FA backup codes in your password manager, not in git.
