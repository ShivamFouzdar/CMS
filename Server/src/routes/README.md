# API Routes Documentation

This directory contains all the API routes for the CMS application, organized by functionality.

## Route Structure

### 📁 Route Files

- **`api.ts`** - Main API router that mounts all sub-routes
- **`health.ts`** - Health check and system monitoring routes
- **`contact.ts`** - Contact form and submission management routes
- **`reviews.ts`** - Customer reviews and testimonials routes
- **`services.ts`** - Business services management routes
- **`users.ts`** - User authentication and management routes
- **`admin.ts`** - Admin dashboard and system management routes
- **`auth.ts`** - Authentication and token management routes
- **`index.ts`** - Central export and documentation

## 🔐 Authentication & Authorization

### Middleware
- **`authenticateToken`** - Validates JWT tokens
- **`requireRole`** - Requires specific user roles
- **`requirePermission`** - Requires specific permissions
- **`optionalAuth`** - Optional authentication
- **`rateLimit`** - Rate limiting protection

### User Roles
- **`admin`** - Full system access
- **`moderator`** - Content management access
- **`viewer`** - Read-only access

## 📋 API Endpoints

### Health Routes (`/health`)
```
GET /health - Basic health check
GET /health/detailed - Detailed system health
GET /health/database - Database health check
GET /health/endpoints - Endpoint health check
GET /health/metrics - System metrics
```

### Contact Routes (`/api/contact`)

#### Public Routes
```
POST / - Submit contact form
```

#### Protected Routes (Admin/Moderator)
```
GET /submissions - Get all contact submissions
GET /submissions/:id - Get contact submission by ID
PATCH /submissions/:id/status - Update contact status
PATCH /submissions/:id/contacted - Mark as contacted
DELETE /submissions/:id - Delete contact submission
GET /stats - Get contact statistics
GET /by-service/:service - Get contacts by service
```

### Review Routes (`/api/reviews`)

#### Public Routes
```
GET / - Get all published reviews
GET /stats - Get review statistics
GET /featured - Get featured reviews
GET /recent - Get recent reviews
GET /category/:category - Get reviews by category
GET /:id - Get review by ID
POST / - Submit new review
POST /:id/vote - Vote on review helpfulness
```

#### Protected Routes (Admin/Moderator)
```
PATCH /:id/status - Update review status
PATCH /:id/response - Add admin response
DELETE /:id - Delete review
```

### Service Routes (`/api/services`)

#### Public Routes
```
GET / - Get all active services
GET /categories - Get service categories
GET /featured - Get featured services
GET /category/:category - Get services by category
GET /slug/:slug - Get service by slug
GET /id/:id - Get service by ID
```

#### Protected Routes (Admin Only)
```
POST / - Create new service
PUT /:id - Update service
DELETE /:id - Delete service
PATCH /:id/activate - Activate service
PATCH /:id/deactivate - Deactivate service
PATCH /:id/feature - Feature service
PATCH /:id/unfeature - Unfeature service
GET /stats - Get service statistics
```

### User Routes (`/api/users`)

#### Public Routes
```
POST /register - Register new user
POST /login - Login user
POST /logout - Logout user
POST /forgot-password - Request password reset
POST /reset-password - Reset password
POST /verify-email - Verify email address
```

#### Protected Routes
```
GET /me - Get current user profile
PUT /me/profile - Update user profile
PUT /me/preferences - Update user preferences
PUT /me/password - Change password
```

#### Admin Only Routes
```
GET / - Get all users
GET /stats - Get user statistics
GET /:id - Get user by ID
PUT /:id - Update user
DELETE /:id - Delete user
PATCH /:id/activate - Activate user
PATCH /:id/deactivate - Deactivate user
```

### Admin Routes (`/api/admin`)

#### Dashboard & Analytics
```
GET /dashboard - Get dashboard statistics
GET /analytics - Get analytics data
GET /activity - Get recent activity
```

#### System Management
```
GET /health - Get system health
GET /metrics - Get server metrics
GET /logs - Get system logs
GET /settings - Get system settings
PUT /settings - Update system settings
```

#### Database Management
```
GET /database/stats - Get database statistics
POST /database/backup - Backup database
POST /database/restore - Restore database
```

#### Data Export
```
GET /export/contacts - Export contacts data
GET /export/reviews - Export reviews data
GET /export/services - Export services data
GET /export/users - Export users data
```

### Auth Routes (`/api/auth`)

#### Public Routes
```
POST /refresh - Refresh access token
POST /validate - Validate token
```

#### Protected Routes
```
POST /revoke - Revoke token
GET /info - Get token information
```

## 🔧 Usage Examples

### Authentication
```typescript
// Login
const response = await fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Use token in subsequent requests
const protectedResponse = await fetch('/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Contact Form Submission
```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Interested in your services',
    service: 'IT Services'
  })
});
```

### Review Submission
```typescript
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    content: 'Great service!',
    rating: 5,
    category: 'IT Services'
  })
});
```

### Service Management (Admin)
```typescript
// Create service
const response = await fetch('/api/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Web Development',
    slug: 'web-development',
    description: 'Full-stack web development services',
    category: 'IT Services',
    features: ['React', 'Node.js', 'MongoDB'],
    benefits: ['Fast delivery', 'Modern tech stack']
  })
});
```

## 🛡️ Security Features

### Rate Limiting
- Default: 100 requests per 15 minutes
- Configurable per endpoint
- IP-based tracking

### Input Validation
- Request body validation
- Parameter sanitization
- SQL injection prevention

### Authentication
- JWT token-based authentication
- Token expiration handling
- Refresh token support

### Authorization
- Role-based access control
- Permission-based restrictions
- Resource-level permissions

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Error Codes

### Authentication Errors
- `MISSING_TOKEN` - No authorization token provided
- `INVALID_TOKEN` - Invalid or malformed token
- `TOKEN_EXPIRED` - Token has expired
- `INVALID_USER` - User not found or inactive

### Authorization Errors
- `AUTH_REQUIRED` - Authentication required
- `INSUFFICIENT_PERMISSIONS` - Insufficient permissions

### Validation Errors
- `VALIDATION_ERROR` - Request validation failed
- `DUPLICATE_ENTRY` - Resource already exists
- `NOT_FOUND` - Resource not found

### System Errors
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `DATABASE_ERROR` - Database operation failed
- `INTERNAL_ERROR` - Internal server error

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```

4. **Test API**
   ```bash
   curl http://localhost:5000/api
   ```

## 📝 Notes

- All routes are prefixed with `/api` except health routes (`/health`)
- Authentication is required for most management operations
- Rate limiting is applied to prevent abuse
- All responses include timestamps for debugging
- Error responses include helpful error codes and messages
