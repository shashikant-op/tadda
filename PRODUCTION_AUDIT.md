# Production Audit

## 36-Phase Completion (2026-08-25)

All phases defined in `AI_INSTRUCTIONS.md` were audited. The review covered architecture; every frontend route/component/form class; authentication/session behavior; API routes and frontend consumers; models, indexes, relationships, and deletion behavior; error/loading/empty states; React/network/asset/API performance; security, sanitization, uploads, authorization, and rate limiting; responsive breakpoints; accessibility; SEO; tutorial/search/admin UX; environment/dependencies/tests/edge cases/build/deployment/observability; UX polish, performance targets, and dead code.

| Phases | Outcome |
| --- | --- |
| 1–3 Architecture, frontend, forms | COMPLETE: architecture mapped; interactive/form submission states audited; critical duplicate-submit paths are disabled while pending. |
| 4–7 Auth, API, database, errors | COMPLETE: role escalation, draft disclosure, ownership, hierarchy integrity, deletion guards, quiz exposure, invalid sessions, and API failure behavior addressed. |
| 8–13 UI/network/asset/API performance | COMPLETE: loading/empty states reviewed, unbounded tutorial loads removed, navbar N+1 subject preloading removed, images optimized, and pagination/search bounded. |
| 14–18 Security/input/upload/authz/rate limits | COMPLETE: P0/P1 boundaries fixed; magic-byte image checks and high-risk rate limits added; dependency advisories resolved. |
| 19–23 Responsive/a11y/SEO/tutorial/search | COMPLETE: browser-tested at 320, 375, 390, 430, 768, 1024, 1280, and 1440px; tablet overflow fixed; quiz and search flows repaired; robots, sitemap, and 404 added. |
| 24–30 Admin/integrity/logs/env/deps/tests/edges | COMPLETE: destructive guards, ownership/data-integrity checks, safe env templates, dependency audits, and targeted regression tests completed. |
| 31–36 Build/deploy/observability/UX/performance/dead code | COMPLETE: Next 16.3.2 production build passes; deployment config reviewed; request IDs and `/health` added; lint is clean. |

“Complete” means the repository phase was inspected and all discovered P0/P1 application defects that were reasonably fixable locally were fixed. Live database/provider verification remains environment-dependent as recorded under Remaining Risks.

## Scope and Architecture

- `thubnew/`: Next.js 16 App Router frontend, React 19, Zustand authentication state, Axios service layer, and an admin AI-pipeline route handler.
- `backend/`: Express 4 REST API using MVC/service conventions, MongoDB/Mongoose, JWT bearer authentication, role middleware, Joi validation, Multer/Cloudinary uploads, and Jest/Supertest tests.
- `aipipeline/`: isolated TypeScript course-generation pipeline with research, curriculum, content, visual, validation, persistence, and job-management stages.
- Main flows: public branch/subject/tutorial browsing and search; registration/login with JWT stored by the frontend; protected bookmarks/progress/profile; author tutorial creation/publishing; admin analytics/user/category management; admin-triggered AI course generation persisted through existing backend APIs.

## Baseline (2026-08-25)

| Area | Command | Result |
| --- | --- | --- |
| Backend install | `npm install` | PASS |
| Backend tests | `npm test` | BLOCKED: 25 tests fail because the configured remote MongoDB host is unreachable in this environment; the suite also assumes an external database instead of an isolated test database. |
| Backend lint/typecheck/build | n/a | No scripts or static-check configuration present. |
| AI pipeline install | `npm install` | PASS |
| AI pipeline typecheck/build | `npm run build` | PASS |
| AI pipeline tests | `npm test` | FAIL: 2 of 25 tests fail because mock prompt parsing returns `determining what the course should cover` instead of `Compiler Design`. |
| Frontend install | `npm install` | PASS |
| Frontend lint | `npm run lint` | FAIL: 8 errors and 12 warnings. |
| Frontend typecheck | `npx tsc --noEmit` | PASS |
| Frontend production build | `npm run build` | PASS outside the filesystem sandbox; the sandbox-only Turbopack port denial is environmental. |

## Critical Issues (P0)

### P0-3: AI pipeline secrets file was tracked by Git

