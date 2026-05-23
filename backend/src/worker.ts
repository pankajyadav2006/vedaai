import Assignment from './models/Assignment.js';
import GeneratedPaper from './models/GeneratedPaper.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { paperWorker } from './workers/paperWorker.js';
import { pdfWorker } from './workers/pdfWorker.js';

const startWorker = async () => {
  try {
    await connectDB();
    await connectRedis();
    console.log('Worker processes started');

    // Keep the process alive
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing workers...');
      await paperWorker.close();
      await pdfWorker.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();
