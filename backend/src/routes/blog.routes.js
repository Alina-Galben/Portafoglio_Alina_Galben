import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  getAllBlogPosts, 
  searchBlogPosts, 
  getBlogTags, 
  getBlogPostBySlug 
} from '../controllers/blog.controller.js';
import { validateBlogParams, validateSearchParams } from '../middleware/validate.js';

const router = Router();

const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Rate limit exceeded', retryAfter: '15m' }
});

const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Search quota exceeded', retryAfter: '5m' }
});

router.get('/', standardLimiter, getAllBlogPosts);
router.get('/tags', standardLimiter, getBlogTags);
router.get('/search', searchLimiter, validateSearchParams, searchBlogPosts);
router.get('/:slug', standardLimiter, validateBlogParams, getBlogPostBySlug);

export default router;