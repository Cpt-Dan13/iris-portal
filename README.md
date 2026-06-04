# iris-portal

The web dashboard for [IRIS](../iris) — a browser-based interface for monitoring and managing automated Hinge activity. Built for a private group of users, iris-portal surfaces match rankings, prospective scores, and conversation history in a clean, data-driven UI.

> Part of the IRIS ecosystem. Requires a running IRIS Android instance and a connected Supabase project.

---

## What It Does

- **Ranking** — View all liked profiles ranked by facial allure score (Face++ powered)
- **Prospective** — Active matches grouped by engagement level (HIGH / MODERATE / LOW), sorted by conversation score
- **Profile Detail** — Full match profile with personal details, personality tags, scores, and conversation history
- **Reports** — Historical analytics — score trends, session stats, top performers
- **Activate** — Trigger and monitor the IRIS automation engine remotely

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| Auth + Database | Supabase |
| Charts | Recharts |
| Icons | Lucide React |

---

## Getting Started

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd iris-portal
   npm install
   ```

2. **Environment variables** — create `.env.local` in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
app/
  (auth)/
    login.tsx         — Login page
  (dashboard)/
    layout.tsx        — Sidebar layout wrapper
    page.tsx          — Ranking screen (home)
    prospective/      — Prospective matches
    profile/[id]/     — Profile detail
    reports/          — Analytics
    activate/         — Automation control
components/
  ProfileCard.tsx     — Match card with level badge
  ScoreBadge.tsx      — Circular score indicator
  PersonalityTag.tsx  — Trait badge
  TakeOverModal.tsx   — Conversation + insights overlay
  Sidebar.tsx         — Fixed left navigation
lib/
  supabase.ts         — Supabase client
  types.ts            — Shared TypeScript types
```

---

## Related Projects

- [`iris`](../iris) — The Android automation engine (React Native + Kotlin Accessibility Service)
- [`SCALE.md`](../iris/SCALE.md) — Full scaling architecture documentation
- [`ROADMAP.md`](../iris/ROADMAP.md) — Step-by-step build plan
