# Admin Login System

## Overview
Complete admin authentication system has been implemented for the CareerMap Solutions CMS.

## Features

### 1. User Model
- **Location**: `Server/src/models/User.ts`
- **Features**:
  - Password hashing with bcrypt (12 salt rounds)
  - Account lock after 5 failed attempts (2 hours)
  - Login tracking and last login timestamps
  - Role-based access control (admin, moderator, viewer)
  - Permission management system
  - Email verification
  - User profiles and preferences

### 2. Authentication Endpoints

**POST `/api/auth/register`** - Register new admin user
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "password": "SecurePass123!",
  "role": "admin" // optional: admin, moderator, viewer
}
```

**POST `/api/auth/login`** - Login admin user
```json
{
  "email": "admin@careermapsolutions.com",
  "password": "Admin@123"
}
```

**POST `/api/auth/logout`** - Logout

**GET `/api/auth/me`** - Get current user (requires authentication)

**POST `/api/auth/refresh`** - Refresh access token

### 3. Default Admin Credentials

When you start the server, a default admin user is automatically created:

- **Email**: `admin@careermapsolutions.com`
- **Password**: `Admin@123`
- **Role**: admin
- **Permissions**: 
  - manage.users
  - manage.job-applications
  - manage.content
  - view.analytics
  - manage.settings

⚠️ **IMPORTANT**: Change the password after first login!

### 4. Test Users (Development Only)

**Moderator User:**
- Email: `moderator@careermapsolutions.com`
- Password: `Moderator@123`
- Role: moderator

**Viewer User:**
- Email: `viewer@careermapsolutions.com`
- Password: `Viewer@123`
- Role: viewer

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
2. **Account Locking**: Accounts are locked after 5 failed login attempts for 2 hours
3. **JWT Tokens**: Secure token-based authentication
4. **Role-Based Access**: Different user roles with different permissions
5. **Password Requirements**: Minimum 8 characters

## Usage

### 1. Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "role": "admin"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@careermapsolutions.com",
    "password": "Admin@123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@careermapsolutions.com",
      "role": "admin",
      "permissions": [...]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Access Protected Routes
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

Add to `.env` file:
```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/cms
```

## Files Created/Modified

1. **Server/src/models/User.ts** - Already exists with full user model
2. **Server/src/controllers/authController.ts** - Updated with login/register logic
3. **Server/src/routes/auth.ts** - Updated with new routes
4. **Server/src/utils/seedAdmin.ts** - New file for seeding admin users
5. **Server/src/config/database.ts** - Updated to seed admin users on startup

## Next Steps

1. Start your server: `npm run dev`
2. Default admin will be created automatically
3. Login with the credentials above
4. Access the admin panel at `http://localhost:8001/admin/job-applicants`

## Notes

- Change the default admin password in production!
- JWT_SECRET should be a strong random string in production
- Database connection is optional - server works without it for testing
- Authentication is currently disabled on job application routes for testing

