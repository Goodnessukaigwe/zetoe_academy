# 🎓 Certificate System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘

1. Admin Login
   │
   ├─► Navigate to /admin-dashboard/certificates
   │   │
   │   ├─► View all certificates
   │   │   - Search by code, name, email, course
   │   │   - See statistics (total, active, this month)
   │   │   - View/Download certificate files
   │   │
   │   └─► Click "Upload Certificate"
   │
   └─► /admin-dashboard/certificates/upload
       │
       ├─► Generate Code
       │   API: GET /api/certificates/generate-code
       │   Returns: CERT-2025-001
       │
       ├─► Select Student
       │   API: GET /api/students
       │   Shows: Student info, course, scores
       │
       ├─► Fill Form
       │   - Certificate code (auto-generated)
       │   - Certificate number (optional display number)
       │   - Grade (Distinction, Merit, Pass, Credit)
       │   - Issue date
       │   - Expiry date (optional)
       │   - Upload file (PDF/PNG/JPEG, max 5MB)
       │   - Notes (optional)
       │
       └─► Submit
           API: POST /api/certificates/upload
           │
           ├─► Upload file to Supabase Storage
           │   Bucket: "certificates"
           │   Path: CERT-2025-001-1234567890.pdf
           │
           ├─► Insert record to database
           │   Table: certificates
           │   Fields: All form data + file URL
           │
           └─► Success → Redirect to certificate list


┌─────────────────────────────────────────────────────────────┐
│                   PUBLIC WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘

1. Anyone (No Login Required)
   │
   └─► Navigate to /verify-certificate
       │
       ├─► Enter Certificate Code
       │   Input: CERT-2025-001
       │
       ├─► Click "Verify Certificate"
       │   API: GET /api/certificates/verify?code=CERT-2025-001
       │   │
       │   ├─► Query database (public RLS policy)
       │   │   SELECT certificate_code, student_name, course_name,
       │   │          grade, final_score, issue_date, expiry_date
       │   │   FROM certificates
       │   │   WHERE certificate_code = 'CERT-2025-001'
       │   │   AND is_active = true
       │   │
       │   └─► Check validity
       │       - Is active?
       │       - Is expired? (expiry_date < today)
       │
       └─► Display Results
           │
           ├─► Valid Certificate ✅
           │   - Green banner
           │   - Student information
           │   - Course details
           │   - Grade and score
           │   - Issue/expiry dates
           │   - Download button
           │
           ├─► Expired Certificate ⚠️
           │   - Orange banner
           │   - Shows expiry date
           │   - Still shows details
           │
           └─► Invalid/Not Found ❌
               - Red error banner
               - "Certificate not found"


┌─────────────────────────────────────────────────────────────┐
│                   DATABASE STRUCTURE                        │
└─────────────────────────────────────────────────────────────┘

certificates
├── id (UUID, primary key)
├── certificate_code (TEXT, unique) ─────► CERT-2025-001
├── certificate_number (TEXT, optional) ─► ZA/HTML/2025/001
├── student_id (UUID) ───────────────────► FK to students
├── student_name (TEXT) ─────────────────► Cached for display
├── student_email (TEXT)
├── course_id (UUID) ────────────────────► FK to courses
├── course_name (TEXT) ──────────────────► Cached for display
├── exam_id (UUID, optional) ────────────► FK to exams
├── exam_title (TEXT, optional)
├── score_id (UUID, optional) ───────────► FK to scores
├── final_score (DECIMAL, optional) ─────► 85.50
├── grade (TEXT) ────────────────────────► Distinction, Merit, etc
├── file_url (TEXT) ─────────────────────► Supabase Storage URL
├── file_name (TEXT)
├── file_type (TEXT) ────────────────────► application/pdf
├── issue_date (DATE) ───────────────────► 2025-12-28
├── expiry_date (DATE, optional)
├── issued_by (UUID) ────────────────────► FK to admins
├── notes (TEXT, optional)
├── is_verified (BOOLEAN) ───────────────► TRUE by default
├── is_active (BOOLEAN) ─────────────────► TRUE by default
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)


┌─────────────────────────────────────────────────────────────┐
│                   STORAGE STRUCTURE                         │
└─────────────────────────────────────────────────────────────┘

Supabase Storage
└── certificates/ (bucket)
    ├── CERT-2025-001-1703778123456.pdf
    ├── CERT-2025-002-1703778234567.png
    ├── CERT-2025-003-1703778345678.jpg
    └── ...

Policies:
✅ Admins can INSERT (upload)
✅ Admins can SELECT (view)
✅ Authenticated users can SELECT (view with URL)


┌─────────────────────────────────────────────────────────────┐
│                   SECURITY (RLS)                            │
└─────────────────────────────────────────────────────────────┘

Table: certificates

Public (No Login):
✅ SELECT - Can read active certificates
   WHERE is_active = TRUE

Students:
✅ SELECT - Can see their own certificates
   WHERE student_id IN (
     SELECT id FROM students WHERE user_id = auth.uid()
   )

