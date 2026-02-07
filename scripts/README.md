# GitHub Issues Automation Scripts

## Prerequisites

### Install GitHub CLI

The script requires GitHub CLI (`gh`) to be installed and authenticated.

**Installation:**

- **Linux (Debian/Ubuntu):**

  ```bash
  sudo apt install gh
  ```

- **Linux (Other):**

  ```bash
  # Download from https://cli.github.com/
  # Or use your package manager
  ```

- **macOS:**

  ```bash
  brew install gh
  ```

- **Windows:**
  ```bash
  winget install --id GitHub.cli
  ```

### Authenticate with GitHub

After installing, authenticate with your GitHub account:

```bash
gh auth login
```

Follow the prompts to:

1. Select GitHub.com
2. Choose HTTPS
3. Authenticate with your browser or paste a token

## Usage

### Create All GitHub Issues

This script will create all 21 issues from `GITHUB_ISSUES.md`:

```bash
./scripts/create-github-issues.sh
```

**What it does:**

- ✅ Creates 21 GitHub issues with proper titles, descriptions, and labels
- ✅ Adds priority emoji indicators (🔴 🟠 🟡 🟢)
- ✅ Includes formatted descriptions with checkboxes
- ✅ Applies appropriate labels (security, bug, enhancement, etc.)
- ✅ Adds rate limiting to avoid API throttling

**Output:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Creating GitHub Issues for Zetoe Academy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will create 21 GitHub issues in the repository.

Do you want to continue? (y/N): y

Creating issues...

Creating: 🔴 Security - Environment Variables Exposed
✓ Created
Creating: 🔴 Infinite Recursion in Admin RLS Policies
✓ Created
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successfully created 21 GitHub issues!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View them at: https://github.com/Goodnessukaigwe/zetoe_academy/issues
```

## Issue Breakdown

The script creates **21 issues** organized by priority:

### 🔴 Critical (2 issues)

1. Security: Environment Variables Exposed in Repository
2. Infinite Recursion in Admin RLS Policies

### 🟠 High Priority (4 issues)

3. Mobile Responsiveness: Admin Dashboards
4. Mobile Responsiveness: Landing & Marketing Pages
5. Image Optimization: Replace `<img>` with Next.js `<Image />`
6. Build Errors: Missing Icon Imports and Invalid Links _(already fixed)_

### 🟡 Medium Priority (4 issues)

7. React Hooks: Missing Dependencies in useEffect
8. Code Cleanup: Remove Unused Variables and Imports
9. Security: Server-Side Exam Timer Validation
10. Observability: Error Monitoring and Logging

### 🟢 Low Priority (12 issues)

11. TypeScript: Avoid 'any' Types
12. UX: Add Breadcrumb Navigation
13. UX: Improve Loading States
14. Documentation: Improve README
15. Documentation: Update API Documentation
16. Feature: Email Verification for New Users
17. Feature: Student Profile Page
18. Feature: Bulk Student Import via CSV
19. Testing: Add Unit Tests
20. Performance: Implement Request Caching
21. Performance: Database Query Optimization

## Labels Used

The script applies the following labels to categorize issues:

- `security` - Security-related issues
- `bug` - Bugs and errors
- `enhancement` - New features and improvements
- `ui/ux` - User interface and experience
- `mobile` - Mobile responsiveness
- `performance` - Performance optimization
- `code-quality` - Code quality improvements
- `testing` - Testing-related tasks
- `documentation` - Documentation improvements
- `database` - Database-related issues
- `typescript` - TypeScript-specific issues
- `observability` - Logging and monitoring
- `feature` - New feature requests
- `critical` - Critical priority issues
- `deployment` - Deployment-related issues
- `cleanup` - Code cleanup tasks
- `quality` - Quality assurance

## Troubleshooting

### Error: "gh: command not found"

**Solution:** Install GitHub CLI (see Prerequisites above)

### Error: "Not authenticated with GitHub CLI"

**Solution:** Run `gh auth login` and follow the prompts

### Error: "Resource not accessible by integration"

**Solution:** Make sure you have push access to the repository

### Issues are being created but with errors

**Solution:** Check that you're in the correct repository. Run `gh repo view` to confirm.

## Manual Alternative

If you prefer to create issues manually, you can use the GitHub web interface:

1. Go to https://github.com/Goodnessukaigwe/zetoe_academy/issues
2. Click "New Issue"
3. Copy the content from `GITHUB_ISSUES.md` for each issue
4. Add appropriate labels

## After Creating Issues

Once issues are created:

1. **Review** - Go through each issue and ensure accuracy
2. **Prioritize** - Use GitHub's project boards or milestones
3. **Assign** - Assign issues to team members
4. **Track** - Create a project board to track progress
5. **Update** - Close issues as they are completed

## Recommended Next Steps

### Week 1 - Critical Issues

```bash
# View critical issues
gh issue list --label critical
```

### Week 2 - High Priority

```bash
# View high priority issues
gh issue list --label enhancement,mobile,performance
```

### Create a Project Board

```bash
# Create a new project
gh project create "Zetoe Academy Development"
```

## Additional Resources

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [Project Planning Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
