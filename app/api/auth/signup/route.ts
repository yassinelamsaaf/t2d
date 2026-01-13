import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password and username are required' },
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
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          username: username,
        }
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create profile with username
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          username: username,
          email: email,
          created_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
