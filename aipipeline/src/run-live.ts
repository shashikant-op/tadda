import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { PipelineOrchestrator } from './pipeline/PipelineOrchestrator';

async function getToken(): Promise<string> {
  if (process.env.ADMIN_TOKEN) {
    return process.env.ADMIN_TOKEN;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const backendUrl = process.env.BACKEND_URL || 'https://tutorialsadda.onrender.com/api/v1';

  if (!email || !password) {
    throw new Error('Authentication required: Please set ADMIN_TOKEN or (ADMIN_EMAIL and ADMIN_PASSWORD) in aipipeline/.env');
  }

  console.log(`[AUTH] Logging in as ${email} to ${backendUrl}...`);
  try {
    const res = await axios.post(`${backendUrl}/auth/login`, { email, password });
    const token = res.data?.data?.token || res.data?.token;
    if (!token) {
      throw new Error('Login succeeded but token was not returned in response.');
    }
    console.log('[AUTH] Successfully obtained admin authentication token.');
    return token;
  } catch (err: any) {
    throw new Error(`Failed to authenticate with Render backend: ${err.response?.data?.message || err.message}`);
  }
}

async function runLivePipeline() {
  const courseName = process.argv[2] || 'Soft Computing';
  const branchName = process.argv[3] || 'Computer Science Engineering';

  console.log('========================================');
  console.log('RUNNING AI PIPELINE LOCALLY → RENDER BACKEND');
  console.log('========================================');
  console.log(`Course: ${courseName}`);
  console.log(`Branch: ${branchName}`);
  console.log(`Backend URL: ${process.env.BACKEND_URL || 'https://tutorialsadda.onrender.com/api/v1'}`);
  console.log('----------------------------------------');

  const token = await getToken();

  const orchestrator = new PipelineOrchestrator(token);
  const job = await orchestrator.runPipeline(courseName, branchName, token);

  console.log('========================================');
  console.log(`Job ID: ${job.jobId}`);
  console.log(`Status: ${job.status.toUpperCase()}`);
  console.log(`Progress: ${job.progress}%`);
  if (job.errors && job.errors.length > 0) {
    console.log('Errors:', job.errors);
  }
  if (job.result && job.result.persistence) {
    console.log(`Persistence Result:`, job.result.persistence);
  }
  console.log('========================================');
}

runLivePipeline().catch(err => {
  console.error('Live pipeline execution error:', err.message);
});
