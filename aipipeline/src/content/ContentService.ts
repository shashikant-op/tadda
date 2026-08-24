import { GeneratedContent, ResearchPackage, Subtopic } from '../types';
import { IAIProvider, createAIProvider } from '../providers/AIProvider';

export class ContentService {
  private aiProvider: IAIProvider;

  constructor(aiProvider: IAIProvider = createAIProvider()) {
    this.aiProvider = aiProvider;
  }

  public async generateSubtopicContent(
    courseName: string,
    topicTitle: string,
    subtopic: Subtopic,
    researchPackage: ResearchPackage
  ): Promise<GeneratedContent> {
    if (!subtopic || !subtopic.title) {
      throw new Error('Valid subtopic is required for content generation.');
    }

    const relevantSources = researchPackage.sources.slice(0, 3);
    const context = relevantSources.map(s => `${s.title}: ${s.content}`).join('\n\n');

    const prompt = `You are an expert engineering educator, textbook author, and principal software architect. Generate an exhaustive, deeply descriptive, production-level educational lesson for the subtopic "${subtopic.title}" under topic "${topicTitle}" for the course "${courseName}".
Ensure nothing is left out. Provide rich technical explanations, internal workings, architecture notes, step-by-step algorithms, complete code examples, edge cases, time/space complexity analysis, security/performance considerations, and real-world production usage. Use the provided research context.\n\nResearch Context:\n${context}`;

    const schema = `{ title: string, introduction: string, sections: Array<{ title: string, content: string, examples: string[] }> }`;

    let contentResult: any;
    try {
      contentResult = await this.aiProvider.generateStructuredOutput<any>(prompt, schema);
    } catch (err: any) {
      throw new Error(`Failed to generate content for subtopic "${subtopic.title}": ${err.message}`);
    }

    if (!contentResult || !contentResult.title || !contentResult.introduction || !Array.isArray(contentResult.sections)) {
      // Fallback structure if AI returns generic format
      contentResult = {
        title: subtopic.title,
        introduction: `Introduction to ${subtopic.title} in the context of ${topicTitle}.`,
        sections: [
          {
            title: `Core Concepts of ${subtopic.title}`,
            content: `Detailed academic explanation of ${subtopic.title}, covering fundamental principles and definitions.`,
            examples: [`Example implementation or scenario for ${subtopic.title}`]
          }
        ]
      };
    }

    const sources = relevantSources.map(s => ({
      title: s.title,
      url: s.url,
      relevance: s.relevance || 'Contributed to lesson synthesis'
    }));

    console.log(`[CONTENT] Generated content for subtopic: "${subtopic.title}" with ${contentResult.sections.length} sections`);

    return {
      title: contentResult.title || subtopic.title,
      introduction: contentResult.introduction,
      sections: contentResult.sections,
      sources
    };
  }
}
