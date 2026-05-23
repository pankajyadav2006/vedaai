import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  maxRetriesPerRequest: null, // Required by BullMQ when connection is unstable
};

let paperQueue: Queue | null = null;
let pdfQueue: Queue | null = null;

try {
  paperQueue = new Queue('paper-generation', { 
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
    }
  });

  pdfQueue = new Queue('pdf-generation', { 
    connection,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 2000,
      },
      removeOnComplete: true,
    }
  });

  let lastQueueErrorTime = 0;
  const QUEUE_ERROR_LOG_INTERVAL = 10000;

  paperQueue.on('error', (err) => {
    const now = Date.now();
    if (now - lastQueueErrorTime > QUEUE_ERROR_LOG_INTERVAL) {
      console.error('Paper Queue Error (throttled):', err.message);
      lastQueueErrorTime = now;
    }
  });

  pdfQueue.on('error', (err) => {
    const now = Date.now();
    if (now - lastQueueErrorTime > QUEUE_ERROR_LOG_INTERVAL) {
      console.error('PDF Queue Error (throttled):', err.message);
      lastQueueErrorTime = now;
    }
  });

  console.log('BullMQ Queues Initialized');
} catch (error) {
  console.error('Failed to initialize BullMQ queues:', error);
}

export { paperQueue, pdfQueue };
