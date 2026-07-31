# TutorialsAdda Backend API Documentation

Welcome to the TutorialsAdda Backend API reference guide. This document details all available REST API endpoints, expected inputs (request bodies, query parameters, headers), and JSON response outputs to enable seamless frontend integration.

## Base URL
- Local Development: `http://localhost:5005/api/v1`
- Production: `https://api.tutorialsadda.com/api/v1`

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response payload
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description message",
  "error": {}
}
```

---

## Authentication Mechanism
Most protected routes require a JWT token passed in the request headers:
```http
Authorization: Bearer <jwt_token>
```

---

## API Endpoints Reference

### 1. Authentication APIs (`/api/v1/auth`)

#### Register User
- **Endpoint:** `POST /api/v1/auth/register`
- **Access:** Public
- **Input (JSON Body):**
  ```json
  {
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "password123"
  }
  ```
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "student"
      },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Access:** Public
- **Input (JSON Body):**
  ```json
  {
    "email": "john@gmail.com",
    "password": "password123"
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "student"
      },
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
  }
  ```

#### Get Current User (Me)
- **Endpoint:** `GET /api/v1/auth/me`
- **Access:** Protected (Student / Author / Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "User fetched successfully",
    "data": {
      "user": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "John Doe",
        "email": "john@gmail.com",
        "role": "student"
      }
    }
  }
  ```

---

### 2. Categories & Hierarchy APIs

#### Get All Branches
- **Endpoint:** `GET /api/v1/branches`
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Branches fetched successfully",
    "data": {
      "branches": [
        {
          "id": "65f1a2b3c4d5e6f7a8b9c0d2",
          "name": "Computer Science",
          "slug": "computer-science",
          "description": "Engineering branch tutorials",
          "image": "https://..."
        }
      ]
    }
  }
  ```

#### Get Single Branch by Slug
- **Endpoint:** `GET /api/v1/branches/:slug`
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Branch fetched successfully",
    "data": {
      "branch": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d2",
        "name": "Computer Science",
        "slug": "computer-science",
        "description": "Engineering branch tutorials"
      }
    }
  }
  ```

#### Get Subjects
- **Endpoint:** `GET /api/v1/subjects`
- **Query Params:** `?branch=<branch_id>` (optional)
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Subjects fetched successfully",
    "data": {
      "subjects": [
        {
          "id": "65f1a2b3c4d5e6f7a8b9c0d3",
          "name": "Data Structures",
          "slug": "data-structures",
          "branch": "65f1a2b3c4d5e6f7a8b9c0d2",
          "description": "Learn fundamental data structures"
        }
      ]
    }
  }
  ```

#### Get Topics
- **Endpoint:** `GET /api/v1/topics`
- **Query Params:** `?subject=<subject_id>` (optional)
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Topics fetched successfully",
    "data": {
      "topics": [
        {
          "id": "65f1a2b3c4d5e6f7a8b9c0d4",
          "name": "Arrays",
          "slug": "arrays",
          "subject": "65f1a2b3c4d5e6f7a8b9c0d3",
          "description": "Mastering array algorithms"
        }
      ]
    }
  }
  ```

---

### 3. Tutorial CMS APIs (`/api/v1/tutorials`)

#### Get All Tutorials
- **Endpoint:** `GET /api/v1/tutorials`
- **Query Params:** `page`, `limit`, `search`, `branch`, `subject`, `topic`
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tutorials fetched successfully",
    "data": {
      "tutorials": [
        {
          "id": "65f1a2b3c4d5e6f7a8b9c0d5",
          "title": "Two Sum Algorithm",
          "slug": "two-sum-algorithm",
          "description": "Learn Two Sum problem efficiently",
          "status": "published"
        }
      ]
    }
  }
  ```

#### Search Tutorials
- **Endpoint:** `GET /api/v1/tutorials/search`
- **Query Params:** `?q=binary search`
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tutorials searched successfully",
    "data": {
      "tutorials": []
    }
  }
  ```

