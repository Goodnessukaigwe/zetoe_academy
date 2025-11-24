# Exam System Documentation

## Overview

The Zetoe Academy exam system allows students to take timed, multiple-choice exams with automatic grading. Admins create exams with questions, and students access them using unique access codes.

---

## Student Exam Journey

### 1️⃣ Prerequisites

Before taking an exam, students must:

- ✅ Have a registered account
- ✅ Be logged in
- ✅ Be enrolled in a course (assigned by admin)
- ✅ Have **paid** status (payment_status = 'paid')

### 2️⃣ Accessing an Exam

**Step 1: View Available Exams**

- Navigate to Student Dashboard (`/dashboard`)
- View available exams in the "Your Exams" section
- Exams are only visible if payment status is 'paid'

**Step 2: Enter Exam Code**

- Get the exam access code from your instructor (e.g., "EXAM2024")
- Navigate to exam access page
- Enter the code to unlock the exam

**Step 3: System Validation**
The system checks:

- ✅ Is the code valid?
- ✅ Is the exam associated with the student's enrolled course?
- ✅ Has the student paid?
- ✅ Has the student already taken this exam? (one attempt per exam)

If all checks pass → Redirect to exam page

---

### 3️⃣ Taking the Exam

**Location:** `/exam/[examId]`

#### Exam Interface Components:

**A. Header Section**

- Exam title and description
- Course name
- **Countdown Timer** (e.g., "45:00 remaining")
  - Timer starts immediately when page loads
  - Auto-submits exam when time reaches 0:00
  - Timer is displayed in red when < 5 minutes remaining

**B. Question Navigation Bar**

- Numbered buttons for each question (1, 2, 3, 4...)
- **Color Coding:**
  - **Grey** - Unanswered question
  - **Blue** - Answered question
  - **Current** - Highlighted/bordered
- Click any number to jump to that question

**C. Question Display Area**

- Question number and text
- Four multiple-choice options (A, B, C, D)
- Radio buttons to select answer
- Only one answer can be selected per question

**D. Navigation Controls**

- **"Previous"** button - Go to previous question (disabled on first question)
- **"Next"** button - Go to next question
- **"Submit Exam"** button - Appears on last question

#### Student Actions During Exam:

1. **Read the question** carefully
2. **Select an answer** by clicking a radio button
3. **Navigate** using:
   - Numbered question buttons (jump to any question)
   - "Previous" / "Next" buttons (sequential navigation)
4. **Review unanswered questions** (grey buttons)
5. **Submit** when ready or wait for auto-submit on timeout

#### Important Rules:

- ⏱️ **Time limit is strict** - exam auto-submits when timer expires
- 🔒 **One attempt only** - cannot retake the same exam
- 💾 **Answers are not saved** during the exam - complete in one session
- ⚠️ **Don't refresh the page** - you'll lose all progress

---

### 4️⃣ Submitting the Exam

**Manual Submit:**

1. Navigate to the last question
2. Click **"Submit Exam"** button
3. Confirm submission in popup dialog
4. System sends answers to backend for grading

**Auto-Submit (Timer Expires):**

- Timer reaches 0:00
- Exam automatically submits with current answers
- Unanswered questions are marked as incorrect

**Backend Processing:**

1. Receives all student answers
2. Compares with correct answers from exam questions
3. Calculates score:
   ```
   Score = (Correct Answers / Total Questions) × 100
   ```
4. Determines pass/fail based on exam's passing score
5. Saves result to `scores` table with:
   - Student ID
   - Exam ID
   - Score percentage
   - Status (passed/failed)
   - Timestamp

---

### 5️⃣ Viewing Results

**Location:** `/exam/[examId]/results`

**Results Display:**

- ✅ **Pass** or ❌ **Fail** status (large icon)
- **Score Percentage** (e.g., "85%")
- **Points Earned** vs Total Points
- **Status Badge** with color:
  - Green badge for "PASSED"
  - Red badge for "FAILED"
