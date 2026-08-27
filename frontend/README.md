# Sports Court Booking — Frontend (Phase 1)

React + Vite + Tailwind CSS + Redux Toolkit + Axios.

## Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend
npm run dev
```

## What's in Phase 1

- Project scaffold (Vite, Tailwind, ESM)
- React Router routing (`src/App.jsx`)
- `MainLayout` (Navbar + Footer + Outlet)
- Redux Toolkit store (`src/app/store.js`) with an `auth` slice
  (`src/features/auth/authSlice.js`) — login/register thunks, token +
  user persisted to `localStorage`, rehydrated on load
- Axios instance (`src/api/axiosInstance.js`) — attaches the bearer
  token to every request, logs the user out on any 401
- `authApi.js` — thin wrappers for the two real backend endpoints
  that exist today: `POST /auth/register`, `POST /auth/login`
- Route guards: `ProtectedRoute` (must be logged in),
  `PublicOnlyRoute` (must be logged out — login/register pages),
  `AdminRoute` (must be `role: "admin"`, built now since it's the
  same pattern, wired up in Phase 6)
- Placeholder pages (`Home`, `Login`, `Register`, `Dashboard`,
  `NotFound`) — just enough content to prove routing + auth state
  work end to end. Real forms/UI are Phase 2.

## Known gap (flagged for Phase 2)

`GET /api/profile` returns the raw JWT payload (`id`, `role`, `iat`,
`exp`) only — no name/email/credits. The Dashboard/Profile page
currently reads the user object cached in Redux from login/register
instead. If you want credits to refresh live without re-login, the
backend will need `/api/profile` (or a new endpoint) to return the
full user document.

## Verifying Phase 1 manually

1. `npm run dev`, visit `/` — Home page + Navbar with Login/Register
   links should render.
2. Visit `/dashboard` while logged out — should redirect to `/login`.
3. Log in isn't wired to real UI yet (Phase 2), but you can confirm
   the plumbing by dispatching `loginUser({email, password})` from
   the Redux DevTools console against your running backend, then
   reloading `/dashboard` — user info should show and persist across
   a refresh.
4. Visit `/login` or `/register` while already authenticated (state
   set as above) — should redirect to `/dashboard`.
