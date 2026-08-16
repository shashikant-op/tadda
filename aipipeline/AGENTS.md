Phase 1 — AI Course Generation Pipeline

1. Objective

Build Phase 1 only of the AI Course Generation System.

The goal is:

User enters a course name such as Compiler Design → AI researches the course from multiple sources → creates a comprehensive course structure → generates topics and subtopics → generates educational content → generates image/diagram prompts where useful → validates the generated result → saves the generated course through the existing backend APIs.

Example

Input:

Compiler Design

Expected high-level result:

Compiler Design
│
├── Introduction to Compiler
│   ├── What is a Compiler?
│   ├── Compiler vs Interpreter
│   ├── Compiler vs Assembler
│   └── Language Processing System
│
├── Phases of Compiler
│   ├── Lexical Analysis
│   ├── Syntax Analysis
│   ├── Semantic Analysis
│   ├── Intermediate Code Generation
│   ├── Code Optimization
│   └── Code Generation
│
├── Lexical Analysis
│   ├── Tokens
│   ├── Lexemes
│   ├── Patterns
│   ├── Regular Expressions
│   └── Finite Automata
│
├── Syntax Analysis
│   ├── Context Free Grammar
│   ├── Parse Tree
│   ├── Top Down Parsing
│   └── Bottom Up Parsing
│
└── ...

The system must then generate content for the appropriate subtopics and save the resulting structured course using the existing backend APIs.

⸻

2. VERY IMPORTANT — Existing Code Protection

DO NOT MODIFY EXISTING APPLICATION CODE

This is a strict requirement.

Before doing anything:

1. Read the entire relevant repository structure.
2. Identify frontend and backend applications.
3. Identify existing API routes.
4. Identify existing database models.
5. Identify authentication.
6. Identify course/topic/tutorial creation APIs.
7. Identify existing admin routes.
8. Identify existing services/utilities that can be safely consumed.

Do NOT modify existing production code unless explicitly required and approved by the user.

Do NOT:

* rewrite existing APIs
* rename existing files
* change existing database schemas
* change existing routes
* change existing frontend components
* change existing authentication
* change existing API response formats
* refactor unrelated code
* upgrade dependencies unnecessarily
* modify existing admin functionality
* modify existing course functionality

⸻

3. Isolation Requirement

All Phase 1 implementation must live inside:

aipipeline/

Create a self-contained structure.

Preferred structure:

aipipeline/
├── README.md
├── package.json
├── tsconfig.json
├── jest.config.*
│
├── src/
│   ├── config/
│   ├── types/
│   ├── services/
│   ├── providers/
│   ├── research/
│   ├── curriculum/
│   ├── content/
│   ├── visuals/
│   ├── validation/
│   ├── persistence/
│   ├── jobs/
│   └── index.*
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
└── logs/

If the existing project architecture requires a different language/framework, inspect it first and adapt accordingly.

Do not blindly assume TypeScript or Node.js.

⸻

4. Before Coding — Repository Audit

The first task is NOT implementation.

Perform a complete repository audit.

Read:

backend/
frontend/
admin/
src/
package.json
README.md
.env.example

and all relevant directories that actually exist.

Find:

Course model
Topic model
Tutorial model
Category model
Subject model
Branch model
User/Admin model
Authentication
API routes
Controllers
Services
Database configuration
Existing AI integrations
Existing scraper utilities
Existing HTTP clients
Existing logging system
Existing test configuration

Also search for:

course
topic
tutorial
subject
branch
create
update
admin
auth
api
mongoose
mongodb
openai
gemini
gemma
huggingface
scrape
crawler
playwright
cheerio
axios
fetch
jest
vitest

Do not assume names.

Use the actual repository structure.

⸻

5. Backend/API Discovery Rule

The user will provide backend architecture and APIs when required.

If an API is required but cannot be discovered from the repository:

STOP and ask the user for the API details.

Do NOT invent an endpoint.

Do NOT assume:

POST /courses
POST /topics
POST /tutorials

unless those endpoints actually exist.

Ask for:

HTTP method
URL
authentication requirement
request body
response body
required headers
required IDs
error format

Example request to user:

I need the existing API used to create a tutorial.
Please provide:
1. Endpoint
2. HTTP method
3. Request body
4. Response example
5. Authentication requirements

Then continue.

⸻

6. Absolute Rule — Test Every Step

