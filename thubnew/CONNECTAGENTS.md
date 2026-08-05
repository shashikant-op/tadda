# AGENTS.md — TutorialsAdda Frontend Backend Integration Agent

## Objective

The frontend is currently using **hardcoded/mock data**. Your job is to convert the entire frontend into a **fully dynamic application** that fetches all data from the backend API.

The backend is already completed.

**DO NOT redesign anything.**

The UI, UX, animations, layout, spacing, colors, typography, responsiveness, routing, and components must remain exactly the same.

Only replace the data source.

---

# Backend Information

Development API

```
http://localhost:5005/api/v1
```

Production API

```
https://api.tutorialsadda.com/api/v1
```

Store inside

```
.env.local

NEXT_PUBLIC_API_URL=http://localhost:5005/api/v1
```

Never hardcode URLs.

---

# Important Rules

## Never

❌ Never use hardcoded arrays

❌ Never use dummy JSON

❌ Never use fake APIs

❌ Never use sample data

❌ Never keep fallback mock data

❌ Never redesign pages

❌ Never change UI

❌ Never change spacing

❌ Never change colors

❌ Never change typography

❌ Never change animations

❌ Never change responsive behavior

❌ Never call fetch directly inside components

---

## Always

✅ Everything must come from backend

✅ Create reusable API services

✅ Handle loading

✅ Handle errors

✅ Handle empty states

✅ Handle unauthorized states

✅ Handle pagination

✅ Handle search

✅ Handle refresh correctly

---

# Phase 1 — Audit Frontend

Search the entire project.

Find every place where data is hardcoded.

Examples

```
mockData

dummyData

sampleData

constants

json files

fake API

temporary arrays

local objects
```

Generate a report.

Example

```
Home

Uses hardcoded branches

Category Cards

Uses hardcoded categories

Tutorial

Uses hardcoded content

Dashboard

Uses demo progress

Search

Uses fake results
```

Do not continue until every hardcoded source has been identified.

---

# Phase 2 — API Architecture

Create

```
src/

services/

api.ts

auth.service.ts

branch.service.ts

subject.service.ts

topic.service.ts

tutorial.service.ts

quiz.service.ts

bookmark.service.ts

progress.service.ts

admin.service.ts
```

All API calls must go through services.

No duplicated request logic.

---

# Phase 3 — API Client

Create reusable API client.

Requirements

- Base URL from environment
- JSON headers
- Authorization support
- Request helper
- Response helper
- Timeout
- Error handling
- Token support
- Typed responses

---

# Phase 4 — Replace Home Page

Replace hardcoded data.

Fetch

```
GET /branches
```

Fetch featured tutorials

```
GET /tutorials/search?q=Two
```

Verify

- cards
- images
- links
- counts
- layout

---

# Phase 5 — Branch Pages

Fetch

```
GET /branches/:slug
```

Fetch

```
GET /subjects?branch=:branchId
```

Everything should render dynamically.

---

# Phase 6 — Subject Pages

Fetch

```
GET /subjects/:slug
```

Fetch

```
GET /topics?subject=:subjectId
```

Render dynamically.

---

# Phase 7 — Topic Pages

Fetch

```
GET /tutorials?topic=:topicId
```

Support

- pagination
- loading
- empty state
- error state

---

# Phase 8 — Tutorial Page

Replace everything.

Fetch

```
GET /tutorials/:slug
```

Render

- title
- description
- markdown/html
- code blocks
- video
- seo
- metadata

If quiz exists

Fetch

```
GET /quizzes/:id
```

Render quiz dynamically.

---

# Phase 9 — Search

Replace fake search.

Use

```
GET /tutorials/search?q=value
```

Support

- debounce
- loading
- empty state
- errors

---

# Phase 10 — Authentication

Register

```
POST /auth/register
```

Login

```
POST /auth/login
```

Current User

```
GET /auth/me
```

Requirements

- Auth Context
- JWT storage
- Protected routes
- Logout
- Token refresh (if applicable)

---

# Phase 11 — Bookmarks

Fetch

```
GET /bookmarks
```

Bookmark

```
POST /bookmarks/:tutorialId
```

Update UI immediately.

---

# Phase 12 — Progress

Fetch

```
GET /progress
```

Complete

```
POST /progress/:tutorialId
```

Dashboard must become fully dynamic.

---

# Phase 13 — Admin

Fetch

```
GET /admin/analytics
```

Replace all static values.

---

# Phase 14 — Loading States

Every page must include

- Skeleton
- Spinner
- Loading UI

