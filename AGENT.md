# MANDATORY — FULL PIPELINE OBSERVABILITY & VERIFICATION LOGS

The AI Course Generation Pipeline must provide a **complete real-time execution log**.

The admin should be able to open:

```text
/admin/ai-pipeline
```

and verify exactly what the pipeline is doing at every stage.

The terminal is NOT a decorative UI.

It is the **production execution console**.

Every important operation must produce a real structured log event.

---

# 1. GOLDEN RULE

Never log only:

```text
Research started...
Generating curriculum...
Generating content...
Pipeline completed...
```

That is NOT enough.

The admin must be able to answer:

```text
What website was searched?
What URL was found?
Why was the source accepted?
Why was another source rejected?
What content was extracted?
How many sources were collected?
What information was sent to Gemini?
What curriculum did Gemini return?
How many modules/topics/subtopics were created?
Which lesson is currently being generated?
Which lesson succeeded?
Which lesson failed?
What visual was generated?
What validation failed?
What backend API was called?
What database record was created?
What IDs were returned?
How many records were persisted?
```

without opening the source code.

---

# 2. STRUCTURED LOG FORMAT

Every log event should contain:

```typescript
interface PipelineLog {
  runId: string;
  timestamp: string;

  level:
    | "DEBUG"
    | "INFO"
    | "SUCCESS"
    | "WARN"
    | "ERROR";

  stage:
    | "RESEARCH"
    | "CURRICULUM"
    | "CONTENT"
    | "VISUAL"
    | "VALIDATION"
    | "PERSISTENCE"
    | "SYSTEM";

  event: string;

  message: string;

  metadata?: Record<string, unknown>;

  progress?: {
    current: number;
    total: number;
    percentage: number;
  };

  durationMs?: number;
}
```

Use the existing project conventions if another event interface already exists.

---

# 3. RESEARCH LOGS — MUST SHOW EVERYTHING IMPORTANT

When research starts:

```text
[13:42:01] INFO [RESEARCH]
Starting research for: "Cryptography"
```

Then:

```text
[13:42:01] INFO [RESEARCH]
Search query:
"Cryptography fundamentals algorithms architecture security"
```

Then show the search provider:

```text
[13:42:02] INFO [RESEARCH]
Search provider: <provider-name>
Query returned: 10 results
```

For EVERY result:

```text
[13:42:02] INFO [RESEARCH]
SOURCE DISCOVERED

Title:
Cryptography — NIST

URL:
https://...

Domain:
nist.gov

Position:
1

Relevance:
0.96
```

Another:

```text
[13:42:03] INFO [RESEARCH]
SOURCE DISCOVERED

Title:
RFC 8446 — TLS 1.3

URL:
https://...

Domain:
rfc-editor.org

Position:
2

Relevance:
0.94
```

---

# 4. SOURCE RANKING MUST BE VISIBLE

When `SourceRanker` evaluates a source:

```text
[13:42:03] DEBUG [RESEARCH]
Evaluating source

Domain:
example.com

Authority score:
0.61

Relevance score:
0.83

Freshness score:
0.72

Technical quality:
0.75

Final score:
0.71
```

Then:

```text
[13:42:03] SUCCESS [RESEARCH]
Source accepted

URL:
https://...

Final score:
0.91
```

or:

```text
[13:42:03] WARN [RESEARCH]
Source rejected

URL:
https://...

Reason:
Low authority score

Score:
0.38
```

This allows me to understand **why the AI selected its sources**.

---

# 5. CONTENT EXTRACTION LOGS

When extracting a source:

```text
[13:42:04] INFO [RESEARCH]
Extracting content

URL:
https://...

Extractor:
ContentExtractor
```

After extraction:

```text
[13:42:05] SUCCESS [RESEARCH]
Content extracted

URL:
https://...

Characters:
38,492

Sections:
24

Code blocks:
8

Tables:
3

Processing time:
812ms
```

If extraction fails:

```text
[13:42:05] ERROR [RESEARCH]
Content extraction failed

URL:
https://...

Reason:
Timeout

Retry:
1/3
```

---

# 6. RESEARCH SUMMARY LOG

When research finishes:

```text
[13:42:18] SUCCESS [RESEARCH]
Research completed

Sources discovered:
27

Sources accepted:
14

Sources rejected:
13

Documents extracted:
12

Total research context:
384,291 characters

Duration:
17.2s
```

