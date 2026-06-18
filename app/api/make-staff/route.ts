import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the user by email
    const { data: user, error: getUserError } = await supabase.auth.admin.getUserByEmail(email)

    if (getUserError || !user) {
      return Response.json(
        { error: `User with email ${email} not found` },
        { status: 404 }
      )
    }

    // Update the user's metadata to mark them as staff
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          is_staff: true,
        },
      }
    )

    if (updateError) {
      return Response.json(
        { error: `Failed to update user: ${updateError.message}` },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      message: `User ${email} is now a staff member`,
      userId: data.user.id,
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
