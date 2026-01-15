# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - alert [ref=e20]
  - generic [ref=e22]:
    - img "Zetoe logo" [ref=e24]
    - heading "Welcome back 👋" [level=2] [ref=e25]
    - paragraph [ref=e26]: Login to your account to continue/access dashboard
    - generic [ref=e27]:
      - textbox "Email" [ref=e28]
      - generic [ref=e29]:
        - textbox "Password" [ref=e30]
        - button [ref=e31]:
          - img [ref=e32]
      - link "Forgot password?" [ref=e38] [cursor=pointer]:
        - /url: /forgot-password
      - button "Login" [ref=e39]
    - paragraph [ref=e40]:
      - text: Don’t have an account?
      - link "Register" [ref=e41] [cursor=pointer]:
        - /url: register
    - paragraph [ref=e42] [cursor=pointer]:
      - link "Back to Homepage" [ref=e43]:
        - /url: /
```