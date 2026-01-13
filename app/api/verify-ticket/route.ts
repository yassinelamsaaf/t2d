import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { qrData } = await request.json()

    if (!qrData) {
      return NextResponse.json(
        { error: 'QR data is required' },
        { status: 400 }
      )
    }

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
    
    // Parse QR data
    let ticketInfo
    try {
      ticketInfo = JSON.parse(qrData)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 })
    }

    // Verify ticket exists in database
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', ticketInfo.ticketNumber)
      .single()

    if (error || !ticket) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Ticket not found or invalid' 
      }, { status: 404 })
    }

    // Check if already checked in
    if (ticket.checked_in) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Ticket already used',
        checkedInAt: ticket.checked_in_at,
      }, { status: 400 })
    }

    // Mark as checked in
    const { error: updateError } = await supabase
      .from('tickets')
      .update({ 
        checked_in: true, 
        checked_in_at: new Date().toISOString() 
      })
      .eq('id', ticket.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to check in' }, { status: 500 })
    }

    // Get user info
    const { data: { user } } = await supabase.auth.admin.getUserById(ticket.user_id)

    return NextResponse.json({ 
      valid: true,
      message: 'Ticket verified successfully',
      ticket: {
        ticketNumber: ticket.ticket_number,
        email: user?.email,
        checkedInAt: new Date().toISOString(),
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
