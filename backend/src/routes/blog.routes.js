import express from 'express';
import rateLimit from 'express-rate-limit';
import * as blogController from '../controllers/blog.controller.js';
import { validateBlogParams, validateSearchParams } from '../middleware/validate.js';

const router = express.Router();

// Rate limiting per le API del blog
const blogRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // 100 richieste per IP
  message: {
    error: 'Troppe richieste',
    message: 'Limite di richieste superato per le API del blog. Riprova tra 15 minuti.'
  }
});

// Rate limiting più restrittivo per la ricerca
const searchRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minuti
  max: 20, // 20 ricerche per IP
  message: {
    error: 'Troppe ricerche',
    message: 'Limite di ricerche superato. Riprova tra 5 minuti.'
  }
});

/**
 * @route GET /api/blog
 * @desc Ottieni tutti i blog posts pubblicati
 * @access Public
 * @query {number} limit - Numero massimo di post da restituire (default: 10)
 * @query {number} skip - Numero di post da saltare per la paginazione (default: 0)
 * @query {string} order - Ordine di ordinamento (default: -fields.publishDate)
 */
router.get('/', blogRateLimit, blogController.getAllBlogPosts);

/**
 * @route GET /api/blog/search
 * @desc Cerca blog posts
 * @access Public
 * @query {string} q - Termine di ricerca nel titolo e contenuto
 * @query {string|string[]} tags - Tag da filtrare
 * @query {number} limit - Numero massimo di risultati (default: 10)
 * @query {number} skip - Numero di risultati da saltare (default: 0)
 */
router.get('/search', searchRateLimit, validateSearchParams, blogController.searchBlogPosts);

/**
 * @route GET /api/blog/tags
 * @desc Ottieni tutti i tag disponibili
 * @access Public
 */
router.get('/tags', blogRateLimit, blogController.getBlogTags);

/**
 * @route GET /api/blog/:slug
 * @desc Ottieni un singolo blog post per slug
 * @access Public
 * @param {string} slug - Slug univoco del blog post
 */
router.get('/:slug', blogRateLimit, validateBlogParams, blogController.getBlogPostBySlug);

export default router;