No blank screens.

---

# Phase 15 — Error Handling

Handle

- 400
- 401
- 403
- 404
- 500
- Timeout
- Network failure

Never crash.

Show user-friendly UI.

---

# Phase 16 — Empty States

If backend returns

```
[]
```

Show proper empty state.

Never leave blank containers.

---

# Phase 17 — Remove Mock Data

Delete every

- demo array
- json
- fake api
- dummy object
- sample tutorial
- sample category

Frontend must completely depend on backend.

---

# Phase 18 — Development Debug Logging

While integrating the backend, log every API interaction in development mode.

Wrap all logs with a development check (for example `process.env.NODE_ENV === "development"`).

Never log passwords or JWT tokens.

## Before Every Request

Log:

```
========================================
🚀 API REQUEST
Method:
URL:
Headers:
Query:
Body:
========================================
```

---

## After Every Successful Response

Log the full backend response.

Example

```
========================================
✅ API RESPONSE

Endpoint:
/branches

{
 success:true,
 data:{...}
}

========================================
```

---

## After Parsing Data

Immediately log the data that will be rendered.

Example

```
📦 Branches

[...]

Total Branches: 12
```

Do this for

- Branches
- Subjects
- Topics
- Tutorials
- Tutorial Details
- Search Results
- Quiz
- User
- Bookmarks
- Progress
- Analytics

---

## Log Component Rendering

Examples

```
🏠 Home Rendered

Branches:
15

Featured Tutorials:
8
```

```
📚 Subject Page

Subject:
Data Structures

Topics:
22
```

---

## Log Navigation

Whenever route changes

```
➡ Navigation

Home

↓

Computer Science

↓

Data Structures

↓

Arrays

↓

Tutorial
```

---

## Log Search

```
🔍 Searching

binary search
```

After response

```
12 tutorials found
```

---

## Log Authentication

Login

```
🔐 Login Success

User Loaded

Role:
student
```

Logout

```
🔓 Logout Success

Token Removed
```

---

## Log Loading

```
⏳ Loading Branches...
```

```
⏳ Loading Tutorials...
```

When finished

```
✅ Loading Complete
```

---

## Final Integration Report

After frontend finishes loading print

```
================================================

🎉 FRONTEND ↔ BACKEND REPORT

Backend Connected

Base URL

http://localhost:5005/api/v1

✓ Branches

✓ Subjects

✓ Topics

✓ Tutorials

✓ Tutorial Details

✓ Search

✓ Authentication

✓ Bookmarks

✓ Progress

✓ Analytics

Branches: X

Subjects: X

Topics: X

Tutorials: X

No Hardcoded Data Found

Frontend Successfully Connected

================================================
```

---

# Final Testing

Test every API individually.

## Authentication

```
POST /auth/register

POST /auth/login

GET /auth/me
```

Verify authentication works.

---

## Branches

```
GET /branches

GET /branches/:slug
```

---

## Subjects

```
GET /subjects

GET /subjects?branch=id
```

---

## Topics

```
GET /topics

GET /topics?subject=id
```

---

## Tutorials

```
GET /tutorials

GET /tutorials/:slug

GET /tutorials/search
```

Verify

- pagination
- filtering
- search

---

## Quiz

```
GET /quizzes/:id
```

---

## Bookmarks

```
GET /bookmarks

POST /bookmarks/:tutorialId
```

---

## Progress

```
GET /progress

POST /progress/:tutorialId
```

---

## Admin

```
GET /admin/analytics
```

---

# End-to-End Testing

Start backend.

Start frontend.

Navigate

```
Home

↓

Branch

↓

Subject

↓

Topic

↓

Tutorial

↓

Quiz

↓

Dashboard

↓

Bookmarks

↓

Profile

↓

Search

↓

Admin
```

Every page must display backend data.

Refresh browser.

Everything should still work.

---

# Completion Criteria

The task is complete only when:

- Every hardcoded dataset has been removed.
- Every page fetches data from the backend.
- Every API endpoint is connected.
- Every request uses the centralized API service.
- Loading, error, and empty states are implemented.
- Console logs verify every request and response in development mode.
- No passwords or JWT tokens are logged.
- Production builds contain no debug logs.
- Dynamic routing works correctly.
- Images, SEO metadata, and tutorial content come from the backend.
- The application works correctly after a full page refresh.
- There are no TypeScript errors.
- There are no ESLint errors.
- There are no console errors.
- The UI remains visually identical to the original implementation.
- The backend is the single source of truth for all frontend data.
```