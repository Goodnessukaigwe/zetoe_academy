# 📡 API Documentation - Zetoe Academy

Complete API reference for the Zetoe Academy backend.

**Base URL**: `http://localhost:3000/api`  
**Production**: `https://your-domain.vercel.app/api`

---

## 🔐 Authentication

### Sign Up
**POST** `/api/auth/signup`

Register a new user (defaults to student role).

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student" // optional, defaults to "student"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": { /* user object */ }
}
```

---

### Sign In
**POST** `/api/auth/signin`

Authenticate a user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Signed in successfully",
  "user": { /* user object */ },
  "session": { /* session object */ }
}
```

---

### Sign Out
**POST** `/api/auth/signout`

Sign out the current user.

**Response:** `200 OK`
```json
{
  "message": "Signed out successfully"
}
```

---

### Get Current User
**GET** `/api/auth/me`

Get the authenticated user with role and profile.

**Response:** `200 OK`
```json
{
  "user": { /* auth user */ },
  "role": "student",
  "profile": { /* student or admin profile */ }
}
```

---

## 📚 Courses

### Get All Courses
**GET** `/api/courses`

Get all courses (public access).

**Response:** `200 OK`
```json
{
  "courses": [
    {
      "id": "uuid",
      "name": "Full Stack Development",
      "description": "Learn to build web apps",
      "price": 150000,
      "duration": "3 months",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Course
**POST** `/api/courses`

Create a new course (admin only).

**Request Body:**
```json
{
  "name": "Mobile App Development",
  "description": "Build iOS and Android apps",
  "price": 180000,
  "duration": "4 months"
}
```

**Response:** `201 Created`
```json
{
  "message": "Course created successfully",
  "course": { /* course object */ }
}
```

---

### Get Single Course
**GET** `/api/courses/[id]`

Get details of a specific course.

**Response:** `200 OK`
```json
{
  "course": { /* course object */ }
}
```

---

### Update Course
**PUT** `/api/courses/[id]`

Update a course (admin only).

**Request Body:**
```json
{
  "name": "Updated Course Name",
  "price": 200000
}
```

---

### Delete Course
**DELETE** `/api/courses/[id]`

Delete a course (super admin only).

**Response:** `200 OK`
```json
{
  "message": "Course deleted successfully"
}
```

---

## 👥 Students

### Get All Students
**GET** `/api/students`

Get all students (admin only).

**Response:** `200 OK`
```json
{
  "students": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+234xxx",
      "payment_status": "paid",
      "course": { /* course object */ }
    }
  ]
}
```

---

### Create Student
**POST** `/api/students`

Register a new student (admin only).

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "phone": "+234xxxxxxxxx",
  "course_id": "course-uuid" // optional
}
```

**Response:** `201 Created`
```json
{
  "message": "Student created successfully",
  "student": { /* student object */ }
}
```

---

### Get Single Student
**GET** `/api/students/[id]`

Get student details (own profile or admin).

**Response:** `200 OK`
```json
{
  "student": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "payment_status": "paid",
    "course": { /* course object */ }
  }
}
```

---

### Update Student
**PUT** `/api/students/[id]`

Update student information (admin only).

**Request Body:**
```json
{
  "phone": "+234xxxxxxxxx",
  "course_id": "new-course-uuid",
  "payment_status": "paid"
}
```

---

### Delete Student
**DELETE** `/api/students/[id]`

Delete a student (super admin only).

**Response:** `200 OK`
```json
{
  "message": "Student deleted successfully"
}
```

---

## 💰 Payments

### Get Payments
**GET** `/api/payments`

Get payment records (filtered by role).

**Query Parameters:**
- `student_id` (optional) - Filter by student ID (admin only)

