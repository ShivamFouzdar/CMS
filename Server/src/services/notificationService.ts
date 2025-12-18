import { User } from '@/models';
import { sendNotificationEmail, emailTemplates } from './emailService';

/**
 * Notification Service
 * Handles sending notifications to admin users based on their preferences
 */

export type NotificationType = 'new-leads' | 'job-applications' | 'reviews' | 'system-alerts';

/**
 * Get admin users who should receive notifications for a specific type
 */
const getNotificationRecipients = async (_notificationType: NotificationType): Promise<string[]> => {
  try {
    // Get all active admin users
    const users = await User.find({
      isActive: true,
      role: { $in: ['admin', 'moderator'] },
    }).select('email preferences');

    const recipients: string[] = [];

    for (const user of users) {
      // If user has preferences set, check if email notifications are enabled
      // If preferences are not set, default to sending notifications (backward compatibility)
      const emailEnabled = user.preferences?.notifications?.email !== false;
      
      if (!emailEnabled) {
        console.log(`Skipping ${user.email} - email notifications disabled`);
        continue;
      }

      // For now, we'll send to all admins with email enabled
      // In the future, we can add per-type preferences
      if (user.email) {
        recipients.push(user.email);
      } else {
        console.warn(`Admin user found without email address`);
      }
    }

    console.log(`📧 Found ${recipients.length} notification recipient(s) for ${_notificationType}`);
    if (recipients.length > 0) {
      console.log(`   Recipients: ${recipients.join(', ')}`);
    }

    return recipients;
  } catch (error) {
    console.error('❌ Error fetching notification recipients:', error);
    return [];
  }
};

/**
 * Send notification for new job application
 */
export const notifyNewJobApplication = async (applicationData: {
  fullName: string;
  email: string;
  phone: string;
  position?: string;
  experience: string;
}): Promise<void> => {
  try {
    console.log('📧 Attempting to send job application notification...');
    console.log('   Application data:', { fullName: applicationData.fullName, email: applicationData.email });
    
    const recipients = await getNotificationRecipients('job-applications');
    
    if (recipients.length === 0) {
      console.warn('⚠️  No recipients found for job application notification. Check:');
      console.warn('   1. Are there admin users in the database?');
      console.warn('   2. Do admin users have email addresses?');
      console.warn('   3. Are email notifications enabled in user preferences?');
      return;
    }

    const template = emailTemplates.newJobApplication({
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      position: applicationData.position || 'General Position',
      experience: applicationData.experience,
    });
    console.log('   Email template generated, sending to:', recipients.join(', '));

    await sendNotificationEmail(recipients, template.subject, template.html);
    console.log(`✅ Job application notification sent successfully to ${recipients.length} admin(s)`);
  } catch (error) {
    console.error('❌ Failed to send job application notification:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    // Don't throw - notifications shouldn't break the main flow
  }
};

/**
 * Send notification for new lead
 */
export const notifyNewLead = async (leadData: {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}): Promise<void> => {
  try {
    console.log('📧 Attempting to send lead notification...');
    console.log('   Lead data:', { name: leadData.name, email: leadData.email, service: leadData.service });
    
    const recipients = await getNotificationRecipients('new-leads');
    
    if (recipients.length === 0) {
      console.warn('⚠️  No recipients found for lead notification. Check:');
      console.warn('   1. Are there admin users in the database?');
      console.warn('   2. Do admin users have email addresses?');
      console.warn('   3. Are email notifications enabled in user preferences?');
      return;
    }

    const templateData: {
      name: string;
      email: string;
      phone?: string;
      service: string;
      message: string;
    } = {
      name: leadData.name,
      email: leadData.email,
      service: leadData.service,
      message: leadData.message,
    };
    
    if (leadData.phone) {
      templateData.phone = leadData.phone;
    }
    
    const template = emailTemplates.newLead(templateData);
    console.log('   Email template generated, sending to:', recipients.join(', '));

    await sendNotificationEmail(recipients, template.subject, template.html);
    console.log(`✅ Lead notification sent successfully to ${recipients.length} admin(s)`);
  } catch (error) {
    console.error('❌ Failed to send lead notification:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    // Don't throw - notifications shouldn't break the main flow
  }
};

/**
 * Send notification for new review
 */
export const notifyNewReview = async (reviewData: {
  reviewerName: string;
  company: string;
  rating: number;
  category: string;
}): Promise<void> => {
  try {
    console.log('📧 Attempting to send review notification...');
    console.log('   Review data:', { reviewerName: reviewData.reviewerName, company: reviewData.company });
    
    const recipients = await getNotificationRecipients('reviews');
    
    if (recipients.length === 0) {
      console.warn('⚠️  No recipients found for review notification. Check:');
      console.warn('   1. Are there admin users in the database?');
      console.warn('   2. Do admin users have email addresses?');
      console.warn('   3. Are email notifications enabled in user preferences?');
      return;
    }

    const template = emailTemplates.newReview({
      reviewerName: reviewData.reviewerName,
      company: reviewData.company,
      rating: reviewData.rating,
      category: reviewData.category,
    });
    console.log('   Email template generated, sending to:', recipients.join(', '));

    await sendNotificationEmail(recipients, template.subject, template.html);
    console.log(`✅ Review notification sent successfully to ${recipients.length} admin(s)`);
  } catch (error) {
    console.error('❌ Failed to send review notification:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    // Don't throw - notifications shouldn't break the main flow
  }
};

/**
 * Send system alert notification
 */
export const notifySystemAlert = async (alertData: {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}): Promise<void> => {
  try {
    const recipients = await getNotificationRecipients('system-alerts');
    
    if (recipients.length === 0) {
      console.log('No recipients for system alert notification');
      return;
    }

    const template = emailTemplates.systemAlert({
      title: alertData.title,
      message: alertData.message,
      severity: alertData.severity,
    });

    await sendNotificationEmail(recipients, template.subject, template.html);
    console.log(`✅ System alert notification sent to ${recipients.length} admin(s)`);
  } catch (error) {
    console.error('Failed to send system alert notification:', error);
    // Don't throw - notifications shouldn't break the main flow
  }
};

