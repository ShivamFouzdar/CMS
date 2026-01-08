import { Router } from 'express';
import {
    getMedia,
    uploadMedia,
    deleteMedia
} from '@/controllers/mediaController';
import { authenticateToken, requireRole } from '@/middleware/auth';
// Existing upload middleware is specific to 'resume'. We should probably make a generic one or reuse it.
// The existing `uploadResume` uses `cloudinaryFolderNames.resumes`. 
// We should probably export a generic `uploadMedia` middleware in `middleware/upload.ts` or reuse it.
// For now, let's create a generic one or adapt. 
// Actually, looking at `middleware/upload.ts` content from previous turn: it is hardcoded to 'resumes'.
// I should probably update `middleware/upload.ts` to handle generic uploads first.
// But for this step, I will use `uploadResume` temporarily or create a new one. 
// Let's create a new `uploadMedia` middleware in `middleware/upload.ts` first.
// Wait, I can't update middleware inside this `write_to_file`. 
// I will create the route and import `uploadGeneric` which I will create next.

// Let's assume I will add `uploadGeneric` to `middleware/upload.ts`.
import { uploadGeneric } from '@/middleware/upload';

const router = Router();

/**
 * Media Routes
 * Handles media file management
 */

// All media routes require authentication and admin/moderator role
router.use(authenticateToken);
router.use(requireRole(['admin', 'moderator']));

router.get('/', getMedia);
router.post('/', uploadGeneric.single('file'), uploadMedia);
router.delete('/:id', deleteMedia);

export default router;
