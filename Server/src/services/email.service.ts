
import nodemailer from 'nodemailer';
import { createError } from '@/utils/helpers';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
}

export class EmailService {

    private async getTransporter() {
        // Try to get settings from DB first
        let smtpHost, smtpPort, smtpUser, smtpPass, fromEmail;
        let secure = false;

        try {
            const { Settings } = await import('@/models/Settings');
            const settings = await Settings.findOne().select('+smtp.password');
            if (settings && settings.smtp && settings.smtp.host) {
                smtpHost = settings.smtp.host;
                smtpPort = settings.smtp.port;
                smtpUser = settings.smtp.user;
                smtpPass = settings.smtp.password;
                secure = settings.smtp.secure;
                fromEmail = settings.smtp.fromEmail;
            }
        } catch (error) {
            console.error('Failed to fetch settings for email service:', error);
        }

        // Fallback to env vars
        if (!smtpHost) {
            smtpHost = process.env['SMTP_HOST'];
            smtpPort = parseInt(process.env['SMTP_PORT'] || '587', 10);
            smtpUser = process.env['SMTP_USER'];
            smtpPass = process.env['SMTP_PASS'];
            secure = process.env['SMTP_SECURE'] === 'true';
        }

        if (!smtpHost || !smtpUser || !smtpPass) {
            throw new Error('Email service not configured. Please check SMTP settings.');
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: typeof smtpPort === 'string' ? parseInt(smtpPort, 10) : smtpPort,
            secure: secure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        return { transporter, defaultFrom: fromEmail || process.env['SMTP_FROM'] || smtpUser || 'noreply@example.com' };
    }

    async checkHealth(): Promise<boolean> {
        try {
            const { transporter } = await this.getTransporter();
            return await transporter.verify();
        } catch (error) {
            console.error('SMTP Health Check Failed:', error);
            return false;
        }
    }

    async verifyConfig(config: any): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            host: config.host,
            port: parseInt(config.port, 10),
            secure: config.secure,
            auth: {
                user: config.user,
                pass: config.password,
            },
            connectionTimeout: 10000, // 10s timeout
        });

        try {
            await transporter.verify();
            return true;
        } catch (error) {
            console.error('SMTP Verification Failed:', error);
            throw error;
        }
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const { transporter, defaultFrom } = await this.getTransporter();

            await transporter.sendMail({
                from: options.from || defaultFrom,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                text: options.text || options.html.replace(/<[^>]*>/g, ''),
                html: options.html,
            });
            console.log('✅ Email sent successfully!');
        } catch (error: any) {
            console.error('❌ Failed to send email:', error.message);
            // Don't throw logic error to prevent crashing main flows, but maybe throw specific error?
            // The original code threw createError. Let's maintain that.
            throw createError(`Failed to send email: ${error.message}`, 500);
        }
    }
}

export const emailTemplates = {
    newJobApplication: (data: {
        fullName: string;
        email: string;
        phone: string;
        position: string;
        experience: string;
    }) => ({
        subject: `New Job Application: ${data.fullName}`,
        html: `
      <!DOCTYPE html>
      <html><body>
      <h1>New Job Application Received</h1>
      <p>Name: ${data.fullName}</p>
      <p>Email: ${data.email}</p>
      <p>Phone: ${data.phone}</p>
      <p>Position: ${data.position}</p>
      <p>Experience: ${data.experience}</p>
      </body></html>
    `,
    }),
    newLead: (data: {
        name: string;
        email: string;
        phone?: string;
        service: string;
        message: string;
    }) => ({
        subject: `New Lead: ${data.name} - ${data.service}`,
        html: `
      <!DOCTYPE html>
      <html><body>
      <h1>New Lead Received</h1>
      <p>Name: ${data.name}</p>
      <p>Email: ${data.email}</p>
      ${data.phone ? `<p>Phone: ${data.phone}</p>` : ''}
      <p>Service: ${data.service}</p>
      <p>Message: ${data.message}</p>
      </body></html>
    `,
    }),
    newReview: (data: {
        reviewerName: string;
        company: string;
        rating: number;
        category: string;
    }) => ({
        subject: `New Review: ${data.reviewerName} - ${data.company}`,
        html: `
      <!DOCTYPE html>
      <html><body>
      <h1>New Review Received</h1>
      <p>Reviewer: ${data.reviewerName}</p>
      <p>Company: ${data.company}</p>
      <p>Category: ${data.category}</p>
      <p>Rating: ${data.rating}/5</p>
      </body></html>
    `,
    }),
    systemAlert: (data: {
        title: string;
        message: string;
        severity: 'info' | 'warning' | 'error';
    }) => ({
        subject: `System Alert: ${data.title}`,
        html: `
      <!DOCTYPE html>
      <html><body>
      <h1>${data.title}</h1>
      <p>Severity: ${data.severity}</p>
      <p>Message: ${data.message}</p>
      </body></html>
    `,
    }),
};

export const emailService = new EmailService();
export const sendNotificationEmail = async (recipients: string[], subject: string, html: string) => {
    if (recipients.length === 0) return;
    await emailService.sendEmail({ to: recipients, subject, html });
};
