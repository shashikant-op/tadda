# AGENTS.md — TutorialsAdda Frontend Development Agent

# Project Name

TutorialsAdda


# Project Objective

Build a premium, production-ready engineering tutorial platform frontend.

TutorialsAdda is an online learning platform where users can explore:

- Programming branches
- Subjects
- Topics
- Tutorials
- Code examples
- Images and diagrams
- Quizzes

The platform should provide a learning experience similar to:

- GeeksforGeeks
- TutorialsPoint
- MDN
- Modern SaaS learning platforms


## Quality Target

The frontend quality target is:

"$200k+ SaaS quality frontend"


The application must be:

- Fast
- Scalable
- SEO optimized
- Responsive
- Accessible
- Production ready
- Maintainable


---

# Development Rules

## Phase Based Development

The AI developer must build the project phase-by-phase.

Do not generate the complete application at once.


Every phase must follow this workflow:


Build Feature

    ↓

Run Tests

    ↓

Verify UI

    ↓

Connect Backend API

    ↓

Test Complete Flow

    ↓

Move To Next Phase



Never move to the next phase until the current phase is fully working.


---

# Reference Design Rules

A homepage screenshot/Figma reference will be provided.

The reference design is the source of truth.


The AI developer must:

- Study the reference carefully
- Match layout structure
- Match navbar design
- Match colors
- Match typography
- Match spacing
- Match component style
- Match responsive behavior


## Strict Rule

Do not redesign existing reference screens.


Do not:

- Change navbar
- Change color system
- Change spacing
- Replace components unnecessarily
- Add random UI patterns


All new pages must follow the same design language.


---

# Frontend Technology Stack


## Framework

Next.js 16

Requirements:

- App Router
- Server Components
- Server Side Rendering
- Static Generation where possible


## Language

TypeScript


## Styling

Tailwind CSS


## Component Library

Shadcn UI


## Animation

Framer Motion


## State Management

Zustand


## Server State Management

TanStack Query


## Forms

React Hook Form

Zod Validation


## API Communication

Axios


## Icons

Lucide React


---

# Frontend Architecture Principles


The codebase must follow:


## Component Driven Architecture

Every reusable UI element should be a separate component.


Example:


Button

Navbar

TutorialCard

QuizCard

SearchBar

Footer



---

## Feature Based Structure

Business logic should be organized by feature.


Example:


features

auth

tutorials

bookmark

progress

profile



---

## Clean Code Rules


The AI developer must avoid:

- Duplicate code
- Large components
- Hardcoded API URLs
- Hardcoded tutorial data
- Mixing business logic with UI
- Unnecessary dependencies


Every component should have:

- Clear purpose
- Proper TypeScript types
- Reusable design


---

# Folder Structure


Use the following structure:



src

│
├── app
│
│ ├── layout.tsx
│ ├── page.tsx
│
│ ├── (public)
│ │
│ │ ├── branches
│ │ ├── subjects
│ │ ├── topics
│ │ ├── tutorials
│ │ └── search
│
│ ├── auth
│ │
│ │ ├── login
│ │ └── register
│
│ ├── dashboard
│
│ ├── profile
│
│ └── admin
│
│
├── components
│
│ ├── ui
│ │
│ ├── navbar
│ ├── footer
│ ├── tutorial
│ ├── quiz
│ ├── cards
│ ├── search
│ └── common
│
│
├── features
│
│ ├── auth
│ ├── tutorials
│ ├── bookmarks
│ ├── progress
│ └── users
│
│
├── services
│
│ ├── auth.service.ts
│ ├── tutorial.service.ts
│ ├── user.service.ts
│ └── upload.service.ts
│
│
├── hooks
│
├── store
│
│ ├── auth.store.ts
│
│
├── lib
│
│ ├── axios.ts
│ ├── utils.ts
│ └── constants.ts
│
│
├── types
│
├── validations
│
└── styles



---

# Application Routing


SEO-friendly URLs are mandatory.


Tutorial URL format:



/computer-science/data-structures/arrays/two-sum



The hierarchy must represent:



Branch

↓

Subject

↓

Topic

↓

Tutorial



Examples:



/computer-science

/computer-science/data-structures

/computer-science/data-structures/arrays

/computer-science/data-structures/arrays/two-sum



---

# Required Pages


## Public Pages



Home Page

Branch Listing Page

Subject Page

Topic Page

Tutorial Reading Page

Search Page

Login Page

Register Page



