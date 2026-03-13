# Client Requirement Clarification

## Overview
The client has specified new requirements regarding **course registration, dashboard visibility, and exam access control**. These requirements define how students interact with courses after registration.

---

# 1. Course Registration Limit
### Requirement
Students should **not be restricted to registering for only two courses**.

### Meaning
- The system should allow students to register for **multiple courses**.
- There should be **no hard limit** preventing registration beyond two courses.

---

# 2. Student Dashboard Course Visibility
### Requirement
After registering, students should be able to **see all the courses they registered for** on their dashboard.

### Meaning
- The dashboard should display **every course the student has registered for**.
- Each course should include relevant details such as payment status and exam availability.

### Example Dashboard Layout

| Course | Payment Status | Exam Access |
|------|------|------|
| Cloud Computing | Paid | Available |
| Data Analytics | Pending | Locked |
| Cybersecurity | Paid | Available |

---

# 3. Exam Access Based on Payment
### Requirement
Students should **only be able to write exams for courses they have paid for**.

### Meaning
- Students may register for multiple courses.
- However, **exam access should be restricted to courses with completed payment**.

### Example Scenario

| Course | Registered | Paid | Can Write Exam |
|------|------|------|------|
| Cloud Computing | ✔ | ✔ | ✔ |
| Data Analytics | ✔ | ❌ | ❌ |
| Cybersecurity | ✔ | ✔ | ✔ |

### System Behavior
- **Paid courses** → Exam access allowed  
- **Unpaid courses** → Exam access denied  

---

# Summary
The platform should support the following workflow:

1. Students can **register for multiple courses** without limitation.
2. The **student dashboard displays all registered courses**.
3. **Exam access is granted only for courses that have been paid for**.

---

# Technical Implication
To support this functionality, the system should allow a **many-to-many relationship between students and courses**.

### Example Database Structure

**students**

**courses**

**student_courses**

| column | description |
|------|------|
| student_id | references the student |
| course_id | references the course |
| payment_status | indicates whether the student has paid |

This structure allows one student to be associated with multiple courses while tracking payment status for each course.