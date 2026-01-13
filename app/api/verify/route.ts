import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = 't2d-admin@gmail.com'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    // Verify admin is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
    }

    // Get QR data from request
    const { qrData } = await request.json()

    if (!qrData) {
      return NextResponse.json({ error: 'No QR data provided' }, { status: 400 })
    }

    // Parse QR data
    let parsedData
    try {
      parsedData = JSON.parse(qrData)
    } catch {
      return NextResponse.json({ 
        approved: false, 
        error: 'Invalid QR code format' 
      }, { status: 200 })
    }

    const { ticketNumber, userId, email } = parsedData

    if (!ticketNumber || !userId) {
      return NextResponse.json({ 
        approved: false, 
        error: 'Invalid ticket data' 
      }, { status: 200 })
    }

    // Verify ticket exists in database
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', ticketNumber)
      .eq('user_id', userId)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json({ 
        approved: false, 
        error: 'Ticket not found in database' 
      }, { status: 200 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', userId)
      .single()

    // Check if already checked in
    const alreadyCheckedIn = ticket.checked_in

    // Mark ticket as checked in
    if (!ticket.checked_in) {
      await supabase
        .from('tickets')
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq('id', ticket.id)
    }

    return NextResponse.json({
      approved: true,
      alreadyCheckedIn,
      ticketInfo: {
        ticketNumber: ticket.ticket_number,
        username: profile?.username || 'Unknown',
        email: profile?.email || email,
        generatedAt: ticket.created_at,
        checkedInAt: alreadyCheckedIn ? ticket.checked_in_at : new Date().toISOString()
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
