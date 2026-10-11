# મારુ ભરૂચ (Maru Bharuch) — પ્રોજેક્ટ નોંધ (ગુજરાતી)

આ ફાઇલ ChatGPT / કોઈ પણ AI અથવા નવા ડેવલપરને પ્રોજેક્ટ સમજાવવા માટે છે. README થી વિગતો લીધી છે; ભાષા સરળ ગુજરાતી.

---

## હેતુ (શા માટે બનાવ્યું?)

**મારુ ભર૚** એક **સમુદાય ડિરેક્ટરી વેબ એપ** છે. ભરૂચના લોકો **વિશ્વસનીય સર્વિસ પ્રોવાઇડર** (પ્લમ્બર, ઇલેક્ટ્રિશિયન, ડોક્ટર, ડ્રાઇવર વગેરે) શોધી શકે અને **પોતાના ફોનના contacts** માંથી મદદરારોની માહિતી શેર કરી ડિરેક્ટરી ભરી શકે.

મુખ્ય ધ્યેય:
- લોકોને **ઝડપી શોધ** (નામ, સર્વિસ, એરિયા, ફોન)
- **કોલ / WhatsApp** એક ટેપમાં
- **ડેટા કલેક્શન** — ઘણા contacts એકસાથે add (ખાસ કરીને helping group / community)

---

## કોના માટે ઉપયોગી?

| વપરાશકર્તા | શું મળે |
|------------|---------|
| **ભરૂચના રહિષ્ટા** | નજીકના helpers શોધવા, કૉલ કરવા |
| **સમુદાય / ગ્રુપ સ્વયંસેવક** | ફોન contacts થી trusted નંબર ડિરેક્ટરીમાં મૂકવા |
| **સર્વિસ પ્રોવાઇડર** | (ભવિષ્યમાં) પોતાની listing — હાલ મુખ્યત્વે community submit |

Login **જરૂરી નથી** browse અથવા helper add કરવા માટે (optional login છે).

---

## કેવી રીતે કામ કરે છે? (સરળ flow)

### 1) Browse (હોમ પેજ)
- કેટેગરી પસંદ કરો → નીચે **સર્વિસ બટન** (જેમ કે Plumber) — નામ Supabase `service_types` ટેબલમાંથી
- શોધ: નામ, સર્વિસ, એરિયા, ફોન
- પહેલાં **તાજા helpers** દેખાય; શોધ/ફિલ્ટર લાગે ત્યારે પૂરી લિસ્ટ લોડ
- કાર્ડ પર **Call / WhatsApp**; વિગત મોડલ

### 2) Helper add (`/add-helper`)
- **Select from Contacts** (મોબાઇલ Chrome વગેરે) અથવા **Manual entry** (ફોર્મ + optional ફોટો Cloudinary)
- Contact નામ પરથી **સર્વિસ suggest**; ન મળે તો **Others / Other Service**
- **4 અથવા ઓછા** contacts → review પછી submit
- **4 થી વધુ** → review વગર **ઝડપી auto upload** (batch RPC, 30 ના chunks)

### 3) Install (PWA)
- Live site HTTPS પર: **Install** બટન (ઇન્સ્ટોલ થયા પછી છુપાય)
- iPhone: Add to Home Screen સૂચનાઓ

### 4) ડેટા ક્યાં રહે છે?
- **Supabase:** categories, service_types, directory_people
- **Submit:** RPC `submit_directory_helper` (એક) અને `submit_directory_helpers` (બેચ)
- **ફોટો:** Cloudinary (Supabase Storage નહીં)

---

## ટેકનિકલ (ટૂંકમાં)

- **Frontend:** React + Vite + Tailwind, mobile-first (max width ~480px)
- **Hosting:** Vercel — https://helpers-tawny.vercel.app/
- **Cache:** TanStack Query + localStorage (categories, services, recent helpers)
- **ભાષા:** en / gu / hi (મુખ્યત્વે category/service નામ)

**એકાઉન્ટ્સ (સંદર્ભ):**
- Supabase: marubharuch@gmail.com
- GitHub / Vercel / Cloudinary: szrsmjsangh@gmail.com  
(વિગત: `docs/SERVICE_ACCOUNTS.md`)

---

## README નો ઉપયોગ શું?

README **ડેવલપર્સ** માટે છે: install, env vars, folder structure, deploy, SQL files.  
આ ગુજરાતી નોંધ **હેતુ + વપરાશ + flow** માટે છે; ChatGPT ને આ ફાઇલ અથવા નીચેનો prompt paste કરો.

---

## ChatGPT માટે તૈયાર prompt (copy-paste)

```
હું "મારુ ભરૂચ" (Maru Bharuch) પ્રોજેક્ટ પર કામ કરું છું.

એ શું છે: ભરૂચ માટે સમુદાય helper ડિરેક્ટરી વેબ એપ (React + Supabase + Vercel PWA).

હેતુ: locals trusted service providers શોધે; volunteers phone contacts થી ડેટા add કરે.

Stack: React 19, Vite, Tailwind, Supabase (Postgres + RPC), Cloudinary photos, TanStack Query cache.

મુખ્ય routes: / (home), /add-helper, /login, /about, /category/:id

Add helper: contacts અથવા manual; 4 થી વધુ contacts = auto fast batch upload (submit_directory_helpers RPC).

Live: https://helpers-tawny.vercel.app/

મારી મદદ કરો: [તમારો પ્રશ્ન અહીં]
```

---

*છેલ્લું અપડેટ: README અને કોડબેઝ સાથે સંરેખિત.*
