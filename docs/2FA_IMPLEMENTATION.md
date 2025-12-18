# Two-Factor Authentication (2FA) Implementation Guide

## How 2FA Works

### Overview
Two-Factor Authentication adds an extra layer of security by requiring users to provide:
1. **Something they know** (password)
2. **Something they have** (authenticator app on their phone)

### Technology: TOTP (Time-based One-Time Password)
We'll use **TOTP** which is the industry standard (used by Google Authenticator, Authy, Microsoft Authenticator, etc.)

---

## Flow When Enabling 2FA

### Step 1: User Toggles 2FA ON
1. User goes to Settings → Security tab
2. User toggles "Two-Factor Authentication" switch to ON
3. System generates a **secret key** (unique to the user)
4. System generates a **QR code** containing:
   - Secret key
   - Account name (e.g., "CareerMap Solutions - admin@example.com")
   - Issuer name ("CareerMap Solutions")

### Step 2: User Scans QR Code
1. User opens authenticator app (Google Authenticator, Authy, etc.)
2. User scans the QR code displayed on screen
3. Authenticator app saves the secret and starts generating 6-digit codes

### Step 3: User Verifies Setup
1. System asks user to enter a 6-digit code from their authenticator app
2. User enters the code
3. System verifies the code is correct
4. If correct:
   - 2FA is enabled for the account
   - Secret key is stored (encrypted) in database
   - User can now use 2FA for login

### Step 4: Backup Codes (Optional but Recommended)
1. System generates 10 backup codes
2. User can use these codes if they lose access to their authenticator app
3. Codes are shown once and should be saved securely
4. Each backup code can only be used once

---

## Login Flow When 2FA is Enabled

### Step 1: Normal Login
1. User enters email and password
2. System verifies credentials
3. If correct, system checks if 2FA is enabled

### Step 2: 2FA Challenge
1. If 2FA is enabled:
   - System returns a **temporary token** (not full access token)
   - User is redirected to 2FA verification page
   - User must enter 6-digit code from authenticator app

### Step 3: Verify 2FA Code
1. User enters 6-digit code
2. System verifies code using:
   - User's secret key (from database)
   - Current time
   - TOTP algorithm
3. Code is valid for 30 seconds (standard TOTP window)

### Step 4: Complete Login
1. If code is correct:
   - System generates full access tokens (JWT)
   - User is logged in
   - User can access the admin panel
2. If code is incorrect:
   - User can retry (with rate limiting)
   - After too many failures, account may be locked

---

## Security Features

### 1. Secret Key Storage
- Secret keys are **encrypted** in the database
- Never sent to client in plain text
- Only used server-side for verification

### 2. Time Window
- TOTP codes are valid for 30 seconds
- System accepts codes from current and previous time window (for clock drift)
- Expired codes are rejected

### 3. Rate Limiting
- Maximum 5 attempts per 15 minutes
- Prevents brute force attacks
- Account locked after too many failures

### 4. Backup Codes
- 10 one-time use codes
- Can be regenerated (invalidates old ones)
- Should be stored securely by user

### 5. Disabling 2FA
- Requires password confirmation
- All backup codes are invalidated
- User must re-enable to use 2FA again

---

## Database Schema Changes Needed

```typescript
// Add to User model
twoFactor: {
  enabled: boolean;
  secret: string; // Encrypted secret key
  backupCodes: string[]; // Hashed backup codes
  verifiedAt?: Date; // When 2FA was verified
  lastUsed?: Date; // Last successful 2FA verification
}
```

---

## API Endpoints Needed

### 1. Enable 2FA
```
POST /api/users/me/2fa/enable
Response: {
  secret: string, // For QR code generation
  qrCode: string, // Base64 QR code image
  backupCodes: string[] // One-time backup codes
}
```

### 2. Verify 2FA Setup
```
POST /api/users/me/2fa/verify
Body: { code: string }
Response: { success: boolean }
```

### 3. Disable 2FA
```
POST /api/users/me/2fa/disable
Body: { password: string } // Confirm password
Response: { success: boolean }
```

### 4. Login with 2FA
```
POST /api/auth/login
Body: { email, password }
Response: {
  requires2FA: true,
  tempToken: string // Temporary token for 2FA verification
}

POST /api/auth/verify-2fa
Body: { tempToken, code }
Response: {
  user: {...},
  tokens: { accessToken, refreshToken }
}
```

### 5. Regenerate Backup Codes
```
POST /api/users/me/2fa/backup-codes/regenerate
Body: { password: string }
Response: { backupCodes: string[] }
```

---

## Frontend Changes Needed

### 1. Settings Page
- Toggle switch for 2FA
- QR code display modal when enabling
- Code verification input
- Backup codes display (one-time view)
- Disable 2FA with password confirmation

### 2. Login Page
- 2FA code input field (shown after password verification)
- "Use backup code" option
- Resend code option (if using SMS/Email instead)

### 3. Components Needed
- QRCodeDisplay component
- BackupCodesDisplay component
- TwoFactorVerification component

---

## Implementation Steps

1. **Install TOTP library** (e.g., `speakeasy` for Node.js, `qrcode` for QR generation)
2. **Update User model** with 2FA fields
3. **Create 2FA service** for secret generation and verification
4. **Update login flow** to check 2FA status
5. **Create API endpoints** for 2FA operations
6. **Update frontend** Settings and Login pages
7. **Add backup codes** functionality
8. **Test thoroughly** with authenticator apps

---

## User Experience Flow

### Enabling 2FA:
1. User toggles 2FA ON
2. Modal appears with QR code
3. User scans with authenticator app
4. User enters verification code
5. Success! 2FA enabled
6. Backup codes shown (user should save them)

### Logging in with 2FA:
1. User enters email/password
2. "Enter 6-digit code" screen appears
3. User opens authenticator app
4. User enters code
5. Login successful!

### Disabling 2FA:
1. User toggles 2FA OFF
2. Password confirmation required
3. 2FA disabled
4. User can login with just password again

---

## Security Best Practices

1. ✅ Encrypt secret keys in database
2. ✅ Use HTTPS for all 2FA operations
3. ✅ Rate limit 2FA verification attempts
4. ✅ Log all 2FA events (enable/disable/verify)
5. ✅ Allow backup codes for account recovery
6. ✅ Require password to disable 2FA
7. ✅ Clear temp tokens after use
8. ✅ Validate code format (6 digits, numeric)

---

## Testing Checklist

- [ ] Enable 2FA and scan QR code
- [ ] Verify setup with code from authenticator
- [ ] Login with 2FA enabled
- [ ] Test with expired code (should fail)
- [ ] Test with wrong code (should fail)
- [ ] Test rate limiting (too many attempts)
- [ ] Use backup code for login
- [ ] Disable 2FA with password
- [ ] Re-enable 2FA (new secret generated)
- [ ] Test with multiple authenticator apps

