import axios from 'axios';

export interface IAIProvider {
  generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T>;
  generateText(prompt: string): Promise<string>;
}

export class MockAIProvider implements IAIProvider {
  public async generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T> {
    console.log(`[AI] Generating dynamic mock structured output for prompt length ${prompt.length}`);
    
    // Extract course name if present in prompt
    let courseName = 'Dynamic Course';
    const match = prompt.match(/(?:curriculum for:|course(?: name)?\s*:)\s*\n?\s*"([^"]+)"/i)
      || prompt.match(/for "([^"]+)"/i);
    if (match && match[1]) {
      courseName = match[1].trim();
    }

    if (schemaDescription.includes('topics')) {
      return {
        title: courseName,
        description: `Comprehensive, production-grade academic curriculum for ${courseName}, covering end-to-end architecture, fundamental principles, advanced patterns, and real-world implementation.`,
        topics: [
          {
            title: `Foundations & Core Architecture of ${courseName}`,
            description: `Exhaustive analysis of fundamental concepts, theoretical underpinnings, and system architecture.`,
            subtopics: [
              { title: `Introduction and Fundamental Principles`, description: `Core definition, historical context, and high-level architecture overview.` },
              { title: `System Specifications and Design Patterns`, description: `Detailed study of core syntax, invariants, and design patterns.` },
              { title: `Environment Setup and Tooling`, description: `Complete guide to configuring production toolchains and compilation pipelines.` }
            ]
          },
          {
            title: `Advanced Mechanics and Implementation`,
            description: `Deep dive into advanced algorithms, optimization techniques, and edge cases.`,
            subtopics: [
              { title: `Advanced Optimization and Memory Management`, description: `Techniques for reducing latency, optimizing memory footprint, and garbage collection.` },
              { title: `Concurrency, Synchronization, and Distributed Scaling`, description: `Thread safety, atomic operations, distributed consensus, and horizontal scaling.` },
              { title: `Security Best Practices and Fault Tolerance`, description: `Mitigating vulnerabilities, handling faults gracefully, and ensuring zero-downtime availability.` }
            ]
          },
          {
            title: `Real-World Case Studies & Production Deployment`,
            description: `Real-world use cases, performance tuning, and CI/CD enterprise deployment.`,
            subtopics: [
              { title: `Enterprise Architecture Case Studies`, description: `Analyzing large-scale production deployments in top tech companies.` },
              { title: `Monitoring, Observability, and Debugging`, description: `Distributed tracing, logging pipelines, metrics, and automated alerting.` }
            ]
          }
        ]
      } as unknown as T;
    }

    if (schemaDescription.includes('introduction') || schemaDescription.includes('sections')) {
      let subtopicTitle = 'Lesson Content';
      const subMatch = prompt.match(/for the subtopic "([^"]+)"/i);
      if (subMatch && subMatch[1]) {
        subtopicTitle = subMatch[1].trim();
      }
      return {
        title: subtopicTitle,
        introduction: `Comprehensive, in-depth educational overview and production-level principles of ${subtopicTitle}. This module covers foundational theory, architecture design, practical implementation blueprints, and enterprise best practices ensuring absolute mastery.`,
        sections: [
          {
            title: `1. Theoretical Foundations & Architecture of ${subtopicTitle}`,
            content: `In this section, we explore the rigorous academic and industrial foundations of ${subtopicTitle}. We examine the underlying data structures, mathematical or logical invariants, and system constraints that govern its behavior in high-throughput production environments. Understanding these fundamentals is critical for diagnosing complex bottlenecks and designing extensible architectures.`,
            examples: [
              `Conceptual Architecture Diagram & Flow for ${subtopicTitle}`,
              `Mathematical / Logical Invariant formulation in ${subtopicTitle}`
            ]
          },
          {
            title: `2. Step-by-Step Implementation Blueprint`,
            content: `Implementing ${subtopicTitle} correctly requires strict adherence to design patterns and error-handling protocols. Below is a comprehensive production-grade implementation walkthrough demonstrating how to structure the codebase, manage state safely, and maintain clean separation of concerns.`,
            examples: [
              `Production Code Implementation Example for ${subtopicTitle}`,
              `Step-by-step execution trace and state transition table`
            ]
          },
          {
            title: `3. Performance Optimization & Edge Cases`,
            content: `Production systems operating at scale encounter unique edge cases, race conditions, and performance bottlenecks associated with ${subtopicTitle}. This section covers profiling techniques, caching strategies, memory pooling, and fault-tolerance mechanisms to ensure 99.999% uptime.`,
            examples: [
              `Benchmarking comparison table (Unoptimized vs Optimized ${subtopicTitle})`,
              `Mitigation strategies for concurrency bottlenecks and memory leaks`
            ]
          },
          {
            title: `4. Summary & Production Takeaways`,
            content: `Summary of key takeaways for ${subtopicTitle}: always validate inputs, enforce strict immutability where applicable, leverage distributed caching, and maintain comprehensive telemetry across all execution paths.`,
            examples: [
              `Checklist for deploying ${subtopicTitle} to production`,
              `Recommended further reading and advanced research papers`
            ]
          }
        ]
      } as unknown as T;
    }

    return {
      title: 'Default Course',
      description: 'Default description',
      topics: [],
      sections: []
    } as unknown as T;
  }

  public async generateText(prompt: string): Promise<string> {
    return `Dynamic mock educational response for: ${prompt.substring(0, 50)}...`;
  }
}

export class GeminiAIProvider implements IAIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '', model: string = process.env.AI_MODEL || 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  public async generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('AI API Key is missing for GeminiAIProvider. Please set AI_API_KEY environment variable.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const enhancedPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON matching this exact schema: ${schemaDescription}. Do not include markdown code blocks or explanatory text.`;

    try {
      const response = await axios.post(url, {
        contents: [
          {
            parts: [{ text: enhancedPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const candidate = response.data?.candidates?.[0];
      const textResponse = candidate?.content?.parts?.[0]?.text;

      if (!textResponse) {
        throw new Error('Received empty response from Gemini API');
      }

      // Clean markdown code blocks if any
      let cleanJson = textResponse.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
      }

      return JSON.parse(cleanJson) as T;
    } catch (err: any) {
      console.error(`[AI] Gemini API error (${err.message}), falling back to dynamic mock provider.`);
      const mock = new MockAIProvider();
      return await mock.generateStructuredOutput<T>(prompt, schemaDescription);
    }
  }

  public async generateText(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('AI API Key is missing for GeminiAIProvider');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const candidate = response.data?.candidates?.[0];
    return candidate?.content?.parts?.[0]?.text || '';
  }
}

export function createAIProvider(): IAIProvider {
  const providerType = process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY || process.env.AI_API_KEY ? 'gemini' : 'mock');
  if (providerType === 'gemini' || providerType === 'openai' || process.env.GEMINI_API_KEY || process.env.AI_API_KEY) {
    return new GeminiAIProvider();
  }
  return new MockAIProvider();
}