**Response:** `200 OK`
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 150000,
      "payment_method": "cash",
      "reference": "REF123",
      "notes": "Paid in full",
      "paid_at": "2025-01-15T10:30:00Z",
      "student": { /* student object */ },
      "admin": { "name": "Admin Name", "email": "admin@example.com" }
    }
  ]
}
```

---

### Record Payment
**POST** `/api/payments`

Record a new payment (admin only).

**Request Body:**
```json
{
  "student_id": "student-uuid",
  "amount": 150000,
  "payment_method": "bank_transfer", // cash, bank_transfer, card, other
  "reference": "REF12345", // optional
  "notes": "Payment confirmed via bank transfer" // optional
}
```

**Response:** `201 Created`
```json
{
  "message": "Payment recorded successfully",
  "payment": { /* payment object */ }
}
```

**Note:** This automatically updates student `payment_status` to `paid`.

---

## 📝 Exams

### Get Exams
**GET** `/api/exams`

Get all exams (authenticated users).

**Query Parameters:**
- `course_id` (optional) - Filter by course
- `include_questions=true` - Include questions in response

**Response:** `200 OK`
```json
{
  "exams": [
    {
      "id": "uuid",
      "title": "Final Exam",
      "description": "Comprehensive assessment",
      "code": "EXAM123",
      "duration_minutes": 60,
      "passing_score": 70,
      "course": { "name": "Course Name" }
    }
  ]
}
```

---

### Create Exam
**POST** `/api/exams`

Create a new exam (admin only).

**Request Body:**
```json
{
  "course_id": "course-uuid",
  "title": "Midterm Exam",
  "description": "Covers chapters 1-5",
  "code": "MID001",
  "duration_minutes": 90,
  "passing_score": 70,
  "questions": [
    {
      "id": "q1",
      "question": "What is React?",
      "options": ["Library", "Framework", "Language", "Database"],
      "correct_answer": 0,
      "points": 1
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Exam created successfully",
  "exam": { /* exam object */ }
}
```

---

### Access Exam with Code
**POST** `/api/exams/access`

Access an exam using the exam code (students).

**Request Body:**
```json
{
  "code": "EXAM123"
}
```

**Response:** `200 OK`
```json
{
  "exam": {
    "id": "uuid",
    "title": "Final Exam",
    "duration_minutes": 60,
    "passing_score": 70,
    "questions": [
      {
        "id": "q1",
        "question": "What is React?",
        "options": ["Library", "Framework", "Language", "Database"],
        "points": 1
        // Note: correct_answer is NOT included
      }
    ]
  }
}
```

**Requirements:**
- Student must be enrolled in the course
- Payment status must be `paid`
- Student hasn't taken the exam yet

---

### Submit Exam
**POST** `/api/exams/submit`

Submit exam answers and get score (students).

**Request Body:**
```json
{
  "exam_id": "exam-uuid",
  "time_taken_minutes": 45,
  "answers": [
    {
      "question_id": "q1",
      "selected_answer": 0
    },
    {
      "question_id": "q2",
      "selected_answer": 2
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "message": "Exam submitted successfully",
  "result": {
    "score": 8,
    "total_questions": 10,
    "percentage": 80,
    "status": "passed",
    "passing_score": 70
  },
  "data": { /* full score record */ }
}
```

---

## 📊 Scores

### Get Scores
**GET** `/api/scores`

Get exam scores (filtered by role).

**Query Parameters:**
- `student_id` (optional) - Filter by student (admin only)
- `exam_id` (optional) - Filter by exam (admin only)

**Response:** `200 OK`
```json
{
  "scores": [
    {
      "id": "uuid",
      "score": 8,
      "total_questions": 10,
      "percentage": 80,
      "status": "passed",
      "time_taken_minutes": 45,
      "submitted_at": "2025-01-20T14:30:00Z",
      "student": { "name": "John Doe" },
      "exam": {
        "title": "Final Exam",
        "passing_score": 70,
        "course": { "name": "Course Name" }
      }
    }
  ]
}
```

---

## 👔 Admins

### Get All Admins
**GET** `/api/admins`

Get all admins (admin only).

**Response:** `200 OK`
```json
{
  "admins": [
    {
      "id": "uuid",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### Create Admin
**POST** `/api/admins`

Create a new admin (super admin only).

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "securepassword",
  "name": "Admin Name",
  "role": "admin" // or "super_admin"
}
```

**Response:** `201 Created`
```json
{
  "message": "Admin created successfully",
  "admin": { /* admin object */ }
}
```

---

### Update Admin
**PUT** `/api/admins/[id]`

Update admin information (super admin only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "super_admin"
}
```

---

### Delete Admin
**DELETE** `/api/admins/[id]`

Delete an admin (super admin only).

**Response:** `200 OK`
```json
{
  "message": "Admin deleted successfully"
}
```

---

## 🔒 Authorization Matrix

| Endpoint | Student | Admin | Super Admin |
|----------|---------|-------|-------------|
| **Auth Routes** | ✅ | ✅ | ✅ |
| GET /courses | ✅ | ✅ | ✅ |
| POST /courses | ❌ | ✅ | ✅ |
| PUT/DELETE /courses | ❌ | ✅ | ✅ (DELETE) |
| GET /students | ❌ | ✅ | ✅ |
| POST /students | ❌ | ✅ | ✅ |
| GET /students/[id] | Own only | ✅ | ✅ |
| PUT /students/[id] | ❌ | ✅ | ✅ |
| DELETE /students/[id] | ❌ | ❌ | ✅ |
| GET /payments | Own only | ✅ | ✅ |
| POST /payments | ❌ | ✅ | ✅ |
| GET /exams | ✅ | ✅ | ✅ |
| POST /exams | ❌ | ✅ | ✅ |
| POST /exams/access | ✅ | ✅ | ✅ |
| POST /exams/submit | ✅ | ❌ | ❌ |
| GET /scores | Own only | ✅ | ✅ |
| GET /admins | ❌ | ✅ | ✅ |
| POST /admins | ❌ | ❌ | ✅ |
| PUT/DELETE /admins | ❌ | ❌ | ✅ |

---

## 🚨 Error Responses

All endpoints return standard error responses:

**400 Bad Request**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "error": "Not authenticated"
}
```

**403 Forbidden**
```json
{
  "error": "Unauthorized"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. **Authentication**: Most endpoints require authentication. Include cookies in your requests.
2. **Cookies**: Next.js automatically handles Supabase auth cookies.
3. **CORS**: Configured for same-origin requests. Update for production domains.
4. **Rate Limiting**: Consider implementing rate limiting for production.
5. **Validation**: All endpoints validate input data before processing.

---

**Last Updated**: October 21, 2025  
**Version**: 1.0.0
