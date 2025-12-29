import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth'
import { adminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if user is admin
    const role = await getUserRole(user.id)
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Call the database function to generate code
    const { data, error } = await adminClient.rpc('generate_certificate_code')

    if (error) {
      return NextResponse.json(
        { error: 'Failed to generate code' },
        { status: 500 }
      )
    }

    return NextResponse.json({ code: data })

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
