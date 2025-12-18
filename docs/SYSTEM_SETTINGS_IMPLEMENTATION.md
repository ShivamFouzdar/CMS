# System Settings - Full Implementation

## ✅ Implementation Complete

System Settings are now **fully functional** with database persistence and application-wide integration.

## What Was Implemented

### 1. **Database Model** (`Server/src/models/Settings.ts`)
- Created Settings model with all system configuration fields
- Ensures only one settings document exists (singleton pattern)
- Includes validation for all fields
- Default values for all settings

### 2. **Settings Service** (`Server/src/services/settingsService.ts`)
- `getSystemSettings()` - Retrieves current settings
- `updateSystemSettings()` - Updates settings with validation
- `isMaintenanceMode()` - Checks if maintenance mode is enabled
- `areRegistrationsAllowed()` - Checks if registrations are allowed
- `getFileUploadLimits()` - Gets file upload configuration

### 3. **Backend API** (`Server/src/controllers/adminController.ts`)
- `GET /api/admin/settings` - Fetches settings from database
- `PUT /api/admin/settings` - Saves settings to database
- Full validation and error handling

### 4. **Maintenance Mode Middleware** (`Server/src/middleware/maintenanceMode.ts`)
- Blocks all requests when maintenance mode is enabled
- Allows admin routes and health checks to continue
- Returns 503 status with maintenance message

### 5. **Registration Control** (`Server/src/controllers/authController.ts`)
- Checks `allowRegistrations` setting before allowing new user registration
- Returns 403 error if registrations are disabled

### 6. **Database Initialization** (`Server/src/config/database.ts`)
- Automatically creates default settings on first run
- Settings are initialized during database seeding

### 7. **Server Integration** (`Server/src/index.ts`)
- Maintenance mode middleware applied globally
- Settings loaded on server startup

## How It Works

### Settings Persistence
1. Settings are stored in MongoDB in a `settings` collection
2. Only one settings document exists (singleton)
3. Settings are loaded from database on every request
4. Changes are saved immediately to database

### Maintenance Mode
1. When enabled, middleware checks every request
2. Blocks all routes except:
   - `/api/admin/*` (admin routes)
   - `/admin/*` (admin panel)
   - `/health` (health checks)
   - `/api/auth/login` (admin login)
3. Returns 503 status with maintenance message

### Registration Control
1. Before processing registration, checks `allowRegistrations` setting
2. If disabled, returns 403 error
3. If enabled, proceeds with normal registration

## Usage

### Accessing Settings
```typescript
import { getSystemSettings } from '@/services/settingsService';

const settings = await getSystemSettings();
console.log(settings.maintenanceMode); // true/false
```

### Updating Settings
```typescript
import { updateSystemSettings } from '@/services/settingsService';

await updateSystemSettings({
  maintenanceMode: true,
  siteName: 'My New Site Name'
});
```

### Checking Maintenance Mode
```typescript
import { isMaintenanceMode } from '@/services/settingsService';

const isMaintenance = await isMaintenanceMode();
if (isMaintenance) {
  // Show maintenance page
}
```

## Settings Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `siteName` | string | "CareerMap Solutions" | Website name |
| `siteDescription` | string | "Your trusted partner..." | Site description |
| `contactEmail` | string | "" | Contact email address |
| `contactPhone` | string | "" | Contact phone number |
| `maintenanceMode` | boolean | false | Enable maintenance mode |
| `allowRegistrations` | boolean | true | Allow new user registrations |
| `emailNotifications` | boolean | true | Enable email notifications |
| `maxFileSize` | number | 10 | Max file size in MB (1-100) |
| `allowedFileTypes` | string[] | ['pdf', 'doc', 'docx', 'jpg', 'png'] | Allowed file extensions |

## API Endpoints

### Get Settings
```
GET /api/admin/settings
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "siteName": "CareerMap Solutions",
    "siteDescription": "...",
    "contactEmail": "contact@example.com",
    "contactPhone": "+1234567890",
    "maintenanceMode": false,
    "allowRegistrations": true,
    "emailNotifications": true,
    "maxFileSize": 10,
    "allowedFileTypes": ["pdf", "doc", "docx", "jpg", "png"]
  }
}
```

### Update Settings
```
PUT /api/admin/settings
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "siteName": "New Site Name",
  "maintenanceMode": true,
  "maxFileSize": 20
}

Response:
{
  "success": true,
  "data": { ...updated settings... },
  "message": "System settings updated successfully"
}
```

## Frontend Integration

The Settings UI (`Client/src/pages/admin/Settings.tsx`) is already connected:
- ✅ Fetches settings on page load
- ✅ Displays current settings
- ✅ Saves changes to backend
- ✅ Shows success/error messages
- ✅ Validates inputs

## Testing

### Test Maintenance Mode
1. Go to Settings → System
2. Enable "Maintenance Mode"
3. Save settings
4. Try accessing public routes (should return 503)
5. Login as admin (should still work)

### Test Registration Control
1. Go to Settings → System
2. Disable "Allow Registrations"
3. Save settings
4. Try to register new user (should return 403)
5. Re-enable to allow registrations

### Test Settings Persistence
1. Update any setting
2. Save
3. Refresh page
4. Settings should persist

## Future Enhancements

Potential improvements:
- [ ] Settings caching for performance
- [ ] Settings history/audit log
- [ ] Settings import/export
- [ ] Environment-specific settings
- [ ] Settings validation rules UI
- [ ] Real-time settings updates (WebSocket)
- [ ] Settings templates/presets

## Notes

- Settings are loaded from database on every request (no caching yet)
- Maintenance mode allows admin access for easy toggling
- File upload limits are stored but not yet enforced in upload middleware
- Settings are initialized automatically on first database seed

