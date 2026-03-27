# LifeLink Frontend

Frontend dashboard and public case views for the LifeLink platform.

## Ownership

- Henry Fakorode (@henrytech12): frontend implementation

## Overview

This app enables hospitals to:

- onboard and sign in
- view dashboard metrics
- create and monitor emergency cases
- review active and historical case records
- open bridge application flow when eligible
- interact with AI assistant widget

It also provides a public case route for sharing donation case links.

## Tech Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- React Router
- Axios
- TanStack React Query
- Framer Motion
- Lucide icons

## Project Structure

```text
project/
├── src/
│   ├── pages/           # route-level screens
│   ├── components/      # reusable UI components
│   ├── contexts/        # auth/session context
│   ├── lib/             # api-client and api-service abstractions
│   └── types/           # request/response interfaces
├── public/
└── package.json
```

## Prerequisites

- Node.js 18+
- npm 9+

## Environment Variables

Create `.env` in `project/` if needed.

- `VITE_API_BASE_URL` (optional)

If omitted, the app falls back to the configured default backend URL in source.

Example:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1/lifelink
```

## Install and Run

```bash
cd project
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Build and Preview

```bash
npm run build
npm run preview
```

## Lint and Type Check

```bash
npm run lint
npm run typecheck
```

## Auth and Session Behavior

The frontend stores:

- `lifelink_access_token`
- `lifelink_refresh_token`
- `lifelink_hospital_email`
- `lifelink_hospital_id`

Behavior:

- access token is attached via Axios request interceptor
- on `401/403`, refresh token flow is attempted automatically
- on refresh failure, session is cleared and user is redirected to login

## API Integration Summary

Main API clients are in `src/lib/api-service.ts` and `src/lib/api-client.ts`.

### Hospital APIs

- onboard
- login
- refresh token
- dashboard data
- hospital profile data

### Case APIs

- initiate case
- fetch case detail
- fetch active cases
- fetch paginated history
- apply for bridge loan

### AI API

- chatbot endpoint for assistant widget

## Key Routes

- `/login`
- `/onboard`
- `/dashboard`
- `/dashboard/cases`
- `/dashboard/history`
- `/dashboard/settings`
- `/case/:caseId`

## UX Notes

- dashboard and case pages rely on backend response shapes; keep DTO contracts synchronized
- bridge application UI validates BVN/NIN and agreement before submission
- new emergency modal creates and displays virtual account details for sharing

## Troubleshooting

### Frontend cannot reach backend

- set `VITE_API_BASE_URL` to your active backend
- verify backend CORS allows frontend origin

### Login succeeds but screens fail

- inspect token storage in browser localStorage
- verify refresh endpoint behavior and token expiration

### Build fails

- run `npm install` again
- run `npm run typecheck` to isolate TS issues

## Product Context

See [project/FRONTEND_PRD.md](FRONTEND_PRD.md) for product direction and UI/UX context.
