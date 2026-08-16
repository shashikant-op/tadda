import { CourseStructure, ValidationResult } from '../types';

export class ValidationService {
  public validateCourse(structure: CourseStructure, contents: any[]): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!structure || !structure.title) {
      issues.push('Missing course title');
    }

    if (!Array.isArray(structure?.topics) || structure.topics.length === 0) {
      issues.push('Course has no topics');
    } else {
      let totalSubtopics = 0;
      for (const topic of structure.topics) {
        if (!topic.title) {
          issues.push('Topic missing title');
        }
        if (!Array.isArray(topic.subtopics) || topic.subtopics.length === 0) {
          issues.push(`Topic "${topic.title}" has no subtopics`);
        } else {
          totalSubtopics += topic.subtopics.length;
        }
      }

      if (contents.length < totalSubtopics) {
        warnings.push(`Generated contents count (${contents.length}) is less than expected subtopics (${totalSubtopics})`);
      }
    }

    for (const c of contents) {
      if (!c.title) {
        issues.push('Content item missing title');
      }
      if (!c.introduction || c.introduction.trim() === '') {
        issues.push(`Content "${c.title}" missing introduction`);
      }
      if (!Array.isArray(c.sections) || c.sections.length === 0) {
        issues.push(`Content "${c.title}" has no sections`);
      }
      if (!Array.isArray(c.sources) || c.sources.length === 0) {
        warnings.push(`Content "${c.title}" has no source references`);
      }
    }

    const status = issues.length === 0 ? 'PASS' : 'FAIL';
    const score = Math.max(0, 100 - issues.length * 15 - warnings.length * 5);

    console.log(`[VALIDATION] Status=${status} Score=${score} Issues=${issues.length} Warnings=${warnings.length}`);

    return {
      status,
      score,
      issues,
      warnings
    };
  }
}
