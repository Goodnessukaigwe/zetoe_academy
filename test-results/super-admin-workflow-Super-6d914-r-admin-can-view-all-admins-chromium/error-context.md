# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - img "Zetoe logo" [ref=e15]
    - heading "Welcome back 👋" [level=2] [ref=e16]
    - paragraph [ref=e17]: Login to your account to continue/access dashboard
    - generic [ref=e18]:
      - textbox "Email" [ref=e19]
      - generic [ref=e20]:
        - textbox "Password" [ref=e21]
        - button [ref=e22]:
          - img [ref=e23]
      - link "Forgot password?" [ref=e29] [cursor=pointer]:
        - /url: /forgot-password
      - button "Login" [ref=e30]
    - paragraph [ref=e31]:
      - text: Don’t have an account?
      - link "Register" [ref=e32] [cursor=pointer]:
        - /url: register
    - paragraph [ref=e33] [cursor=pointer]:
      - link "Back to Homepage" [ref=e34]:
        - /url: /
```