# Email Notification Troubleshooting Guide

## Problem: Not Receiving Email Notifications

If you're not receiving email notifications for new leads, job applications, or reviews, follow these steps:

## Step 1: Check Server Logs

When a new lead/job application/review is submitted, check your server console for these messages:

### ✅ Success Messages
- `📧 Attempting to send lead notification...`
- `📧 Found X notification recipient(s) for new-leads`
- `📤 Sending email...`
- `✅ Email sent successfully!`

### ⚠️ Warning Messages
- `⚠️ No recipients found for lead notification`
- `⚠️ Email service not configured`
- `⚠️ Email service connection verification failed`

### ❌ Error Messages
- `❌ Failed to send email`
- `❌ Email service is not configured`

## Step 2: Verify SMTP Configuration

Check your `Server/.env` file has these variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@careermapsolutions.com
```

### Common SMTP Settings

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- User: Your Gmail address
- Pass: App Password (not your regular password)
  - Enable 2-Step Verification
  - Generate App Password: https://myaccount.google.com/apppasswords

**Outlook/Hotmail:**
- Host: `smtp-mail.outlook.com`
- Port: `587`
- User: Your Outlook email
- Pass: Your Outlook password

**SendGrid:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Pass: Your SendGrid API key

## Step 3: Check Admin User Configuration

The notification system sends emails to admin users. Verify:

1. **Admin users exist in database:**
   ```javascript
   // Check in MongoDB or via admin panel
   // Users should have role: 'admin' or 'moderator'
   ```

2. **Admin users have email addresses:**
   - Each admin user must have an `email` field set

3. **Email notifications enabled:**
   - By default, notifications are enabled for all admins
   - If a user has `preferences.notifications.email = false`, they won't receive emails
   - Check in Admin Panel → Settings → Notifications

## Step 4: Test Email Service

### Option 1: Check Server Startup Logs

When the server starts, you should see:
```
✅ Email service initialized successfully
   SMTP Host: smtp.gmail.com:587
   SMTP User: your-email@gmail.com
✅ Email service connection verified
```

If you see warnings, the email service is not configured correctly.

### Option 2: Test with a Test Endpoint

Create a test endpoint to verify email sending:

```typescript
// Add to Server/src/routes/api.ts
router.post('/test-email', authenticateToken, async (req, res) => {
  try {
    const { sendEmail } = await import('@/services/emailService');
    await sendEmail({
      to: req.user.email, // Your email
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>If you receive this, email service is working!</p>'
    });
    res.json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Step 5: Common Issues and Solutions

### Issue 1: "No recipients found"

**Cause:** No admin users found or no email addresses set

**Solution:**
1. Ensure you have admin users in the database
2. Check that admin users have email addresses
3. Verify user preferences allow email notifications

### Issue 2: "Email service is not configured"

**Cause:** Missing SMTP credentials in `.env`

**Solution:**
1. Add all required SMTP variables to `Server/.env`
2. Restart the server after adding credentials
3. Check server logs for initialization messages

### Issue 3: "Failed to send email"

**Cause:** SMTP authentication or connection error

**Solution:**
1. Verify SMTP credentials are correct
2. For Gmail: Use App Password, not regular password
3. Check firewall/network allows SMTP connections
4. Verify SMTP port is correct (587 for TLS, 465 for SSL)

### Issue 4: Emails going to spam

**Cause:** Email provider marking as spam

**Solution:**
1. Check spam/junk folder
2. Add sender email to contacts
3. Use a professional email service (SendGrid, Mailgun)
4. Set up SPF/DKIM records for custom domain

### Issue 5: "Connection timeout"

**Cause:** Network/firewall blocking SMTP

**Solution:**
1. Check firewall allows outbound SMTP (port 587/465)
2. Try different SMTP port
3. Use a different SMTP provider
4. Check if your ISP blocks SMTP

## Step 6: Enable Debug Logging

The notification system now includes detailed logging. Check your server console for:

- `📧 Attempting to send [type] notification...`
- `📧 Found X notification recipient(s)`
- `📤 Sending email...`
- `✅ Email sent successfully!`

If you see warnings or errors, the logs will indicate what's wrong.

## Step 7: Verify Database Users

Run this query in MongoDB or check via admin panel:

```javascript
// Find all admin users
db.users.find({ 
  role: { $in: ['admin', 'moderator'] },
  isActive: true 
}, { email: 1, preferences: 1 })
```

Ensure:
- Users have `email` field
- Users are `isActive: true`
- Users have `role: 'admin'` or `role: 'moderator'`

## Quick Checklist

- [ ] SMTP credentials set in `Server/.env`
- [ ] Server restarted after adding credentials
- [ ] Email service initialized (check server logs)
- [ ] Admin users exist in database
- [ ] Admin users have email addresses
- [ ] Email notifications enabled in user preferences (or not explicitly disabled)
- [ ] Check spam folder
- [ ] Check server console for error messages

## Still Not Working?

1. **Check server logs** - Look for error messages when submitting a form
2. **Test SMTP connection** - Use a test email endpoint
3. **Verify credentials** - Double-check SMTP settings
4. **Try different provider** - Test with Gmail, SendGrid, etc.
5. **Check network** - Ensure SMTP ports aren't blocked

## Support

If issues persist:
1. Share server console logs
2. Share `.env` configuration (hide passwords)
3. Share error messages from console
4. Check MongoDB for admin users