#### Get Tutorial by Slug
- **Endpoint:** `GET /api/v1/tutorials/:slug`
- **Access:** Public
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Tutorial fetched successfully",
    "data": {
      "tutorial": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d5",
        "title": "Two Sum Algorithm",
        "slug": "two-sum-algorithm",
        "content": "Detailed content...",
        "codeBlocks": [
          {
            "language": "cpp",
            "code": "#include <vector>..."
          }
        ],
        "seo": {
          "title": "Two Sum Algorithm",
          "description": "Learn Two Sum",
          "keywords": ["two sum"]
        }
      }
    }
  }
  ```

#### Create Tutorial
- **Endpoint:** `POST /api/v1/tutorials`
- **Access:** Protected (Author / Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Input (JSON Body):**
  ```json
  {
    "title": "Two Sum Algorithm",
    "description": "Learn Two Sum",
    "content": "Tutorial content...",
    "branch": "65f1a2b3c4d5e6f7a8b9c0d2",
    "subject": "65f1a2b3c4d5e6f7a8b9c0d3",
    "topic": "65f1a2b3c4d5e6f7a8b9c0d4",
    "codeBlocks": [
      {
        "language": "javascript",
        "code": "console.log('hello')"
      }
    ],
    "seo": {
      "title": "Two Sum",
      "description": "Learn Two Sum"
    }
  }
  ```
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Tutorial created successfully",
    "data": {
      "tutorial": {}
    }
  }
  ```

---

### 4. Quiz APIs (`/api/v1/quizzes`)

#### Get Quiz By ID
- **Endpoint:** `GET /api/v1/quizzes/:id`
- **Access:** Public / Student
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Quiz fetched successfully",
    "data": {
      "quiz": {
        "id": "65f1a2b3c4d5e6f7a8b9c0d6",
        "tutorial": "65f1a2b3c4d5e6f7a8b9c0d5",
        "questions": [
          {
            "question": "What is time complexity of array access?",
            "options": ["O(1)", "O(n)"],
            "correctAnswer": "O(1)",
            "explanation": "Constant time"
          }
        ]
      }
    }
  }
  ```

#### Submit Quiz Answers
- **Endpoint:** `POST /api/v1/quizzes/:id/submit`
- **Access:** Protected (Student)
- **Headers:** `Authorization: Bearer <token>`
- **Input (JSON Body):**
  ```json
  {
    "answers": ["O(1)"]
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Quiz submitted successfully",
    "data": {
      "score": 100,
      "correctAnswers": 1,
      "totalQuestions": 1
    }
  }
  ```

---

### 5. Bookmark & Progress APIs

#### Get User Bookmarks
- **Endpoint:** `GET /api/v1/bookmarks`
- **Access:** Protected (Student)
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bookmarks fetched successfully",
    "data": {
      "bookmarks": []
    }
  }
  ```

#### Add Bookmark
- **Endpoint:** `POST /api/v1/bookmarks/:tutorialId`
- **Access:** Protected (Student)
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Tutorial bookmarked successfully",
    "data": {}
  }
  ```

#### Get Learning Progress
- **Endpoint:** `GET /api/v1/progress`
- **Access:** Protected (Student)
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Progress fetched successfully",
    "data": {
      "progress": []
    }
  }
  ```

#### Mark Tutorial Completed
- **Endpoint:** `POST /api/v1/progress/:tutorialId`
- **Access:** Protected (Student)
- **Output (201 Created):**
  ```json
  {
    "success": true,
    "message": "Progress recorded successfully",
    "data": {}
  }
  ```

---

### 6. Admin Analytics & Management APIs (`/api/v1/admin`)

#### Get Platform Analytics
- **Endpoint:** `GET /api/v1/admin/analytics`
- **Access:** Protected (Admin)
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "Analytics fetched successfully",
    "data": {
      "totalUsers": 150,
      "totalTutorials": 45,
      "totalViews": 2300
    }
  }
  ```
