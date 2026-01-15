# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img "Zetoe logo" [ref=e5]
    - heading "Welcome back 👋" [level=2] [ref=e6]
    - paragraph [ref=e7]: Login to your account to continue/access dashboard
    - generic [ref=e8]: Something went wrong! Please try again.
    - generic [ref=e9]:
      - textbox "Email" [ref=e10]: admin.test@zetoe.com
      - generic [ref=e11]:
        - textbox "Password" [ref=e12]: AdminPassword123!
        - button [ref=e13]:
          - img [ref=e14]
      - link "Forgot password?" [ref=e20] [cursor=pointer]:
        - /url: /forgot-password
      - button "Login" [ref=e21]
    - paragraph [ref=e22]:
      - text: Don’t have an account?
      - link "Register" [ref=e23] [cursor=pointer]:
        - /url: register
    - paragraph [ref=e24] [cursor=pointer]:
      - link "Back to Homepage" [ref=e25]:
        - /url: /
  - button "Open Next.js Dev Tools" [ref=e31] [cursor=pointer]:
    - img [ref=e32]
  - alert [ref=e36]
```