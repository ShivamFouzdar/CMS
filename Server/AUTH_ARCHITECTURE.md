# Authentication Architecture

## Overview
The authentication system follows proper separation of concerns with a clean service-controller pattern.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Request                      │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Routes (auth.ts)                         │
│                    HTTP Endpoints                           │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Controllers (authController.ts)               │
│  • Handle HTTP request/response                            │
│  • Validate HTTP-specific concerns                         │
│  • Return JSON responses                                   │
│  • Call service layer for business logic                   │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Services (authService.ts)                   │
│  • Business logic                                           │
│  • Data validation                                          │
│  • Security operations (hashing, token generation)         │
│  • Database operations                                      │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Models (User.ts)                         │
│  • MongoDB schema definitions                               │
│  • Instance methods                                         │
│  • Static methods                                           │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

### 1. `Server/src/services/authService.ts`
**Purpose**: Business logic layer

**Responsibilities**:
- User registration logic
- User login logic
- Password validation
- Account locking/security
- JWT token generation
- User data retrieval
- Token validation

**Exports**:
- `registerUser(data)` - Register new user
- `loginUser(credentials)` - Login user
- `getCurrentUser(userId)` - Get user info
- `validateToken(token)` - Validate JWT
- `logoutUser()` - Logout
- `generateToken(user)` - Generate JWT

### 2. `Server/src/controllers/authController.ts`
**Purpose**: HTTP request/response handling

**Responsibilities**:
- Handle HTTP requests
- Extract request data
- Call service layer
- Return JSON responses
- Handle HTTP status codes
- Error handling

**Exports**:
- `register()` - POST /api/auth/register
- `login()` - POST /api/auth/login
- `logout()` - POST /api/auth/logout
- `getCurrentUser()` - GET /api/auth/me
- `refreshToken()` - POST /api/auth/refresh
- `validateToken()` - POST /api/auth/validate
- `revokeToken()` - POST /api/auth/revoke
- `getTokenInfo()` - GET /api/auth/token-info

### 3. `Server/src/routes/auth.ts`
**Purpose**: Define API endpoints

**Routes**:
- `POST /api/auth/register` - Public
- `POST /api/auth/login` - Public
- `POST /api/auth/logout` - Public
- `POST /api/auth/refresh` - Public
- `POST /api/auth/validate` - Public
- `GET /api/auth/me` - Protected (requires auth)
- `POST /api/auth/revoke` - Protected
- `GET /api/auth/token-info` - Protected

## Separation of Concerns

### Controller Layer (authController.ts)
```typescript
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  // Extract data from request
  const result = await authService.loginUser({ email, password });
  
  // Return HTTP response
  res.status(200).json({ success: true, data: result });
});
```

**What it does**:
- ✅ Extracts data from `req.body`
- ✅ Calls service layer
- ✅ Returns HTTP response
- ❌ NO business logic
- ❌ NO database operations
- ❌ NO validation logic

### Service Layer (authService.ts)
```typescript
export const loginUser = async (credentials: LoginCredentials) => {
  // Validation
  if (!credentials.email || !credentials.password) {
    throw createError('Email and password are required', 400);
  }
  
  // Database operations
  const user = await User.findByEmail(credentials.email);
  
  // Business logic
  const isPasswordValid = await user.comparePassword(credentials.password);
  
  // Return result
  return { user, token };
};
```

**What it does**:
- ✅ Business logic
- ✅ Data validation
- ✅ Database operations
- ✅ Security operations
- ❌ NO HTTP handling
- ❌ NO Express-specific code

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Controllers handle HTTP
- Services handle business logic
- Models handle data

### 2. **Testability**
```typescript
// Test service layer independently
const result = await authService.loginUser({ 
  email: 'test@example.com', 
  password: 'password123' 
});
```

### 3. **Reusability**
```typescript
// Service can be used by different controllers
const { loginUser } = require('@/services/authService');

// In REST API controller
await loginUser(credentials);

// In GraphQL resolver
await loginUser(credentials);
```

### 4. **Maintainability**
- Easy to find where logic lives
- Easy to modify without affecting other layers
- Clear responsibilities

## API Flow Example: Login

### 1. Client Request
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Route Handler
```typescript
// routes/auth.ts
router.post('/login', login);
```

### 3. Controller
```typescript
// controllers/authController.ts
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.status(200).json({ success: true, data: result });
});
```

### 4. Service
```typescript
// services/authService.ts
export const loginUser = async ({ email, password }) => {
  // Validate input
  // Find user in database
  // Verify password
  // Generate token
  return { user, token };
};
```

### 5. Model
```typescript
// models/User.ts
const user = await User.findByEmail(email);
const isValid = await user.comparePassword(password);
```

## Best Practices

### ✅ DO
- Put business logic in services
- Put HTTP handling in controllers
- Reuse service functions
- Test service layer independently

### ❌ DON'T
- Put business logic in controllers
- Put HTTP code in services
- Access database directly in controllers
- Duplicate logic across files

## File Locations

```
Server/src/
├── services/
│   └── authService.ts          # Business logic
├── controllers/
│   └── authController.ts        # HTTP handling
├── routes/
│   └── auth.ts                  # Endpoint definitions
├── models/
│   └── User.ts                  # Data models
└── middleware/
    └── auth.ts                  # Authentication middleware
```

