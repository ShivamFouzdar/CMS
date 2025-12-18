# Notification System Documentation

## Overview

The notification system sends email notifications to admin users when important events occur in the system. It's designed to be non-blocking and respects user preferences.

## Features

- ✅ Email notifications via SMTP
- ✅ User preference management
- ✅ Notification types: New Leads, Job Applications, Reviews, System Alerts
- ✅ Beautiful HTML email templates
- ✅ Non-blocking notification delivery
- ✅ Automatic notification triggers on events

## Configuration

### Environment Variables

Add these to your `Server/.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@careermapsolutions.com
```

### Gmail Setup

For Gmail, you'll need to:
1. Enable 2-Step Verification
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as `SMTP_PASS`

### Other Email Providers

- **SendGrid**: Use `smtp.sendgrid.net` as host, port 587
- **Mailgun**: Use `smtp.mailgun.org` as host, port 587
- **Outlook**: Use `smtp-mail.outlook.com` as host, port 587
- **Custom SMTP**: Use your provider's SMTP settings

## Architecture

### Components

1. **Email Service** (`Server/src/services/emailService.ts`)
   - Handles SMTP connection
   - Sends emails using nodemailer
   - Provides email templates

2. **Notification Service** (`Server/src/services/notificationService.ts`)
   - Manages notification logic
   - Respects user preferences
   - Sends notifications for different event types

3. **Controllers**
   - Trigger notifications when events occur
   - Non-blocking (doesn't affect main flow)

### Notification Types

1. **New Job Application** (`notifyNewJobApplication`)
   - Triggered when: Job application is submitted
   - Recipients: Admins with email notifications enabled

2. **New Lead** (`notifyNewLead`)
   - Triggered when: Contact form is submitted
   - Recipients: Admins with email notifications enabled

3. **New Review** (`notifyNewReview`)
   - Triggered when: Review is submitted
   - Recipients: Admins with email notifications enabled

4. **System Alert** (`notifySystemAlert`)
   - Triggered when: System events occur
   - Recipients: Admins with email notifications enabled

## User Preferences

Users can manage their notification preferences in the Admin Panel → Settings → Notifications tab.

### Preference Structure

```typescript
{
  notifications: {
    email: boolean,  // Enable/disable email notifications
    sms: boolean,     // Future: SMS notifications
    push: boolean     // Future: Push notifications
  }
}
```

### API Endpoint

- **Update Preferences**: `PUT /api/users/me/preferences`
- **Body**: 
  ```json
  {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
  ```

## Email Templates

All email templates are HTML-based with:
- Responsive design
- Professional styling
- Action buttons linking to admin panel
- Brand colors and gradients

### Template Locations

Templates are defined in `Server/src/services/emailService.ts`:
- `emailTemplates.newJobApplication()`
- `emailTemplates.newLead()`
- `emailTemplates.newReview()`
- `emailTemplates.systemAlert()`

## Usage

### Sending Notifications

Notifications are automatically sent when events occur. No manual intervention needed.

### Manual Notification (for testing)

```typescript
import { notifyNewLead } from '@/services/notificationService';

await notifyNewLead({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  service: 'Web Development',
  message: 'Interested in your services'
});
```

### Checking Email Service Status

The email service initializes on server startup. Check server logs for:
- ✅ `Email service initialized successfully` - Service is ready
- ⚠️ `Email service not configured` - SMTP credentials missing

## Error Handling

- Notifications are non-blocking
- Errors are logged but don't affect main application flow
- Failed notifications don't prevent form submissions or data saves

## Future Enhancements

- [ ] Per-type notification preferences (enable/disable specific notification types)
- [ ] SMS notifications (Twilio integration)
- [ ] Push notifications (Web Push API)
- [ ] Notification history/logs
- [ ] Email queue system for reliability
- [ ] Notification digests (daily/weekly summaries)
- [ ] Custom notification templates per user

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials** in `.env` file
2. **Verify email service initialization** in server logs
3. **Test SMTP connection** using email service verification
4. **Check spam folder** - emails might be filtered
5. **Verify user preferences** - email notifications must be enabled

### Gmail Issues

- Use App Password, not regular password
- Enable "Less secure app access" (if App Password doesn't work)
- Check if account has 2FA enabled

### Common Errors

- `Email service is not configured` - Missing SMTP credentials
- `Failed to send email` - SMTP connection issue
- `Invalid credentials` - Wrong SMTP_USER or SMTP_PASS

## Testing

### Test Email Service

```typescript
import { verifyEmailConnection } from '@/services/emailService';

const isConnected = await verifyEmailConnection();
console.log('Email service connected:', isConnected);
```

### Test Notification

Submit a test form (job application, contact form, or review) and check:
1. Server logs for notification sent message
2. Admin email inbox for notification email
3. Email template rendering

## Security Considerations

- SMTP credentials stored in environment variables
- Email service errors don't expose sensitive information
- User preferences validated before saving
- Only active admin users receive notifications

