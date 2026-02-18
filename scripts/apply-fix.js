#!/usr/bin/env node

/**
 * Apply the fixed username generation function
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

const fixedFunction = `
CREATE OR REPLACE FUNCTION generate_student_username()
RETURNS TEXT AS $$
DECLARE
  new_username TEXT;
  current_year TEXT;
  counter INTEGER;
  max_counter INTEGER;
  max_attempts INTEGER := 1000;
  attempt INTEGER := 0;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');
  
  -- Find the highest counter for this year
  SELECT COALESCE(MAX(
    CASE 
      WHEN username ~ ('^STU' || current_year || '[0-9]+$')
      THEN CAST(SUBSTRING(username FROM (LENGTH('STU' || current_year) + 1)) AS INTEGER)
      ELSE 0
    END
  ), 0) INTO max_counter
  FROM students
  WHERE username LIKE 'STU' || current_year || '%';
  
  -- Start from the next available number
  counter := max_counter + 1;
  
  LOOP
    -- Generate username: STU + YEAR + 3-digit counter
    new_username := 'STU' || current_year || LPAD(counter::TEXT, 3, '0');
    
    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM students WHERE username = new_username) THEN
      RETURN new_username;
    END IF;
    
    -- Increment counter and try again
    counter := counter + 1;
    attempt := attempt + 1;
    
    -- Prevent infinite loop
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique username after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
`

async function applyFix() {
  console.log('🔧 Applying fixed username generation function...\n')

  const { data, error } = await supabase.rpc('exec', { 
    query: fixedFunction 
  })

  if (error) {
    console.error('❌ Error applying fix:', error.message)
    console.log('\n⚠️  Please apply manually:')
    console.log('   1. Go to: https://app.supabase.com/project/rveanmxnevtzcehcggxz/sql/new')
    console.log('   2. Copy the contents of: supabase/fix-username-function-v2.sql')
    console.log('   3. Paste and run it in the SQL Editor\n')
    return
  }

  console.log('✅ Function updated successfully!')
  
  // Test the function
  console.log('\n🧪 Testing the fixed function...')
  const { data: testData, error: testError } = await supabase
    .rpc('generate_student_username')

  if (testError) {
    console.error('❌ Test failed:', testError.message)
  } else {
    console.log('✅ Generated username:', testData)
    console.log('\n✨ You can now create students successfully!\n')
  }
}

applyFix().catch(console.error)