---

## Student Pages



Dashboard

Profile

Bookmarks

Learning Progress

Quiz History



---

## Admin Pages



Admin Dashboard

Tutorial Management

Create Tutorial

Edit Tutorial

Category Management

User Management

Analytics Dashboard



---

# User Roles


The frontend must support:


## Admin Role


Permissions:

- Full platform access
- Manage users
- Manage tutorials
- Manage categories
- View analytics



## Author Role


Permissions:

- Create tutorials
- Edit own tutorials
- Manage own content



## Student Role


Permissions:

- Read tutorials
- Save tutorials
- Bookmark tutorials
- Track learning progress
- Attempt quizzes
- Manage profile


---

# Authentication Requirements


Authentication must support:


## Email Authentication


Features:

- Register
- Login
- Logout
- JWT handling
- Protected routes


## Social Authentication


Support:

- Google Login
- OAuth providers supported by backend


Authentication state should be globally managed using Zustand.


---

# Part 2 — Design System, UI Architecture & Component Rules


---

# Design Philosophy


TutorialsAdda must look like a premium modern learning platform.

Design goals:

- Professional
- Clean
- Trustworthy
- Developer-focused
- Easy learning experience
- High readability


The UI should feel like a combination of:

- Modern SaaS platform
- Developer documentation website
- Premium education platform


---

# Design System Rules


## Layout System


Use an 8px spacing system.


Example:


8px
16px
24px
32px
40px
48px
64px
80px



Avoid random spacing values.


---

# Container Rules


All pages should use a common container.


Example:



max-width:

1280px - 1440px



Desktop:


padding-left: 24px
padding-right: 24px



Mobile:


padding-left: 16px
padding-right: 16px



---

# Typography Rules


Use professional developer-friendly typography.


Recommended:


Headings:


Inter / Geist



Body:


Inter



Code:


JetBrains Mono



Typography hierarchy:



H1

Page title

H2

Section heading

H3

Card heading

Body

Content text

Code

Programming examples



---

# Color System


The color system must be extracted from the provided reference design.


Do not randomly choose colors.


Create centralized tokens:



theme

├── primary

├── secondary

├── background

├── foreground

├── muted

├── border

└── accent



All colors must be reusable.


Never write random colors directly inside components.


Bad:


