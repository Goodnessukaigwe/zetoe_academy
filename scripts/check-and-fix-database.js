#!/usr/bin/env node

/**
 * Script to check and fix the database function issue
 * This will verify if generate_student_username function exists
 * and create it if missing
 */

const { createClient } = require('@supabase/supabase-js')

// Hardcoded credentials (from your .env.local)
const supabaseUrl = 'https://rveanmxnevtzcehcggxz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZWFubXhuZXZ0emNlaGNnZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk4MTk2OSwiZXhwIjoyMDc2NTU3OTY5fQ.9BzQRuVj7HVs0k7Wu7aKm9GuVMsGhzmDpgukOoQqVwY'

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAndFixDatabase() {
  console.log('🔍 Checking database...\n')

  // 1. Check if students table has username column
  console.log('1. Checking students table structure...')
  const { data: columns, error: columnsError } = await supabase
    .from('students')
    .select('*')
    .limit(1)

  if (columnsError) {
    console.error('❌ Error checking students table:', columnsError.message)
    return
  }

  const hasUsernameColumn = columns && columns[0] && 'username' in columns[0]
  console.log(`   ${hasUsernameColumn ? '✅' : '❌'} Username column exists: ${hasUsernameColumn}\n`)

  // 2. Try to call the function to see if it exists
  console.log('2. Testing generate_student_username function...')
  const { data: functionTest, error: functionError } = await supabase
    .rpc('generate_student_username')

  if (functionError) {
    console.error('❌ Function error:', functionError.message)
    console.error('   Error code:', functionError.code)
    console.error('   Details:', functionError.details)
    console.log('\n⚠️  The generate_student_username function is missing!\n')
    console.log('📝 To fix this, you need to run the SQL migration:')
    console.log('   1. Go to: https://app.supabase.com/project/rveanmxnevtzcehcggxz/sql/new')
    console.log('   2. Copy the contents of: supabase/migration-username-auth.sql')
    console.log('   3. Paste and run it in the SQL Editor')
    console.log('\n   OR run just the function creation:')
    console.log('   - Copy contents of: supabase/fix-username-function.sql\n')
  } else {
    console.log('✅ Function works! Generated username:', functionTest)
    console.log('\n✅ Database is properly configured!\n')
  }

  // 3. Check if there are any students
  const { data: students, count } = await supabase
    .from('students')
    .select('id, username, email', { count: 'exact' })
    .limit(5)

  console.log(`\n3. Students in database: ${count || 0}`)
  if (students && students.length > 0) {
    console.log('   Sample students:')
    students.forEach(s => {
      console.log(`   - ${s.username || 'NO USERNAME'} (${s.email})`)
    })
  }
}

checkAndFixDatabase().catch(console.error)
