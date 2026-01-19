import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const router = Router();

/**
 * GET /api/users
 * List all users.
 */
router.get('/', UserController.getAll);

/**
 * GET /api/users/:id
 * Get user by ID.
 */
router.get('/:id', UserController.getById);

export default router;
