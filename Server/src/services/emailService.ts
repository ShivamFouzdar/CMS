import nodemailer from 'nodemailer';
import { createError } from '@/utils/helpers';

/**
 * Email Service
 * Handles sending emails via SMTP
 */

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 */
export const initializeEmailService = (): void => {
  const smtpHost = process.env['SMTP_HOST'];
  const smtpPort = process.env['SMTP_PORT'];
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASS'];

  // Check if email is configured
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn('⚠️  Email service not configured. SMTP credentials missing in .env file.');
    console.warn('   Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to enable email notifications.');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // For Gmail, you may need to enable "Less secure app access" or use App Password
      // For other providers, adjust settings accordingly
    });

    console.log('✅ Email service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
  }
};

/**
 * Verify email transporter connection
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email service verification failed:', error);
    return false;
  }
};

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!transporter) {
    const errorMsg = 'Email service is not configured. Please set SMTP credentials in .env file.';
    console.error('❌', errorMsg);
    console.error('   Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
    throw createError(errorMsg, 500);
  }

  // Use SMTP_FROM if provided, otherwise fall back to SMTP_USER
  // For Gmail: "from" should match SMTP_USER or be an alias
  // For custom domains: Can use any address from your domain
  const defaultFrom = process.env['SMTP_FROM'] || process.env['SMTP_USER'] || 'noreply@careermapsolutions.com';

  try {
    const mailOptions = {
      from: options.from || defaultFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html: options.html,
    };

    console.log('📤 Sending email...');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      if ('code' in error) {
        console.error('   Error code:', (error as any).code);
      }
      if ('command' in error) {
        console.error('   SMTP command:', (error as any).command);
      }
    }
    throw createError('Failed to send email notification', 500);
  }
};

/**
 * Send notification email to admin users
 */
export const sendNotificationEmail = async (
  recipients: string[],
  subject: string,
  htmlContent: string
): Promise<void> => {
  if (recipients.length === 0) {
    return;
  }

  try {
    await sendEmail({
      to: recipients,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
    // Don't throw - notifications shouldn't break the main flow
  }
};

/**
 * Email Templates
 */
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
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Application Received</h1>
          </div>
          <div class="content">
            <p>You have received a new job application:</p>
            <div class="info-row">
              <span class="label">Name:</span> ${data.fullName}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${data.email}
            </div>
            <div class="info-row">
              <span class="label">Phone:</span> ${data.phone}
            </div>
            <div class="info-row">
              <span class="label">Position:</span> ${data.position}
            </div>
            <div class="info-row">
              <span class="label">Experience:</span> ${data.experience}
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env['CLIENT_URL'] || 'http://localhost:5005'}/admin/job-applicants" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Application
              </a>
            </p>
          </div>
          <div class="footer">
            <p>CareerMap Solutions - Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
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
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; }
          .message-box { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #764ba2; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Lead Received</h1>
          </div>
          <div class="content">
            <p>You have received a new lead:</p>
            <div class="info-row">
              <span class="label">Name:</span> ${data.name}
            </div>
            <div class="info-row">
              <span class="label">Email:</span> ${data.email}
            </div>
            ${data.phone ? `<div class="info-row"><span class="label">Phone:</span> ${data.phone}</div>` : ''}
            <div class="info-row">
              <span class="label">Service:</span> ${data.service}
            </div>
            <div class="message-box">
              <span class="label">Message:</span><br>
              ${data.message}
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env['CLIENT_URL'] || 'http://localhost:5005'}/admin/leads" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Lead
              </a>
            </p>
          </div>
          <div class="footer">
            <p>CareerMap Solutions - Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
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
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; }
          .rating { font-size: 24px; color: #ffc107; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Review Received</h1>
          </div>
          <div class="content">
            <p>You have received a new review:</p>
            <div class="info-row">
              <span class="label">Reviewer:</span> ${data.reviewerName}
            </div>
            <div class="info-row">
              <span class="label">Company:</span> ${data.company}
            </div>
            <div class="info-row">
              <span class="label">Category:</span> ${data.category}
            </div>
            <div class="info-row">
              <span class="label">Rating:</span> 
              <span class="rating">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
              (${data.rating}/5)
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env['CLIENT_URL'] || 'http://localhost:5005'}/admin/reviews" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Review
              </a>
            </p>
          </div>
          <div class="footer">
            <p>CareerMap Solutions - Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
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
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${data.severity === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : data.severity === 'warning' ? 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert-box { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid ${data.severity === 'error' ? '#f5576c' : data.severity === 'warning' ? '#fcb69f' : '#667eea'}; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.title}</h1>
          </div>
          <div class="content">
            <div class="alert-box">
              ${data.message}
            </div>
            <p style="margin-top: 20px;">
              <a href="${process.env['CLIENT_URL'] || 'http://localhost:5005'}/admin" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Admin Panel
              </a>
            </p>
          </div>
          <div class="footer">
            <p>CareerMap Solutions - Admin Panel</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