- Location: `aipipeline/.env`
- Root cause: the repository tracked the live environment file and had no root ignore policy covering nested environment files.
- User impact: provider, backend, or administrative credentials may be exposed to anyone with repository/history access.
- Status: FIXED for future commits. The local file is preserved, removed from Git tracking, and covered by `.gitignore`; safe example files were added. All credentials previously committed must be rotated because repository history is not rewritten by this fix.

### P0-1: Public registration permits privilege escalation

- Location: `backend/src/validators/auth.validator.js`, `backend/src/services/auth.service.js`
- Root cause: the public registration body accepts `role`, and the service persists `admin` or `author` directly.
- User impact: any unauthenticated caller can create an administrator account and take full control of users and content.
- Status: FIXED. Public registration rejects `role`, and the service independently forces `student`.

### P0-2: Stored XSS in tutorial rendering

- Location: `thubnew/src/components/tutorial/MarkdownRenderer.tsx`
- Root cause: stored tutorial HTML and markdown-derived inline HTML are passed to `dangerouslySetInnerHTML` without sanitization or escaping.
- User impact: an author or compromised content pipeline can execute script-capable markup in readers' browsers and steal locally stored JWTs.
- Status: FIXED. Both stored HTML and markdown-derived inline HTML are sanitized with DOMPurify before rendering.

## High Priority Issues (P1)

### P1-14: Course and tutorial cards generated incorrect or incomplete canonical URLs

- Location: tutorial/category list controllers; frontend subject/tutorial services, course endpoint, navbar, tutorial card, and tutorial player.
- Root cause: populated list responses omitted branch/subject slugs, frontend cards substituted hard-coded `computer-science/general` segments, subject lookup was not branch-scoped, and legacy duplicate subject slugs could select an empty record.
- User impact: course clicks could stop at an empty course page or open a valid lesson under the wrong URL.
- Status: FIXED. List/search APIs now include slugs; subject resolution is branch-aware; duplicate legacy subjects are checked by ID; course URLs automatically redirect to the first published lesson; invalid legacy lesson URLs redirect to the canonical branch/course/lesson path. Browser verification confirmed the reported course redirects to `/computer-science/formal-language-and-automata-theory/applications-of-automata-theory`, and the old `/computer-science/general/applications-of-automata-theory` URL self-corrects with `Curriculum (1)` and no console errors.

### P1-13: Course player showed `Curriculum (0)` while the current lesson was visible

- Location: `thubnew/src/app/(public)/[branch]/[subject]/[...slug]/page.tsx`
- Root cause: the curriculum request preferred a subject slug even though subject slugs are only scoped within a branch; duplicate slugs could resolve to another subject and return no lessons.
- User impact: the course sidebar was empty and previous/next lesson navigation could not be built.
- Status: FIXED. The player now filters with the populated subject ID and keeps the authoritative current published lesson in the curriculum if a stale/inconsistent list response omits it. Browser verification on the reported Automata Theory URL renders `Curriculum (1)` with its lesson link and no console errors.

### P1-14: Normal navigation exhausts the authentication rate limit

- Location: backend application and authentication routes.
- Root cause: one IP-based 20-request bucket covered every `/auth` endpoint, including routine `/auth/me` session initialization and logout requests.
- User impact: ordinary navigation could block valid login attempts for 15 minutes and display “Too many requests.”
- Status: FIXED. Rate limiting is scoped to login and registration only; successful logins do not consume failed-login capacity; session checks and logout are not throttled by the login bucket. The default login threshold is 50 failed attempts per five minutes and is environment-configurable. Dedicated regression tests confirm 25 session checks remain authentication failures rather than becoming HTTP 429, while sustained failed-login abuse is still blocked.

### P1-13: Curriculum topic and lesson sequencing could not be persisted

- Location: public tutorial curriculum page, category/tutorial controllers and tutorial creation service.
- Root cause: topic rows had drag metadata but no drop handler; lesson movement mixed grouped and course-wide indices; new topics and lessons defaulted to order `0`; topic order was not included in populated curriculum data.
- User impact: drag-and-drop appeared available but topic moves did nothing, lesson moves could produce the wrong sequence, and newly added curriculum entries appeared near the beginning.
- Status: FIXED. Topic and lesson drops now reorder within their correct scopes with optimistic rollback, topic order is returned and applied independently, new entries receive the next order value, legacy equal-order entries use oldest-first ordering, and reorder requests validate topic IDs and subject scope. Reorders use verified bulk database writes and compare the returned stored sequence when the backend provides it; the frontend remains compatible with already-running older backend processes whose successful reorder response has no data payload. Mutable curriculum lists bypass localStorage caching so refresh reads the authoritative database order. Local development now points the browser API at the corrected local backend instead of the older deployed API.

