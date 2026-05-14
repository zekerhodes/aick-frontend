# AIC Kapsowar Hospital - Asset Management UI

React frontend (CRA + Tailwind + shadcn/ui) for the hospital's asset management portal.

## Tech Stack
- React 19 + React Router 7
- Tailwind CSS + shadcn/ui components
- Recharts (dashboards)
- react-barcode (asset labels)
- axios (API client)

## Local Setup
1. Copy env template: `cp .env.example .env.local`
2. Set `REACT_APP_BACKEND_URL` to your backend URL
3. Install deps: `yarn install`
4. Run dev server: `yarn start`

## Default Login (against seeded backend)
- Email: `admin@kapsowar.org`
- Password: `demo1234`

## Features
- Dashboard with KPIs and charts
- Full Asset Tiger-style menu: Assets, Lists, Reports, Tools, Advanced
- 12 asset actions (check-out, check-in, lease, dispose, maintenance, move, reserve, etc.)
- Barcode generator with print-ready labels (CODE128, CODE39, EAN13, UPC)
- AIC Kapsowar Hospital branding with KSh currency
- Scaffolded Pharmacy and Inventory modules (Coming Soon)

## Deployment (Vercel)
- Framework: Create React App
- Build Command: `yarn build`
- Output Directory: `build`
- Environment Variable: `REACT_APP_BACKEND_URL`

## Companion Backend Repo
https://github.com/YOUR-USERNAME/aick-backend
