# Author Dashboard, API Route & Hydration Fix Changelog

This document tracks all changes made to implement the `/tutorials/author/me` API endpoint, fix author course fetching, and resolve client-side hydration mismatches on the author dashboard.

---

## Summary of Changes

### 1. Author Tutorials API Route (`backend/src/routes/tutorial.routes.js` & `tutorial.controller.js`)
- Added `GET /api/v1/tutorials/author/me` endpoint protected by `protect` and `authorize('author', 'admin')` so authors can fetch their created courses and tutorials successfully.

### 2. Author Dashboard Hydration Fix (`thubnew/src/app/author/dashboard/page.tsx`)
- Added a client-side mounting guard (`mounted` state) to eliminate SSR vs client hydration mismatches when rendering user names from local storage / auth store.

---

## Instructions for Reverting / Undoing Changes

To undo these changes:
1. Revert `backend/src/routes/tutorial.routes.js` and `backend/src/controllers/tutorial.controller.js`.
2. Revert `thubnew/src/app/author/dashboard/page.tsx`.
3. Delete `DOCS_EDITOR_CHANGELOG.md`.
