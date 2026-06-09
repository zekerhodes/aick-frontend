# AIC Kapsowar Hospital - Asset Management UI

React frontend for the hospital's asset management portal.

## What's New in v0.2
- Camera-based barcode scanner (works on laptop webcams AND phones)
- Full CRUD across all master data (Add/Edit/Delete for categories, locations, vendors, departments, persons, etc.)
- Edit Asset full form (route: /app/assets/:id/edit)
- Real CSV bulk import via Tools > Import
- Audit tool now uses camera scanner with live match/mismatch tracking
- Removed demo-mode notice from login

## Camera Scanner Notes
- Requires HTTPS to access camera (works automatically on Vercel)
- Browser will ask for camera permission first time
- Supports CODE128, CODE39, EAN, UPC, QR codes

## Deployment (Vercel)
- Framework: Create React App
- Build Command: yarn build
- Output Directory: build
- Environment Variable: REACT_APP_BACKEND_URL
- IMPORTANT: also set CI=false in Vercel env vars to allow warnings