Admins:
✅ INSERT - Can create certificates
✅ UPDATE - Can modify certificates
✅ SELECT - Can view all certificates

Super Admins:
✅ DELETE - Can remove certificates


┌─────────────────────────────────────────────────────────────┐
│                   API ENDPOINTS                             │
└─────────────────────────────────────────────────────────────┘

GET /api/certificates
├── Auth: Admin only
├── Query: ?studentId=UUID (optional filter)
└── Returns: List of all certificates

POST /api/certificates/upload
├── Auth: Admin only
├── Body: FormData with file + metadata
├── Actions:
│   1. Upload file to storage
│   2. Insert record to database
└── Returns: Created certificate

GET /api/certificates/verify?code=CERT-2025-001
├── Auth: Public (no auth required)
├── Query: code (certificate code)
└── Returns: Certificate details + validity status

GET /api/certificates/generate-code
├── Auth: Admin only
└── Returns: New unique code (CERT-2025-XXX)


┌─────────────────────────────────────────────────────────────┐
│                   CODE GENERATION                           │
└─────────────────────────────────────────────────────────────┘

Function: generate_certificate_code()

Logic:
1. Get current year ─────────────► 2025
2. Count existing certificates ──► 5 certificates in 2025
3. Next number ──────────────────► 006
4. Pad with zeros ───────────────► 006
5. Format ───────────────────────► CERT-2025-006

Examples:
- First of year:  CERT-2025-001
- Second:         CERT-2025-002
- Tenth:          CERT-2025-010
- Hundredth:      CERT-2025-100


┌─────────────────────────────────────────────────────────────┐
│                   VALIDATION RULES                          │
└─────────────────────────────────────────────────────────────┘

Certificate Status:

Valid ✅
├── is_active = TRUE
├── is_verified = TRUE
└── (expiry_date IS NULL OR expiry_date >= today)

Expired ⚠️
├── is_active = TRUE
├── is_verified = TRUE
└── expiry_date < today

Invalid ❌
└── is_active = FALSE


File Upload Rules:

✅ Allowed Types:
   - application/pdf
   - image/png
   - image/jpeg

✅ Max Size: 5MB

❌ Rejected:
   - Other file types
   - Files > 5MB


┌─────────────────────────────────────────────────────────────┐
│                   USER INTERFACE                            │
└─────────────────────────────────────────────────────────────┘

Admin Dashboard:
┌─────────────────────────────────────────┐
│ 🏆 Certificates Management              │
│                           [Upload +]    │
├─────────────────────────────────────────┤
│ 🔍 [Search...]                          │
├─────────────────────────────────────────┤
│ Total: 25  Active: 23  This Month: 5   │
├─────────────────────────────────────────┤
│ Code          Student        Course     │
│ CERT-2025-001 John Doe       HTML       │
│ CERT-2025-002 Jane Smith     CSS        │
│ ...                                     │
└─────────────────────────────────────────┘

Upload Page:
┌─────────────────────────────────────────┐
│ 📜 Upload Certificate                   │
├─────────────────────────────────────────┤
│ Code: [CERT-2025-003] [Generate]       │
│ Number: [ZA/HTML/2025/003] (optional)  │
│ Student: [Select dropdown]              │
│ Grade: [Pass ▼]                         │
│ Issue Date: [2025-12-28]                │
│ Expiry: [          ] (optional)         │
│ File: [Click to upload]                 │
│ Notes: [                    ]           │
│                                         │
│ [Cancel]  [Upload Certificate]          │
└─────────────────────────────────────────┘

Public Verification:
┌─────────────────────────────────────────┐
│ 🔍 Certificate Verification             │
├─────────────────────────────────────────┤
│ Enter certificate code:                 │
│ [CERT-2025-001          ]               │
│                                         │
│ [Verify Certificate]                    │
└─────────────────────────────────────────┘

Result (Valid):
┌─────────────────────────────────────────┐
│ ✅ Valid Certificate                    │
│ This certificate is authentic           │
├─────────────────────────────────────────┤
│ Code: CERT-2025-001                     │
│                                         │
│ 👤 Student: John Doe                    │
│    Email: john@example.com              │
│                                         │
│ 📚 Course: HTML Fundamentals            │
│                                         │
│ 🏆 Grade: Distinction (92%)             │
│                                         │
│ 📅 Issued: December 28, 2025            │
│                                         │
│ [View/Download Certificate]             │
└─────────────────────────────────────────┘
```

## Key Features Summary

### For Admins:
✅ Auto-generate unique certificate codes  
✅ Upload certificates with student linking  
✅ Track grades and scores  
✅ Set issue and expiry dates  
✅ Search and filter certificates  
✅ View statistics  
✅ Download certificate files  

### For Public:
✅ Verify certificates without login  
✅ Search by code  
✅ View certificate details  
✅ Check validity status  
✅ Download certificate files  

### Security:
✅ Row Level Security (RLS)  
✅ Public read-only access  
✅ Admin-only modifications  
✅ Secure file storage  
✅ Unique code validation  

## Implementation Complete! 🎉

All components are ready to use. Follow the setup guide to deploy.