Phase 1 must be developed in 10 incremental steps.

For EVERY step:

IMPLEMENT
   ↓
WRITE TEST
   ↓
RUN TEST
   ↓
CHECK OUTPUT
   ↓
IF FAIL → DEBUG
   ↓
RUN TEST AGAIN
   ↓
ONLY IF PASS → NEXT STEP

Never move to the next step while the current step is failing.

After every step print a clear console summary:

========================================
PHASE 1 - STEP 01
========================================
Implementation: PASS
Unit Tests:     PASS
Integration:    PASS
Errors:         0
Ready for Step 02
========================================

If a test fails:

========================================
STEP 01 FAILED
========================================
Test:
<test name>
Error:
<error>
Fix:
<what was changed>
Re-running tests...

Do not hide errors.

⸻

7. Logging Requirements

The pipeline must have structured logging.

Every major operation must log:

[PHASE1]
[STEP]
[JOB]
[RESEARCH]
[CURRICULUM]
[CONTENT]
[VISUAL]
[VALIDATION]
[DATABASE]
[ERROR]

Example:

[PHASE1] Starting course generation
[JOB] jobId=course-compiler-design-001
[RESEARCH] Searching sources for "Compiler Design"
[RESEARCH] Found 8 candidate sources
[RESEARCH] Selected 5 sources
[CURRICULUM] Generating course structure
[CURRICULUM] Generated 12 topics
[CURRICULUM] Generated 67 subtopics
[CONTENT] Generating content
[VISUAL] Generating image prompts
[VALIDATION] Running content validation
[DATABASE] Saving course
[PHASE1] Generation completed successfully

Never log:

* passwords
* API keys
* JWT tokens
* database passwords
* private credentials

⸻

8. Phase 1 — Ten-Step Development Plan

STEP 01 — Repository Audit and Isolation

Objective

Understand the existing system without changing it.

Tasks

* Read repository structure.
* Read backend.
* Read relevant frontend/admin code.
* Identify existing APIs.
* Identify database models.
* Identify authentication.
* Identify testing framework.
* Identify package manager.
* Identify existing environment configuration.
* Create aipipeline/.

Deliverables

aipipeline/
README.md

Create:

aipipeline/ARCHITECTURE.md

Document:

Existing Backend
Existing APIs
Existing Database Models
Existing Authentication
Existing Admin Structure
Integration Points
Unknowns

Tests

Create a basic Jest test verifying the Phase 1 pipeline directory/configuration can load.

Run:

npm test

or the repository’s existing test command.

Gate

DO NOT proceed until:

Repository audit: PASS
Jest: PASS
Existing application unchanged: PASS

⸻

STEP 02 — Course Generation Job

Objective

Create the internal job architecture.

Input:

{
  "courseName": "Compiler Design"
}

Create a job:

jobId
courseName
status
createdAt
updatedAt
progress
errors

Statuses:

pending
researching
structuring
generating_content
generating_visuals
validating
saving
completed
failed

Requirements

The job must have a unique ID.

Example:

compiler-design-<timestamp>-<random>

Do not use only the course name as a unique identifier.

Tests

Test:

* valid course name
* empty course name
* whitespace-only course name
* job creation
* job status update
* job failure
* job completion

Run Jest.

Fix all failures.

Only continue after PASS.

⸻

STEP 03 — Research/Scraper Layer

Objective

Research the requested course from multiple sources.

Input:

Compiler Design

Output:

ResearchPackage

Example:

{
  "course": "Compiler Design",
  "sources": [
    {
      "title": "...",
      "url": "...",
      "content": "...",
      "sourceType": "web"
    }
  ]
}

Architecture

Use a provider abstraction:

ResearchService
      │
      ├── SearchProvider
      ├── PageFetcher
      ├── ContentExtractor
      └── SourceRanker

Do NOT tightly couple the pipeline to one search provider.

Research requirements

The system should:

1. Search for the course.
2. Find multiple relevant sources.
3. Fetch permitted pages.
4. Extract useful content.
5. Remove navigation/ads/noise.
6. Deduplicate sources.
7. Store source metadata.
8. Rank/select useful sources.

Legal/ethical requirements

Do not bypass:

* paywalls
* authentication
* CAPTCHAs
* anti-bot systems
* access controls

Respect:

* robots.txt where applicable
* site terms
* copyright
* rate limits

Do not copy source pages into the final course.

