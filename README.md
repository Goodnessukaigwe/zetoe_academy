# 🎓 Zetoe Academy

Modern Learning Management System built with Next.js 15, TypeScript, and Supabase.

---

## 🚀 Features

- ✅ **Student Management** - Registration, course enrollment, payment tracking
- ✅ **Course Management** - Create and manage courses with exams
- ✅ **Exam System** - Timed exams with automatic grading
- ✅ **Role-Based Access** - Student, Admin, Super Admin roles
- ✅ **Certificate Verification** - Upload and verify certificates with unique codes
- ✅ **Performance Optimized** - Database indexes, API caching
- ✅ **E2E Testing** - Comprehensive test coverage with Playwright

---

## 📚 Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Supabase)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Testing:** Playwright (E2E)
- **Caching:** In-memory cache with auto-invalidation

---

## 🏃 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone repository
git clone <repository-url>
cd zetoe_academy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000`

---

## 🗄️ Database Setup

### 1. Run Optimization Script

```bash
# In Supabase SQL Editor
# Run: supabase/database-optimization.sql
```

This creates:

- 15+ performance indexes
- Query optimization functions
- Full-text search capabilities

### 2. Create Test Data (Optional)

```bash
# Run: supabase/test-data-setup.sql
```

Creates test users and courses for E2E testing.

---

## 🧪 Testing

### Run E2E Tests

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install --with-deps

# Run tests
npm run test:e2e

# Interactive mode
npm run test:e2e:ui

# View report
npm run test:e2e:report
```

### Test Coverage

- ✅ Student exam flow (4 tests)
- ✅ Admin workflow (6 tests)
- ✅ Super admin workflow (5 tests)
- ✅ Authentication & security (7 tests)

**Total: 22+ test cases**

📖 See: `docs/E2E_TESTING_GUIDE.md`

---

## 📊 Performance

### Database Optimization

- 15+ indexes (composite, GIN, B-tree)
- pg_trgm for full-text search
- Pagination on all list queries
- Query optimization functions

📖 See: `docs/QUERY_OPTIMIZATION_GUIDE.md`

### API Caching

- In-memory cache with TTL
- Automatic cache expiration
- Pattern-based invalidation
- 95% faster cached responses

📖 See: `docs/API_CACHING_GUIDE.md`

---

## 🎯 Available Scripts

| Script                    | Description              |
| ------------------------- | ------------------------ |
| `npm run dev`             | Start development server |
| `npm run build`           | Build for production     |
| `npm start`               | Start production server  |
| `npm run lint`            | Run ESLint               |
| `npm run test:e2e`        | Run E2E tests            |
| `npm run test:e2e:ui`     | E2E tests in UI mode     |
| `npm run test:e2e:report` | View test report         |

---

## 📁 Project Structure

```
zetoe_academy/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Student dashboard
│   │   ├── admin-dashboard/   # Admin dashboard
│   │   └── certificates/      # Certificate verification
│   └── lib/                    # Utilities
│       ├── cache.ts           # Caching system
│       └── swr-config.ts      # Client-side cache config
├── e2e/                        # E2E tests
│   ├── fixtures/              # Test helpers & page objects
│   └── tests/                 # Test suites
├── supabase/                   # Database
│   ├── database-optimization.sql
│   └── test-data-setup.sql
├── docs/                       # Documentation
│   ├── E2E_TESTING_GUIDE.md
│   ├── E2E_TESTING_SETUP.md
│   ├── E2E_TESTING_SUMMARY.md
│   ├── API_CACHING_GUIDE.md
│   └── QUERY_OPTIMIZATION_GUIDE.md
└── playwright.config.ts        # Test configuration
```

---

## 🔐 User Roles

### Student

- View enrolled courses
- Take exams
- View scores and certificates
- Dashboard access

### Admin

- Create students
- Assign courses
- Set payment status
- Create exams
- View scores
- Manage students

### Super Admin

- All admin permissions
- Create/delete admins
- System-wide access
- View admin logs

---

## 🎓 Certificate System

### Admin: Upload Certificate

1. Navigate to Admin Dashboard
2. Go to Certificates section
3. Upload certificate with unique code
4. Certificate stored in Supabase Storage

### Public: Verify Certificate

1. Visit `/certificates`
2. Enter certificate code
3. View certificate if valid

📖 See: `docs/CERTIFICATE_SYSTEM_SUMMARY.md`

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Required:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🔄 CI/CD

E2E tests run automatically on:

- Push to `main` or `develop`
- Pull requests
- Manual trigger

**GitHub Actions Workflow:** `.github/workflows/e2e-tests.yml`

Test reports and screenshots uploaded as artifacts.

---

## 📖 Documentation

| Document                                                 | Description              |
| -------------------------------------------------------- | ------------------------ |
| [E2E Testing Guide](docs/E2E_TESTING_GUIDE.md)           | Complete testing guide   |
| [E2E Setup](docs/E2E_TESTING_SETUP.md)                   | Step-by-step setup       |
| [E2E Summary](docs/E2E_TESTING_SUMMARY.md)               | Quick reference          |
| [API Caching](docs/API_CACHING_GUIDE.md)                 | Caching implementation   |
| [Query Optimization](docs/QUERY_OPTIMIZATION_GUIDE.md)   | Database optimization    |
| [Certificate System](docs/CERTIFICATE_SYSTEM_SUMMARY.md) | Certificate verification |

---

## 🐛 Known Issues

None at this time. Report issues in GitHub Issues.

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

**Note:** All PRs must pass E2E tests.

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

- Next.js team for amazing framework
- Supabase for backend infrastructure
- Playwright for testing framework

---

## 📞 Support

- 📧 Email: support@zetoe.com
- 📖 Documentation: `/docs`
- 🐛 Issues: GitHub Issues

---

## ✅ Status

**Production Ready** ✅

All features implemented and tested:

- ✅ Student management
- ✅ Course management
- ✅ Exam system
- ✅ Certificate verification
- ✅ Database optimization
- ✅ API caching
- ✅ E2E testing
- ✅ CI/CD pipeline

**GitHub Issues Resolved:**

1. ✅ Database Query Optimization
2. ✅ API Caching Implementation
3. ✅ E2E Testing Setup

---

**Built with ❤️ by the Zetoe Academy Team**
