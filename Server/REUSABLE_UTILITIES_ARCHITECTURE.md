# Reusable Utilities Architecture

## Overview
Enhanced admin authentication system with JWT, UUID, and reusable utilities for maximum reusability and loose coupling.

## Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer (Reusable)                  │
│  • jwt.utils.ts      - JWT operations                      │
│  • uuid.utils.ts     - UUID generation                     │
│  • auth.utils.ts     - Password & security                 │
│  • helpers.ts        - Common utilities                    │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  • authService.ts    - Business logic using utilities       │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│  • authController.ts - HTTP handling                        │
└────────────────────────┬───────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware Layer                         │
│  • auth.ts           - Token validation using utilities    │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

### Utility Files (Reusable & Loosely Coupled)

#### 1. `Server/src/utils/jwt.utils.ts`
**Purpose**: JWT token operations

**Exports**:
```typescript
- generateAccessToken(payload) - Generate access token
- generateRefreshToken(payload) - Generate refresh token
- generateTokenPair(payload) - Generate both tokens
- verifyToken(token) - Verify JWT token
- decodeToken(token) - Decode without verification
- extractTokenFromHeader(header) - Extract from Authorization header
- getTokenExpiration() - Get expiration date
```

**Features**:
- ✅ Configurable via environment variables
- ✅ Supports access & refresh tokens
- ✅ Custom expiration parsing
- ✅ Type-safe payload

#### 2. `Server/src/utils/uuid.utils.ts`
**Purpose**: UUID generation

**Exports**:
```typescript
- generateUUID() - UUID v4
- generateTimeBasedUUID() - UUID v1
- isValidUUID(uuid) - Validate UUID
- generateShortId() - Short ID
- generateNanoId(length) - Nano ID
- generateSessionId() - Session ID
- generateApiKey(prefix) - API key
- generateTokenId() - Token ID
- generateFriendlyId() - Friendly ID
```

**Features**:
- ✅ Multiple ID formats
- ✅ Session & API key generation
- ✅ UUID validation

#### 3. `Server/src/utils/auth.utils.ts`
**Purpose**: Authentication utilities

**Exports**:
```typescript
- hashPassword(password) - Hash password
- comparePassword(password, hash) - Compare password
- generateSecureRandom(length) - Secure random string
- generateSessionToken() - Session token
- validatePasswordStrength(password) - Validate strength
- calculatePasswordStrength(password) - Calculate score
- maskEmail(email) - Mask email
- isTokenExpired(expirationTime) - Check expiration
- generateRandomBytes(length) - Random bytes
```

**Features**:
- ✅ Password hashing & validation
- ✅ Secure random generation
- ✅ Password strength checking
- ✅ Email masking

#### 4. `Server/src/utils/helpers.ts`
**Purpose**: Common helper functions

**Exports**:
```typescript
- asyncHandler(fn) - Async handler wrapper
- createError(message, code) - Create error
- validateEmail(email) - Validate email
- validatePhone(phone) - Validate phone
- sanitizeInput(input) - Sanitize input
- generateId() - Generate ID
- formatDate(date) - Format date
- formatDateTime(date) - Format datetime
```

**Features**:
- ✅ Common utilities for all modules
- ✅ Input validation & sanitization

### Middleware (Uses Utilities)

#### `Server/src/middleware/auth.ts`
**Purpose**: Authentication middleware

**Functions**:
```typescript
- authenticateToken(req, res, next) - Validate JWT
- requireRole(roles) - Require specific role
- requirePermission(permissions) - Require permission
- optionalAuth(req, res, next) - Optional auth
- rateLimit(maxRequests, windowMs) - Rate limiting
```

**Features**:
- ✅ Uses `verifyToken` from `jwt.utils.ts`
- ✅ Uses `extractTokenFromHeader` from `jwt.utils.ts`
- ✅ Role-based access control
- ✅ Permission-based access control

### Service (Uses Utilities)

