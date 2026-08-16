# Architecture Documentation - Phase 1 AI Course Generation Pipeline

## 1. Existing Backend
- **Framework**: Node.js & Express (`backend/src/app.js`)
- **Database**: MongoDB via Mongoose (`backend/src/config/database.js`)
- **Authentication**: JWT Bearer Token (`backend/src/middleware/auth.middleware.js`), Role-based access control (`backend/src/middleware/role.middleware.js` supporting `student`, `author`, `admin`).

## 2. Existing Database Models
- **Branch**: Root category (e.g. Computer Science Engineering). Fields: `name`, `slug`, `description`, `image`.
- **Subject** (Course): Sub-category under Branch. Fields: `name`, `slug`, `branch` (ObjectId ref Branch), `description`.
- **Topic**: Chapter/Section under Subject. Fields: `name`, `slug`, `subject` (ObjectId ref Subject), `description`.
- **Tutorial** (Subtopic/Lesson content): Lesson under Topic. Fields: `title`, `slug`, `description`, `content`, `branch`, `subject`, `topic`, `author`, `status` (`draft` or `published`), `views`, `codeBlocks`, `images`, `seo`.
- **User**: Fields: `name`, `email`, `password`, `role` (`student`, `author`, `admin`).

## 3. Existing API Routes
- **Branches**: 
  - `POST /api/v1/branches` (Admin) - Create Branch
  - `GET /api/v1/branches` - Get all Branches
- **Subjects**: 
  - `POST /api/v1/subjects` (Author/Admin) - Create Course/Subject
  - `GET /api/v1/subjects` - Get Subjects
- **Topics**: 
  - `POST /api/v1/topics` (Author/Admin) - Create Topic
  - `GET /api/v1/topics` - Get Topics
- **Tutorials**: 
  - `POST /api/v1/tutorials` (Author/Admin) - Create Lesson/Subtopic content
  - `GET /api/v1/tutorials` - Get Tutorials

## 4. Existing Authentication
- Admin/Author API requests require `Authorization: Bearer <JWT_TOKEN>`.
- Admin user can be logged in via `/auth/login` to obtain the token.

## 5. Integration Points
The AI Pipeline acts as an autonomous orchestrator:
1. Takes Course Name (e.g. "Compiler Design").
2. Researches via search/scraper providers.
3. Generates course structure (Branch, Subject, Topics, Subtopics).
4. Generates educational content and visual prompts.
5. Validates structure and content.
6. Persists into MongoDB by calling existing backend APIs (`/api/v1/branches`, `/api/v1/subjects`, `/api/v1/topics`, `/api/v1/tutorials`) using Admin/Author credentials.

## 6. Unknowns
- None identified. All endpoints, models, and auth mechanisms have been fully audited from repository files.
