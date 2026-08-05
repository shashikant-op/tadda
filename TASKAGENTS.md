# AGENT TASK — Full Production Audit of the Entire Project

You are a Principal Software Engineer, Software Architect, QA Lead, Security Engineer, DevOps Engineer, Performance Engineer, and Product Engineer with 20+ years of experience building and reviewing large-scale production systems.

Your task is **NOT** to implement new features immediately.

Your first responsibility is to perform a **complete production audit** of the entire project and generate a comprehensive report documenting every issue, bug, architectural weakness, security risk, scalability concern, performance bottleneck, UX problem, and code quality issue.

Do not assume anything is correct.

Think like a senior engineer preparing this project for millions of users.

---

# Objective

Perform a complete audit of the entire codebase.

Analyze:

* Frontend
* Backend
* API
* Database
* Authentication
* Authorization
* Admin Panel
* Author Dashboard
* User Dashboard
* State Management
* Routing
* SEO
* UI
* UX
* Accessibility
* Performance
* Scalability
* Security
* DevOps
* Deployment
* Error Handling
* Logging
* Testing
* Build System
* Code Quality

Everything.

---

# IMPORTANT

Do NOT modify code during this phase.

This phase is only for investigation.

Generate a detailed markdown document.

Name it:

PROJECT_AUDIT_REPORT.md

---

# Audit Process

Work systematically.

Never skip a directory.

Inspect every file.

Inspect every route.

Inspect every component.

Inspect every API.

Inspect every database model.

Inspect every middleware.

Inspect every hook.

Inspect every utility.

Inspect every configuration.

Inspect every environment variable.

Inspect everything.

---

# 1 Frontend Audit

Inspect every page.

Inspect every component.

Inspect every layout.

Inspect every hook.

Inspect every context.

Inspect every store.

Inspect every service.

Inspect every utility.

Look for

Broken pages

Broken navigation

Broken links

Unused pages

Duplicate pages

Incorrect routing

Hydration issues

Memory leaks

Missing loading states

Missing error states

Infinite rendering

Bad React patterns

Large components

Code duplication

Improper state management

Race conditions

Rendering performance

Accessibility issues

Responsiveness

Dark mode issues

Animation issues

SEO issues

Image optimization

Lazy loading

Bundle size

Suspense usage

Next.js best practices

Server vs Client component mistakes

Missing metadata

Broken breadcrumbs

Incorrect layouts

Unnecessary re-renders

Hardcoded data

Console logs

Unused imports

Unused states

Dead code

---

# 2 Backend Audit

Inspect every controller.

Inspect every service.

Inspect every route.

Inspect every middleware.

Inspect every validator.

Inspect every model.

Inspect every helper.

Inspect every utility.

Look for

Business logic bugs

Duplicate logic

Unhandled exceptions

Poor folder structure

Missing validation

Missing sanitization

Missing pagination

Missing filtering

Missing sorting

Improper status codes

Improper error handling

Slow database queries

Circular dependencies

Memory leaks

Blocking operations

Large controller methods

Code duplication

Security vulnerabilities

Improper async usage

Race conditions

Incorrect API design

REST violations

Improper DTOs

---

# 3 Database Audit

Inspect

Indexes

Relations

Schemas

Validation

References

Aggregation

Transactions

Population

Duplicate fields

Naming conventions

Scalability

Normalization

Denormalization

Query performance

Missing indexes

N+1 queries

Collection growth

Migration strategy

Backup strategy

---

# 4 Authentication Audit

Inspect

JWT

Refresh tokens

Access tokens

Cookies

Sessions

Password hashing

Forgot password

Reset password

Email verification

Role management

Permission system

Admin protection

Route guards

Expired token handling

Unauthorized access

Privilege escalation

---

# 5 Authorization Audit

Verify every route.

Ensure users cannot access

Admin APIs

Other users' data

Private resources

Author-only routes

Admin-only routes

---

# 6 API Audit

Inspect every endpoint.

Verify

HTTP methods

Response format

Error format

Validation

Authentication

Authorization

Rate limiting

Pagination

Filtering

Sorting

Caching

Idempotency

OpenAPI compatibility

Versioning

---

# 7 Security Audit

Search entire project for

XSS

SQL Injection

Mongo Injection

CSRF

SSRF

RCE

Prototype pollution

Unsafe HTML

Unsafe Markdown

Unsafe uploads

Missing sanitization

File upload vulnerabilities

Open redirects

Secrets in repository

Leaked API keys

Weak JWT secret

Improper CORS

