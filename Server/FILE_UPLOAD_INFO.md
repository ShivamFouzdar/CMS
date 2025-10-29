# File Upload Storage Information

## 📁 Where Files Are Saved

When a user uploads a resume through the job application form, the file is saved to:

```
Server/uploads/resumes/
```

### Full Path Structure:
```
C:\Users\kaush\OneDrive\Desktop\CMS\Server\uploads\resumes\
```

## 📝 File Naming Convention

Files are saved with a unique name using this format:

```
resume-{timestamp}-{randomNumber}.{originalExtension}
```

Example:
- `resume-1761646773997-740911184.pdf`
- `resume-1761647696841-688353940.pdf`

Where:
- `{timestamp}`: Current Unix timestamp (milliseconds)
- `{randomNumber}`: Random 9-digit number
- `{originalExtension}`: Original file extension (.pdf, .doc, .docx)

## 🔧 Configuration

The upload configuration is in: `Server/src/controllers/jobApplicationController.ts`

```typescript
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
```

### Upload Limits:
- **Maximum file size**: 5MB
- **Allowed file types**: 
  - PDF (`application/pdf`)
  - Word 2003 (.doc) (`application/msword`)
  - Word 2007+ (.docx) (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)

## 💾 Data Storage

### File Storage (Physical Files)
- **Location**: `Server/uploads/resumes/`
- **Content**: Actual PDF/Word document files uploaded by users

### Database Storage (Metadata)
- **Model**: `Applicant` (MongoDB)
- **Field**: `resumePath` - Stores the relative path to the file
- **Example**: `/uploads/resumes/resume-1761646773997-740911184.pdf`

## 🔍 How It Works

1. User uploads a resume via the job application form
2. Server receives the file via `multer` middleware
3. File is saved to `Server/uploads/resumes/` with a unique name
4. File path is saved in MongoDB in the `Applicant` model's `resumePath` field
5. Server responds with success message

## 📊 Current Files

As of the last check, there are **5 uploaded resume files**:

1. `resume-1761570259676-128433359.pdf` (55KB)
2. `resume-1761570919030-403008855.pdf` (55KB)
3. `resume-1761571157648-884915426.pdf` (55KB)
4. `resume-1761646773997-740911184.pdf` (55KB)
5. `resume-1761647696841-688353940.pdf` (55KB)

## 🔒 Security Considerations

- Files are stored outside the web root (recommended security practice)
- Files are accessible via the API endpoint for authorized users
- File type validation prevents malicious file uploads
- File size limits prevent DoS attacks via large file uploads

## 🗑️ Deletion

When a job application is deleted via the admin panel:
1. The database record is removed from MongoDB
2. The physical file is also deleted from `Server/uploads/resumes/`
3. Both operations happen atomically in the `deleteJobApplication` function

## 🔗 API Access

### Download Resume
**Endpoint**: `GET /api/job-application/submissions/:id/resume`

**Headers Required**:
```
Authorization: Bearer {accessToken}
```

This endpoint serves the file directly to authorized admin users.

