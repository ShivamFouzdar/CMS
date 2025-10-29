# User Models in CMS

## Overview
The CMS has TWO distinct types of users:

### 1. Admin Users (User Model)
**Location**: `Server/src/models/User.ts`

**Purpose**: CMS administrators who manage the system

**Authentication**: YES - Login/Register required

**Fields**:
- `firstName`, `lastName`, `email`, `password`
- `role` ('admin' | 'moderator' | 'viewer')
- `isActive`, `isEmailVerified`
- `permissions[]`
- `profile` (avatar, phone, department, bio)
- `preferences` (notifications, theme, language)
- Password hashing with bcrypt
- Login tracking & account locking

**Features**:
- ✅ Can login at `/api/auth/login`
- ✅ Can register at `/api/auth/register`
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Account lock after 5 failed attempts
- ✅ Role-based access control
- ✅ Permission management
- ✅ Session management with JWT tokens

**Login Credentials**:
- Email: `admin@careermapsolutions.com`
- Password: `Admin@123`
- Role: `admin`

**API Endpoints**:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout

---

### 2. Job Applicants (Applicant Model)
**Location**: `Server/src/models/Applicant.ts`

**Purpose**: People who submit job applications

**Authentication**: NO - Cannot login/register

**Fields**:
- `fullName`, `email`, `phone`, `location`
- `experience`, `workMode`
- `skillsDescription`
- `hearAboutUs`
- `resumePath` (for uploaded resume)
- `status` ('new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired')
- `notes` (admin notes about the applicant)
- `reviewedBy`, `reviewedAt`
- `submittedAt`, `updatedAt`

**Features**:
- ❌ **NO LOGIN/REGISTER** - They cannot access the system
- ✅ Can submit job applications via `/api/job-application`
- ✅ Resume upload support
- ✅ Status tracking for admin review
- ✅ Full application history

**How They Interact**:
1. Visit the website
2. Click "Find Your Dream Job" button
3. Fill out the job application form
4. Upload resume
5. Submit application
6. **THAT'S IT** - No login required!

**Admin Access**:
- Admins can view all applicants at `/admin/job-applicants`
- Admins can download resumes
- Admins can update application status
- Admins can add notes

---

## Key Differences

| Feature | Admin Users (User) | Job Applicants (Applicant) |
|---------|-------------------|---------------------------|
| **Model** | `User` | `Applicant` |
| **Login** | ✅ Yes | ❌ No |
| **Register** | ✅ Yes | ❌ No |
| **Password** | ✅ Required & Hashed | ❌ Not applicable |
| **Access** | ✅ CMS Dashboard | ❌ No access |
| **Purpose** | System Management | Job Applications |
| **Data** | Stored in `users` collection | Stored in `applicants` collection |
| **Authentication** | JWT tokens | None |

---

## Database Collections

### 1. `users` Collection
- Admin accounts
- Login credentials
- System permissions
- NOT for job applicants

### 2. `applicants` Collection
- Job applications
- Resume files
- Application status
- NO login capability

---

## Important Notes

1. **Job Applicants Cannot Login**: They can only submit applications. They don't have accounts or access to the system.

2. **Admin Users Only**: Only admin users (User model) can login and access the admin panel to view/manage applicants.

3. **Separate Collections**: 
   - `users` - For admin/staff accounts
   - `applicants` - For job applications

4. **Clear Separation**: These two models serve completely different purposes:
   - `User` = CMS administrators
   - `Applicant` = Job seekers

---

## Usage Examples

### Creating an Admin User (Programmatically)
```typescript
import { User } from '@/models';

const admin = await User.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@company.com',
  password: 'SecurePass123!',
  role: 'admin',
});
```

### Creating a Job Application (by Applicant)
```typescript
// This is done via the job application form
// Applicants cannot create this themselves programmatically
// It's submitted via POST /api/job-application
```

### Viewing Applicants (Admin Only)
```typescript
import { Applicant } from '@/models';

// Get all applicants
const applicants = await Applicant.find({ status: 'new' });

// Get applicant stats
const stats = await Applicant.getStats();
```

---

## Summary

✅ **User Model**: For CMS admins who can login/register  
❌ **Applicant Model**: For job seekers who submit applications (NO LOGIN)

This clear separation ensures:
- Security (only admins have system access)
- Simplicity (applicants don't need accounts)
- Data integrity (admin data separate from application data)

