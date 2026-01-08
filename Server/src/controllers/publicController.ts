import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/helpers';
import { sendSuccess } from '@/utils/response.utils';
import { Settings } from '@/models/Settings';

/**
 * Public Controller
 * Handles public-facing API requests (no authentication required)
 */

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Publicly accessible endpoints
 */

/**
 * @swagger
 * /api/public/settings:
 *   get:
 *     summary: Get public system settings
 *     description: Returns non-sensitive site configuration (name, description, social links, contact info)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Public settings retrieved successfully
 */
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
    // Fetch settings, excluding sensitive fields (though we select specific fields manually below for safety)
    const settings = await Settings.findOne().lean();

    if (!settings) {
        return sendSuccess(res, 'Default settings', {
            siteName: 'CareerMap Solutions',
            siteDescription: '',
            contactEmail: '',
            contactPhone: '',
            socialMedia: {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: '',
                youtube: ''
            }
        });
    }

    // whitelist only public fields
    const publicSettings = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        socialMedia: settings.socialMedia,
        allowRegistrations: settings.allowRegistrations
    };

    return sendSuccess(res, 'Public settings retrieved successfully', publicSettings);
});