The generated course must be an original synthesis.

Tests

Create mocked research providers.

Test:

* search success
* search failure
* fetch failure
* malformed page
* duplicate source
* zero sources
* multiple sources
* source ranking

Do NOT rely exclusively on live web scraping in unit tests.

Use mocks/fixtures.

Gate

All Jest tests PASS.

⸻

STEP 04 — Course Structure Generator

Objective

Transform research into a comprehensive course hierarchy.

Input:

Compiler Design
+
ResearchPackage

Output:

Course
 ├── Topic
 │    ├── Subtopic
 │    ├── Subtopic
 │    └── ...
 ├── Topic
 │    └── ...

Requirements

The AI should generate:

* logical topic order
* beginner → advanced progression
* topics
* subtopics
* learning relationships
* no unnecessary duplication

Example:

{
  "title": "Compiler Design",
  "topics": [
    {
      "title": "Introduction to Compiler",
      "subtopics": [
        {
          "title": "What is a Compiler?"
        },
        {
          "title": "Compiler vs Interpreter"
        }
      ]
    }
  ]
}

Important

Use structured JSON output.

Do NOT parse arbitrary AI prose if structured output is available.

Validation

Validate:

* required fields
* title
* topic array
* subtopic array
* duplicate names
* empty topics
* malformed JSON

Tests

Test:

* valid AI response
* malformed AI response
* missing topics
* duplicate topics
* duplicate subtopics
* empty response

Run Jest.

Only continue after PASS.

⸻

STEP 05 — Content Generator

Objective

Generate educational content for each subtopic.

Example:

Compiler Design
  ↓
Lexical Analysis
  ↓
Tokens
  ↓
Generate lesson

Output should be structured.

Example:

{
  "title": "Tokens",
  "introduction": "...",
  "sections": [
    {
      "title": "...",
      "content": "...",
      "examples": []
    }
  ]
}

Content requirements

Content should be:

* original
* educational
* technically accurate
* logically structured
* based on research
* appropriate for the selected topic
* free from direct source copying

At this stage:

DO NOT apply the user’s personal teaching style.

That belongs to Phase 2.

Tests

Test:

* successful generation
* empty AI response
* malformed response
* missing required fields
* very long research input
* API failure
* retry behavior

Run Jest.

⸻

STEP 06 — Visual/Image Prompt Generator

Objective

Determine where educational visuals would improve the lesson.

For each relevant section:

{
  "required": true,
  "type": "diagram",
  "prompt": "Educational diagram showing..."
}

Possible visual types:

diagram
flowchart
architecture
timeline
comparison
tree
graph
conceptual illustration
code visualization
table

Requirements

Do not generate images in Phase 1 unless explicitly requested.

Phase 1 should generate:

IMAGE PROMPTS

not necessarily the image itself.

Example

For compiler phases:

Educational flowchart showing the major phases of a compiler:
lexical analysis, syntax analysis, semantic analysis,
intermediate code generation, code optimization, and
code generation. Show source code entering the pipeline
and target code leaving it. Clean academic diagram,
clear labels, minimal visual clutter.

Tests

Test:

* visual required
* visual not required
* valid visual type
* missing prompt
* malformed AI output

Run Jest.

⸻

STEP 07 — Content Validation / Quality Control

Objective

Before saving anything, validate the generated course.

Checks:

Structure
Accuracy signals
Completeness
Duplication
Empty content
Missing sections
Invalid JSON
Missing sources
Missing visual prompts where required

Implement deterministic validation wherever possible.

AI validation may be added for semantic checks.

Validation result

{
  "status": "PASS",
  "score": 92,
  "issues": [],
  "warnings": []
}

or:

{
  "status": "FAIL",
  "score": 61,
  "issues": [
    "Missing subtopic content"
  ]
}

Rules

A validation failure must NOT silently continue to database saving.

The pipeline should either:

FAIL

or:

RETRY → VALIDATE AGAIN

Tests

Test:

* valid course
* missing topic
* missing subtopic
* empty content
* duplicate content
* invalid visual prompt
* missing source
* validation failure

Run Jest.

⸻

STEP 08 — Existing Backend API Integration

Objective

Save Phase 1 output through the user’s EXISTING backend APIs.

Do not directly connect to MongoDB if the existing backend already exposes APIs for this purpose.

Preferred architecture:

AI Pipeline
     │
     ▼
