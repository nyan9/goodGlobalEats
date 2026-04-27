<!-- markdownlint-disable-file MD033 -->

<h1 align="center"> Good Global Eats </h1> <br>
<p align="center">
    <img alt="Good Global Eats Logo" title="Good Global Eats" src="public/sushi.svg" width="200" >
    <img alt="Map gif" title="Map" src="public/goodglobaleats.gif" width="600" >
</p>

<p align="center" > Good Eats Across The Globe! </p>

## Table of Contents

1. [Overview](#overview)
   - [Tech stack](#tech-stack)
2. [Features](#features)
3. [Local development](#local-development)
4. [Deploying to Vercel + Neon](#deploying-to-vercel--neon)
5. [Architecture notes](#architecture-notes)
6. [TODOs](#todos)
7. [Author](#author)

## Overview

Good Global Eats is a full-stack restaurant-sharing app inspired by Airbnb's split-map UI. Discover restaurants worldwide on an interactive map, or share your own favorite spots.

### Tech stack

- **Next.js 14** (Pages Router) on Node 20
- **TypeScript 5**
- **Apollo Server 4** + **Apollo Client 3.13** + **type-graphql 2** + **graphql-codegen**
- **Prisma 5** against **PostgreSQL** (Neon in production)
- **Auth.js v5** (Google OAuth, database session strategy via Prisma adapter)
- **Tailwind CSS** for styling
- **react-map-gl** + **Mapbox** for the map
- **Cloudinary** for image hosting
- **Google Places** for address autocomplete
- Deployed on **Vercel**

## Features

- **Sign in** with Google
- **Map** — search by city / area / country, zoom to see posted restaurants in view, click markers for previews
- **Restaurant posts** — create with photo upload, edit, and delete your own posts; view anyone's posts on the map

## Local development

### Prerequisites

- Node 20 (use `nvm use` — pinned via `.nvmrc`)
- Yarn 1.22 (`corepack enable && corepack prepare yarn@1.22.22 --activate`)
- A local Postgres or a Neon dev branch

### Setup

```bash
git clone git@github.com:nyan9/goodGlobalEats.git
cd goodGlobalEats
cp .env.example .env.local        # fill in the values — see below
yarn install                       # runs prisma generate via postinstall
yarn db:migrate                    # applies prisma/migrations to your local DB
yarn dev                           # http://localhost:3000
```

### Required env vars (`.env.local`)

| Variable                                                                                 | Where to get it                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                           | Local Postgres or a Neon dev branch (`postgres://user:pass@host:5432/db`)                                                                                                                                                  |
| `AUTH_SECRET`                                                                            | Generate: `openssl rand -base64 32`                                                                                                                                                                                        |
| `NEXTAUTH_URL`                                                                           | `http://localhost:3000` for dev                                                                                                                                                                                            |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`                                                  | [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) → create OAuth client (web). Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | [Cloudinary console](https://console.cloudinary.com/)                                                                                                                                                                      |
| `NEXT_PUBLIC_MAPBOX_API_TOKEN`                                                           | [Mapbox account → tokens](https://account.mapbox.com/access-tokens/)                                                                                                                                                       |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`                                                        | Same Google Cloud project; enable the Places API and Maps JavaScript API for the key. Restrict by HTTP referrer.                                                                                                           |

### Useful scripts

```bash
yarn dev              # next dev
yarn build            # next build
yarn start            # next start (after build)
yarn typecheck        # tsc --noEmit
yarn lint             # next lint
yarn format           # prettier --write
yarn codegen          # regenerate src/generated/types.ts from src/schema/**
yarn db:migrate       # prisma migrate dev (creates a new migration on schema changes)
yarn db:deploy        # prisma migrate deploy (production)
yarn db:push          # prisma db push (dev-only; skips migration history)
```

## Deploying to Vercel + Neon

### One-time setup

1. **Create a Neon project** at [neon.tech](https://neon.tech). Use a region close to your Vercel function region (e.g. `us-east-1`). Note the **pooled connection string** (used as `DATABASE_URL`).
2. **Create a Google OAuth client** at [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials):
   - Application type: Web application
   - Authorized redirect URIs: `https://<your-vercel-domain>/api/auth/callback/google` (and any custom domains)
3. **Apply migrations to Neon once:**
   ```bash
   DATABASE_URL='postgres://...' yarn db:deploy
   ```
4. **Configure Vercel env vars** (Project → Settings → Environment Variables, set for both **Production** and **Preview**):
   - `DATABASE_URL` (Neon pooled)
   - `AUTH_SECRET` (`openssl rand -base64 32`, fresh per env)
   - `NEXTAUTH_URL` (your prod URL, e.g. `https://good-global-eats.vercel.app`)
   - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
   - `NEXT_PUBLIC_MAPBOX_API_TOKEN`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
5. **Trigger a production deploy** — push to `main` or click "Redeploy" in Vercel.

### Verifying

- Visit the production URL → sign in with Google → expect a Vercel-domain callback.
- Create a Spot (with a photo upload via Cloudinary) → confirm it appears on the map.
- Edit and delete the Spot → confirm the gating (`user.uid === spot.userId`) prevents editing other users' posts.

## Architecture notes

### Server-side auth gating

Protected pages (`pages/spots/[id]/edit.tsx`, `pages/spots/putOn.tsx`) read the session via Auth.js's `auth(context)` inside `getServerSideProps` and 302 to `/auth` if there's no session.

### GraphQL context

`pages/api/graphql.ts` uses `@apollo/server@4` + `@as-integrations/next`. Per-request context is `{ uid, prisma }`, where `uid` comes from `auth(req, res)` reading the Auth.js session cookie. Resolvers in `src/schema/spot.ts` use the `@Authorized()` decorator + a `uid === spot.userId` check for mutations.

### Codegen

`yarn codegen` runs `scripts/print-schema.ts` (which builds the type-graphql schema and writes `schema.gql`), then `graphql-codegen --config codegen.ts` to emit `src/generated/types.ts`. The 8 historical per-operation files in `src/generated/` are now thin shims re-exporting from `types.ts` for back-compat.

### Data flicker prevention

`src/utils/useLastData.ts` returns the previous Apollo result while a new query is loading, preventing the map from blanking out during pan/zoom transitions.

## TODOs

- [ ] Map clusters when markers overlap
- [ ] Like / Dislike on posts
- [ ] User profile page

## Author

[Ryan Naing](https://RyanNaing.com)
