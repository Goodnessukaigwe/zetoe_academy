#!/bin/bash

# Test Data Setup Script for Zetoe Academy
# This script helps you load test data into Supabase

echo "🧪 Zetoe Academy - Test Data Setup"
echo "=================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI is not installed"
    echo ""
    echo "📦 Install it with:"
    echo "   npm install -g supabase"
    echo "   # or"
    echo "   brew install supabase/tap/supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're in the right directory
if [ ! -f "supabase/test-data-setup.sql" ]; then
    echo "❌ Error: supabase/test-data-setup.sql not found"
    echo "   Make sure you're running this from the project root"
    exit 1
fi

echo "📁 Found test-data-setup.sql"
echo ""

# Ask user for confirmation
echo "⚠️  WARNING: This will create/update test data in your database"
echo "   Only run this in development/test environments!"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🚀 Running test data setup..."
echo ""

# Run the SQL file using Supabase CLI
supabase db execute --file supabase/test-data-setup.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Test data setup completed successfully!"
    echo ""
    echo "📋 Test accounts created:"
    echo "   Student: student.test@zetoe.com (password: TestPassword123!)"
    echo "   Admin: admin.test@zetoe.com (password: TestPassword123!)"
    echo "   Super Admin: superadmin@zetoe.com (password: TestPassword123!)"
    echo ""
    echo "📚 Test data includes:"
    echo "   - 3 test users"
    echo "   - 2 sample courses"
    echo "   - 2 sample exams with questions"
    echo ""
    echo "🧪 You can now run E2E tests:"
    echo "   npm run test:e2e:chromium"
    echo ""
else
    echo ""
    echo "❌ Error: Failed to execute SQL script"
    echo ""
    echo "💡 Alternative method:"
    echo "   1. Open Supabase Dashboard: https://app.supabase.com"
    echo "   2. Go to SQL Editor"
    echo "   3. Copy contents of supabase/test-data-setup.sql"
    echo "   4. Paste and run"
    echo ""
    exit 1
fi
