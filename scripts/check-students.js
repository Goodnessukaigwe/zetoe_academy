#!/usr/bin/env node

/**
 * Check students with STU2026 prefix
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Please create a .env.local file with:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your-project-url')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkStudents() {
  // Get all students with username starting with STU2026
  const { data: students, error } = await supabase
    .from('students')
    .select('id, username, email, created_at')
    .ilike('username', 'STU2026%')
    .order('username')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`\n📊 Total students with STU2026 prefix: ${students?.length || 0}\n`)
  
  if (students && students.length > 0) {
    console.log('Students:')
    students.forEach((s, i) => {
      console.log(`${i + 1}. ${s.username} - ${s.email}`)
    })
  }

  // Check for duplicate usernames
  const usernames = students?.map(s => s.username) || []
  const duplicates = usernames.filter((item, index) => usernames.indexOf(item) !== index)
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  DUPLICATE USERNAMES FOUND:')
    duplicates.forEach(dup => console.log(`   - ${dup}`))
  }
}

checkStudents().catch(console.error)
