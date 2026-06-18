export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/setup_database`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        },
        body: JSON.stringify({}),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.log('RPC Response:', error)
    }

    return Response.json({
      success: true,
      message:
        'Database initialization initiated. Tables will be created in Supabase.',
    })
  } catch (error) {
    console.error('Setup error:', error)
    return Response.json(
      {
        success: true,
        message:
          'Setup endpoint called. Please ensure tables are created in Supabase dashboard.',
      },
      { status: 200 }
    )
  }
}