- **"Back to Dashboard"** button

**Result Persistence:**

- Results are saved permanently in the database
- Viewable anytime in Student Dashboard under "Recent Scores"
- Shows exam title, date taken, score, and pass/fail status

---

## Admin Exam Management

### How to Create an Exam (Step-by-Step Guide)

#### **Step 1: Navigate to Exam Creation**

1. Log in as an **Admin** or **Super Admin**
2. Go to **Admin Dashboard** → **Exams** section
3. Click the **"Create Exam"** button (usually top-right corner)
4. A modal/dialog will open with the exam creation form

---

#### **Step 2: Fill in Basic Exam Details**

**Required Fields:**

1. **Exam Title** \*

   - Example: "HTML & CSS Midterm Exam"
   - Be descriptive but concise
   - Students will see this title

2. **Course** \*

   - Select from dropdown menu
   - Only courses you've created will appear
   - Students must be enrolled in this course to take the exam

3. **Access Code** \*

   - Example: "EXAM2024" or "HTML101"
   - **Auto-converts to UPPERCASE**
   - Must be unique (system will reject duplicates)
   - Share this code with students to access the exam
   - 📝 **Write this down** - students need it!

4. **Duration (minutes)** \*

   - Example: 60 (for 1 hour exam)
   - Timer starts when student opens exam
   - Auto-submits when time expires
   - Recommended: 1-2 minutes per question

5. **Passing Score (%)** \*

   - Example: 70 (students need 70% to pass)
   - Range: 0-100
   - Students below this score will see "FAILED"
   - Students at or above will see "PASSED"

6. **Description** (Optional)
   - Example: "This exam covers HTML tags, CSS selectors, and basic responsive design"
   - Helps students understand what to expect
   - Displayed before exam starts

---

#### **Step 3: Add Questions**

The exam creation modal has a **scrollable questions section**. Here's how to add questions:

**Adding Your First Question:**

The form starts with one empty question. You'll see:

- Question text input field
- Four option input fields (Option 1, Option 2, Option 3, Option 4)
- Radio buttons next to each option

**How to Fill a Question:**

1. **Enter Question Text**

   ```
   Example: "What does HTML stand for?"
   ```

2. **Fill in All 4 Options**

   - Option 1: `HyperText Markup Language` ← Correct answer
   - Option 2: `High Tech Modern Language`
   - Option 3: `Home Tool Markup Language`
   - Option 4: `Hyperlinks and Text Markup Language`

3. **Select the Correct Answer**

   - ✅ Click the **radio button** (green circle) next to the correct option
   - The radio button will turn **green** when selected
   - You'll see: "Select the correct answer:" label above options
   - **IMPORTANT:** Only ONE option can be marked correct per question

4. **Visual Feedback:**
   - Each option is in a bordered box with clear spacing
   - Selected radio button shows a green checkmark
   - Option labels show "Option 1:", "Option 2:", etc.

**Adding More Questions:**

1. Click the **"Add Question"** button (blue button with + icon)
2. A new question block appears below
3. Fill it out the same way (question text + 4 options + select correct answer)
4. Repeat for all questions

**Removing Questions:**

- Click the **trash icon** (🗑️) next to any question
- Minimum: Must have at least 1 question
- Confirmation: No confirmation dialog - deletes immediately

---

#### **Step 4: Review Your Exam**

Before submitting, double-check:

✅ **Basic Details:**

- Exam title is clear and descriptive
- Correct course selected
- Access code is memorable and unique
- Duration allows enough time (1-2 min/question recommended)
- Passing score is fair (60-80% is typical)

✅ **Questions:**

- All question text is complete and clear
- All 4 options are filled for every question
- Every question has a correct answer selected (green radio button)
- No typos or formatting issues
- Questions are in desired order

---

#### **Step 5: Submit and Create**

1. Click the **"Create Exam"** button at the bottom
2. System validates:
   - All required fields filled
   - All questions have text
   - All options have text
   - Each question has a correct answer selected
