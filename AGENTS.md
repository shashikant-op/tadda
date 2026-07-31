AGENTS.md — TutorialsAdda Full Stack Testing & Verification Agent


# Project Objective


Verify and validate that the existing TutorialsAdda frontend and backend are correctly connected.


The goal is NOT to rebuild anything.


The goal is:

Test Backend
↓
Verify Database Storage
↓
Test APIs
↓
Connect Frontend
↓
Verify Data Fetching
↓
Fix Integration Issues
↓
Confirm Production Readiness


---

# Important Rules


## DO NOT


- Rewrite existing frontend
- Rewrite existing backend
- Change UI design
- Change database architecture
- Create unnecessary features
- Replace working APIs


Only fix:

- Connection issues
- API issues
- Data flow issues
- Authentication issues
- Environment issues


---

# Testing Strategy


Testing must happen in this order:

Backend Testing
Database Verification
API Testing
Frontend API Connection Testing
Complete User Flow Testing


Never test frontend before confirming backend works.


---

# PHASE 1 — Backend Environment Verification


## Objective


Confirm backend can start correctly.


Check:

Node.js installed
Dependencies installed
Environment variables loaded
MongoDB connected
Server running


Verify:


Backend:

npm run dev


Expected:

Server running successfully
Database connected successfully


---

# PHASE 2 — Database Connection Testing


## Objective


Verify backend can communicate with MongoDB.


Check:

MONGO_URI
MongoDB Atlas connection
Database permissions
Collections creation


Test:


Create a temporary test API:

POST /api/v1/test/database


Send:


```json
{
"name":"Test Tutorial",
"type":"database-test"
}
Expected:
Data should appear in MongoDB.
Verify in:
MongoDB Atlas Dashboard

MongoDB Compass
If data is not saved:
Debug:
MongoDB URI
Schema
Model
Controller
Database permissions
Do not continue until database saving works.
PHASE 3 — Backend Dummy Data Testing
Objective
Send dummy data through APIs and verify complete backend flow.
Test order:
Create Branch

↓

Create Subject

↓

Create Topic

↓

Create Tutorial

↓

Create Quiz

↓

Create User
Dummy Branch Test
API:
POST /api/v1/branches
Data:
{
"name":"Computer Science",
"slug":"computer-science",
"description":"Programming and engineering tutorials"
}
Verify:
MongoDB:
branches collection
Expected:
Document exists.
Dummy Subject Test
API:
POST /api/v1/subjects
Data:
{
"name":"Data Structures",
"slug":"data-structures",
"branch":"branch_id"
}
Verify:
subjects collection
Dummy Topic Test
API:
POST /api/v1/topics
Data:
{
"name":"Arrays",
"slug":"arrays",
"subject":"subject_id"
}
Verify:
topics collection
Dummy Tutorial Test
API:
POST /api/v1/tutorials
Data:
{
"title":"Two Sum Algorithm",

"description":"Learn Two Sum",

"content":"Tutorial content example",

"branch":"branch_id",

"subject":"subject_id",

"topic":"topic_id",

"codeBlocks":[
{
"language":"javascript",
"code":"console.log('Hello World')"
}
],

"seo":{
"title":"Two Sum Tutorial",
"description":"Learn Two Sum algorithm"
}
}
Verify:
MongoDB:
tutorials collection
Check:
Data saved
Relations correct
Slug generated
SEO stored
PHASE 4 — Backend API Testing
Use:
Postman

or

Thunder Client
Test every API.
Public API Testing
Check:
GET /tutorials

GET /branches

GET /subjects

GET /topics

GET /tutorial/:slug
Verify:
Response contains database data.
Example:
{
"success":true,
"data":{
"title":"Two Sum Algorithm"
}
}
Authentication Testing
Test:
Register
POST /auth/register
Verify:
User created
Password hashed
Token returned
Login
POST /auth/login
Verify:
Correct credentials
JWT generated
Protected API Testing
Without token:
Expected:
401 Unauthorized
With token:
Expected:
200 Success
Test:
Bookmarks

Progress

Profile

Admin APIs
PHASE 5 — Frontend Connection Testing
Only start after backend is verified.
Environment Verification
Check frontend:
.env.local
Verify:
NEXT_PUBLIC_API_URL
Example:
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
Axios Verification
Check:
src/lib/axios.ts
Verify:
Correct backend URL
Token attached
Error handling works
PHASE 6 — Verify Frontend Data Source
Main Rule
No frontend page should use fake/static data after integration.
Check every page:
Homepage
Verify:
Branches come from backend.
Example:
GET /branches
Branch Page
Verify:
Data comes from:
GET /branches/:slug
Subject Page
Verify:
Data comes from:
GET /subjects/:slug
Topic Page
Verify:
Data comes from:
GET /topics/:slug
Tutorial Page
Verify:
Data comes from:
GET /tutorials/:slug
Check:
Title
Content
Images
Code blocks
Quiz
Related tutorials
If Frontend Data Is Missing
Debug in this order:
1. Check API URL

↓

2. Check Network Tab

↓

3. Check API Response

↓

4. Check Service Function

↓

5. Check React Query Hook

↓

6. Check Component Props
PHASE 7 — Browser Network Testing
Use browser developer tools.
Open:
Chrome DevTools

↓

Network Tab
Verify:
Every page request:
Frontend

↓

Backend API

↓

Response received

↓

UI updated
PHASE 8 — Complete User Flow Testing
Student Flow
Test:
Register

↓

Login

↓

Browse Tutorials

↓

Search

↓

Open Tutorial

↓

Bookmark

↓

Complete Quiz

↓

Track Progress
Author Flow
Test:
Login

↓

Create Tutorial

↓

Upload Image

↓

Add Code

↓

Publish Tutorial

↓

Verify Public Page
Admin Flow
Test:
Login

↓

Open Dashboard

↓

Manage Users

↓

Manage Categories

↓

Manage Tutorials

↓

View Analytics
PHASE 9 — Bug Fixing Rules
When an issue appears:
Follow:
Identify Problem

↓

Find Layer

↓

Fix Smallest Possible Area

↓

Retest

↓

Verify No Regression
Example:
Tutorial not loading:
Check:
Database

↓

Backend API

↓

Axios

↓

React Query

↓

Component
PHASE 10 — Final Production Verification
Before deployment:
Backend
Verify:
MongoDB connected

All APIs working

Authentication working

Errors handled

Environment variables correct
Frontend
Verify:
No mock data

All pages fetch backend data

No console errors

Build successful

SEO working
Final Acceptance Criteria
TutorialsAdda is considered complete only when:
Backend saves real data into MongoDB

↓

APIs return correct data

↓

Frontend fetches real API data

↓

Authentication works

↓

Roles work

↓

Tutorial workflow works

↓

No broken integrations

↓

Production deployment ready