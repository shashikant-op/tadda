import { PipelineOrchestrator } from './pipeline/PipelineOrchestrator';
import { BackendClient } from './persistence/BackendClient';

class MockBackendClientForDemo extends BackendClient {
  async getBranches() {
    return [{ _id: 'branch-cse', name: 'Computer Science Engineering', slug: 'computer-science-engineering' }];
  }
  async createBranch(data: any) {
    return { _id: 'branch-cse', ...data, slug: 'computer-science-engineering' };
  }
  async getSubjects(branchId?: string) {
    return [];
  }
  async createSubject(data: any) {
    return { _id: 'subject-soft-computing', ...data, slug: 'soft-computing' };
  }
  async getTopics(subjectId?: string) {
    return [];
  }
  async createTopic(data: any) {
    return { _id: 'topic-id', ...data, slug: 'topic-slug' };
  }
  async createTutorial(data: any) {
    return { _id: 'tut-id', ...data };
  }
}

async function runDemo() {
  console.log('========================================');
  console.log('AI COURSE PIPELINE - DEMO EXECUTION');
  console.log('========================================');
  console.log('Course: Soft Computing');
  console.log('Branch: Computer Science Engineering');
  console.log('----------------------------------------');

  const orchestrator = new PipelineOrchestrator();
  // Use mock persistence client for standalone demo execution
  (orchestrator as any).persistenceService.client = new MockBackendClientForDemo();

  const job = await orchestrator.runPipeline('Soft Computing', 'Computer Science Engineering');

  console.log('========================================');
  console.log(`Job ID: ${job.jobId}`);
  console.log(`Status: ${job.status.toUpperCase()}`);
  console.log(`Progress: ${job.progress}%`);
  if (job.result && job.result.structure) {
    console.log(`Generated Topics: ${job.result.structure.topics.length}`);
    console.log(`Saved Subtopics/Tutorials: ${job.result.persistence.subtopicsCreated}`);
  }
  console.log('========================================');
  console.log(job.status === 'completed' ? 'SUCCESS - PIPELINE COMPLETED' : 'FAILED');
  console.log('========================================');
}

runDemo().catch(err => {
  console.error('Demo execution error:', err);
});