3. If validation fails → Error message shows what's missing
4. If validation passes → Exam is created and saved to database
5. Success! You're returned to the exams list

---

#### **Step 6: Share Access Code with Students**

After creating the exam:

1. **Write down the access code** (e.g., "EXAM2024")
2. **Share it with students** via:
   - Email announcement
   - Classroom announcement
   - Learning management system
   - Printed handout
3. **Remind students:**
   - They need to be enrolled in the course
   - Payment must be completed
   - One attempt only
   - Time limit is enforced

---

### Creating an Exam - Quick Checklist

**Before You Start:**

- [ ] Know which course this exam is for
- [ ] Have your questions and answers ready
- [ ] Decided on duration and passing score
- [ ] Chosen a unique access code

**During Creation:**

- [ ] Fill in all basic details (title, course, code, duration, passing %)
- [ ] Add all questions (minimum 1 question)
- [ ] Fill question text for each question
- [ ] Fill all 4 options for each question
- [ ] Select correct answer (radio button) for each question
- [ ] Review everything before submitting

**After Creation:**

- [ ] Write down the access code
- [ ] Share code with students
- [ ] Inform students of exam availability
- [ ] Monitor student scores after submission

---

### Example: Creating a Simple HTML Exam

**Basic Details:**

- Title: `HTML Basics Quiz`
- Course: `Web Development 101`
- Access Code: `HTML101`
- Duration: `30` minutes
- Passing Score: `70`%
- Description: `Test your knowledge of HTML tags and structure`

**Question 1:**

- Question: `What does HTML stand for?`
- Option 1: `HyperText Markup Language` ← ✅ **Selected as correct**
- Option 2: `High Tech Modern Language`
- Option 3: `Home Tool Markup Language`
- Option 4: `Hyperlinks and Text Markup Language`

**Question 2:**

- Question: `Which tag is used for creating a hyperlink?`
- Option 1: `<link>`
- Option 2: `<a>` ← ✅ **Selected as correct**
- Option 3: `<href>`
- Option 4: `<url>`

**Question 3:**

- Question: `What is the correct HTML element for the largest heading?`
- Option 1: `<h1>` ← ✅ **Selected as correct**
- Option 2: `<heading>`
- Option 3: `<h6>`
- Option 4: `<head>`

✅ Click "Create Exam" → Exam is created with access code `HTML101`

---

### Creating an Exam (Traditional Documentation)

**Location:** Admin Dashboard → Exams → "Create Exam" button

**Required Information:**

1. **Basic Details:**

   - Exam Title (e.g., "Midterm Exam")
   - Course (select from enrolled courses)
   - Access Code (e.g., "EXAM2024") - unique identifier students use
   - Duration (minutes, e.g., 60)
   - Passing Score (percentage, e.g., 70%)
   - Description (optional)

2. **Questions:**
   - Add unlimited questions
   - Each question requires:
     - Question text
     - Four options (A, B, C, D)
     - Correct answer (select one radio button)
     - Points (default: 1 point per question)

**Creating Questions:**

- Click **"Add Question"** to add new questions
- Click **trash icon** to remove questions
- Select correct answer using radio buttons
- All fields are required

**Validation:**

- At least one question required
- All questions must have text
- All options must be filled
- One correct answer must be selected per question

**Submission:**

- Click **"Create Exam"**
- System validates and saves to database
- Questions are stored as JSON in exam record

---

### Viewing/Managing Exams

**Location:** Admin Dashboard → Exams

**Exam List Shows:**

- Exam title and code
- Associated course
- Number of questions
- Duration and passing score
- Actions: Edit, Delete

**Edit Exam:**

- Modify exam details
- Update questions
- Change passing score or duration

**Delete Exam:**

- Permanently removes exam
- Associated scores remain in database for records

---

## Database Schema

### Tables Used:

**`exams` Table:**

