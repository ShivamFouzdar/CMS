# System Settings Guide

## Overview

System Settings allow administrators to configure global application settings that affect the entire system. These settings are accessible through the Admin Panel → Settings → System tab.

## Accessing System Settings

1. **Login** to the admin panel
2. Navigate to **Settings** (gear icon in sidebar)
3. Click on the **System** tab
4. You'll see all available system settings

## Available Settings

### 1. **Site Information**

#### Site Name
- **Purpose**: The name of your website/application
- **Default**: "CareerMap Solutions"
- **Usage**: Used in emails, notifications, and branding
- **Example**: "My Company Name"

#### Site Description
- **Purpose**: A brief description of your website
- **Default**: "Your trusted partner for business solutions"
- **Usage**: Used in SEO, meta tags, and public-facing pages
- **Example**: "We provide innovative business solutions"

### 2. **Contact Information**

#### Contact Email
- **Purpose**: Primary contact email for the website
- **Format**: Must be a valid email address
- **Usage**: Displayed on contact pages, used for inquiries
- **Example**: "contact@careermapsolutions.com"

#### Contact Phone
- **Purpose**: Primary contact phone number
- **Format**: Any phone number format
- **Usage**: Displayed on contact pages
- **Example**: "+1 (555) 123-4567"

### 3. **System Controls**

#### Maintenance Mode
- **Purpose**: Put the website in maintenance mode
- **Type**: Toggle (On/Off)
- **Usage**: 
  - When **ON**: Website shows maintenance message to visitors
  - When **OFF**: Website operates normally
- **Use Case**: During updates, migrations, or major changes

#### Allow Registrations
- **Purpose**: Control whether new users can register
- **Type**: Toggle (On/Off)
- **Usage**:
  - When **ON**: New users can create accounts
  - When **OFF**: Registration is disabled
- **Use Case**: Temporarily disable registrations during high traffic or security concerns

#### Email Notifications
- **Purpose**: Enable/disable system-wide email notifications
- **Type**: Toggle (On/Off)
- **Usage**:
  - When **ON**: System sends email notifications for events
  - When **OFF**: No email notifications are sent
- **Note**: This is a global setting; individual user preferences still apply

### 4. **File Upload Settings**

#### Max File Size
- **Purpose**: Maximum file size allowed for uploads
- **Unit**: Megabytes (MB)
- **Range**: 1-100 MB
- **Default**: 10 MB
- **Usage**: Controls resume uploads, document uploads, etc.
- **Example**: Set to 5 for smaller files, 50 for larger documents

#### Allowed File Types
- **Purpose**: File extensions that can be uploaded
- **Type**: Array of file extensions
- **Default**: `['pdf', 'doc', 'docx', 'jpg', 'png']`
- **Usage**: Security measure to prevent malicious file uploads
- **Common Types**:
  - Documents: `pdf`, `doc`, `docx`, `txt`
  - Images: `jpg`, `jpeg`, `png`, `gif`, `webp`
  - Spreadsheets: `xls`, `xlsx`, `csv`

## How to Use

### Step 1: Navigate to Settings
```
Admin Panel → Settings → System Tab
```

### Step 2: Edit Settings
1. **Click on any field** to edit
2. **Type your values** in text fields
3. **Toggle switches** for boolean settings (On/Off)
4. **Adjust sliders** for numeric values

### Step 3: Save Changes
1. Click the **"Save Settings"** button at the bottom
2. Wait for the success message: "System settings updated successfully!"
3. Changes are applied immediately

## Current Implementation Status

### ✅ Working Features
- **UI**: All settings fields are displayed and editable
- **Validation**: 
  - Site name is required
  - Email format is validated
  - File size range is validated (1-100 MB)
- **Save Function**: Settings can be saved via API

### ⚠️ Partial Implementation
- **Backend Storage**: Currently returns success but doesn't persist to database
- **Settings Retrieval**: Fetches from API but may return default values
- **Settings Application**: Settings are saved but may not be actively used throughout the app

### 🔄 To Make Fully Functional

The backend needs to:
1. **Store settings in database** (create a Settings model)
2. **Load settings on app startup**
3. **Apply settings throughout the application**:
   - Maintenance mode check in routes
   - Registration toggle in auth routes
   - File size/type validation in upload middleware
   - Site name/description in public pages

## Example Usage Scenarios

### Scenario 1: Enable Maintenance Mode
1. Go to Settings → System
2. Toggle **Maintenance Mode** to **ON**
3. Click **Save Settings**
4. Website now shows maintenance page to visitors

### Scenario 2: Update Contact Information
1. Go to Settings → System
2. Enter new **Contact Email**: "support@company.com"
3. Enter new **Contact Phone**: "+1 (555) 999-8888"
4. Click **Save Settings**
5. New contact info appears on contact pages

### Scenario 3: Restrict File Uploads
1. Go to Settings → System
2. Set **Max File Size** to **5 MB**
3. Update **Allowed File Types** to only `['pdf', 'jpg', 'png']`
4. Click **Save Settings**
5. Users can only upload PDFs and images up to 5MB

### Scenario 4: Disable New Registrations
1. Go to Settings → System
2. Toggle **Allow Registrations** to **OFF**
3. Click **Save Settings**
4. Registration form is now disabled

## API Endpoints

### Get System Settings
```
GET /api/admin/settings
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: {
    siteName: string,
    siteDescription: string,
    contactEmail: string,
    contactPhone: string,
    maintenanceMode: boolean,
    allowRegistrations: boolean,
    emailNotifications: boolean,
    maxFileSize: number,
    allowedFileTypes: string[]
  }
}
```

### Update System Settings
```
PUT /api/admin/settings
Headers: Authorization: Bearer <token>
Body: {
  siteName: string,
  siteDescription: string,
  contactEmail: string,
  contactPhone: string,
  maintenanceMode: boolean,
  allowRegistrations: boolean,
  emailNotifications: boolean,
  maxFileSize: number,
  allowedFileTypes: string[]
}
Response: {
  success: true,
  message: "System settings updated successfully"
}
```

## Permissions

- **Required Role**: Admin or Moderator
- **Authentication**: Must be logged in with valid token
- **Access**: Only accessible through admin panel

## Validation Rules

1. **Site Name**: Required, cannot be empty
2. **Contact Email**: If provided, must be valid email format
3. **Max File Size**: Must be between 1 and 100 MB
4. **Allowed File Types**: Array of strings (file extensions)

## Best Practices

1. **Test Changes**: Always test settings changes in a development environment first
2. **Backup**: Consider backing up settings before major changes
3. **Documentation**: Document any custom settings for your team
4. **Security**: Be careful with file upload settings to prevent security issues
5. **Maintenance Mode**: Inform users before enabling maintenance mode

## Troubleshooting

### Settings Not Saving
- Check if you have admin permissions
- Verify authentication token is valid
- Check browser console for errors
- Check server logs for API errors

### Settings Not Applying
- Settings may need to be implemented in the application code
- Check if settings are being read from database
- Verify settings are being used in relevant components

### Validation Errors
- Ensure all required fields are filled
- Check email format is correct
- Verify file size is within 1-100 MB range
- Ensure file types are valid extensions

## Future Enhancements

Potential improvements:
- [ ] Database persistence for settings
- [ ] Settings history/versioning
- [ ] Settings import/export
- [ ] Environment-specific settings
- [ ] Settings audit log
- [ ] Real-time settings application
- [ ] Settings templates/presets

