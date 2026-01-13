import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

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
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a ticket
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingTicket) {
      return NextResponse.json({ ticket: existingTicket }, { status: 200 })
    }

    // Generate unique ticket number
    const ticketNumber = `T2D-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Get user profile for username
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    
    // Create QR code data (JSON with ticket info)
    const qrData = JSON.stringify({
      ticketNumber,
      userId: user.id,
      email: user.email,
      username: profile?.username || 'Unknown',
      eventName: 'Think To Deploy 2026',
      generatedAt: new Date().toISOString(),
    })

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#EAEDEF',
      },
    })

    // Insert ticket into database
    const { data: ticket, error: insertError } = await supabase
      .from('tickets')
      .insert({
        user_id: user.id,
        ticket_number: ticketNumber,
        qr_code_data: qrData,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      ticket: {
        ...ticket,
        qr_code_image: qrCodeDataUrl,
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error generating ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
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
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's ticket
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'No ticket found' }, { status: 404 })
    }

    // Generate QR code image for display
    const qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_code_data, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#EAEDEF',
      },
    })

    return NextResponse.json({ 
      ticket: {
        ...ticket,
        qr_code_image: qrCodeDataUrl,
      }
    }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
