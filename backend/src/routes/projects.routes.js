import express from 'express';
import rateLimit from 'express-rate-limit';
import * as projectsController from '../controllers/projects.controller.js';
import { validateBlogParams } from '../middleware/validate.js';

const router = express.Router();

// Rate limiting per le API dei progetti
const projectsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // 100 richieste per IP
  message: {
    error: 'Troppe richieste',
    message: 'Limite di richieste superato per le API dei progetti. Riprova tra 15 minuti.'
  }
});

/**
 * @route GET /api/projects
 * @desc Ottieni tutti i progetti
 * @access Public
 * @query {number} limit - Numero massimo di progetti da restituire (default: 10)
 * @query {number} skip - Numero di progetti da saltare per la paginazione (default: 0)
 * @query {string} order - Ordine di ordinamento (default: -fields.date)
 */
router.get('/', projectsRateLimit, projectsController.getAllProjects);

/**
 * @route GET /api/projects/technologies
 * @desc Ottieni tutte le tecnologie utilizzate nei progetti
 * @access Public
 */
router.get('/technologies', projectsRateLimit, projectsController.getProjectTechnologies);

/**
 * @route GET /api/projects/:slug
 * @desc Ottieni un singolo progetto per slug
 * @access Public
 * @param {string} slug - Slug univoco del progetto
 */
router.get('/:slug', projectsRateLimit, validateBlogParams, projectsController.getProjectBySlug);

export default router;
