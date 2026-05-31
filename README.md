# CineScope — Premium Movie Discovery UI

CineScope is a modern Angular front-end demo for movie discovery. It uses the OMDb API for movie data and showcases a premium-style UI with standalone Angular components, Angular Signals, responsive layout, and local demo authentication.

## What this project includes

- Premium sign-in and sign-up flows using Angular Material
- Form validation for email, password, confirm password, and terms acceptance
- OMDb search with debounce and live results
- Movie details page with poster, plot, cast, ratings, and metadata
- Watchlist persisted in `localStorage`
- Demo authentication with local user storage and premium status
- Premium page / upgrade flow stored locally
- Genre browsing and load-more functionality
- Shared reusable UI components: movie cards, carousels, skeleton loaders, loading spinner
- Responsive mobile-first layout with modern glassmorphism styling

## Key features

- **Premium Auth UI**: Sign in and Sign up forms built with Angular Material and validation
- **Frontend demo auth only**: no backend auth; users are saved to `localStorage`
- **Premium demo mode**: upgrade/downgrade user status locally and protect premium content in the UI
- **Search**: debounced typing search using OMDb
- **Watchlist**: add/remove favorites with persistence
- **Genres**: browse movies by genre and load more results
- **Movie detail view**: full movie metadata and watchlist actions
- **Responsive design**: works on mobile, tablet, and desktop

## Tech stack

- Angular 21 (standalone components)
- Angular Material for form controls and actions
- Angular Signals for reactive state
- RxJS for search and async behavior
- SCSS with modern Sass module API
- localStorage for demo auth and watchlist persistence

## Project structure

```
src/app/
├─ layout/                # Header, footer, responsive nav
├─ pages/                 # App pages: home, search, movie-details, watchlist, premium, signin, signup
├─ shared/
│  ├─ components/         # reusable UI components
│  ├─ directives/         # lazy image loader, etc.
│  ├─ guards/             # auth and premium guards
│  ├─ services/           # omdb, auth, cache, etc.
│  └─ state/              # signal stores for auth and watchlist
```

## Authentication and premium flow

- Authentication is a frontend-only demo using `AuthService` + `AuthStore`
- Users are stored in `localStorage` with email, name, password, and `isPremium`
- `Sign In` and `Sign Up` use Angular Material and validation messages
- Premium status is saved per user and used by the UI to gate premium actions
- `AuthGuard` protects logged-in routes; `PremiumGuard` can protect premium-only areas

## Setup

### Requirements

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Run development server

```bash
npm start
```

### Build

```bash
npm run build
```

## Environment configuration

Set your OMDb API key in `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  omdbApiKey: 'YOUR_API_KEY',
  omdbBaseUrl: 'https://www.omdbapi.com/',
};
```

## Useful scripts

- `npm start` — start the dev server
- `npm run build` — build the app
- `npm test` — run tests

## Notable files

- `src/app/app.routes.ts` — route definitions and lazy pages
- `src/app/shared/services/omdb.service.ts` — OMDb API integration
- `src/app/shared/services/auth.service.ts` — demo local auth and premium logic
- `src/app/shared/state/auth.store.ts` — current user state with Signals
- `src/app/shared/state/watchlist.store.ts` — localStorage watchlist state
- `src/app/shared/guards/auth.guard.ts` — protect authenticated routes
- `src/app/shared/guards/premium.guard.ts` — protect premium-only routes

## Notes

- This project is a frontend demonstration only. There is no real backend authentication or payment flow.
- LocalStorage is used for demo persistence only; this is not production-safe.
- The design intentionally uses Material-style inputs with premium dark glass styling for auth pages.

Would you like me to add screenshots and a short CONTRIBUTING guide?
