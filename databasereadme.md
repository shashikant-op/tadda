# TutorialsAdda Database & MongoDB Architecture Guide

This document explains how data is structured, modeled, and stored in the MongoDB database for the TutorialsAdda platform.

---

## Database Overview
- **Database Name:** `tutorialsadda` (MongoDB Atlas / Local MongoDB)
- **ODM:** Mongoose (Schema validation, population, timestamps)

---

## Core Data Hierarchy & Relationships
TutorialsAdda follows a strict hierarchical tree structure for content discovery and SEO:

```
Branch (e.g., Computer Science)
  └── Subject (e.g., Data Structures)
        └── Topic (e.g., Arrays)
              └── Tutorial (e.g., Two Sum Algorithm)
                    └── Quiz (Linked 1:1)
```

---

## Collections & Schemas

### 1. Users Collection (`users`)
Stores user accounts, authentication credentials, and permission roles.
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "$2a$10$hashedpassword...",
  "avatar": "https://...",
  "role": "student", // Enum: ["student", "author", "admin"]
  "savedTutorials": ["ObjectId"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 2. Branches Collection (`branches`)
Top-level engineering or educational categories.
```json
{
  "_id": "ObjectId",
  "name": "Computer Science",
  "slug": "computer-science",
  "description": "Engineering branch tutorials and guides",
  "image": "https://..."
}
```

### 3. Subjects Collection (`subjects`)
Mid-level categorization under a Branch.
```json
{
  "_id": "ObjectId",
  "name": "Data Structures",
  "slug": "data-structures",
  "branch": "ObjectId (ref: Branch)",
  "description": "Learn fundamental data structures"
}
```

### 4. Topics Collection (`topics`)
Specific domain concepts under a Subject.
```json
{
  "_id": "ObjectId",
  "name": "Arrays",
  "slug": "arrays",
  "subject": "ObjectId (ref: Subject)",
  "description": "Mastering array algorithms"
}
```

### 5. Tutorials Collection (`tutorials`)
The core content entity containing rich tutorials, code snippets, and SEO metadata.
```json
{
  "_id": "ObjectId",
  "title": "Two Sum Algorithm",
  "slug": "two-sum-algorithm",
  "description": "Learn Two Sum problem efficiently",
  "content": "Detailed markdown/HTML content...",
  "branch": "ObjectId (ref: Branch)",
  "subject": "ObjectId (ref: Subject)",
  "topic": "ObjectId (ref: Topic)",
  "author": "ObjectId (ref: User)",
  "images": ["https://res.cloudinary.com/..."],
  "video": {
    "url": "https://youtube.com/watch?v=...",
    "platform": "youtube"
  },
  "codeBlocks": [
    {
      "language": "cpp",
      "code": "#include <vector>..."
    }
  ],
  "quiz": "ObjectId (ref: Quiz)",
  "seo": {
    "title": "Two Sum Algorithm | TutorialsAdda",
    "description": "Learn Two Sum",
    "keywords": ["two sum", "algorithms"]
  },
  "relatedTutorials": ["ObjectId (ref: Tutorial)"],
  "status": "published", // Enum: ["draft", "published"]
  "views": 120,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 6. Quizzes Collection (`quizzes`)
Interactive multiple-choice questions attached to tutorials.
```json
{
  "_id": "ObjectId",
  "tutorial": "ObjectId (ref: Tutorial)",
  "questions": [
    {
      "question": "What is the time complexity of array access?",
      "options": ["O(1)", "O(n)", "O(log n)"],
      "correctAnswer": "O(1)",
      "explanation": "Arrays allow random access in constant time."
    }
  ]
}
```

### 7. Bookmarks Collection (`bookmarks`)
Stores user saved tutorials.
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "tutorial": "ObjectId (ref: Tutorial)",
  "createdAt": "ISODate"
}
```

### 8. Progress Collection (`progress`)
Tracks student learning completion history.
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "tutorial": "ObjectId (ref: Tutorial)",
  "completed": true,
  "completedAt": "ISODate"
}
```

---

## Database Indexes & Performance Optimization
To ensure high read speed and SEO query efficiency:
- **Tutorial slug:** Unique index for fast URL resolution (`/computer-science/data-structures/arrays/two-sum`).
- **Branch, Subject, Topic slugs:** Indexed for hierarchical browsing.
- **User email:** Unique index for authentication lookup.
- **Tutorial title/content:** Text index for search queries.
