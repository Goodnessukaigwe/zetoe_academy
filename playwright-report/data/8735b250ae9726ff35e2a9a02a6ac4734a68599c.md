# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - navigation [ref=e4]:
        - link "Dashboard" [ref=e5] [cursor=pointer]:
          - /url: /admin-dashboard
          - img [ref=e6]
          - text: Dashboard
        - link "Students" [ref=e9] [cursor=pointer]:
          - /url: /student-management
          - img [ref=e10]
          - text: Students
        - link "Courses" [ref=e15] [cursor=pointer]:
          - /url: /admin-dashboard/courses
          - img [ref=e16]
          - text: Courses
        - link "Exams" [ref=e18] [cursor=pointer]:
          - /url: /admin-dashboard/exams
          - img [ref=e19]
          - text: Exams
        - link "Certificates" [ref=e22] [cursor=pointer]:
          - /url: /admin-dashboard/certificates
          - img [ref=e23]
          - text: Certificates
    - generic [ref=e26]:
      - banner [ref=e27]:
        - heading "Admin Dashboard" [level=1] [ref=e28]
        - button "Logout" [ref=e29]
      - main [ref=e30]
  - button "Open Next.js Dev Tools" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
  - alert [ref=e42]
```