Existing Backend API
     │
     ▼
Existing Database

CRITICAL

Before implementation, inspect the backend.

If an endpoint is missing or unclear:

STOP and ask the user.

Do NOT invent an API.

Required integration information

If not discoverable in the repository, request:

Create Course API
Create Topic API
Create Subtopic/Tutorial API
Update API if required
Authentication
Request body
Response body
Required IDs

Tests

Use mocked backend API responses for unit tests.

Add integration tests where possible.

Test:

* successful course creation
* successful topic creation
* successful subtopic creation
* API authentication failure
* 400 response
* 401 response
* 404 response
* 500 response
* timeout
* retry
* partial failure

Important

The pipeline must support failure recovery.

If topic 17 fails after topics 1–16 were saved, do not blindly create topics 1–16 again.

Implement idempotency/deduplication where supported by the existing API.

⸻

STEP 09 — Admin Testing Page

Objective

Create a dedicated testing UI for Phase 1.

IMPORTANT:

Do NOT modify existing admin pages unnecessarily.

Create the smallest isolated admin testing page possible.

Example:

/admin/ai-pipeline

or the equivalent route based on the existing admin architecture.

If adding this route requires modifying a protected route registry, middleware, or navigation, inspect the existing architecture first and ask before modifying production files if necessary.

UI

┌──────────────────────────────────────────────┐
│ AI Course Pipeline                           │
├──────────────────────────────────────────────┤
│                                              │
│ Course Name                                  │
│ ┌──────────────────────────────────────────┐ │
│ │ Compiler Design                          │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│              [ Generate Course ]             │
│                                              │
├──────────────────────────────────────────────┤
│ Progress                                     │
│                                              │
│ ✓ Job created                                │
│ ✓ Research completed                         │
│ ✓ Course structure generated                 │
│ ⏳ Content generation                        │
│ ○ Visual prompts                             │
│ ○ Validation                                 │
│ ○ Database                                   │
│                                              │
├──────────────────────────────────────────────┤
│ Logs                                         │
│                                              │
│ [RESEARCH] Found 8 sources                   │
│ [CURRICULUM] Generated 12 topics             │
│ [CONTENT] Generating Tokens                 │
│                                              │
└──────────────────────────────────────────────┘

Testing page requirements

It must allow:

* enter course name
* start generation
* view job ID
* view current status
* view progress
* view errors
* view generated structure
* view generated content
* view image prompts
* view sources
* view final database-save result

Do not build unnecessary UI.

The page exists primarily to test Phase 1.

Tests

Add frontend tests using the existing test framework where applicable.

Test:

* page loads
* input validation
* generate button
* loading state
* successful job
* failed job
* status display

Run all tests.

⸻

STEP 10 — Full End-to-End Test

Objective

Run the entire Phase 1 pipeline.

Use:

Compiler Design

as the test course.

The complete flow must work:

Admin Page
    ↓
Create Job
    ↓
Research
    ↓
Multiple Sources
    ↓
Course Structure
    ↓
Topics
    ↓
Subtopics
    ↓
Content
    ↓
Visual Prompts
    ↓
Validation
    ↓
Existing Backend API
    ↓
Database

End-to-end test

The test should verify:

Course created
Topics created
Subtopics created
Content created
Visual prompts generated
Sources recorded
Database records created
Job marked completed

Final test command

Use the project’s appropriate commands, for example:

npm test

and:

npm run build

and the appropriate integration/e2e command if available.

Do not assume command names without checking package.json.

⸻

9. Failure Handling

Every pipeline stage must have error handling.

Research
   ↓
FAIL
   ↓
Retry
   ↓
Still FAIL
   ↓
Job = failed

Do not silently swallow exceptions.

Every failure should contain:

{
  "step": "research",
  "error": "...",
  "timestamp": "...",
  "jobId": "..."
}

⸻

10. Retry Strategy

Use limited retries.

Example:

Attempt 1
   ↓
FAIL
   ↓
Attempt 2
   ↓
FAIL
   ↓
Attempt 3
   ↓
FAIL
   ↓
STOP

Never create infinite retry loops.

Retry only errors that are potentially transient:

timeout
429
temporary network error
temporary provider error

Do not blindly retry:

invalid JSON
authentication failure
invalid API request
missing required data

⸻

11. AI Provider Abstraction

Do not hard-code the entire pipeline to one AI provider.