### P1-12: Quiz answers leaked through tutorial detail and grading was client-side

- Location: `backend/src/controllers/tutorial.controller.js`, `thubnew/src/components/quiz/QuizCard.tsx`
- Root cause: tutorial population returned the full quiz, including `correctAnswer`, while the UI attempted to calculate scores locally and did not reliably render object-shaped quizzes.
- User impact: answer keys were public and the core quiz flow was broken/insecure.
- Status: FIXED. Tutorial responses exclude answer keys and the accessible quiz form submits selected option text to the authenticated server scoring endpoint with loading, error, score, and retake states.

### P1-11: Cross-author quiz attachment and tutorial reordering

- Location: `backend/src/controllers/quiz.controller.js`, `backend/src/controllers/tutorial.controller.js`
- Root cause: authors could attach a quiz to, or reorder, tutorials they did not own by changing IDs.
- User impact: IDOR allowed unauthorized mutation of another author’s course content.
- Status: FIXED. Author ownership is enforced; admin behavior is preserved; reordered IDs must be valid and unique.

### P1-10: Tutorial relationships and destructive category/account operations could orphan data

- Location: tutorial/category/admin controllers and tutorial service.
- Root cause: branch/subject/topic relationships were accepted independently; parent categories and authors could be deleted while referenced; tutorial deletion left quiz/bookmark/progress/saved/related references.
- User impact: inconsistent navigation, dangling references, and inaccessible content.
- Status: FIXED. Tutorial hierarchy is validated, parent deletion returns 409 while children exist, authors with tutorials cannot be deleted, self-demotion/deletion is blocked, and tutorial dependents are cleaned up.

### P1-9: High-severity production dependency advisories

- Location: `backend/package.json`, `thubnew/package.json`, lockfiles.
- Root cause: Cloudinary `<2.7.0` and the previous Next.js/transitive PostCSS/Sharp/Nano ID stack matched high-severity advisories.
- User impact: upload argument injection and vulnerable production build/runtime dependencies.
- Status: FIXED. Cloudinary upgraded to 2.10.1, Next.js to 16.3.2, Nano ID patched; `npm audit --omit=dev` reports zero vulnerabilities in backend, frontend, and AI pipeline.

### P1-1: Draft tutorials are publicly accessible

- Location: `backend/src/controllers/tutorial.controller.js`
- Root cause: unauthenticated list requests can set any `status`, and the public slug endpoint does not enforce `published`.
- User impact: unpublished/private work is disclosed publicly; `?edit=true` also suppresses view counting without authentication.
- Status: FIXED. Public list/detail queries enforce `published`; authenticated author/admin edit reads use optional JWT authentication plus ownership checks.

### P1-2: AI generation endpoint is not admin-authorized

- Location: `thubnew/src/app/api/ai-pipeline/run/route.ts`
- Root cause: the route accepts missing/unverified bearer tokens and starts an expensive pipeline before backend persistence enforces authorization.
- User impact: unauthenticated callers can trigger costly AI/research work and resource exhaustion.
- Status: FIXED. The Next.js route now requires a bearer token, verifies it through the existing `/auth/me` backend endpoint, and requires the `admin` role before pipeline work starts.

### P1-3: Quiz answer keys are returned before submission

- Location: `backend/src/controllers/quiz.controller.js`, `backend/src/models/Quiz.js`
- Root cause: `GET /quizzes/:id` serializes each question's `correctAnswer` to all authenticated roles.
- User impact: students can inspect the response and trivially obtain every answer.
- Status: FIXED. Quiz retrieval strips `correctAnswer`; scoring remains server-side. Empty quizzes are rejected instead of producing an invalid score.

### P1-4: Pipeline mock curriculum extracts the wrong course title

- Location: `aipipeline/src/providers/AIProvider.ts`
- Root cause: a broad regex captures a later prose phrase in the curriculum prompt instead of the explicit course name.
- User impact: mock/default pipeline runs persist a course under an unrelated title; 2 pipeline tests fail.
- Status: FIXED. Mock prompt parsing targets the explicit curriculum/course label. All 25 pipeline tests pass.

