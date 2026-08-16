# AI Course Generation Pipeline Architecture & Workflow

This document provides a comprehensive technical overview of the **AI Course Generation Pipeline (Phase 1)** implemented in TutorialsAdda. The pipeline automates the end-to-end lifecycle of technical course creation—from autonomous research to database persistence.

---

## Architecture Overview

The pipeline is structured as an orchestrator (`PipelineOrchestrator`) coordinating 6 specialized autonomous services:

```
[Admin Trigger] ──> [PipelineOrchestrator]
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    [1. Research]   [2. Structure]  [3. Content]
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                 [4. Visual Prompts]
                          ▼
                   [5. Validation]
                          ▼
                 [6. DB Persistence] ──> [MongoDB / Backend API]
```

---

## The 6 Pipeline Stages

### 1. Research Agent (`ResearchService`)
- **Purpose**: Gathers authoritative technical documentation, syntax references, and architectural specifications related to the course name (e.g., *Compiler Design*, *Distributed Systems*, *React 19*).
- **Process**: Queries search providers, evaluates source relevance using `SourceRanker`, and extracts clean markdown content using `ContentExtractor`.

### 2. Curriculum Structuring (`CurriculumService`)
- **Purpose**: Builds a robust, logically progressive syllabus.
- **Process**: Feeds research context into Gemini AI with a strict JSON schema prompt to generate comprehensive modules, topics, and subtopics (beginner to advanced progression).

### 3. Exhaustive Content Generation (`ContentService`)
- **Purpose**: Generates rich, production-level educational content subtopic by subtopic.
- **Process**: Ensures **nothing is left out** by instructing Gemini AI to produce multi-section lessons covering:
  1. *Theoretical Foundations & Architecture*
  2. *Step-by-Step Implementation Blueprint*
  3. *Performance Optimization & Edge Cases*
  4. *Summary & Production Takeaways with Code Examples*

### 4. Visual Prompt Generation (`VisualService`)
- **Purpose**: Creates technical diagram and illustration prompts for each subtopic to accompany the Notion-grade reading experience.

### 5. Quality Validation (`ValidationService`)
- **Purpose**: Verifies course structure, uniqueness of topic/subtopic names, and content completeness against strict quality gates before persistence.

### 6. Database Persistence (`PersistenceService` & `BackendClient`)
- **Purpose**: Persists the generated curriculum directly to MongoDB.
- **Process**: Automatically creates branches, subjects, topics, and tutorials via secure REST endpoints authenticated with admin bearer tokens.

---

## Admin Interface & Live Execution Console

Administrators can trigger and monitor the AI pipeline in real time at `/admin/ai-pipeline`:
- **Live Terminal Logs**: Real-time step-by-step progress logging (`[00:01] 🌐 Initializing Research Agent...`, `[00:05] 🗺️ Structuring curriculum...`, `[00:09] ✍️ Generating content subtopic by subtopic...`).
- **Interactive Editor Links**: Once persistence completes, every generated subtopic is rendered as a clickable card that opens directly in the Notion-grade course reader/editor view.