Create an abstraction such as:

AIProvider

with operations conceptually like:

generateText()
generateStructuredOutput()

Possible future providers:

Gemini
OpenAI
Ollama
Hugging Face
Local model

Phase 1 should work with whichever provider is actually available in the user’s environment.

If an API key/provider is required and unavailable:

Ask the user instead of inventing credentials.

⸻

12. Research Provider Abstraction

Similarly:

ResearchProvider

should allow different implementations.

Conceptually:

ResearchProvider
   │
   ├── WebSearchProvider
   ├── PageFetcher
   └── SourceExtractor

This makes the pipeline replaceable later.

⸻

13. Data Contracts

Create explicit TypeScript interfaces/types or equivalent schemas.

At minimum:

CourseGenerationJob
ResearchSource
ResearchPackage
CourseStructure
Topic
Subtopic
GeneratedContent
VisualPrompt
ValidationResult
GenerationResult

Do not use:

any

unless there is a documented unavoidable reason.

⸻

14. Idempotency

The pipeline must be safe to retry.

Example:

Compiler Design

is generated twice.

Do not accidentally create:

Compiler Design
Compiler Design
Compiler Design
Compiler Design

unless the user explicitly requests another generation.

Use:

jobId
courseId
slug
externalGenerationId

where appropriate.

Follow the existing backend’s capabilities instead of creating conflicting identifiers.

⸻

15. Concurrency

Do not generate hundreds of AI requests simultaneously.

Use controlled concurrency.

For example:

Topic 1
Topic 2
Topic 3
Topic 4

then another batch.

The exact concurrency limit should be configurable.

Example:

MAX_CONCURRENT_GENERATIONS=3

Do not hard-code provider-specific limits.

⸻

16. Cost Control

Phase 1 must be designed with cost control in mind.

Avoid sending the entire research corpus to every AI request.

Use:

Research
 ↓
Relevant research for topic
 ↓
Topic-specific generation

not:

Entire web research
 ↓
Every single generation request

Cache research where possible.

Store:

search results
source content
research summaries

so the same course doesn’t need to be researched repeatedly.

⸻

17. Source Management

Every generated lesson should retain source references.

Example:

{
  "sources": [
    {
      "title": "Source title",
      "url": "https://...",
      "relevance": "Explains lexical analysis"
    }
  ]
}

The final content should be an original synthesis, not copied source material.

Do not fabricate sources.

If a source cannot be verified, do not store it as a verified source.

⸻

18. Environment Variables

Never hard-code:

API keys
passwords
tokens
database URLs

Use environment variables.

Example:

AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
MAX_RETRIES=
MAX_CONCURRENT_GENERATIONS=
RESEARCH_TIMEOUT=

Use the existing project’s environment conventions where possible.

Never commit .env.

Update .env.example only inside aipipeline/ unless explicitly approved otherwise.

⸻

19. Testing Strategy

Minimum test layers:

Unit tests

Test each service independently.

research.test
curriculum.test
content.test
visual.test
validation.test
job.test

Integration tests

Test:

AI Pipeline
      ↓
Mocked/controlled Backend API

End-to-end test

Test:

Admin
 ↓
Pipeline
 ↓
Backend API
 ↓
Database

Use a test database/environment.

Never destroy production data during testing.

⸻

20. Console Output

The agent must show useful logs during development.

Example:

========================================
AI COURSE PIPELINE
========================================
Course: Compiler Design
Job: compiler-design-172...
Status: RESEARCHING
[1/7] Research
  ✓ Source search complete
  ✓ 8 sources discovered
  ✓ 5 sources selected
[2/7] Curriculum
  ✓ 12 topics
  ✓ 67 subtopics
[3/7] Content
  ✓ 67 content jobs created
[4/7] Visuals
  ✓ 31 image prompts
[5/7] Validation
  ✓ Structure valid
  ✓ Content validation passed
[6/7] Persistence
  ✓ Course created
  ✓ Topics created
  ✓ Subtopics created
[7/7] Complete
========================================
SUCCESS
========================================

⸻

21. No Dummy Data

STRICT RULE:

Do not create fake production data such as:

Fake courses
Fake topics
Fake API responses
Fake database records

For unit tests, use fixtures/mocks.

For the admin page, use real Phase 1 pipeline execution.

The admin test page must connect to the actual pipeline.

⸻

