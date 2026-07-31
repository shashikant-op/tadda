# AGENTS.md — TutorialsAdda Backend Development Agent


# Project Name

TutorialsAdda Backend


---

# Project Objective


Build a production-ready backend API for TutorialsAdda.


TutorialsAdda is an engineering/programming tutorial platform where users can:

- Explore branches
- Learn subjects
- Read topics
- Study tutorials
- View code examples
- Watch embedded videos
- Attempt quizzes
- Track learning progress


The backend must provide:

- Authentication
- User management
- Tutorial management
- Category management
- Quiz management
- Bookmark system
- Learning progress tracking
- Analytics


---

# Backend Quality Target


The backend should be:

- Clean
- Fast
- Secure
- Scalable
- Maintainable
- Production ready


Target:

Startup MVP supporting:


10,000 - 100,000 users



---

# Development Rules


## Phase Based Development


The AI developer must not build everything at once.


Development must happen phase-by-phase.


Every phase follows:



Build Feature

    ↓

Create Database Models

    ↓

Implement APIs

    ↓

Test APIs

    ↓

Connect Frontend

    ↓

Verify Complete Flow

    ↓

Move To Next Phase



Never move to the next phase if the current phase is incomplete.


---

# Core Development Principle


Backend must be API-first.


The backend should be independent from frontend.


Architecture:



Frontend

↓

REST API

↓

Express Backend

↓

MongoDB Database



---

# Technology Stack


## Runtime


Node.js


## Framework


Express.js


## Database


MongoDB


## ODM


Mongoose


## Authentication


JWT Authentication


## File Storage


Cloudinary


Used for:

- Tutorial images
- User profile images
- Educational media


## Video Support


YouTube Embedded Videos


Videos are not stored directly.


Store:

- YouTube video URL
- Video metadata


---

# Backend Architecture


Use MVC + Service Layer architecture.


Structure:



Request

↓

Routes

↓

Middleware

↓

Controller

↓

Service

↓

Model

↓

MongoDB



---

# Folder Structure


Use:



backend

├── src
│
│
├── config
│
│ ├── database.js
│ ├── cloudinary.js
│ └── jwt.js
│
│
├── controllers
│
│ ├── auth.controller.js
│ ├── user.controller.js
│ ├── tutorial.controller.js
│ ├── category.controller.js
│ ├── quiz.controller.js
│ └── admin.controller.js
│
│
├── models
│
│ ├── User.js
│ ├── Branch.js
│ ├── Subject.js
│ ├── Topic.js
│ ├── Tutorial.js
│ ├── Quiz.js
│ ├── Bookmark.js
│ └── Progress.js
│
│
├── routes
│
│ ├── auth.routes.js
│ ├── user.routes.js
│ ├── tutorial.routes.js
│ ├── category.routes.js
│ ├── quiz.routes.js
│ └── admin.routes.js
│
│
├── middleware
│
│ ├── auth.middleware.js
│ ├── role.middleware.js
│ ├── error.middleware.js
│ └── upload.middleware.js
│
│
├── services
│
│ ├── auth.service.js
│ ├── tutorial.service.js
│ ├── upload.service.js
│ └── email.service.js
│
│
├── validators
│
│ ├── auth.validator.js
│ ├── tutorial.validator.js
│ └── user.validator.js
│
│
├── utils
│
│ ├── ApiError.js
│ ├── ApiResponse.js
│ ├── slug.js
│ └── pagination.js
│
│
├── app.js
│
└── server.js



---

# Environment Configuration


Never hardcode secrets.


Use:



.env



Required:



PORT

MONGO_URI

JWT_SECRET

JWT_EXPIRE

CLOUDINARY_NAME

CLOUDINARY_KEY

CLOUDINARY_SECRET

CLIENT_URL



---

# Database Design Principles


MongoDB schema must be designed for:


- Fast reads
- SEO pages
- Tutorial discovery
- Easy management


Avoid unnecessary duplication.


---

# Main Data Relationship


Tutorial hierarchy:



Branch

|

└── Subject

        |

        └── Topic

                |

                └── Tutorial


Example:



Computer Science

    |

    Data Structures

            |

            Arrays

                    |

                    Two Sum Algorithm


---

# API Design Rules


All APIs must follow:


REST principles.


Example:



GET

/api/tutorials

POST

/api/tutorials

PUT

/api/tutorials/:id

DELETE

/api/tutorials/:id



---

# API Response Format


Every API response must follow:


Success:


