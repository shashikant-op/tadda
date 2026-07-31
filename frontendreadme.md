# TutorialsAdda Frontend Page & Data Requirement Guide

This document specifies every frontend page in the TutorialsAdda platform, the backend API endpoints it connects to, and the exact data structures and formats required for rendering.

---

## 1. Home Page (`/`)
- **Route:** `src/app/page.tsx`
- **Data Requirements:**
  - **Branches:** Fetched via `GET /api/v1/branches`
  - **Featured Tutorials:** Fetched via `GET /api/v1/tutorials/search?q=Two` (or featured filter)
- **Data Format Required:**
  ```json
  {
    "branches": [
      {
        "id": "string",
        "name": "Computer Science",
        "slug": "computer-science",
        "description": "string",
        "image": "string"
      }
    ],
    "tutorials": [
      {
        "id": "string",
        "title": "Two Sum Algorithm",
        "slug": "two-sum-algorithm",
        "description": "string",
        "status": "published"
      }
    ]
  }
  ```

---

## 2. Branch Page (`/[branch]`)
- **Route:** `src/app/(public)/computer-science/page.tsx` (dynamic routing support)
- **Data Requirements:**
  - **Branch Details:** `GET /api/v1/branches/:slug`
  - **Subjects List:** `GET /api/v1/subjects?branch=:branchId`
- **Data Format Required:**
  ```json
  {
    "branch": {
      "id": "string",
      "name": "Computer Science",
      "slug": "computer-science",
      "description": "string"
    },
    "subjects": [
      {
        "id": "string",
        "name": "Data Structures",
        "slug": "data-structures",
        "description": "string"
      }
    ]
  }
  ```

---

## 3. Subject & Topic Pages (`/[branch]/[subject]`, `/[branch]/[subject]/[topic]`)
- **Route:** `src/app/(public)/computer-science/data-structures/page.tsx`
- **Data Requirements:**
  - **Subject Details:** `GET /api/v1/subjects/:slug`
  - **Topics List:** `GET /api/v1/topics?subject=:subjectId`
  - **Tutorials List:** `GET /api/v1/tutorials?topic=:topicId`
- **Data Format Required:**
  ```json
  {
    "subject": {
      "id": "string",
      "name": "Data Structures",
      "slug": "data-structures"
    },
    "topics": [
      {
        "id": "string",
        "name": "Arrays",
        "slug": "arrays"
      }
    ]
  }
  ```

---

## 4. Tutorial Reading Page (`/[branch]/[subject]/[topic]/[slug]`)
- **Route:** `src/app/(public)/[branch]/[subject]/[topic]/[slug]/page.tsx`
- **Data Requirements:**
  - **Tutorial Content:** `GET /api/v1/tutorials/:slug`
  - **Quiz Data:** Included in tutorial response or fetched via `GET /api/v1/quizzes/:id`
- **Data Format Required:**
  ```json
  {
    "tutorial": {
      "id": "string",
      "title": "Two Sum Algorithm",
      "slug": "two-sum-algorithm",
      "description": "Learn Two Sum",
      "content": "Markdown / HTML content...",
      "codeBlocks": [
        {
          "language": "cpp",
          "code": "#include <vector>..."
        }
      ],
      "video": {
        "url": "https://youtube.com/watch?v=...",
        "platform": "youtube"
      },
      "quiz": {
        "id": "string",
        "questions": [
          {
            "question": "What is time complexity?",
            "options": ["O(1)", "O(n)"],
            "correctAnswer": "O(1)",
            "explanation": "Constant time access"
          }
        ]
      },
      "seo": {
        "title": "Two Sum Algorithm | TutorialsAdda",
        "description": "Learn Two Sum",
        "keywords": ["two sum"]
      }
    }
  }
  ```

---

## 5. Search Page (`/search`)
- **Route:** `src/app/(public)/search/page.tsx`
- **Data Requirements:**
  - **Search Query:** `GET /api/v1/tutorials/search?q=:query`
- **Data Format Required:**
  ```json
  {
    "tutorials": [
      {
        "id": "string",
        "title": "Binary Search",
        "slug": "binary-search",
        "description": "Search algorithm"
      }
    ]
  }
  ```

---

## 6. Authentication Pages (`/auth/login`, `/auth/register`)
- **Route:** `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`
- **Data Requirements:**
  - **Login Request:** `POST /api/v1/auth/login` (Body: `{ email, password }`)
  - **Register Request:** `POST /api/v1/auth/register` (Body: `{ name, email, password }`)
- **Response Format:**
  ```json
  {
    "user": {
      "id": "string",
      "name": "John Doe",
      "email": "john@gmail.com",
      "role": "student"
    },
    "token": "jwt_token_string"
  }
  ```

---

## 7. Student Dashboard & Profile (`/dashboard`, `/profile`)
- **Route:** `src/app/dashboard/page.tsx`, `src/app/profile/page.tsx`
- **Data Requirements:**
  - **Current User:** `GET /api/v1/auth/me`
  - **Bookmarks:** `GET /api/v1/bookmarks`
  - **Learning Progress:** `GET /api/v1/progress`
  - **Update Profile:** `PUT /api/v1/users/profile`
- **Data Format Required:**
  ```json
  {
    "bookmarks": [
      {
        "id": "string",
        "tutorial": {
          "title": "Two Sum Algorithm",
          "slug": "two-sum-algorithm"
        }
      }
    ],
    "progress": [
      {
        "tutorial": "string",
        "completed": true,
        "completedAt": "timestamp"
      }
    ]
  }
  ```

---

## 8. Author / Admin Pages (`/author/create`, `/admin`)
- **Route:** `src/app/author/create/page.tsx`, `src/app/admin/page.tsx`
- **Data Requirements:**
  - **Create Tutorial:** `POST /api/v1/tutorials`
  - **Upload Image:** `POST /api/v1/tutorials/upload/image` (Multipart Form-Data)
  - **Analytics:** `GET /api/v1/admin/analytics`
- **Data Format Required:**
  ```json
  {
    "analytics": {
      "totalUsers": 150,
      "totalTutorials": 45,
      "totalViews": 2300
    }
  }
  ```
