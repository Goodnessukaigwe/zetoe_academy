# Student Information Feature Update

## Overview
The **Edit button** in the student management section should be replaced with a **Student Info button**.  
This new page will provide a detailed view of each student's information, courses, and exam history.

---

## Feature Requirements

### 1. Replace Edit Button
- Replace the existing **Edit** button with a **Info** button.
- Clicking the **Student Info** button should open a page or modal showing detailed student information.

---

### 2. Student Details Section
The student information page should display the following details:

- Student **Full Name**
- **Email Address**
- **Student ID**
- **Current Course(s)**
- **Registration Date** (optional)

This section provides a quick overview of the student’s profile.

---

### 3. Add More Courses
The page should include a feature to allow administrators to **add additional courses** for the student.

Requirements:
- A button labeled **"Add Course"**.
- A form to:
  - Select a **course**.
  - Mark whether the course has been **paid for**.
- The new course should then appear in the student’s course list.

---

### 4. Student Exam Records
Include a **table that displays the student's exam history**.

The table should show:

| Course | Exam Title | Score | Date Taken |
|------|------|------|------|
| Data Analytics | Module 1 Exam | 85 | 2025-01-10 |
| Web Development | HTML Basics | 92 | 2025-01-15 |

This section allows administrators to easily track a student's performance.

---

## Expected Outcome
The **Student Info page** should provide administrators with a centralized view where they can:

- View detailed student information.
- Add new courses and mark them as paid.
- Track the student’s exam history and scores.