```json
{
 "success": true,
 "message": "Tutorial fetched successfully",
 "data": {}
}

Error:

{
 "success": false,
 "message": "Something went wrong",
 "error": {}
}
Error Handling

Central error handling middleware required.

All errors should pass through:

error.middleware.js

Handle:

Validation errors
Authentication errors
Authorization errors
Database errors
Server errors
Async Handling

All controllers must use async error handling.

Avoid:

try {

}
catch(error){

}

Repeated everywhere.

Use centralized async handler.

Code Quality Rules

The AI developer must:

DO:

Write clean modules
Use reusable services
Validate inputs
Add comments where needed
Follow naming conventions

DO NOT:

Put database queries inside routes
Put business logic inside controllers
Duplicate code
Store secrets in code
Testing Rule

Every backend feature must be tested before moving ahead.

Testing order:

Database Test

↓

API Test

↓

Authentication Test

↓

Frontend Integration Test


Tools:

Recommended:

Postman
Thunder Client
Jest (optional)

# Part 2 — Database Models, Authentication & Security Architecture


---

# Database Architecture


MongoDB database must support:


- Fast tutorial browsing
- SEO-friendly pages
- User learning tracking
- Content management
- Future scalability


Database:

MongoDB Atlas


ODM:

Mongoose


---

# Database Collections


Required collections:

Users
Branches
Subjects
Topics
Tutorials
Quizzes
Bookmarks
Progress
Analytics


---

# User Model


Collection:
users


Schema:


```js
{
 name: String,

 email: String,

 password: String,

 avatar: String,


 role: {
   type: String,
   enum:[
      "student",
      "author",
      "admin"
   ]
 },


 savedTutorials:[
    ObjectId
 ],


 createdAt: Date,

 updatedAt: Date
}
User Role System
The backend must support three roles.
Admin Role
Admin has complete access.
Permissions:
Manage users

Manage tutorials

Create categories

Delete content

View analytics

Manage authors
Author Role
Authors can:
Create tutorials

Edit own tutorials

Upload images

Add code examples

Create quizzes
Restrictions:
Author cannot:
Delete other author content

Manage users

Access admin settings
Student Role
Students can:
Read tutorials

Bookmark tutorials

Track progress

Attempt quizzes

Manage profile
Branch Model
Collection:
branches
Example:
{
 name:"Computer Science",

 slug:"computer-science",

 description:"Engineering branch tutorials",

 image:"cloudinary_url"
}
Subject Model
Collection:
subjects
Schema:
{
 name:"Data Structures",

 slug:"data-structures",

 branch:{
    type:ObjectId,
    ref:"Branch"
 },

 description:String
}
Topic Model
Collection:
topics
Schema:
{
 name:"Arrays",

 slug:"arrays",

 subject:{
    type:ObjectId,
    ref:"Subject"
 },

 description:String
}
Tutorial Model
Collection:
tutorials
Main content model.
Schema:
{
 title:String,

 slug:String,


 description:String,


 content:String,


 branch:{
   type:ObjectId,
   ref:"Branch"
 },


 subject:{
   type:ObjectId,
   ref:"Subject"
 },


 topic:{
   type:ObjectId,
   ref:"Topic"
 },


 author:{
   type:ObjectId,
   ref:"User"
 },


 images:[
   String
 ],


 video:{
   url:String,
   platform:String
 },


 codeBlocks:[

 {
   language:String,

   code:String

 }

 ],



 quiz:{
    type:ObjectId,
    ref:"Quiz"
 },


 seo:{

   title:String,

   description:String,

   keywords:[String]

 },


 relatedTutorials:[

   ObjectId

 ],



 status:{
    type:String,
    enum:[
      "draft",
      "published"
    ]
 },


 views:Number,


 createdAt:Date,

 updatedAt:Date

}
Quiz Model
Collection:
quizzes
Schema:
{
 tutorial:{
    type:ObjectId,
    ref:"Tutorial"
 },


 questions:[

 {

 question:String,


 options:[

 String

 ],


 correctAnswer:String,


 explanation:String


 }

 ]

}
Example:
Question:

What is React?


Options:

A) Library

B) Language

C) Database


Answer:

A
Bookmark Model
Collection:
bookmarks
Schema:
{

 user:{
   type:ObjectId,
   ref:"User"
 },


 tutorial:{
   type:ObjectId,
   ref:"Tutorial"
 },


 createdAt:Date

}
Progress Model
Collection:
progress
Schema:
{

 user:{
   type:ObjectId,
   ref:"User"
 },


 tutorial:{
   type:ObjectId,
   ref:"Tutorial"
 },


 completed:Boolean,


 completedAt:Date

}
Authentication System
Authentication method:
JWT Authentication
Flow:
User Register

↓

Password Hashing