```sql
- id (uuid, primary key)
- title (text)
- description (text)
- course_id (uuid, foreign key → courses.id)
- code (text, unique) -- Access code
- duration_minutes (integer)
- passing_score (integer) -- Percentage
- questions (jsonb) -- Array of question objects
- created_at (timestamp)
```

**Question Object Structure:**

```json
{
  "id": "q_1",
  "question": "What is HTML?",
  "options": [
    "HyperText Markup Language",
    "High Tech Modern Language",
    "Home Tool Markup Language",
    "Hyperlinks and Text Markup Language"
  ],
  "correct_answer": 0, // Index of correct option (0 = first option)
  "points": 1
}
```

**`scores` Table:**

```sql
- id (uuid, primary key)
- student_id (uuid, foreign key → students.id)
- exam_id (uuid, foreign key → exams.id)
- score (integer) -- Raw points earned
- percentage (integer) -- Percentage score
- status ('passed' | 'failed')
- answers (jsonb) -- Student's submitted answers
- submitted_at (timestamp)
```

**`students` Table:**

```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users.id)
- name (text)
- email (text)
- course_id (uuid, foreign key → courses.id)
- payment_status ('paid' | 'unpaid' | 'partial')
- created_at (timestamp)
```

---

## API Endpoints

### Student Endpoints:

**GET `/api/exams?courseId={id}`**

- Fetch all exams for a specific course
- Returns: Array of exam objects (without correct answers)

**POST `/api/exams/submit`**

- Submit exam answers for grading
- Body:
  ```json
  {
    "examId": "uuid",
    "answers": {
      "q_1": 0,
      "q_2": 2,
      "q_3": 1
    }
  }
  ```
- Returns: Score object with percentage and pass/fail status

**GET `/api/scores`**

- Fetch student's exam scores
- Automatically filters by authenticated student
- Returns: Array of score objects with exam details

### Admin Endpoints:

**POST `/api/exams`**

- Create new exam
- Requires admin authentication
- Body: Exam object with questions array

**PUT `/api/exams/[id]`**

- Update existing exam
- Requires admin authentication

**DELETE `/api/exams/[id]`**

- Delete exam
- Requires admin authentication

---

## Security Features

### Access Control:

1. ✅ **Authentication Required** - All exam pages check for valid session
2. ✅ **Role-Based Access**:
   - Students can only take exams
   - Admins can create/edit/delete exams
3. ✅ **Payment Gate** - Must have 'paid' status to access exams
4. ✅ **Course Enrollment** - Can only take exams for enrolled course
5. ✅ **One Attempt Rule** - Database constraint prevents multiple submissions

### Data Protection:

1. 🔒 **Correct Answers Hidden** - Never sent to frontend during exam
2. 🔒 **Server-Side Grading** - Score calculation on backend only
3. 🔒 **Unique Access Codes** - Database enforces unique exam codes
4. 🔒 **Timestamp Tracking** - All submissions timestamped

### Cheating Prevention:

1. ⏱️ **Strict Timer** - Auto-submit prevents overtime
2. 🚫 **No Retakes** - One attempt per exam per student
3. 🔐 **Code Protected** - Need valid code from instructor
4. 📝 **Answer Storage** - All submissions saved for review

---

## Technical Implementation

### Frontend Stack:

- **Next.js 15** (App Router)
- **React** (Client Components)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)

### Key Files:

**Student Exam Interface:**

- `/src/app/exam/[id]/page.tsx` - Exam taking page with timer
- `/src/app/exam/[id]/results/page.tsx` - Results display page
- `/src/app/dashboard/page.tsx` - Student dashboard with exam list

**Admin Exam Management:**

- `/src/app/admin-dashboard/exams/page.tsx` - Exam list view
- `/src/app/admin-dashboard/exams/createExamModal.tsx` - Create exam modal
- `/src/app/admin-dashboard/exams/editExamModal.tsx` - Edit exam modal

**API Routes:**

