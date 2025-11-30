# 🎓 Zetoe Academy - Tech Consulting & Certification Platform


## 🚀 Features

### Student Portal

- 📚 Browse available courses
- � Register for courses
- 📝 Take exams with custom access codes
- 📊 View scores and results
- 💰 View payment status and history
- 🎓 Download certificates upon completion

### Admin Portal

- 👥 Register and manage students
- 💳 Record and manage payments manually
- 📋 Create and upload exams
- ✏️ Edit student information and payment status
- 📈 View exam results and analytics
- 🔐 Conduct and monitor exams

### Super Admin Portal

- 🔑 All admin functionalities
- 👔 Create, edit, and delete admin accounts
- 🎛️ Full system control
- 💰 Manage all payments and courses

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Payments**: Manual/Local (Admin managed)
- **Deployment**: Vercel
- **Language**: TypeScript

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Install dependencies**:

```bash
npm install
```

2. **Configure environment variables**:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Supabase credentials.

3. **Set up Supabase database**:

   - Follow the complete guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Run the SQL scripts in `supabase/` folder

4. **Run the development server**:

```bash
npm run dev
```

5. **Test the connection**:
   - Open [http://localhost:3000/test-connection](http://localhost:3000/test-connection)

## 📁 Project Structure

```
zetoe_academy/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── test-connection/ # Connection test page
│   │   └── page.tsx      # Landing page
│   ├── lib/              # Utility functions
│   │   ├── supabase/     # Supabase clients
│   │   └── auth.ts       # Authentication helpers
│   └── types/            # TypeScript definitions
├── supabase/             # Database schema and migrations
│   ├── schema.sql        # Main database schema
│   ├── rls-policies.sql  # Row Level Security policies
│   └── sample-data.sql   # Sample data for testing
├── middleware.ts         # Next.js middleware
└── .env.local           # Environment variables (not in git)
```

## 🗄️ Database Schema

Tables:

- **courses**: Available courses
- **students**: Student profiles and enrollment
- **admins**: Admin and super admin accounts
- **exams**: Exam questions and metadata
- **scores**: Student exam results
- **payments**: Payment transactions

See `supabase/schema.sql` for the complete schema.

## 🔐 Authentication & Authorization

### User Roles

1. **Student**: Can register, enroll, take exams, view results
2. **Admin**: Can manage students, create exams, view all data
3. **Super Admin**: Full system access, can manage admins

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Then add your environment variables in the Vercel dashboard.

## 📝 Development Timeline

- ✅ **Week 1**: Project setup, Supabase integration, Auth
- 🔄 **Week 2**: Frontend pages, Student dashboard
- ⏳ **Week 3**: Admin/Super Admin dashboards
- ⏳ **Week 4**: Testing, deployment, documentation

## 👨‍💻 Author

**Goodness Ukaigwe**

- GitHub: [@Goodnessukaigwe](https://github.com/Goodnessukaigwe)

---

**Built with Next.js** | Powered by Supabase
