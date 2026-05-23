import express from 'express';
import GeneratedPaper from '../models/GeneratedPaper.js';
import { cache } from '../config/redis.js';

const router = express.Router();

// GET /api/papers/:id (supports both assignmentId and paper _id)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `paper:${id}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(cached);

    // Try finding by assignmentId first
    let paper = await GeneratedPaper.findOne({ assignmentId: id });
    
    // If not found, try finding by paper _id directly
    if (!paper) {
      paper = await GeneratedPaper.findById(id);
    }

    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    await cache.set(cacheKey, paper, 300);
    res.json(paper);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/papers/:id/pdf (supports both assignmentId and paper _id)
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    
    let paper = await GeneratedPaper.findOne({ assignmentId: id });
    if (!paper) {
      paper = await GeneratedPaper.findById(id);
    }

    if (!paper || !paper.pdfUrl) {
      return res.status(404).json({ message: 'PDF not found or not yet generated' });
    }

    // Assuming pdfUrl is a base64 data URI for simplicity as per requirements
    const base64Data = paper.pdfUrl.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
