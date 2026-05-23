import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.log('Redis reconnection limit reached. Stopping retries.');
        return false; // Stop retrying
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

let lastErrorLogTime = 0;
const ERROR_LOG_INTERVAL = 10000; // Log error once every 10 seconds

redisClient.on('error', (err) => {
  const now = Date.now();
  if (now - lastErrorLogTime > ERROR_LOG_INTERVAL) {
    console.error('Redis Client Error (throttled):', err.message || err);
    lastErrorLogTime = now;
  }
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      // Set a timeout for the connection attempt
      const connectPromise = redisClient.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('Redis Connected');
    }
  } catch (error) {
    console.error('Failed to connect to Redis. Some features like caching and jobs will be unavailable.');
    // We don't rethrow here so the server can still start
  }
};

export const cache = {
  get: async (key: string) => {
    if (!redisClient.isOpen) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Cache get error:', err);
      return null;
    }
  },
  set: async (key: string, value: any, ttl: number = 300) => {
    if (!redisClient.isOpen) return;
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (err) {
      console.error('Cache set error:', err);
    }
  },
  del: async (key: string) => {
    if (!redisClient.isOpen) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      console.error('Cache del error:', err);
    }
  },
  invalidate: async (pattern: string) => {
    if (!redisClient.isOpen) return;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error('Cache invalidate error:', err);
    }
  }
};

export { redisClient };
