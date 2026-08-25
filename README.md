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
| Framework | Vite + React (TypeScript) — state-driven screens, no router |
| Styling | Tailwind CSS |
| Auth + Database | Supabase |
| Control plane | [iris-api](https://github.com/Cpt-Dan13/iris-api) (FastAPI, deployed separately on Render) |
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

2. **Environment variables** — create `.env` in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:8000
   VITE_LOG_WS_URL=wss://iris-logs.ngrok-free.app
   VITE_NOVNC_URL=https://iris-novnc.ngrok-free.app/vnc_lite.html?autoconnect=true&resize=scale
   ```
   `VITE_API_URL` should point at a running [iris-api](../iris-api) instance — a local one (`http://localhost:8000`) for dev, or the deployed Render URL.

3. **Run locally**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
src/
  App.tsx              — Top-level state machine; switches between screens (no router)
  main.tsx             — Entry point
  screens/
    Login.tsx           — Auth login
    Register.tsx        — Account registration
    MachineSelect.tsx    — Pick an IRIS instance
    LinkAccount.tsx       — Link a Hinge/IRIS instance (OTP flow)
    Ranking.tsx          — Liked profiles ranked by allure score (home)
    Prospective.tsx       — Active matches grouped by engagement level
    ProfileDetail.tsx      — Full liked-profile detail view
    MatchedProfileDetail.tsx — Full matched-profile detail view
    Reports.tsx           — Historical analytics
    Activate.tsx          — Automation start/stop control
    Monitoring.tsx        — Live noVNC + log stream view
    UserProfile.tsx        — Account/user settings
  components/
    Sidebar.tsx           — Fixed left navigation
    ScoreBadge.tsx         — Circular score indicator
    PersonalityTag.tsx      — Trait badge
    TakeOverModal.tsx        — Conversation + insights overlay
    MatchedInsightsModal.tsx  — Matched-profile insights overlay
  hooks/
    useProfiles.ts / useProfile.ts   — Liked profiles (list + detail)
    useMatchedProfiles.ts             — Matched profiles
    useAutomation.ts                   — Start/stop automation via iris-api
    useLinkAccount.ts                   — Link-flow polling via iris-api
    useIrisUser.ts / useMobile.ts        — Auth/user + responsive helpers
  lib/
    supabase.ts           — Supabase client
    transforms.ts           — Supabase row → UI type mapping (incl. photo URL resolution)
    avatars.ts               — Placeholder avatar resolution
  context/
    AuthContext.tsx        — Auth state provider
    ThemeContext.tsx         — Light/dark theme provider
  types/index.ts          — Shared TypeScript types
```

---

## Related Projects

- [`iris`](../iris) — The Android automation engine (React Native + Kotlin Accessibility Service)
- [`iris-api`](../iris-api) — FastAPI control plane and event relay (RabbitMQ ↔ Supabase), sits between this portal and the IRIS Android instances
- [`docs/SCALE.md`](../iris/docs/SCALE.md) — Full scaling architecture documentation
- [`docs/ROADMAP.md`](../iris/docs/ROADMAP.md) — Step-by-step build plan