#### `Server/src/services/authService.ts`
**Purpose**: Authentication business logic

**Functions**:
```typescript
- registerUser(data) - Register user
- loginUser(credentials) - Login user
- getCurrentUser(userId) - Get user
- validateAuthToken(token) - Validate token
- refreshAccessToken(token) - Refresh token
- logoutUser() - Logout
- changePassword(userId, old, new) - Change password
- requestPasswordReset(email) - Request reset
- verifyUserToken(token) - Verify token
```

**Features**:
- ✅ Uses `generateTokenPair` from `jwt.utils.ts`
- ✅ Uses `generateSessionId` from `uuid.utils.ts`
- ✅ Uses `hashPassword`, `comparePassword`, `validatePasswordStrength` from `auth.utils.ts`
- ✅ Complete business logic with reusability

### Controller (Uses Service)

#### `Server/src/controllers/authController.ts`
**Purpose**: HTTP request/response handling

**Endpoints**:
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/refresh
POST /api/auth/validate
POST /api/auth/revoke
GET  /api/auth/token-info
```

## Benefits

### ✅ **Reusability**
- Utilities can be used across multiple services
- No code duplication
- Easy to maintain

### ✅ **Loose Coupling**
- Each utility is independent
- Services don't depend on implementations
- Easy to swap implementations

### ✅ **Testability**
- Test utilities independently
- Mock utilities in service tests
- Easy to write unit tests

### ✅ **Scalability**
- Add new utilities easily
- Extend functionality without breaking
- Supports future features

### ✅ **Security**
- Centralized security utilities
- Consistent security practices
- Easy to audit

## Usage Examples

### Using JWT Utils
```typescript
import { generateTokenPair, verifyToken } from '@/utils/jwt.utils';

// Generate tokens
const tokens = generateTokenPair({
  userId: '123',
  email: 'user@example.com',
  role: 'admin',
  sessionId: 'sess_abc123'
});

// Verify token
const decoded = verifyToken(token);
```

### Using UUID Utils
```typescript
import { generateUUID, generateSessionId } from '@/utils/uuid.utils';

// Generate UUID
const id = generateUUID();

// Generate session ID
const sessionId = generateSessionId();
```

### Using Auth Utils
```typescript
import { hashPassword, comparePassword, validatePasswordStrength } from '@/utils/auth.utils';

// Hash password
const hashed = await hashPassword('Secure123!');

// Compare password
const isValid = await comparePassword('Secure123!', hashed);

// Validate strength
const validation = validatePasswordStrength('Secure123!');
```

## Environment Variables

```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
```

## Token Structure

### Access Token Payload
```typescript
{
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}
```

### Response Format
```typescript
{
  success: true,
  data: {
    user: { ... },
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    }
  },
  message: string,
  timestamp: string
}
```

## Best Practices

### ✅ DO
- Use utilities from the utils folder
- Keep services focused on business logic
- Keep controllers focused on HTTP
- Use TypeScript types for safety

### ❌ DON'T
- Duplicate utility functions
- Put business logic in controllers
- Hard-code values (use env vars)
- Skip input validation

## Integration

All utilities are already integrated:

1. ✅ `authService.ts` uses JWT, UUID, and auth utilities
2. ✅ `authMiddleware.ts` uses JWT utilities
3. ✅ Controllers use services
4. ✅ No duplication
5. ✅ Loose coupling maintained

## Next Steps

1. Start using the enhanced authentication system
2. Register admin users with strong passwords
3. Login and receive JWT tokens
4. Access protected routes with tokens
5. Refresh tokens when expired

## Summary

✅ **Reusable utilities** - JWT, UUID, auth utils  
✅ **Loose coupling** - Independent modules  
✅ **No duplication** - Single source of truth  
✅ **Type-safe** - Full TypeScript support  
✅ **Environment configurable** - Uses .env  
✅ **Production-ready** - Security best practices  

**All utilities created and integrated successfully!** 🎉