### P1-5: Production lint gate fails

- Location: frontend search and AI-pipeline admin/route files.
- Root cause: unsafe `any` usage and a synchronous state update inside an effect violate configured rules.
- User impact: CI/release lint gate cannot pass.
- Status: FIXED. Frontend lint exits successfully with zero errors (8 P2 performance warnings remain).

### P1-6: Navbar hydration failure and invalid nested controls

- Location: `thubnew/src/components/navbar/Navbar.tsx`, `thubnew/src/components/ui/button.tsx`, `thubnew/src/app/layout.tsx`
- Root cause: persisted client authentication changed the first client render relative to SSR; `Button` ignored its `asChild` contract and emitted nested interactive elements; the inline theme script was rendered as a normal React script node.
- User impact: the homepage logged an uncaught hydration error and regenerated its navigation on the client.
- Status: FIXED. Auth-dependent navigation is gated until mount, mobile navigation uses styled links directly, the unsupported prop was removed, and theme initialization uses Next.js `Script`.

### P1-7: Frontend production API fallback omitted the API prefix

- Location: `thubnew/src/lib/constants.ts`
- Root cause: the fallback used the API host root even though every documented backend route is under `/api/v1`.
- User impact: a deployment missing `NEXT_PUBLIC_API_URL` would send all frontend API calls to nonexistent paths.
- Status: FIXED. The fallback now matches the documented production base URL.

## Medium Priority (P2)

- **FIXED:** Admin dashboard metrics no longer use hard-coded `1000`, `3`, `5`, or `99.9%` fallbacks. Tutorial, user, and branch totals render from MongoDB analytics; system health reflects the real authenticated analytics/database request state. Analytics count queries execute concurrently, and a controller regression test verifies the database response shape.

- **FIXED:** Search input is validated, length-limited, escaped as a literal, paginated, capped at 100 records per page, and rate-limited.
- **FIXED:** Frontend tutorial loading now uses bounded 100-record pages instead of requesting 1,000 records in one response; filtered/admin collections retrieve additional pages explicitly.
- **FIXED:** All configured frontend lint warnings were removed, including unoptimized static/dynamic image markup and an unused type import.
- **FIXED:** Cloudinary errors/timeouts now produce explicit 502/504 failures instead of silently embedding multi-megabyte base64 data URLs in API/database payloads. Uploads are rate-limited.
- **PARTIAL:** Database-independent backend coverage now has a dedicated `npm run test:unit` command with 9 passing tests. The legacy integration suites still require a reachable MongoDB instance and are not hermetic.
- **DEFERRED ARCHITECTURAL RISK:** Token storage in `localStorage` increases the impact of client-side injection. Moving to HttpOnly cookies requires coordinated backend CSRF/session and frontend authentication changes, so it was not attempted as a low-risk cleanup.
- **FIXED:** Persisted sessions are verified against `/auth/me` on initialization instead of trusting stale local user data; 401 responses clear both persisted auth values and synchronize the store.
- **FIXED:** Navbar subject discovery no longer fires one request per branch on every page; subjects load on demand for the active branch and are cached in component state.
- **FIXED:** Search ignores stale overlapping responses, disables repeat submission while active, and stores the trimmed query in the URL for refresh/back/forward behavior.
- **FIXED:** Added `robots.txt`, `sitemap.xml`, and a user-friendly application 404 page.
- **FIXED:** Added request IDs and a non-sensitive `/health` endpoint.
- **REMAINING:** The sitemap contains stable static routes only. A complete tutorial/category sitemap needs a production-reachable database/API during server generation or a dedicated backend sitemap feed.

## Low Priority (P3)

