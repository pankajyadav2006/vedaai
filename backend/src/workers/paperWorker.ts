import { Worker, Job } from 'bullmq';
import Assignment from '../models/Assignment.js';
import GeneratedPaper from '../models/GeneratedPaper.js';
import { cache } from '../config/redis.js';
import { emitToClient } from '../services/websocket.js';
import { generatePaper } from '../services/llmService.js';
import { pdfQueue } from '../config/queue.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};

const updateJobStatus = async (jobId: string, status: string, progress: number, message: string) => {
  const payload = { status, progress, message };
  await cache.set(`job:${jobId}:status`, payload, 3600);
  emitToClient(jobId, { type: 'progress', percent: progress, message });
};

export const paperWorker = new Worker('paper-generation', async (job: Job) => {
  const { assignmentId } = job.data;
  const jobId = job.id!;

  try {
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    await updateJobStatus(jobId, 'processing', 10, 'Starting generation...');

    await updateJobStatus(jobId, 'processing', 25, 'Building prompt...');
    
    await updateJobStatus(jobId, 'processing', 40, 'AI is generating questions...');
    const parsedData = await generatePaper(job.data);

    await updateJobStatus(jobId, 'processing', 70, 'Parsing response...');
    
    await updateJobStatus(jobId, 'processing', 85, 'Saving paper...');
    const paper = new GeneratedPaper({
      assignmentId,
      ...parsedData
    });
    await paper.save();

    await cache.set(`paper:${assignmentId}`, paper, 300);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'completed' });
    
    // Add to PDF queue
    await pdfQueue!.add('generate-pdf', { paperId: paper._id });

    await updateJobStatus(jobId, 'completed', 100, 'Finalizing...');
    emitToClient(jobId, { type: 'complete', paperId: paper._id, assignmentId });

  } catch (error: any) {
    console.error('Paper Worker error:', error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    await updateJobStatus(jobId, 'failed', 0, error.message);
    emitToClient(jobId, { type: 'error', message: error.message });
  }
}, { connection });

console.log('Paper Generation Worker Initialized');
