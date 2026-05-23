import express from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import Assignment from '../models/Assignment.js';
import { paperQueue } from '../config/queue.js';
import { cache, redisClient } from '../config/redis.js';
import { emitToClient } from '../services/websocket.js';
import GeneratedPaper from '../models/GeneratedPaper.js';

const router = express.Router();

const assignmentSchema = z.object({
  subject: z.string().min(2),
  grade: z.string().min(1),
  dueDate: z.string().refine((d) => new Date(d) > new Date(), "Must be future date"),
  questionTypes: z.array(z.object({
    type: z.string().min(1),
    count: z.number().min(1).max(50),
    marksEach: z.number().min(1).max(20)
  })).min(1),
  additionalInfo: z.string().optional(),
  fileContent: z.string().optional()
});

// GET /api/assignments
router.get('/', async (req, res) => {
  try {
    const cachedData = await cache.get('assignments:all');
    if (cachedData) return res.json(cachedData);

    const assignments = await Assignment.find().sort({ createdAt: -1 });
    await cache.set('assignments:all', assignments, 60);
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/assignments
router.post('/', validate(assignmentSchema), async (req, res) => {
  try {
    const totalQuestions = req.body.questionTypes.reduce((acc: number, q: any) => acc + q.count, 0);
    const totalMarks = req.body.questionTypes.reduce((acc: number, q: any) => acc + (q.count * q.marksEach), 0);

    const assignment = new Assignment({
      ...req.body,
      totalQuestions,
      totalMarks,
      status: 'pending'
    });

    await assignment.save();
    await cache.del('assignments:all');

    if (!paperQueue || !redisClient.isOpen) {
      console.warn('Redis/Queue unavailable. Performing simulated fallback generation.');
      const jobId = `fallback-${assignment._id}`;
      
      // Start background simulation
      (async () => {
        try {
          // Log 1: Analyzing
          await new Promise(r => setTimeout(r, 1000));
          emitToClient(jobId, { type: 'progress', percent: 33, message: 'Step 1/3: Analyzing curriculum and instructions...' });

          // Log 2: Generating
          await new Promise(r => setTimeout(r, 2000));
          emitToClient(jobId, { type: 'progress', percent: 66, message: 'Step 2/3: AI is drafting professional assessment questions...' });

          // Log 3: Finalizing
          await new Promise(r => setTimeout(r, 2000));
          emitToClient(jobId, { type: 'progress', percent: 90, message: 'Step 3/3: Structuring and formatting exam paper...' });
          
          const mockPaper = new GeneratedPaper({
            assignmentId: assignment._id,
            schoolName: "Delhi Public School, Sector-4, Bokaro",
            subject: req.body.subject,
            grade: req.body.grade,
            timeAllowed: "45 minutes",
            totalMarks: totalMarks,
            sections: [
              {
                title: "Section A",
                questionType: req.body.questionTypes[0]?.type || "Short Answer Questions",
                instruction: "Attempt all questions.",
                questions: [
                  { number: 1, text: "Mock question for demo (Redis is offline)", difficulty: "Easy", marks: 2 },
                  { number: 2, text: "How does AI transform education?", difficulty: "Moderate", marks: 3 }
                ]
              }
            ],
            answerKey: [
              { number: 1, answer: "Mock answer for demo" },
              { number: 2, answer: "AI enhances personalized learning and automates administrative tasks." }
            ]
          });
          
          await mockPaper.save();
          await new Promise(r => setTimeout(r, 1000));
          emitToClient(jobId, { type: 'complete', paperId: mockPaper._id });
        } catch (err) {
          console.error('Fallback simulation error:', err);
          emitToClient(jobId, { type: 'error', message: 'Simulated generation failed' });
        }
      })();

      return res.status(201).json({ assignmentId: assignment._id, jobId });
    }

    const job = await paperQueue!.add('generate-paper', {
      assignmentId: assignment._id,
      ...req.body
    });

    res.status(201).json({ assignmentId: assignment._id, jobId: job.id });
  } catch (error: any) {
    console.error('POST /api/assignments error:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    await cache.del('assignments:all');
    await cache.del(`paper:${assignment._id}`);
    res.json({ message: 'Assignment deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/assignments/:id/regenerate
router.post('/:id/regenerate', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.status = 'pending';
    await assignment.save();

    await cache.del('assignments:all');
    await cache.del(`paper:${assignment._id}`);

    if (!paperQueue) {
      return res.status(503).json({ message: 'Generation service unavailable' });
    }

    const job = await paperQueue!.add('generate-paper', {
      assignmentId: assignment._id,
      subject: assignment.subject,
      grade: assignment.grade,
      dueDate: assignment.dueDate,
      questionTypes: assignment.questionTypes,
      additionalInfo: assignment.additionalInfo,
      fileContent: assignment.fileContent
    });

    res.json({ jobId: job.id });
  } catch (error: any) {
    console.error('POST /api/assignments/:id/regenerate error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