- `/src/app/api/exams/route.ts` - GET (list) and POST (create)
- `/src/app/api/exams/[id]/route.ts` - GET (single), PUT (update), DELETE
- `/src/app/api/exams/submit/route.ts` - POST (submit and grade)
- `/src/app/api/scores/route.ts` - GET (student scores)

**Database:**

- Supabase (PostgreSQL)
- Row Level Security (RLS) policies
- Admin client for bypassing RLS in API routes

---

## Exam Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN CREATES EXAM                      │
│  (Admin Dashboard → Create Exam → Add Questions → Save)    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Exam Saved to DB      │
            │  Code: "EXAM2024"      │
            └────────────┬───────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  STUDENT TAKES EXAM                         │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │ Check   │    │ Check    │    │ Check    │
   │ Paid?   │    │ Enrolled?│    │ Already  │
   │         │    │          │    │ Taken?   │
   └────┬────┘    └────┬─────┘    └────┬─────┘
        │              │               │
        └──────────────┼───────────────┘
                       ▼
              ✅ All Checks Pass
                       │
                       ▼
            ┌──────────────────┐
            │  Exam Page Loads │
            │  Timer Starts    │
            └────────┬─────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Student Answers       │
        │  Questions (A/B/C/D)   │
        └────────┬───────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐            ┌──────────┐
│ Submit  │            │  Timer   │
│ Button  │            │ Expires  │
└────┬────┘            └────┬─────┘
     │                      │
     └──────────┬───────────┘
                ▼
     ┌──────────────────────┐
     │  POST /api/exams/    │
     │  submit              │
     └──────────┬───────────┘
                ▼
     ┌──────────────────────┐
     │  Backend Grading:    │
     │  - Compare answers   │
     │  - Calculate score   │
     │  - Determine pass/   │
     │    fail              │
     │  - Save to DB        │
     └──────────┬───────────┘
                ▼
     ┌──────────────────────┐
     │  Results Page        │
     │  Score: 85%          │
     │  Status: PASSED ✅   │
     └──────────────────────┘
```

---

## Future Enhancements

### Potential Features:

- 📊 **Analytics Dashboard** - Track student performance trends
- 📧 **Email Notifications** - Send results to student email
- 🔄 **Practice Mode** - Take exam without saving score
- 📝 **Essay Questions** - Support for text input questions
- 🎯 **Question Bank** - Randomize questions from pool
- ⏸️ **Pause/Resume** - Save progress and continue later
- 📱 **Mobile Optimization** - Better mobile exam experience
- 🖼️ **Image Support** - Add images to questions
- 📈 **Progress Tracking** - Show completion percentage during exam
- 🏆 **Leaderboard** - Display top performers
- 💬 **Exam Feedback** - Students can comment on questions
- 📄 **PDF Certificates** - Generate printable certificates for passed exams

---

## Troubleshooting

### Common Issues:

**Issue: "Exam code not found"**

- ✅ Verify code is correct (case-sensitive)
- ✅ Check if exam exists in admin dashboard
- ✅ Ensure you're enrolled in the exam's course

**Issue: "Payment required"**

- ✅ Contact admin to update payment status
- ✅ Verify payment was processed
- ✅ Check payment_status in database

**Issue: "Already taken this exam"**

- ✅ One attempt per exam rule enforced
- ✅ Check scores table for existing submission
- ✅ Contact admin if you need to retake

**Issue: Timer not showing**

- ✅ Check browser console for JavaScript errors
- ✅ Ensure JavaScript is enabled
- ✅ Try different browser

**Issue: Submit button not working**

- ✅ Make sure you're on the last question
- ✅ Check network connection
- ✅ Review browser console for errors

---

## Support

For technical issues or questions:

- 📧 Email: support@zeteoacademy.com
- 💬 Contact your course administrator
- 🐛 Report bugs to development team

---

**Last Updated:** November 24, 2025  
**Version:** 1.0.0
