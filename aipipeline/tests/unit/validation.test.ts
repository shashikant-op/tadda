import { ValidationService } from '../../src/validation/ValidationService';
import { CourseStructure } from '../../src/types';

describe('Content Validation / Quality Control (Step 07)', () => {
  it('should pass validation for a valid course structure and contents', () => {
    const service = new ValidationService();
    const structure: CourseStructure = {
      title: 'Compiler Design',
      topics: [
        {
          title: 'Introduction',
          subtopics: [{ title: 'Tokens' }]
        }
      ]
    };
    const contents = [
      {
        title: 'Tokens',
        introduction: 'Intro to tokens',
        sections: [{ title: 'Definition', content: '...', examples: [] }],
        sources: [{ title: 'Source 1', url: 'https://example.com', relevance: 'Relevant' }]
      }
    ];

    const result = service.validateCourse(structure, contents);
    expect(result.status).toBe('PASS');
    expect(result.score).toBeGreaterThan(80);
    expect(result.issues.length).toBe(0);
  });

  it('should fail validation when course has no topics', () => {
    const service = new ValidationService();
    const structure: CourseStructure = {
      title: 'Compiler Design',
      topics: []
    };
    const result = service.validateCourse(structure, []);
    expect(result.status).toBe('FAIL');
    expect(result.issues).toContain('Course has no topics');
  });

  it('should fail validation when content is missing introduction', () => {
    const service = new ValidationService();
    const structure: CourseStructure = {
      title: 'Compiler Design',
      topics: [{ title: 'Intro', subtopics: [{ title: 'Tokens' }] }]
    };
    const contents = [
      {
        title: 'Tokens',
        introduction: '',
        sections: [{ title: 'Def', content: '...', examples: [] }],
        sources: []
      }
    ];
    const result = service.validateCourse(structure, contents);
    expect(result.status).toBe('FAIL');
    expect(result.issues.some(i => i.includes('missing introduction'))).toBe(true);
  });
});
