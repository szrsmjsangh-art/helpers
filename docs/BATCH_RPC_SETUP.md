# Batch contact upload — setup steps (Supabase + app)

જ્યારે 5+ contacts select થાય, app **batch RPC** use કરે (ઓછા HTTP requests).  
પહેલા **Supabase**, પછી **GitHub push** (Vercel auto deploy).

---

## Step 1 — Supabase માં SQL run કરો

1. Login: **marubharuch@gmail.com** → [Supabase Dashboard](https://supabase.com/dashboard/project/hleipppzfeqmfuxwcpns)
2. **SQL Editor** → **New query**
3. File open કરો: `supabase/submit_directory_helpers.sql` (આ repo માંથી)
4. **આખું copy-paste** → **Run**
5. Success message આવે = function create થઈ

**શું બન્યું:** નવી function `submit_directory_helpers(p_contacts jsonb)`  
- દરેક contact માટે તમારી હાલની `submit_directory_helper` call થાય  
- એક batch માં **max 50** contacts (app 30 ના chunks મોકલે)

### Test (optional)

SQL Editor માં test block (file ની નીચે comment) uncomment કરી run કરો — mobile numbers unique રાખો.

---

## Step 2 — App deploy

1. Code already uses `submitHelpersBatch` in `submissionService.js`
2. Local: `npm install` → `npm run build`
3. Git push → Vercel: https://helpers-tawny.vercel.app/

Env vars પહેલેથી set હોવા જોઈએ (`VITE_SUPABASE_*`).

---

## Step 3 — Phone પર verify

1. `/add-helper` → **Select from Contacts**
2. **5+ contacts** select કરો → auto upload (no review)
3. Progress: `Uploading X / Y…`
4. Supabase → **Table Editor** → `directory_people` → new rows

---

## જો error આવે

| Error | Fix |
|--------|-----|
| `function submit_directory_helpers does not exist` | Step 1 SQL ફરી run કરો |
| `permission denied` | SQL માં `grant execute` line ચાલી? |
| `Maximum 50 contacts per batch` | Normal — app chunks; contact dev |
| Single `submit_directory_helper` fails inside batch | `failed` array માં reason; duplicate mobile etc. |

---

## Flow summary

```
User picks 47 contacts
  → App chunks: 30 + 17
  → 2× RPC submit_directory_helpers
  → vs 47 separate calls (old)
```

Manual form (1 person) → still **single** `submit_directory_helper` (unchanged).
