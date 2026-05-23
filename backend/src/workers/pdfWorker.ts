import { Worker, Job } from 'bullmq';
import GeneratedPaper from '../models/GeneratedPaper.js';
import { generatePDF } from '../services/pdfService.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};

export const pdfWorker = new Worker('pdf-generation', async (job: Job) => {
  const { paperId } = job.data;

  try {
    const paper = await GeneratedPaper.findById(paperId);
    if (!paper) throw new Error('Paper not found');

    console.log(`Generating PDF for paper: ${paperId}`);
    const base64Pdf = await generatePDF(paper);
    
    await GeneratedPaper.findByIdAndUpdate(paperId, { 
      pdfUrl: `data:application/pdf;base64,${base64Pdf}` 
    });

    console.log(`PDF generated successfully for paper: ${paperId}`);
    return { success: true };
  } catch (error: any) {
    console.error('PDF Worker error:', error);
    throw error;
  }
}, { connection });

console.log('PDF Generation Worker Initialized');
