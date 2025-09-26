import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      next(error);
    }
  };
};

// Common validation schemas
export const farmerIdSchema = z.object({
  params: z.object({
    farmerId: z.string().min(1, 'Farmer ID is required')
  })
});

export const generateQuizSchema = z.object({
  params: z.object({
    farmerId: z.string().min(1, 'Farmer ID is required')
  }),
  body: z.object({
    numQuestions: z.number().min(1).max(10).optional(),
    category: z.string().optional()
  })
});

export const submitQuizSchema = z.object({
  params: z.object({
    farmerId: z.string().min(1, 'Farmer ID is required')
  }),
  body: z.object({
    questionIds: z.array(z.string()),
    answers: z.record(z.string()),
    sessionType: z.enum(['daily', 'practice']).optional()
  })
});