↓

Save User

↓

Login

↓

Generate JWT

↓

Send Token

↓

Access Protected Routes
Password Security
Passwords must never be stored as plain text.
Use:
bcrypt
Process:
Plain Password

↓

bcrypt hash

↓

Store hash in database
JWT Structure
JWT payload:
{
"userId":"123",

"role":"student"
}
Token contains:
User identity
User role
Authentication Middleware
Create:
auth.middleware.js
Responsibilities:
Verify JWT
Extract user
Attach user to request
Example:
req.user
Authorization Middleware
Create:
role.middleware.js
Example:
Admin route:
authorize(
"admin"
)
Author route:
authorize(
"author",
"admin"
)
Protected Route Examples
Public:
GET /api/tutorials
Student:
POST /api/bookmarks
Author:
POST /api/tutorials
Admin:
DELETE /api/users/:id
Input Validation
Every request body must be validated.
Use:
Joi

or

Zod
Validate:
User input
Tutorial data
Quiz data
Profile updates
Security Rules
Implement:
Helmet
Protect HTTP headers.
CORS
Allow only frontend domain.
Example:
CLIENT_URL=https://tutorialsadda.com
Rate Limiting
Prevent abuse.
Apply on:
Authentication routes

Upload routes

Search routes
MongoDB Protection
Prevent:
Injection attacks
Invalid queries
Use:
Mongoose validation
Sanitization
File Upload System
Storage:
Cloudinary
Allowed uploads:
Images:
jpg
png
webp
Video:
Only:
YouTube URLs
Do not store videos on backend server.
Upload Flow
Frontend

↓

Backend Upload API

↓

Cloudinary

↓

Save URL

↓

MongoDB

↓

Return Response
Logging
Backend should log:
Errors
API requests
Authentication failures
Recommended:
Winston

Part 3 — API Architecture, CMS, User Features & Integration


---

# API Architecture


All APIs must follow REST architecture.


Base URL:

/api/v1


Example:

GET
/api/v1/tutorials


---

# API Response Standard


Every API response must follow the same structure.


## Success Response