```tsx
<div className="bg-[#123456]">

Good:

<div className="bg-primary">
Navbar Requirements

The navbar must follow the homepage reference screenshot.

Navbar must be created as a reusable component.

Structure:

Navbar

├── Logo

├── Main Navigation

├── Search

├── Authentication Actions

└── Mobile Menu

Requirements:

Desktop:

Fixed/sticky navigation
Clean spacing
Fast access to categories
Search visibility

Mobile:

Hamburger menu
Responsive navigation drawer
Touch-friendly buttons

Navbar should be used across:

Home

Tutorial pages

Search

Dashboard

Profile
Homepage Architecture

The homepage should be built using reusable sections.

Structure:

Home Page


Navbar


Hero Section

    ├── Main heading

    ├── Description

    ├── Search bar

    └── CTA


Popular Branches


Featured Tutorials


Learning Categories


Latest Tutorials


Popular Topics


Newsletter Section


Footer


Each section must be an independent component.

Example:

components/home


HeroSection.tsx

PopularBranches.tsx

FeaturedTutorials.tsx

LatestTutorials.tsx

Newsletter.tsx

Tutorial Reading Page

The tutorial page is the most important page.

URL example:

/computer-science/data-structures/arrays/two-sum

Layout:

Tutorial Page


Breadcrumb


Title


Description


Author Information


Table Of Contents


Tutorial Content


Images


Code Blocks


Video Section


Quiz Section


Related Tutorials


Comments Section


Tutorial Content Components

Create reusable components:

components/tutorial


TutorialHeader.tsx


TutorialContent.tsx


CodeBlock.tsx


ImageBlock.tsx


VideoEmbed.tsx


TableOfContents.tsx


RelatedTutorials.tsx


Code Block Requirements

Code examples must support:

Syntax highlighting
Copy button
Multiple languages

Supported languages:

JavaScript

TypeScript

Python

Java

C++

C

Go


Example:

CodeBlock

language="cpp"

copy=true

Quiz Components

Quiz UI:

QuizCard


Question


Options


Submit Button


Result


Explanation


Features:

Multiple choice questions
Correct answer display
Score calculation
Progress tracking
Card Components

Create reusable cards:

components/cards


BranchCard


SubjectCard


TopicCard


TutorialCard


QuizCard


AuthorCard


Every card must support:

Loading state
Empty state
Hover state
Responsive behavior
Search Experience

Search is a core feature.

Search UI:

Search Bar


Autocomplete


Filters


Search Results



Users should search by:

Branch
Subject
Topic
Tutorial

Example:

Search:

binary search

Results:

Computer Science

Data Structures

Binary Search Tutorial

Dashboard UI

Student dashboard:

Dashboard


Profile summary


Learning progress


Saved tutorials


Recent activity


Quiz history

Admin Dashboard UI

Admin interface:

Admin Dashboard


Statistics


Tutorial Management


Category Management


User Management


Analytics



Admin UI should be:

Clean
Data-focused
Responsive
Responsive Design Rules

Every page must support:

Desktop
1440px

1280px

1024px
Tablet
768px
Mobile
320px

375px

414px

No horizontal scrolling allowed.

Accessibility Rules

All components must follow:

Semantic HTML
Keyboard navigation
Proper labels
Alt text for images
Good color contrast

Images:

Every image requires:

alt=""
Image Handling

Images should use:

Next.js Image component.

Example:

<Image
 src={image}
 alt="tutorial image"
/>

Requirements:

Lazy loading
Responsive sizing
Optimization enabled

Storage:

Images are served from Cloudinary.

Video Handling

Videos are not uploaded directly.

Use:

YouTube Embedded Videos

Component:

VideoEmbed.tsx

Requirements:

Responsive iframe
Lazy loading
Clean UI
Loading States

Every data fetching component requires:

Loading Skeleton

↓

Data Loaded

↓

Empty State

↓

Error State

Never show blank screens.

Error Handling

Create:

ErrorBoundary

NotFound Page

Network Error UI


User should always understand what happened.

Animation Rules

Use Framer Motion only where it improves UX.

Allowed:

Page transitions
Card hover
Modal animation
Dropdown animation

Avoid:

Excessive animations
Slow loading effects
Distracting movement
Component Quality Rules

Every component must:

Be reusable
Have TypeScript props
Have clear naming
Avoid unnecessary complexity

Example:

Good:

<TutorialCard
 title=""
 category=""
 difficulty=""
/>

Bad:

TutorialPageEverythingComponent.tsx



# Part 3 — SEO, API Integration, Authentication & Performance Rules


---

# SEO Requirements


SEO is a primary requirement because TutorialsAdda depends on organic Google traffic.


Every public page must be optimized for search engines.


Required:

- Server-side rendering
- Metadata generation
- Sitemap
- Robots.txt
- Open Graph tags
- JSON-LD schema
- Breadcrumb schema


---

# SEO Friendly Routing


All tutorial pages must use SEO-friendly URLs.


Example:



/computer-science/data-structures/arrays/two-sum



The URL should contain:



Branch

↓

Subject

↓

Topic

↓

Tutorial



Benefits:

- Better Google ranking
- Better user understanding
- Better sharing experience


---

# Metadata System


Every page must have dynamic metadata.


Example:


Tutorial page:


```ts
title:

"Two Sum Algorithm - Data Structures Tutorial"


description:

"Learn Two Sum algorithm with explanation, examples and code implementation."


keywords:

[
"two sum",
"data structures",
"algorithms"
]


Metadata must come from backend content.

Do not hardcode tutorial SEO data.

Open Graph Requirements

Every shareable page must support:

og:title

og:description

og:image

og:url

og:type


Example:

When a user shares a tutorial:

Facebook / LinkedIn / Twitter should display:

Tutorial title
Thumbnail
Description
JSON-LD Schema

Implement structured data.

Required schemas:

Tutorial Schema
{
 "@type": "Article"
}
Breadcrumb Schema

Example:

Home

>

Computer Science

>

Data Structures

>

Arrays

>

Two Sum

Organization Schema

For TutorialsAdda branding.

Sitemap

Generate:

/sitemap.xml

Include:

Branches

Subjects

Topics

Tutorials

Static pages

Dynamic tutorial URLs must automatically appear.

Robots.txt

Generate:

/robots.txt

Rules:

Allow:

/

Block:

/admin

/dashboard

/profile
API Integration Architecture

Frontend must communicate with backend through services.

Do not call APIs directly inside components.

Bad:

axios.get("/tutorials")

inside component.

Good:

Component

↓

Hook

