# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - img "Zetoe logo" [ref=e5]
    - heading "Welcome back 👋" [level=2] [ref=e6]
    - paragraph [ref=e7]: Login to your account to continue/access dashboard
    - generic [ref=e8]:
      - textbox "Email" [ref=e9]
      - generic [ref=e10]:
        - textbox "Password" [ref=e11]
        - button [ref=e12]:
          - img [ref=e13]
      - link "Forgot password?" [ref=e19] [cursor=pointer]:
        - /url: /forgot-password
      - button "Login" [ref=e20]
    - paragraph [ref=e21]:
      - text: Don’t have an account?
      - link "Register" [ref=e22] [cursor=pointer]:
        - /url: register
    - paragraph [ref=e23] [cursor=pointer]:
      - link "Back to Homepage" [ref=e24]:
        - /url: /
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e35]
```