```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
Error Response
{
  "success": false,
  "message": "Error message",
  "error": {}
}
Authentication APIs
Base:
/api/v1/auth
Register User
Endpoint:
POST /auth/register
Request:
{
"name":"John Doe",

"email":"john@gmail.com",

"password":"password123"
}
Response:
{
"user":{},
"token":"jwt_token"
}
Login User
Endpoint:
POST /auth/login
Request:
{
"email":"john@gmail.com",

"password":"password123"
}
Logout User
Endpoint:
POST /auth/logout
Get Current User
Endpoint:
GET /auth/me
Protected:
JWT Required
User APIs
Base:
/api/v1/users
Get Profile
GET /users/profile
Update Profile
PUT /users/profile
Can update:
Name
Avatar
Bio
Change Password
PUT /users/password
Category Management APIs
Hierarchy:
Branch

↓

Subject

↓

Topic

↓

Tutorial
Branch APIs
Base:
/api/v1/branches
Create Branch
POST /branches
Access:
Admin
Get All Branches
GET /branches
Public.
Get Single Branch
GET /branches/:slug
Update Branch
PUT /branches/:id
Admin only.
Delete Branch
DELETE /branches/:id
Admin only.
Subject APIs
Base:
/api/v1/subjects
Create:
POST /subjects
Admin.
Get Subjects:
GET /subjects
Get Subject:
GET /subjects/:slug
Update:
PUT /subjects/:id
Delete:
DELETE /subjects/:id
Topic APIs
Base:
/api/v1/topics
Create:
POST /topics
Admin.
Get Topics:
GET /topics
Get Topic:
GET /topics/:slug
Update:
PUT /topics/:id
Delete:
DELETE /topics/:id
Tutorial CMS APIs
Base:
/api/v1/tutorials
Tutorial is the core content entity.
Create Tutorial
Endpoint:
POST /tutorials
Access:
Admin

Author
Request:
{
"title":"Two Sum Algorithm",

"description":"Learn Two Sum",

"content":"Tutorial content",

"branch":"id",

"subject":"id",

"topic":"id",

"codeBlocks":[
{
"language":"cpp",
"code":"..."
}
],

"quiz":"quizId"
}
Get All Tutorials
GET /tutorials
Features:
Support:
Pagination
Search
Filtering
Sorting
Example:
GET /tutorials?page=1&limit=10
Search Tutorials
Endpoint:
GET /tutorials/search
Search by:
Title
Topic
Subject
Branch
Keywords
Example:
/tutorials/search?q=binary search
Get Tutorial By Slug
Endpoint:
GET /tutorials/:slug
Example:
/computer-science/data-structures/arrays/two-sum
Returns:
Tutorial content
Images
Code
Quiz
Related tutorials
SEO data
Update Tutorial
Endpoint:
PUT /tutorials/:id
Access:
Owner Author

Admin
Delete Tutorial
Endpoint:
DELETE /tutorials/:id
Access:
Admin

Tutorial Owner
Publish Tutorial
Endpoint:
PATCH /tutorials/:id/publish
Only:
Admin

Author
Tutorial Content Rules
Tutorial supports:
Title

Description

Content

Images

Code blocks

Videos

Quiz

SEO Metadata

Related Tutorials
Quiz APIs
Base:
/api/v1/quizzes
Create Quiz
POST /quizzes
Access:
Author

Admin
Get Quiz
GET /quizzes/:id
Submit Quiz
POST /quizzes/:id/submit
Request:
{
"answers":[
"A",
"B",
"C"
]
}
Response:
{
"score":80,

"correctAnswers":8,

"totalQuestions":10
}
Bookmark APIs
Base:
/api/v1/bookmarks
Add Bookmark
POST /bookmarks/:tutorialId
Student only.
Remove Bookmark
DELETE /bookmarks/:tutorialId
Get User Bookmarks
GET /bookmarks
Learning Progress APIs
Base:
/api/v1/progress
Mark Tutorial Completed
POST /progress/:tutorialId
Student only.
Get Learning Progress
GET /progress
Returns:
Completed tutorials

Percentage

Learning history
File Upload APIs
Base:
/api/v1/upload
Upload Image
POST /upload/image
Flow:
Frontend

↓

Backend

↓

Cloudinary

↓

Return URL

↓

Save MongoDB
Upload Rules
Allowed:
jpg

png

webp
Maximum size:
5MB
Video Handling
Videos are not uploaded.
Only store:
{
"url":"youtube.com/watch",

"platform":"youtube"
}
SEO APIs
Tutorial SEO data must be stored and returned.
Each tutorial response should include:
{
"seo":{
"title":"",
"description":"",
"keywords":[]
}
}
Frontend uses this for:
Metadata
Open Graph
Schema
Admin APIs
Base:
/api/v1/admin
Dashboard Analytics
Endpoint:
GET /admin/analytics
Return:
Total users

Total tutorials

Total views

Popular tutorials

Active authors
Manage Users
Get users:
GET /admin/users
Update user role:
PATCH /admin/users/:id/role
Delete User:
DELETE /admin/users/:id
Frontend Integration Rule
After completing each API module:
Follow:
Test API using Postman

↓

Verify response

↓

Connect frontend

↓

Test complete user flow

↓

Document API
Never build frontend integration before API testing.
Pagination Standard
All list APIs should support:
page

limit

sort

search

filter
Example:
GET /tutorials?page=2&limit=20
Performance Rules
Optimize:
Database queries
MongoDB indexes
API responses
Create indexes for:
Tutorial slug

Tutorial title

Category fields

User email

Part 4 — Development Phases, Testing, Deployment & Production Rules


---

# Backend Development Strategy


The backend must be developed in controlled phases.


Every phase must complete:

Database Design
↓
Backend Implementation
↓
API Testing
↓
Frontend Integration
↓
Complete Flow Verification
↓
Move To Next Phase


Do not skip testing.


---

# PHASE 0 — Backend Project Setup


## Objective


Create a clean Express backend foundation.


Tasks:


Setup:

Node.js
Express.js
MongoDB connection
Mongoose
Environment variables
Error handling
Basic routing


Create:

src
config
controllers
models
routes
services
middleware
utils


---

## Testing


Verify:

Server starts
MongoDB connects
Environment variables load
Basic API works


After verification:

Move to Phase 1.


---

# PHASE 1 — Database Architecture


## Objective


Create all MongoDB models.


Models:

User
Branch
Subject
Topic
Tutorial
Quiz
Bookmark
Progress
Analytics


Implement:


- Schema validation
- Relationships
- Indexes
- Timestamps


---

## Testing


Verify:

Documents save correctly
Relationships work
Validation works
Indexes created


Use:

MongoDB Compass
MongoDB Atlas


---

# PHASE 2 — Authentication System


## Objective


Implement complete authentication.


Features:

Register
Login
Logout
JWT Authentication
Password Hashing
Role Authorization


Implement:

bcrypt
JWT
Auth Middleware
Role Middleware


---

## Testing


Test:


Student:

Can register
Can login
Can access student routes


Author:

Author role works
Cannot access admin routes


Admin:

Full access works


Do not continue until authentication is stable.


---

# PHASE 3 — Category Management System


## Objective


Build:

Branch
Subject
Topic


APIs:

Create
Read
Update
Delete


Access:


Admin only.


---

## Testing


Verify:

Create branch
Add subject
Add topic
Fetch hierarchy


Expected:

Computer Science
↓
Data Structures
↓
Arrays


---

# PHASE 4 — Tutorial CMS


## Objective


Build the core content system.


Features:

Create Tutorial
Edit Tutorial
Delete Tutorial
Publish Tutorial
Get Tutorial
Search Tutorial


Tutorial supports:

Title
Description
Content
Images
Code blocks
Videos
Quiz
SEO metadata
Related tutorials


---

## Testing


Complete flow:

Author Login
↓
Create Tutorial
↓
Upload Image
↓
Add Code
↓
Add Quiz
↓
Publish
↓
Student Views Tutorial


---

# PHASE 5 — Cloudinary Integration


## Objective


Implement media upload.


Support:


Images:

jpg
png
webp


Storage:

Cloudinary


---

## Testing


Verify:

Upload image
Receive Cloudinary URL
Save URL
Display image


---

# PHASE 6 — Quiz System


## Objective


Implement tutorial quizzes.


Features:

Create Quiz
Attach Quiz
Submit Quiz
Calculate Score
Store Result


---

## Testing


Verify:

Student opens quiz
Answers questions
Submits quiz
Receives score
Progress updates


---

# PHASE 7 — Student Features


## Objective


Implement learning features.


Features:

Bookmarks
Learning Progress
Profile Management


---

## Testing


Verify:


Bookmark:

Add bookmark
Remove bookmark
View bookmarks


Progress:

Complete tutorial
Save progress
View learning history


---

# PHASE 8 — Admin Dashboard APIs


## Objective


Create administration APIs.


Features:

Manage Users
Manage Tutorials
Manage Categories
View Analytics


---

## Testing


Admin should:

View statistics
Manage users
Manage content
View platform data


---

# PHASE 9 — Search & SEO Support


## Objective


Prepare backend for Google traffic.


Implement:

SEO Metadata API
Tutorial Slugs
Search API
Related Tutorials


---

## Testing


Verify:


Search:

binary search


Returns:

Relevant tutorials
Topics
Categories


---

# PHASE 10 — Frontend Integration


## Objective


Connect complete frontend and backend.


Integration order:

Authentication
↓
Categories
↓
Tutorial Pages
↓
Search
↓
Bookmarks
↓
Progress
↓
Admin Dashboard


---

## Integration Testing


Test complete user journey:


Student:

Register
↓
Login
↓
Search Tutorial
↓
Read Tutorial
↓
Bookmark
↓
Complete Quiz
↓
Track Progress


Author:

Login
↓
Create Tutorial
↓
Upload Content
↓
Publish


Admin:

Login
↓
Manage Platform


---

# API Testing Requirements


Every API must be tested using:


Recommended:

Postman
Thunder Client


Test:


## Success Cases


Example:

Valid request
Correct permissions
Expected response


---

## Failure Cases


Test:

Invalid token
Missing fields
Wrong role
Not found data
Server error


---

# Database Optimization


Before production:


Implement:


## Indexes


Required indexes:

User email
Tutorial slug
Tutorial title
Category slug


---

## Query Optimization


Avoid:

Unnecessary database calls
Large response payloads
Duplicate queries


Use:

Pagination
Population only when required
Projection


---

# Backend Error Handling


Production backend must have:

Global Error Middleware
Custom Error Classes
Proper HTTP Status Codes
Readable Error Messages


Status codes:

200 Success
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Server Error


---

# Logging


Production logging should capture:

API Requests
Errors
Authentication Failures
Database Errors


Recommended:

Winston


---

# Deployment


Backend deployment:

Render


Database:

MongoDB Atlas


Media:

Cloudinary


---

# Production Environment Checklist


Before deployment verify:


## Environment

All variables configured
No secrets committed
Production database connected


---

## Security


Check:

JWT secure
CORS configured
Rate limiting enabled
Input validation active


---

## API


Verify:

All endpoints working
Correct status codes
Proper responses
Frontend connected


---

## Database


Verify:

Indexes created
Backup enabled
Connection stable


---

# Final Backend Rules


The AI developer must always prioritize:


1. Clean architecture

2. Secure APIs

3. Proper database design

4. Testing before moving forward

5. Frontend compatibility

6. Maintainable code


The final backend should be a reliable foundation for a professional education startup platform.


---

# END OF BACKEND_AGENTS.md