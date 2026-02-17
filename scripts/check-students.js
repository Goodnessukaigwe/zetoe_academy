#!/usr/bin/env node

/**
 * Check students with STU2026 prefix
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rveanmxnevtzcehcggxz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2ZWFubXhuZXZ0emNlaGNnZ3h6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk4MTk2OSwiZXhwIjoyMDc2NTU3OTY5fQ.9BzQRuVj7HVs0k7Wu7aKm9GuVMsGhzmDpgukOoQqVwY'

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
