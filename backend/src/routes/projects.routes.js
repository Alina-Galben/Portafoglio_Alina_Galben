import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  getAllProjects, 
  getProjectTechnologies, 
  getProjectBySlug 
} from '../controllers/projects.controller.js';
import { validateProjectSlug } from '../middleware/validate.js';
const router = Router();

const projectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Project API quota exceeded', retryAfter: '15m' }
});

router.get('/', projectLimiter, getAllProjects);
router.get('/technologies', projectLimiter, getProjectTechnologies);
router.get('/:slug', projectLimiter, validateProjectSlug, getProjectBySlug);

export default router;