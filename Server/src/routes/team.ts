import express from 'express';
import * as teamController from '../controllers/team.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', teamController.getAllMembers);

// Admin routes (Protected)
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/admin', teamController.getAdminMembers);
router.post('/', teamController.createMember);
router.put('/reorder', teamController.reorderMembers);
router.put('/:id', teamController.updateMember);
router.delete('/:id', teamController.deleteMember);

export default router;
