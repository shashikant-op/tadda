import { CourseStructure, ResearchPackage } from '../types';
import { IAIProvider, createAIProvider } from '../providers/AIProvider';

export class CurriculumService {
  private aiProvider: IAIProvider;

  constructor(aiProvider: IAIProvider = createAIProvider()) {
    this.aiProvider = aiProvider;
  }

  public async generateCurriculum(courseName: string, researchPackage: ResearchPackage): Promise<CourseStructure> {
    if (!courseName) {
      throw new Error('Course name is required for curriculum generation.');
    }

    const context = researchPackage.sources.map(s => `${s.title}: ${s.content}`).join('\n\n');
    const prompt = `
    You are an expert technical curriculum architect.

    Your task is to construct the COMPLETE course curriculum for:

    "${courseName}"

    CRITICAL REQUIREMENT:
    The curriculum MUST be primarily derived from the actual topics, headings,
    sections, chapters, and subtopics discovered from the scraped research sources.

    DO NOT simply invent a curriculum from your general knowledge.

    The scraped research is the source of truth for determining what the course
    should cover.

    ==================================================
    SCRAPED RESEARCH
    ==================================================

    The following data was collected from real websites, documentation,
    technical resources, articles, specifications, and other research sources:

    ${context}

    Use this scraped material to identify the actual subject structure.

    ==================================================
    STEP 1 — EXTRACT TOPICS FROM SCRAPED SOURCES
    ==================================================

    First analyze ALL scraped sources and identify:

    - Major topics
    - Sections
    - Chapters
    - Headings
    - Subheadings
    - Concepts
    - Algorithms
    - APIs
    - Features
    - Architectural components
    - Implementation areas
    - Advanced concepts
    - Practical topics
    - Security topics
    - Performance topics
    - Real-world application topics

    You must look across ALL provided sources.

    Do not rely on only the first website.

    Example:

    If the scraped sources contain:

    Source A:
      Introduction
      Variables
      Functions
      Classes

    Source B:
      Functions
      Async Programming
      Promises
      Error Handling

    Source C:
      Modules
      Classes
      Async Programming

    The resulting curriculum should combine them:

    Introduction
    Variables
    Functions
    Classes
    Async Programming
    Promises
    Error Handling
    Modules

    while removing duplicates.

    ==================================================
    STEP 2 — NORMALIZE SCRAPED TOPICS
    ==================================================

    Different websites may use different names for the same concept.

    For example:

    "Async JavaScript"
    "Asynchronous JavaScript"
    "Asynchronous Programming"

    may represent the same concept.

    Normalize these into a single meaningful topic.

    Do NOT blindly merge concepts that are technically different.

    Preserve meaningful distinctions.

    ==================================================
    STEP 3 — BUILD A MASTER TOPIC INVENTORY
    ==================================================

    Create an internal master inventory:

    Source
    → Topic
    → Subtopic

    For example:

    Source 1
    ├── React Fundamentals
    │    ├── Components
    │    ├── Props
    │    └── State
    │
    └── Hooks
          ├── useState
          ├── useEffect
          └── useMemo

    Source 2
    ├── Components
    ├── State Management
    └── Hooks
          ├── useState
          └── useEffect

    Merge these into a normalized master inventory.

    ==================================================
    STEP 4 — CURRICULUM MUST REFLECT SCRAPED STRUCTURE
    ==================================================

    The final curriculum must preserve the important concepts found in the
    scraped sources.

    Do NOT reduce:

    100 scraped meaningful topics
    → 10 generic AI topics.

    Do NOT produce:

    "Introduction"
    "Advanced Concepts"
    "Best Practices"

    and hide all the actual scraped concepts underneath them.

    The final curriculum should retain meaningful topic and subtopic granularity.

    ==================================================
    STEP 5 — DO NOT ARTIFICIALLY LIMIT THE CURRICULUM
    ==================================================

    There is NO fixed limit on:

    - modules
    - topics
    - subtopics

    Do not use:

    MAX_MODULES
    MAX_TOPICS
    MAX_SUBTOPICS

    The final size must depend on the actual scraped material.

    If the research contains:

    250 meaningful subtopics

    the curriculum may contain approximately that level of coverage after
    normalization and deduplication.

    Do not shrink the curriculum just to make generation faster.

    ==================================================
    STEP 6 — ORGANIZE, DON'T INVENT
    ==================================================

    Gemini's primary responsibility is to:

    1. Extract
    2. Normalize
    3. Deduplicate
    4. Categorize
    5. Organize
    6. Order
    7. Group
    8. Improve learning progression

    Gemini should NOT replace the scraped curriculum with an unrelated curriculum
    based purely on its internal knowledge.

    The scraped sources determine WHAT should be taught.

    AI determines HOW those topics should be organized.

    ==================================================
    STEP 7 — LEARNING ORDER
    ==================================================

    After extracting the topics, reorganize them into a logical learning sequence.

    Prefer:

    Prerequisites
    ↓
    Fundamentals
    ↓
    Core Concepts
    ↓
    Intermediate Concepts
    ↓
    Advanced Concepts
    ↓
    Implementation
    ↓
    Performance
    ↓
    Security
    ↓
    Production
    ↓
    Expert Topics

    BUT:

    Do not move or remove a scraped topic simply because it does not fit neatly
    into this progression.

    Preserve complete source coverage.

    ==================================================
    STEP 8 — SCRAPED TOPIC COVERAGE
    ==================================================

    Every meaningful scraped topic/subtopic must map to the final curriculum.

    Internally create a mapping:

    Scraped Topic
    → Final Module
    → Final Topic
    → Final Subtopic

    Example:

    Scraped:
    "React Server Components"

    ↓

    Final:
    Module: Advanced React
    Topic: React Server Components
    Subtopic: Server Components Architecture

    This mapping is extremely important because later the system must generate
    content for every resulting subtopic.

    ==================================================
    STEP 9 — GAP DETECTION
    ==================================================

    After constructing the curriculum from scraped material, perform a gap check.

    Ask:

    "Based on the scraped sources, are there important concepts that were
    mentioned indirectly but not represented as a topic/subtopic?"

    If yes, add them ONLY when they are clearly supported by the scraped research.

    For example:

    Source says:

    "Before learning RSA, understanding modular arithmetic is required."

    If modular arithmetic is not already present, add:

    Mathematical Foundations
    → Modular Arithmetic

    Do NOT add unrelated concepts simply because the model knows about them.

    ==================================================
    STEP 10 — SOURCE TRACEABILITY
    ==================================================

    Every topic/subtopic should retain information about where it came from.

    Where supported by the application's schema, include:

    - source URLs
    - source titles
    - source domains
    - source references

    Example:

    {
      "name": "React Server Components",
      "sourceReferences": [
        "https://react.dev/...",
        "https://nextjs.org/..."
      ]
    }

    This allows the admin to verify:

    "Where did this topic come from?"

    ==================================================
    STEP 11 — PRESERVE SOURCE COVERAGE
    ==================================================

    If 15 authoritative sources collectively cover a subject, use the collective
    knowledge.

    Do not allow one source with a short table of contents to dominate the entire
    curriculum.

    Example:

    Source A → 30 topics
    Source B → 50 topics
    Source C → 40 topics

    The final curriculum should reflect the meaningful union of these sources,
    not simply Source A.

    ==================================================
    STEP 12 — NO HALLUCINATED TOPICS
    ==================================================

    Do NOT add topics solely because:

    "AI knows this topic."

    Every topic must be either:

    A. Directly present in scraped sources

    OR

    B. A necessary prerequisite explicitly implied by the scraped material

    OR

    C. A directly supported logical decomposition of a scraped topic.

    Do NOT add unrelated modern/trending topics just to make the curriculum
    appear more comprehensive.

    ==================================================
    STEP 13 — TOPIC GRANULARITY
    ==================================================

    Do not collapse detailed scraped structures.

    If the source contains:

    Authentication
    ├── Sessions
    ├── Cookies
    ├── JWT
    ├── OAuth
    └── OpenID Connect

    do NOT convert this into:

    Authentication

    Keep the meaningful subtopic structure.

    Likewise, do not split one trivial heading into dozens of meaningless
    subtopics.

    Maintain the granularity present in the research.

    ==================================================
    STEP 14 — FINAL VALIDATION
    ==================================================

    Before returning the curriculum, internally verify:

    - Did I inspect all scraped sources?
    - Did I extract topics from all sources?
    - Did I extract subtopics/headings?
    - Did I normalize duplicates?
    - Did I preserve meaningful concepts?
    - Did I avoid arbitrary limits?
    - Does every important scraped concept appear in the curriculum?
    - Can every final topic be traced back to research?
    - Did I avoid inventing unrelated topics?
    - Is the ordering pedagogically logical?
    - Are prerequisites represented?
    - Are advanced topics preserved?
    - Are implementation topics preserved?
    - Are security/performance topics preserved when present in research?
    - Are real-world topics preserved?
    - Are there any obvious gaps in the scraped coverage?

    If the answer to any important coverage question is NO,
    fix the curriculum before returning it.

    ==================================================
    OUTPUT
    ==================================================

    Return ONLY valid JSON matching the application's existing curriculum schema.

    Do NOT return Markdown.

    Do NOT return explanations outside JSON.

    Do NOT return analysis.

    Do NOT return commentary.

    Each module must contain meaningful topics.

    Each topic must contain meaningful subtopics.

    Each subtopic must represent a real teachable concept.

    Where the existing schema supports it, include source references for
    traceability.

    ==================================================
    FINAL PRINCIPLE
    ==================================================

    THE SCRAPED RESEARCH DEFINES THE COURSE SCOPE.

    Gemini's job is to transform the scraped knowledge structure into a:

    - clean
    - deduplicated
    - logically ordered
    - comprehensive
    - educational
    - traceable

    curriculum.

    It must NOT invent an unrelated curriculum from general model knowledge.

    The final course must be generated FROM THE SCRAPED TOPICS AND SUBTOPICS.
    `;

    const schema = `{ title: string, description: string, topics: Array<{ title: string, description: string, subtopics: Array<{ title: string, description: string }> }> }`;

    let structure: CourseStructure;
    try {
      structure = await this.aiProvider.generateStructuredOutput<CourseStructure>(prompt, schema);
    } catch (err: any) {
      throw new Error(`Failed to generate course structure: ${err.message}`);
    }

    this.validateStructure(structure);
    console.log(`[CURRICULUM] Generated course structure for "${structure.title}" with ${structure.topics.length} topics`);
    return structure;
  }