22. No Fake APIs

Never implement:

POST /fake-course
POST /mock-generation

as substitutes for missing backend APIs.

If the real API is missing:

STOP.

Ask the user.

⸻

23. No Existing-Code Regression

Before every major change:

Check:

git status

Record changed files.

The agent must ensure that unrelated existing files are not modified.

At the end, provide:

Files created:
...
Files modified:
...
Files deleted:
...

If an existing file was modified unintentionally, revert the change.

⸻

24. Phase 1 Definition of Done

Phase 1 is complete only when all conditions are true:

* aipipeline/ exists.
* Existing application functionality is unchanged.
* Repository architecture was documented.
* Existing backend APIs were identified.
* Missing APIs were requested rather than invented.
* Course generation job exists.
* Research pipeline works.
* Multiple sources can be collected.
* Source metadata is preserved.
* Course structure is generated.
* Topics are generated.
* Subtopics are generated.
* Educational content is generated.
* Image prompts are generated.
* Generated data is validated.
* Existing backend APIs are used for persistence.
* Database records are successfully created.
* Admin testing page exists.
* Admin page shows progress.
* Admin page shows logs/errors.
* Jest tests exist.
* Unit tests pass.
* Integration tests pass.
* End-to-end test passes.
* Production build passes.
* No secrets are committed.
* No dummy production data is used.
* No existing code was unnecessarily changed.

⸻

25. Final Phase 1 Flow

The final implementation must accomplish:

                ADMIN
                  │
                  │
          Course: Compiler Design
                  │
                  ▼
            [ GENERATE ]
                  │
                  ▼
             CREATE JOB
                  │
                  ▼
             WEB RESEARCH
                  │
          ┌───────┼───────┐
          ▼       ▼       ▼
       Source  Source  Source
          │       │       │
          └───────┼───────┘
                  ▼
          RESEARCH SYNTHESIS
                  │
                  ▼
          COURSE STRUCTURE
                  │
                  ▼
             TOPICS
                  │
                  ▼
            SUBTOPICS
                  │
                  ▼
         CONTENT GENERATION
                  │
                  ▼
        IMAGE PROMPT GENERATION
                  │
                  ▼
             VALIDATION
                  │
                  ▼
         EXISTING BACKEND API
                  │
                  ▼
              DATABASE
                  │
                  ▼
              COMPLETE

⸻

26. Phase 2 Boundary

Do NOT implement Phase 2 during Phase 1.

Phase 2 will later handle:

150–200 Teacher PDFs
       ↓
Text Extraction
       ↓
Teaching Style Dataset
       ↓
Training Examples
       ↓
QLoRA
       ↓
Teacher Style Model
       ↓
Phase 1 Content
       ↓
Rewrite in Teacher Style
       ↓
Database

Phase 1 must remain independent from this.

Do not add:

* fine-tuning
* QLoRA
* teacher-style training
* teacher-style prompts
* LoRA adapters
* teacher PDFs
* teacher style extraction

unless explicitly requested.

⸻

27. Agent Operating Rules

Follow these rules throughout the implementation:

1. Read before modifying.
2. Never guess existing APIs.
3. Never modify existing code unnecessarily.
4. Keep Phase 1 isolated inside aipipeline/.
5. Complete one step before starting the next.
6. Write tests for every step.
7. Run tests after every step.
8. Fix failures before proceeding.
9. Show console logs.
10. Never hide errors.
11. Never use fake production data.
12. Never hard-code secrets.
13. Never bypass website access restrictions.
14. Preserve source attribution.
15. Generate original synthesized educational content.
16. Use structured output from AI.
17. Validate AI output before persistence.
18. Use existing backend APIs for database persistence.
19. Ask the user whenever required API information is missing.
20. Do not implement Phase 2.

⸻

28. First Action

Before writing implementation code:

Step 1

Inspect the repository.

Step 2

Inspect the backend architecture.

Step 3

Inspect existing API routes.

Step 4

Inspect existing database models.

Step 5

Inspect existing admin architecture.

Step 6

Inspect testing setup.

Step 7

Create:

aipipeline/

Step 8

Create:

aipipeline/ARCHITECTURE.md

Step 9

Create the first Jest test.

Step 10

Run the test.

Only after the first test passes should implementation continue to Step 02.

If any required information cannot be discovered from the repository, stop and ask the user for that specific information instead of making assumptions.