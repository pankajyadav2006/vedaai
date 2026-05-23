import express from 'express';
import { cache } from '../config/redis.js';

const router = express.Router();

// GET /api/jobs/:jobId/status
router.get('/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await cache.get(`job:${jobId}:status`);
    
    if (!status) {
      return res.status(404).json({ message: 'Job status not found' });
    }

    res.json(status);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