Weak CSP

Improper headers

Missing Helmet

Missing rate limiting

DOS vulnerabilities

Dependency vulnerabilities

Unsafe localStorage usage

Broken authentication

Broken authorization

---

# 8 Performance Audit

Measure

Rendering speed

API speed

Database speed

Network requests

Component rendering

Image loading

Caching

Compression

Bundle size

Lazy loading

Memoization

Virtualization

Duplicate fetches

Waterfall requests

Blocking rendering

Slow queries

Large payloads

Memory usage

CPU usage

---

# 9 Scalability Audit

Can this project support

1,000 users

10,000 users

100,000 users

1 million users

Analyze

Database

Backend

API

Frontend

Caching

Queue

CDN

Horizontal scaling

Microservices readiness

Statelessness

Load balancing

Connection pooling

Background jobs

---

# 10 UI Audit

Inspect every screen.

Look for

Alignment issues

Spacing inconsistencies

Typography

Button consistency

Icon consistency

Input consistency

Form consistency

Empty states

Loading states

Hover states

Focus states

Responsive design

Visual hierarchy

Professional appearance

---

# 11 UX Audit

Inspect

Navigation

Search

Forms

Validation

Notifications

Modals

Dialogs

Editor

Dashboard

Admin workflow

Author workflow

User workflow

Accessibility

Discoverability

User journey

---

# 12 Code Quality Audit

Look for

Large files

Large functions

Duplicate code

Magic numbers

Bad naming

Unused code

Unused variables

Improper abstractions

Bad folder structure

Improper separation of concerns

SOLID violations

DRY violations

KISS violations

Dependency inversion

Cyclomatic complexity

---

# 13 DevOps Audit

Inspect

Docker

Docker Compose

CI/CD

GitHub Actions

Environment variables

Production config

Logging

Monitoring

Health checks

Backup

Deployment scripts

Rollback strategy

---

# 14 Testing Audit

Inspect

Unit tests

Integration tests

API tests

E2E tests

Coverage

Critical flows

Regression testing

---

# 15 Documentation Audit

Inspect

README

API documentation

Architecture documentation

Deployment guide

Environment setup

Contributing guide

Developer onboarding

---

# Deliverables

Generate a markdown report named:

PROJECT_AUDIT_REPORT.md

The report must include:

## 1. Executive Summary

* Overall project health score (0–100)
* Production readiness score
* Security score
* Performance score
* Scalability score
* Code quality score
* UI/UX score

---

## 2. Critical Issues (P0)

Issues that must be fixed immediately.

For each issue include:

* Title
* Description
* Location (file/path)
* Impact
* Risk
* Recommended fix

---

## 3. High Priority Issues (P1)

---

## 4. Medium Priority Issues (P2)

---

## 5. Low Priority Issues (P3)

---

## 6. Bugs Found

Include

* Reproduction steps
* Expected behavior
* Actual behavior
* Root cause
* Suggested fix

---

## 7. Broken Functionality

List every feature that is partially working, broken, or incomplete.

---

## 8. Performance Bottlenecks

Include profiling observations and optimization recommendations.

---

## 9. Security Findings

Categorize by severity:

Critical

High

Medium

Low

---

## 10. Scalability Risks

Explain what will fail as traffic grows and how to improve it.

---

## 11. Architecture Review

Evaluate:

* Folder structure
* Separation of concerns
* Maintainability
* Extensibility
* Technical debt

---

## 12. UI/UX Review

Evaluate every major screen with actionable improvements.

---

## 13. Code Smells

List files with:

* Large components
* Complex logic
* Duplication
* Anti-patterns

---

## 14. Improvement Roadmap

Create a phased roadmap:

### Phase 1

Critical fixes

### Phase 2

Architecture improvements

### Phase 3

Performance optimization

### Phase 4

Security hardening

### Phase 5

Scalability enhancements

### Phase 6

Developer experience improvements

---

## 15. Final Verdict

State clearly:

* Is this project production-ready?
* What are the biggest blockers?
* Estimated effort to reach enterprise production quality.
* Top 20 highest-impact improvements.

---

# Final Instructions

* Do not guess—base every finding on the codebase.
* Include exact file paths and line references where possible.
* Prioritize issues by severity and business impact.
* Avoid duplicate findings by grouping related issues.
* Write the report in professional Markdown with tables and checklists.
* If a recommended fix is substantial, include a brief implementation strategy rather than full code.
* At the end, provide an overall action plan that would take the project from its current state to enterprise-grade production quality.
