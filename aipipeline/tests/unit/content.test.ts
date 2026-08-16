import { ContentService } from '../../src/content/ContentService';
import { IAIProvider } from '../../src/providers/AIProvider';
import { ResearchPackage, Subtopic } from '../../src/types';

class FailingAIProvider implements IAIProvider {
  async generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T> {
    throw new Error('AI API Timeout');
  }
  async generateText(prompt: string): Promise<string> {
    throw new Error('AI API Timeout');
  }
}

const mockResearchPackage: ResearchPackage = {
  course: 'soft computing',
  sources: [
    { title: 'Tokenization Guide', url: 'https://example.com/tokens', content: 'Tokens are strings of characters.', sourceType: 'web' }
  ]
};

const mockSubtopic: Subtopic = {
  title: 'Tokens',
  description: 'Lexical tokens definition.'
};

describe('Content Generator (Step 05)', () => {
  it('should successfully generate educational content for a subtopic', async () => {
    const service = new ContentService();
    const content = await service.generateSubtopicContent('Compiler Design', 'Lexical Analysis', mockSubtopic, mockResearchPackage);

    expect(content).toBeDefined();
    expect(content.title).toBe('Tokens');
    expect(content.introduction).toBeDefined();
    expect(content.sections.length).toBeGreaterThan(0);
    expect(content.sources.length).toBeGreaterThan(0);
  });

  it('should throw error on AI failure', async () => {
    const service = new ContentService(new FailingAIProvider());
    await expect(
      service.generateSubtopicContent('Compiler Design', 'Lexical Analysis', mockSubtopic, mockResearchPackage)
    ).rejects.toThrow('Failed to generate content');
  });
});