↓

Service

↓

API

Service Layer Structure

Example:

services


auth.service.ts


tutorial.service.ts


category.service.ts


bookmark.service.ts


progress.service.ts


quiz.service.ts


Axios Configuration

Create:

lib/axios.ts

Responsibilities:

Base URL configuration
JWT token handling
Error handling
Request interceptors
Response interceptors

Example flow:

Request

↓

Attach token

↓

Backend

↓

Response

↓

Update UI

TanStack Query Rules

Use TanStack Query for:

Tutorials
Branches
Subjects
Topics
Search results
User data

Benefits:

Caching
Loading states
Error handling
Automatic refetching
Query Structure

Example:

hooks


useTutorials.ts


useTutorial.ts


useBranches.ts


useSearch.ts


useBookmarks.ts


Zustand Usage

Use Zustand only for client-side global state.

Allowed:

Authentication state

Theme state

Sidebar state

UI preferences

Do not store API data in Zustand.

API data belongs to TanStack Query.

Authentication Flow

Authentication system:

User Login

↓

Backend validates

↓

JWT Token Generated

↓

Frontend stores token securely

↓

User state updated

↓

Protected routes unlocked

Protected Routes

Protected pages:

Dashboard

Profile

Bookmarks

Learning Progress

Admin Dashboard

Must verify:

Is user logged in?

↓

Check role

↓

Allow / Deny access

Role Based Access Control

Frontend must support:

Admin

Routes:

/admin/*

Access:

Full management
Author

Access:

/author/*

Allowed:

Create tutorials
Edit own tutorials
Student

Access:

/dashboard/*

Allowed:

Learning
Bookmark
Progress
Form Handling

All forms must use:

React Hook Form

+

Zod Validation

Required forms:

Login

Register

Profile update

Tutorial creation

Tutorial editing

Quiz creation
Error Handling

Every API request must handle:

Loading

Success

Empty

Error

Unauthorized

Server Error

Example:

Loading:

Show skeleton


Success:

Render content


Empty:

Show empty message


Error:

Show retry button

Security Rules

Never expose:

Secret keys
Admin tokens
Backend credentials

Environment variables:

NEXT_PUBLIC_API_URL

Only public variables should use NEXT_PUBLIC.

Environment Configuration

Create:

.env.local

Example:

NEXT_PUBLIC_API_URL=https://api.tutorialsadda.com

Never hardcode URLs.

Performance Optimization

The application must optimize:

Images

Use:

next/image

Features:

Lazy loading
Optimization
Responsive sizes
Code Splitting

Use:

Dynamic imports
Lazy loading

For:

Admin dashboard
Rich editors
Heavy components
Rendering Strategy

Use:

Server Components:

For:

Tutorial pages
Public content
SEO pages

Client Components:

For:

Forms
Interactive UI
Dashboard actions
Caching Strategy

Public content:

Use:

Static Generation

ISR

Examples:

Branch pages
Subject pages
Tutorial pages

Dynamic user pages:

Use:

Client rendering
Deployment Requirements

Frontend deployment:

Platform:

Vercel

Requirements:

Before production:

Build succeeds
No TypeScript errors
No ESLint errors
Environment variables configured
SEO verified

# Part 4 — Development Phases, Testing & Production Checklist


---

# Development Strategy


The frontend must be developed in structured phases.

Each phase must be:

1. Designed
2. Implemented
3. Tested
4. Connected with backend if required
5. Verified
6. Approved before moving forward


Never skip phases.


---

# PHASE 0 — Project Setup


## Objective

Create a clean Next.js foundation.


Tasks:


Setup:


Next.js 16

TypeScript

Tailwind CSS

Shadcn UI

Framer Motion

TanStack Query

Zustand

Axios

Zod



Create:


Project structure

Environment files

Global styles

Theme configuration

Reusable utilities



---

## Testing


Verify:



Application starts successfully

No TypeScript errors

No ESLint errors

Tailwind works

Components render correctly



After verification:

Move to Phase 1.


---

# PHASE 1 — Design System & Core Components


## Objective

Build the foundation UI system.


Create:



Navbar

Footer

Button

Input

Card

Modal

Dropdown

Loader

Skeleton

Error component



Implement:


- Typography
- Colors
- Spacing system
- Responsive utilities


---

## Testing


Verify:


Desktop:


1440px

1280px



Tablet:


768px



Mobile:


320px

375px



Check:


- Alignment
- Spacing
- Responsive behavior
- Accessibility


After verification:

Move to Phase 2.


---

# PHASE 2 — Homepage Development


## Objective


Build premium TutorialsAdda homepage.


Follow reference screenshot strictly.


Sections:



Navbar

Hero Section

Search

Popular Branches

Featured Tutorials

Popular Topics

Latest Tutorials

Newsletter

Footer



Create reusable components:



HeroSection

BranchCard

TutorialCard

TopicCard

SectionHeader



---

## Testing


Verify:


- UI matches reference
- Responsive layout
- Images load correctly
- Animations work
- Performance is acceptable


Do not continue until homepage is approved.


---

# PHASE 3 — Public Learning Pages


## Objective


Build content discovery system.


Pages:



Branch Listing

Subject Page

Topic Page

Tutorial Reading Page



Data flow:



Frontend

↓

API Service

↓

Backend

↓

MongoDB



---

## Tutorial Page Features


Must include:



Breadcrumb

Title

Description

Author

Table of Contents

Content

Images

Code Blocks

Videos

Quiz

Related Tutorials



---

## Testing


Verify:


- SEO URLs work
- Content loads correctly
- Code blocks render
- Images display
- Video embeds work


After approval:

Move forward.


---

# PHASE 4 — Authentication System


## Objective


Implement user authentication.


Features:



Register

Login

Logout

Google Login

Protected Routes



Roles:



Admin

Author

Student



---

## Testing


Test:


Student:


Can login

Can access dashboard

Cannot access admin



Author:


Can create tutorial

Can edit own tutorial



Admin:


Full access



---

# PHASE 5 — Student Dashboard


## Objective


Create student learning experience.


Pages:



Dashboard

Profile

Bookmarks

Learning Progress

Quiz History



Features:



Save Tutorial

Bookmark

Track completion

View progress

Attempt quizzes



---

## Testing


Verify:


- Progress updates
- Bookmarks save
- Profile updates
- Authentication persists


---

# PHASE 6 — Admin Dashboard


## Objective


Build content management system.


Features:



Manage Tutorials

Create Tutorial

Edit Tutorial

Delete Tutorial

Manage Categories

Manage Users

View Analytics



---

## Tutorial Editor


Support:



Title

Description

Rich Content

Images

Code Blocks

Videos

Quiz

SEO Metadata



---

## Testing


Admin should be able to:



Create tutorial

Upload image

Add video

Add quiz

Publish tutorial



Verify frontend displays created content.


---

# PHASE 7 — Search System


## Objective


Build powerful tutorial discovery.


Features:



Search Tutorials

Filter Results

Search Suggestions

Category Filtering



Search by:



Branch

Subject

Topic

Tutorial



---

## Testing


Verify:


- Search accuracy
- Loading state
- Empty state
- Error handling


---

# PHASE 8 — SEO Implementation


## Objective


Prepare for Google ranking.


Implement:



Dynamic Metadata

Sitemap.xml

robots.txt

Open Graph

JSON-LD Schema

Breadcrumb Schema



---

## Testing


Verify:


Google Rich Results compatibility


Check:



Page title

Description

Schema

Social preview

URLs



---

# PHASE 9 — Performance Optimization


## Objective


Make production-ready.


Optimize:



Images

Bundle size

Loading speed

Caching

Rendering



Implement:



Lazy loading

Dynamic imports

Server components

ISR



---

## Testing


Measure:



Lighthouse Score

Core Web Vitals

Mobile Performance



---

# PHASE 10 — Final Production Preparation


Before deployment:


Check:


## Code Quality



No console errors

No warnings

No unused code

Clean structure



---

## Security


Verify:



No exposed secrets

Protected routes work

Role permissions work



---

## SEO


Verify:



Sitemap generated

Robots working

Metadata correct

Schema valid



---

## Deployment


Deploy frontend:



Vercel



Final checks:



Production build successful

Environment variables configured

Backend connected

Database content displayed

Authentication working



---

# Definition Of Done


A feature is complete only when:



UI Completed

↓

Responsive Tested

↓

Backend Connected

↓

API Verified

↓

Error Handling Added

↓

SEO Checked

↓

Production Ready



---

# Final Frontend Rules


The AI developer must always prioritize:


1. User experience

2. Performance

3. SEO

4. Maintainable code

5. Reusable components

6. Clean architecture


The final product should feel like a professional education startup platform, not a basic tutorial website.


# END OF AGENTS.md