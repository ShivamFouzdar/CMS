# Database Models

This directory contains all the database models for the CMS application using Mongoose ODM.

## Models Overview

### 1. Contact Model (`Contact.ts`)
Represents contact form submissions and inquiries.

**Key Features:**
- Contact form data validation
- Status tracking (new, in_progress, completed, closed)
- Priority levels (low, medium, high)
- Assignment tracking
- Source tracking (website, phone, email, etc.)
- Tags for categorization

**Usage:**
```typescript
import { Contact } from '@/models';

// Create new contact
const contact = new Contact({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Interested in your services',
  service: 'IT Services'
});

await contact.save();
```

### 2. Review Model (`Review.ts`)
Represents customer testimonials and reviews.

**Key Features:**
- Rating validation (1-5 stars)
- Moderation system (isPublished, isVerified)
- Category-based organization
- Helpful voting system
- Admin response capability
- SEO metadata

**Usage:**
```typescript
import { Review } from '@/models';

// Create new review
const review = new Review({
  name: 'Jane Smith',
  email: 'jane@example.com',
  content: 'Great service!',
  rating: 5,
  category: 'IT Services'
});

await review.save();
```

### 3. Service Model (`Service.ts`)
Represents business services offered by the company.

**Key Features:**
- Service details (name, description, features, benefits)
- Process workflow definition
- Pricing tiers (basic, premium, enterprise)
- SEO optimization
- Featured services
- Category organization

**Usage:**
```typescript
import { Service } from '@/models';

// Create new service
const service = new Service({
  name: 'Web Development',
  slug: 'web-development',
  description: 'Full-stack web development services',
  features: ['React', 'Node.js', 'MongoDB'],
  benefits: ['Fast delivery', 'Modern tech stack'],
  category: 'IT Services'
});

await service.save();
```

### 4. User Model (`User.ts`)
Represents admin users and system administrators.

**Key Features:**
- Role-based access control (admin, moderator, viewer)
- Password hashing with bcrypt
- Account lockout after failed attempts
- Email verification
- User preferences
- Permission system

**Usage:**
```typescript
import { User } from '@/models';

// Create new user
const user = new User({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'securepassword',
  role: 'admin'
});

await user.save();
```

## Database Configuration

### Connection Setup
The database connection is configured in `@/config/database.ts`:

```typescript
import { initializeDatabase } from '@/config/database';

// Initialize database connection
await initializeDatabase();
```

### Environment Variables
Required environment variables:

```env
MONGODB_URI=mongodb://localhost:27017/cms
MONGODB_AUTH_SOURCE=admin
NODE_ENV=development
```

### Indexes
All models include optimized indexes for better query performance:
- Contact: email, status, service, submittedAt
- Review: rating, category, isPublished, date
- Service: slug, isActive, category, order
- User: email, role, isActive

## Model Methods

### Static Methods
Each model includes useful static methods:

**Contact:**
- `getStats()` - Get contact statistics
- `getByService(service, limit)` - Get contacts by service

**Review:**
- `getStats()` - Get review statistics
- `getByCategory(category, limit)` - Get reviews by category
- `getFeatured(limit)` - Get featured reviews
- `getRecent(limit)` - Get recent reviews

**Service:**
- `getActive()` - Get active services
- `getFeatured(limit)` - Get featured services
- `getByCategory(category)` - Get services by category
- `getBySlug(slug)` - Get service by slug
- `getCategories()` - Get service categories
- `getStats()` - Get service statistics

**User:**
- `findByEmail(email)` - Find user by email
- `getActive()` - Get active users
- `getByRole(role)` - Get users by role
- `getStats()` - Get user statistics

### Instance Methods
Each model includes useful instance methods:

**Contact:**
- `markAsContacted()` - Mark as contacted
- `updateStatus(status, notes)` - Update status

**Review:**
- `publish()` - Publish review
- `unpublish()` - Unpublish review
- `verify()` - Verify review
- `addHelpfulVote()` - Add helpful vote
- `addResponse(content, respondedBy)` - Add admin response

**Service:**
- `activate()` - Activate service
- `deactivate()` - Deactivate service
- `feature()` - Feature service
- `unfeature()` - Unfeature service
- `updateOrder(order)` - Update display order

**User:**
- `comparePassword(candidatePassword)` - Compare password
- `incLoginAttempts()` - Increment login attempts
- `resetLoginAttempts()` - Reset login attempts
- `updateLastLogin()` - Update last login
- `activate()` - Activate user
- `deactivate()` - Deactivate user
- `verifyEmail()` - Verify email
- `hasPermission(permission)` - Check permission

## Validation

All models include comprehensive validation:
- Required field validation
- Data type validation
- Length constraints
- Format validation (email, phone, etc.)
- Enum validation for predefined values
- Custom validation rules

## Security Features

- Password hashing with bcrypt
- Input sanitization
- SQL injection prevention (MongoDB)
- Account lockout protection
- Role-based access control
- Permission system

## Usage Examples

### Creating Records
```typescript
// Contact
const contact = new Contact({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Interested in your services'
});
await contact.save();

// Review
const review = new Review({
  name: 'Jane Smith',
  email: 'jane@example.com',
  content: 'Excellent service!',
  rating: 5,
  category: 'IT Services'
});
await review.save();

// Service
const service = new Service({
  name: 'Web Development',
  slug: 'web-development',
  description: 'Full-stack development',
  category: 'IT Services'
});
await service.save();

// User
const user = new User({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  password: 'password123',
  role: 'admin'
});
await user.save();
```

### Querying Records
```typescript
// Find contacts by status
const newContacts = await Contact.find({ status: 'new' });

// Find published reviews
const publishedReviews = await Review.find({ isPublished: true });

// Find active services
const activeServices = await Service.find({ isActive: true });

// Find admin users
const adminUsers = await User.find({ role: 'admin' });
```

### Using Static Methods
```typescript
// Get review statistics
const stats = await Review.getStats();

// Get featured services
const featured = await Service.getFeatured(3);

// Get contacts by service
const contacts = await Contact.getByService('IT Services', 10);
```

### Using Instance Methods
```typescript
// Update contact status
await contact.updateStatus('completed', 'Resolved successfully');

// Publish review
await review.publish();

// Activate service
await service.activate();

// Check user permission
const hasPermission = user.hasPermission('manage_users');
```

## Database Seeding

The database can be seeded with initial data using the `seedDatabase()` function:

```typescript
import { seedDatabase } from '@/config/database';

// Seed database (development only)
if (process.env.NODE_ENV === 'development') {
  await seedDatabase();
}
```

This will create:
- Sample services (BPO, IT Services)
- Admin user (admin@careermap.com / admin123)

## Error Handling

All models include proper error handling:
- Validation errors
- Duplicate key errors
- Connection errors
- Query errors

Example error handling:
```typescript
try {
  const contact = new Contact(contactData);
  await contact.save();
} catch (error) {
  if (error.name === 'ValidationError') {
    // Handle validation errors
    console.error('Validation failed:', error.message);
  } else if (error.code === 11000) {
    // Handle duplicate key errors
    console.error('Duplicate entry:', error.message);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error.message);
  }
}
```