  public validateStructure(structure: any): void {
    if (!structure || typeof structure !== 'object') {
      throw new Error('Malformed AI response: structure is not an object.');
    }
    if (!structure.title || typeof structure.title !== 'string') {
      throw new Error('Validation failed: missing or invalid course title.');
    }
    if (!Array.isArray(structure.topics) || structure.topics.length === 0) {
      throw new Error('Validation failed: topics array is missing or empty.');
    }

    const topicNames = new Set<string>();
    for (const topic of structure.topics) {
      if (!topic.title || typeof topic.title !== 'string') {
        throw new Error('Validation failed: topic missing valid title.');
      }
      const normalizedTopicName = topic.title.trim().toLowerCase();
      if (topicNames.has(normalizedTopicName)) {
        throw new Error(`Validation failed: duplicate topic name "${topic.title}".`);
      }
      topicNames.add(normalizedTopicName);

      if (!Array.isArray(topic.subtopics) || topic.subtopics.length === 0) {
        throw new Error(`Validation failed: topic "${topic.title}" has missing or empty subtopics.`);
      }

      const subtopicNames = new Set<string>();
      for (const sub of topic.subtopics) {
        if (!sub.title || typeof sub.title !== 'string') {
          throw new Error(`Validation failed: subtopic in "${topic.title}" missing valid title.`);
        }
        const normalizedSubName = sub.title.trim().toLowerCase();
        if (subtopicNames.has(normalizedSubName)) {
          throw new Error(`Validation failed: duplicate subtopic name "${sub.title}" within topic "${topic.title}".`);
        }
        subtopicNames.add(normalizedSubName);
      }
    }
  }
}
