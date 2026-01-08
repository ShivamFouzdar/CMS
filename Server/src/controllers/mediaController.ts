import { Request, Response } from 'express';
import { asyncHandler, createError } from '@/utils/helpers';
import Media from '@/models/Media';
import { auditService } from '@/services/audit.service';
import { configureCloudinary } from '@/config/cloudinary';

const cloudinary = configureCloudinary();

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: Filter by type (image, document)
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of media files
 */
export const getMedia = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const type = req.query['type'] as string;

    const query: any = {};
    if (type) query.type = type;

    const media = await Media.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('uploadedBy', 'firstName lastName');

    const total = await Media.countDocuments(query);

    res.json({
        success: true,
        data: media,
        pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit
        }
    });
});

/**
 * @swagger
 * /api/media:
 *   post:
 *     summary: Upload a new file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw createError('No file uploaded', 400);
    }

    // req.file is populated by multer-storage-cloudinary
    // However, we want to store it in our Media model too.

    const file = req.file as any; // Cast to any to access cloudinary specific props if needed

    // Create Media record
    const media = await Media.create({
        url: file.path,
        publicId: file.filename, // Multer-cloudinary stores public_id in filename
        fileName: file.originalname,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document',
        format: file.mimetype.split('/')[1] || 'unknown',
        size: file.size,
        uploadedBy: req.user!.id
    });

    await auditService.logAction(req, 'UPLOAD_MEDIA', 'Media', media.id, {
        fileName: media.fileName,
        url: media.url
    });

    res.status(201).json({
        success: true,
        data: media
    });
});

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File deleted successfully
 */
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const media = await Media.findById(id);
    if (!media) {
        throw createError('Media not found', 404);
    }

    // Delete from Cloudinary
    try {
        await cloudinary.uploader.destroy(media.publicId);
    } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
        // Continue to delete from DB even if Cloudinary fails (orphan cleanup)
    }

    await Media.deleteOne({ _id: id });

    await auditService.logAction(req, 'DELETE_MEDIA', 'Media', id, {
        fileName: media.fileName,
        publicId: media.publicId
    });

    res.json({
        success: true,
        message: 'Media deleted successfully'
    });
});