Then show the selected sources:

```text
SELECTED RESEARCH SOURCES

1. NIST
   https://...

2. RFC Editor
   https://...

3. Stanford
   https://...

4. OWASP
   https://...
```

These must come from the actual research execution.

---

# 7. CURRICULUM LOGS

When curriculum generation starts:

```text
[13:42:19] INFO [CURRICULUM]
Preparing curriculum generation

Course:
Cryptography

Research sources:
14

Research context:
384,291 characters
```

Then:

```text
[13:42:20] INFO [CURRICULUM]
Sending curriculum-generation request to Gemini

Provider:
GeminiAIProvider

Model:
<actual model>

Request size:
...
```

Do NOT expose API keys, tokens, credentials, or sensitive data.

---

# 8. GEMINI RESPONSE LOG

After Gemini responds:

```text
[13:42:31] SUCCESS [CURRICULUM]
Gemini curriculum response received

Response size:
42,381 characters

Generation time:
11.2s
```

Then log the actual structural result:

```text
[13:42:31] INFO [CURRICULUM]
Curriculum parsed

Modules:
8

Topics:
42

Subtopics:
186
```

Then show the generated hierarchy:

```text
MODULE 1
Cryptography Foundations

  Topic 1:
  Introduction to Cryptography

    • What is Cryptography?
    • Security Goals
    • Threat Models

  Topic 2:
  Mathematical Foundations

    • Modular Arithmetic
    • Prime Numbers
    • GCD
```

Continue for the complete curriculum or provide expandable sections.

The UI should allow me to inspect the generated structure.

---

# 9. CURRICULUM VALIDATION LOG

Show:

```text
[13:42:32] INFO [CURRICULUM]
Validating curriculum structure
```

Then:

```text
Duplicate modules:
0

Duplicate topics:
0

Duplicate subtopics:
0

Empty names:
0

Missing objectives:
0

Broken dependencies:
0
```

Then:

```text
[13:42:32] SUCCESS [CURRICULUM]
Curriculum validation passed
```

---

# 10. CONTENT GENERATION LOGS

This must be VERY detailed.

Before generating each lesson:

```text
[13:42:33] INFO [CONTENT]
Starting lesson generation

Module:
3/8

Topic:
12/42

Subtopic:
47/186

Subtopic name:
RSA Key Generation
```

Then:

```text
[13:42:33] INFO [CONTENT]
Preparing lesson context

Previous concepts:
Modular Arithmetic
Euler Totient
Prime Numbers

Research sources:
6
```

Then:

```text
[13:42:34] INFO [CONTENT]
Sending lesson-generation request to Gemini

Model:
<actual model>

Estimated context:
...
```

After response:

```text
[13:42:40] SUCCESS [CONTENT]
Lesson generated

Subtopic:
RSA Key Generation

Characters:
18,421

Words:
3,126

Code blocks:
4

Examples:
3

Sections:
17

Generation time:
6.2s
```

Then:

```text
[13:42:40] INFO [CONTENT]
Lesson quality checks

Required sections:
PASS

Code:
PASS

Examples:
PASS

Summary:
PASS

Placeholder detection:
PASS

Minimum depth:
PASS
```

---

# 11. CONTENT PROGRESS

The console should continuously show:

```text
CONTENT GENERATION

Module:
3 / 8

Topic:
12 / 42

Subtopic:
47 / 186

Completed:
46

Failed:
0

Remaining:
140

Progress:
24.73%
```

These numbers MUST be real.

---

# 12. FAILED LESSON LOG

If a lesson fails:

```text
[13:45:22] ERROR [CONTENT]

Lesson generation failed

Module:
3

Topic:
12

Subtopic:
48

Name:
RSA Padding

Error:
Gemini timeout

Attempt:
1 / 3
```

Then:

```text
[13:45:24] WARN [CONTENT]
Retrying lesson

Attempt:
2 / 3
```

If successful:

```text
[13:45:31] SUCCESS [CONTENT]
Retry successful

Subtopic:
RSA Padding
```

If all attempts fail:

```text
[13:46:02] ERROR [CONTENT]
Lesson permanently failed

Subtopic:
RSA Padding

Attempts:
3

Reason:
Gemini timeout
```

The pipeline must retain this information.

---

# 13. VISUAL GENERATION LOGS

For every visual:

```text
[14:02:11] INFO [VISUAL]
Generating visual prompt

Lesson:
TLS Handshake

Visual type:
Sequence Diagram
```

Then:

```text
[14:02:12] SUCCESS [VISUAL]
Visual prompt generated

Type:
Sequence Diagram

Purpose:
Explain TLS handshake flow
```

If multiple visuals:

```text
Visuals:
2

1. TLS Handshake Sequence
2. Key Exchange Flow
```

---

# 14. VALIDATION LOGS

Before persistence:

```text
[14:10:21] INFO [VALIDATION]
Starting complete course validation
```

Then show:

```text
Curriculum:
PASS

Modules:
8/8

Topics:
42/42

Subtopics:
186/186

Lessons:
186/186

Visual prompts:
151/151

Practice material:
186/186
```

Then:

```text
Duplicate check:
PASS

Placeholder check:
PASS

Empty content:
PASS

Missing lesson check:
PASS

Curriculum coverage:
PASS

Research coverage:
PASS
```

Finally:

```text
[14:10:24] SUCCESS [VALIDATION]
COURSE VALIDATION PASSED

Course is ready for persistence.
```

If anything fails:

```text
[14:10:24] ERROR [VALIDATION]

COURSE VALIDATION FAILED

Missing lessons:
4

Incomplete topics:
2

Duplicate subtopics:
1

Persistence blocked.
```

---

# 15. PERSISTENCE LOGS

Every backend operation must be visible.

Example:

```text
[14:10:25] INFO [PERSISTENCE]
Creating branch

Name:
Computer Science Engineering
```

Then:

```text
[14:10:26] SUCCESS [PERSISTENCE]
Branch created

Branch ID:
64f...
```

Then:

```text
[14:10:26] INFO [PERSISTENCE]
Creating subject

Name:
Cryptography

Branch ID:
64f...
```

Then:

```text
[14:10:27] SUCCESS [PERSISTENCE]
Subject created

Subject ID:
65a...
```

Then for topics:

```text
[14:10:27] INFO [PERSISTENCE]
Creating topic

Topic:
Symmetric Cryptography

Position:
4 / 42
```

Then:

```text
[14:10:28] SUCCESS [PERSISTENCE]
Topic created

Topic ID:
66b...
```

For tutorials:

```text
[14:10:28] INFO [PERSISTENCE]
Creating tutorial

Subtopic:
AES Block Cipher

Topic ID:
66b...
```

Then:

```text
[14:10:29] SUCCESS [PERSISTENCE]
Tutorial created

Tutorial ID:
67c...
```

---

# 16. BACKEND API LOGS

Show the API operation without exposing secrets.

Example:

```text
[14:10:29] DEBUG [PERSISTENCE]

POST /api/subjects

Status:
201

Duration:
184ms
```

Then:

```text
[14:10:29] DEBUG [PERSISTENCE]

POST /api/tutorials

Status:
201

Duration:
211ms
```

If failure:

```text
[14:10:30] ERROR [PERSISTENCE]

POST /api/tutorials

Status:
500

Retry:
1/3

Error:
Internal server error
```

NEVER log:

```text
Authorization: Bearer <token>
API_KEY
password
secret
cookie
```

---

# 17. DATABASE VERIFICATION LOG

After persistence:

```text
[14:12:41] INFO [PERSISTENCE]
Verifying persisted course
```

Then:

```text
Expected:

Modules:
8

Topics:
42

Lessons:
186
```

Then actual:

```text
Database:

Topics:
42

Tutorials:
186
```

Then:

```text
[14:12:42] SUCCESS [PERSISTENCE]
Database verification passed

Expected:
186 tutorials

Found:
186 tutorials
```

If mismatch:

```text
[14:12:42] ERROR [PERSISTENCE]
Database verification FAILED

Expected:
186

Found:
181

Missing:
5
```

Pipeline must NOT claim completion.

---

# 18. FINAL PIPELINE SUMMARY

At the end, display a complete execution summary:

```text
══════════════════════════════════════
       AI COURSE GENERATION SUMMARY
══════════════════════════════════════

Course:
Cryptography

Run ID:
cryptography-...

Duration:
10m 42s

RESEARCH
Sources discovered: 27
Sources accepted: 14
Documents extracted: 12

CURRICULUM
Modules: 8
Topics: 42
Subtopics: 186

CONTENT
Lessons generated: 186
Lessons failed: 0
Words generated: 412,384
Code blocks: 248
Examples: 319

VISUALS
Visual prompts: 151

PRACTICE
Questions: 423
Exercises: 84

VALIDATION
Result: PASS

PERSISTENCE
Topics created: 42
Tutorials created: 186

DATABASE
Expected tutorials: 186
Actual tutorials: 186

DATABASE VERIFICATION:
PASS

FINAL STATUS:
COMPLETED
══════════════════════════════════════
```

Every number must come from actual execution.

---

# 19. ADMIN UI MUST SUPPORT LOG INSPECTION

The terminal should support:

```text
Search logs
Filter by stage
Filter by INFO/SUCCESS/WARN/ERROR
Expand event
View metadata
View source URL
View generated curriculum
View lesson statistics
View API response status
View database IDs
```

For example:

```text
[RESEARCH] [SUCCESS]
Source accepted
```

Clicking it should reveal:

```text
URL
Domain
Title
Ranking score
Extraction stats
```

---

# 20. IMPORTANT — DON'T LOG SECRETS

Logs may contain:

```text
URLs
titles
counts
IDs
timings
statuses
AI model names
content statistics
```

Logs must NEVER contain:

```text
API keys
Gemini credentials
JWT secrets
Admin tokens
Passwords
Cookies
Authorization headers
Database passwords
Environment secrets
```

Create a sanitization layer if necessary.

---

# 21. PERSIST LOGS SERVER-SIDE

Do not keep logs only in React state.

Pipeline logs should belong to the `runId`.

Example:

```text
PipelineRun
 ├── runId
 ├── status
 ├── progress
 ├── startedAt
 ├── completedAt
 ├── currentStage
 └── logs[]
```

Or use the existing database/job architecture if already available.

This allows:

```text
Start pipeline
 ↓
Refresh browser
 ↓
Load runId
 ↓
Retrieve logs
 ↓
Continue displaying real execution
```

---

# 22. REAL-TIME + PERSISTENCE

Use:

```text
Database / persistent run state
```

as the source of truth.

Use:

```text
SSE / WebSocket / existing event system
```

for real-time updates.

Architecture:

```text
                    ┌───────────────┐
                    │   Gemini API  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    Pipeline   │
                    └───────┬───────┘
                            │
                     emit real events
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
         ┌─────────────┐         ┌─────────────┐
         │ PipelineRun │         │ SSE/WebSocket│
         │  Database   │         │             │
         └──────┬──────┘         └──────┬──────┘
                │                       │
                └──────────┬────────────┘
                           ▼
                    ┌───────────────┐
                    │ Admin Console │
                    └───────────────┘
```

---

# 23. NO FAKE LOGS — ABSOLUTE RULE

Never do:

```typescript
setTimeout(...)
```

to make the console look active.

Never do:

```typescript
logs.push(...)
```

from the frontend to simulate backend execution.

Never hardcode:

```text
Research completed
Curriculum completed
100%
```

Never show a fake source list.

Never show fake Gemini responses.

Never show fake database IDs.

Never show fake counts.

Every visible event must correspond to a real operation.

---

# 24. FINAL VERIFICATION

After implementation, run a real course:

```text
Course:
Cryptography

Branch:
Computer Science Engineering
```

Then I should be able to watch the console and verify:

```text
✓ Search query
✓ Search provider
✓ Websites discovered
✓ URLs
✓ Source ranking
✓ Accepted/rejected sources
✓ Extraction
✓ Research statistics
✓ Gemini curriculum request
✓ Curriculum result
✓ Module/topic/subtopic counts
✓ Individual lesson generation
✓ Lesson success/failure
✓ Retry attempts
✓ Visual generation
✓ Validation
✓ Backend API calls
✓ Created IDs
✓ Database persistence
✓ Database verification
✓ Final statistics
```

If I cannot verify these from the admin console, the pipeline is NOT sufficiently observable.

---

# DEFINITION OF DONE

The pipeline should feel like a real production job running in front of the administrator.

Not:

```text
Starting...
Generating...
Completed...
```

But:

```text
What happened?
Where did it happen?
What source was used?
What did the AI generate?
How many items were processed?
Which item failed?
What was retried?
What was persisted?
What IDs were created?
Did database verification pass?
```

The admin console must answer all of these questions.

**Build the pipeline so that the logs prove the pipeline is working — not merely claim that it is working.**