- **FIXED:** The lesson creation/editor page now provides an authenticated **AI Image Prompt** action. It sends the complete lesson to Gemini through a server-only route, applies the supplied educational-visual rules, strictly validates Gemini's JSON, replaces prior suggestions to prevent duplicates, and inserts only the final image-generation prompt at its referenced lesson block. The stored Markdown and clearly distinguished green preview card omit internal IDs, placement JSON, purpose metadata, and other authoring details; the card retains a copy action. The Gemini key is never sent to the browser. Live generation, exact paragraph placement, and green preview rendering were verified end to end in the signed-in browser using the supported `gemini-3.6-flash` model.
- **FIXED:** Tutorial owners and admins can update lesson content directly from the public reader page using the existing Markdown Write/Preview editor. Saving uses the ownership-protected update API, reports errors inline, updates the rendered lesson immediately, invalidates tutorial caches, and persists after refresh; cancel leaves the stored lesson unchanged.
- **FIXED:** The lesson Preview tab is now directly editable. Sanitized rich-preview changes convert back to GitHub-flavored Markdown on blur, preserve fenced-code languages, and synchronize with the Write tab and save/publish payload without rewriting untouched previews.
- **FIXED:** Authors can select text in the editable Preview and apply paragraph/H1/H2/H3, bold, italic, underline, strikethrough, bullet or numbered lists, blockquotes, links, horizontal rules, and clear formatting. The editor explicitly preserves and restores the selected range for toolbar actions and link prompts, uses browser-compatible block formatting values, and resets cleared blocks to paragraphs. Underline and numbered-list formatting survive the HTML-to-Markdown save round-trip and render correctly after reopening a lesson.
- **FIXED:** Replaced the placeholder root README with architecture, setup, environment, and verification guidance.
- **FIXED:** Replaced the nonfunctional search Filter control with a working category-browse action and made branch selectors keyboard-accessible pressed buttons.
- **FIXED:** Empty searches no longer make unnecessary API requests; global and page search fields now have accessible names.
- **FIXED:** Removed hard-coded demo credentials from login errors/UI, added appropriate credential autocomplete hints, and improved login-modal dialog semantics.
- **RETAINED INTENTIONALLY:** AI pipeline console output is required execution observability under the project instructions; it is structured operational logging, not decorative debug output.

## Fixed

- Closed unauthenticated admin/author account creation with validator and service-level defenses.
- Prevented stored tutorial XSS.
- Prevented public draft disclosure while preserving owner/admin edit access.
- Protected the expensive AI generation endpoint with verified admin authorization.
- Removed quiz answer keys from pre-submission responses.
- Corrected pipeline mock curriculum naming.
- Cleared the frontend lint error gate and corrected the observed navbar hydration failure.
- Corrected the production API fallback path.
- Escaped, bounded, paginated, and rate-limited search.
- Replaced oversized tutorial requests with bounded pagination.
- Made upload failures explicit and rate-limited the upload endpoint.
- Cleared all frontend lint warnings and optimized image components.
- Removed the live AI environment file from Git tracking and added safe environment templates/ignore rules.
- Replaced placeholder repository documentation.

## Tests Added

- Added nine database-independent backend tests covering role escalation, service-level role enforcement, published-only tutorial list/detail access, quiz answer redaction, regex escaping, pagination bounds, and upload success/failure behavior.

## Final Verification

| Check | Result |
| --- | --- |
| Backend targeted unit/security tests | PASS: 11/11 |
| Backend full suite | ENVIRONMENT BLOCKED: security suite passes; 25 legacy integration tests cannot connect to the configured MongoDB Atlas host (`ECONNREFUSED`). |
| AI pipeline tests | PASS: 25/25 |
| AI pipeline build/typecheck | PASS |
| Frontend lint | PASS: zero errors and zero warnings |
| Frontend typecheck | PASS |
| Frontend production build | PASS |
| Frontend runtime smoke | PASS: `/`, `/search`, and `/admin/ai-pipeline` returned 200; unauthenticated pipeline POST returned 401. |
| Responsive browser audit | PASS after fix: no document overflow at 320, 375, 390, 430, 768, 1024, 1280, or 1440px on the homepage; search also passed at 320px. |
| Dependency audit | PASS: zero production vulnerabilities in backend, frontend, and AI pipeline. |

## Remaining Risks

- Live database-backed flows cannot be fully exercised until an isolated/reachable MongoDB test database is available.
- External Cloudinary, search, and Gemini behavior requires valid service credentials and network access for end-to-end verification.
- No discovered P0/P1 application defect remains unresolved in this session. Full database-backed verification remains blocked by environment connectivity, not by a suppressed test failure.
- Previously committed credentials still require rotation; removing `.env` from tracking does not erase Git history.
- Core Web Vitals targets require measurement against the deployed production origin with representative traffic; the local audit removed observed request/asset/layout problems but cannot certify field LCP/INP/CLS.
