

import { sendNotificationEmail, emailTemplates } from './email.service';
import { UserRepository } from '@/repositories/user.repository';
import { Settings as modelSettings } from '@/models/Settings';

export type NotificationType = 'new-leads' | 'job-applications' | 'reviews' | 'system-alerts';

/**
 * Notification Service
 * Handles sending notifications to admin users based on their preferences
 */
export class NotificationService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get admin users who should receive notifications for a specific type
   */
  private async getNotificationRecipients(notificationType: NotificationType): Promise<string[]> {
    try {
      // 1. Check if notifications are enabled globally for this type
      const settingsRes = await modelSettings.getSettings();
      const globalEnabled = settingsRes.emailNotifications !== false;

      // Map dynamic NotificationType string to schema field
      const alertMap: Record<NotificationType, string> = {
        'new-leads': 'inquiries',
        'job-applications': 'jobApplications',
        'reviews': 'reviews',
        'system-alerts': 'systemAlerts'
      };

      const specificGlobalEnabled = (settingsRes.notificationAlerts as any)?.[alertMap[notificationType]] !== false;

      if (!globalEnabled || !specificGlobalEnabled) {
        console.log(`Global notifications disabled for ${notificationType}`);
        return [];
      }

      // 2. Get all active admin/moderator users
      const admins = await this.userRepository.findWithPagination(
        { isActive: true, role: { $in: ['admin', 'moderator'] } },
        {},
        0,
        1000
      );

      const recipients: string[] = [];

      for (const user of admins) {
        // Individual preferences
        const userEmailEnabled = user.preferences?.notifications?.email !== false;
        const userAlertEnabled = (user.preferences?.notifications?.alerts as any)?.[alertMap[notificationType]] !== false;

        if (userEmailEnabled && userAlertEnabled && user.email) {
          recipients.push(user.email);
        }
      }

      console.log(`📧 Found ${recipients.length} notification recipient(s) for ${notificationType}`);
      return recipients;
    } catch (error) {
      console.error('❌ Error fetching notification recipients:', error);
      return [];
    }
  }

  /**
   * Send notification for new job application
   */
  async notifyNewJobApplication(applicationData: {
    fullName: string;
    email: string;
    phone: string;
    position?: string;
    experience: string;
  }): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients('job-applications');

      if (recipients.length === 0) return;

      const template = emailTemplates.newJobApplication({
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone,
        position: applicationData.position || 'General Position',
        experience: applicationData.experience,
      });

      await sendNotificationEmail(recipients, template.subject, template.html);
      console.log(`✅ Job application notification sent successfully to ${recipients.length} admin(s)`);
    } catch (error) {
      console.error('❌ Failed to send job application notification:', error);
    }
  }

  /**
   * Send notification for new lead
   */
  async notifyNewLead(leadData: {
    name: string;
    email: string;
    phone?: string;
    service: string;
    message: string;
  }): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients('new-leads');

      if (recipients.length === 0) return;

      const template = emailTemplates.newLead({
        name: leadData.name,
        email: leadData.email,
        ...(leadData.phone ? { phone: leadData.phone } : {}),
        service: leadData.service,
        message: leadData.message,
      });

      await sendNotificationEmail(recipients, template.subject, template.html);
      console.log(`✅ Lead notification sent successfully to ${recipients.length} admin(s)`);
    } catch (error) {
      console.error('❌ Failed to send lead notification:', error);
    }
  }

  /**
   * Send notification for new review
   */
  async notifyNewReview(reviewData: {
    reviewerName: string;
    company: string;
    rating: number;
    category: string;
  }): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients('reviews');

      if (recipients.length === 0) return;

      const template = emailTemplates.newReview({
        reviewerName: reviewData.reviewerName,
        company: reviewData.company,
        rating: reviewData.rating,
        category: reviewData.category,
      });

      await sendNotificationEmail(recipients, template.subject, template.html);
      console.log(`✅ Review notification sent successfully to ${recipients.length} admin(s)`);
    } catch (error) {
      console.error('❌ Failed to send review notification:', error);
    }
  }

  /**
   * Send system alert notification
   */
  async notifySystemAlert(alertData: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
  }): Promise<void> {
    try {
      const recipients = await this.getNotificationRecipients('system-alerts');

      if (recipients.length === 0) return;

      const template = emailTemplates.systemAlert({
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity,
      });

      await sendNotificationEmail(recipients, template.subject, template.html);
      console.log(`✅ System alert notification sent to ${recipients.length} admin(s)`);
    } catch (error) {
      console.error('Failed to send system alert notification:', error);
    }
  }
}

export const notificationService = new NotificationService();

// Export individual functions for backward compatibility/destructuring support
// Note: This binds them to the singleton instance
export const notifyNewJobApplication = notificationService.notifyNewJobApplication.bind(notificationService);
export const notifyNewLead = notificationService.notifyNewLead.bind(notificationService);
export const notifyNewReview = notificationService.notifyNewReview.bind(notificationService);
export const notifySystemAlert = notificationService.notifySystemAlert.bind(notificationService);
