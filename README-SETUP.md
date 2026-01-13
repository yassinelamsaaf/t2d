# Think To Deploy - Event Ticketing System

## 🎯 Project Overview
Complete event registration and ticketing system with QR code generation and validation.

## 🎨 Brand Colors
- Primary Purple: `#9D4EDD`
- Light Gray: `#EAEDEF`
- Black: `#000000`

## 📁 Project Structure
```
t2d/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts      # User registration
│   │   │   ├── login/route.ts       # User login
│   │   │   └── logout/route.ts      # User logout
│   │   ├── ticket/route.ts          # Ticket generation & retrieval
│   │   └── verify-ticket/route.ts   # QR code verification
│   ├── login/page.tsx               # Login page
│   ├── register/page.tsx            # Registration page
│   ├── dashboard/page.tsx           # User ticket dashboard
│   ├── scanner/page.tsx             # Staff QR scanner
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home (redirects to login)
│   └── globals.css                  # Global styles
├── lib/
│   └── supabase.ts                  # Supabase client setup
├── public/
│   └── t2d-logo.png                 # Logo
├── .env.local                       # Environment variables
└── supabase-setup.sql              # Database schema

## 🚀 Getting Started

### 1. Set Up Supabase Database (IMPORTANT - DO THIS FIRST!)

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in sidebar
4. Copy content from `supabase-setup.sql`
5. Paste and click **Run**

This creates:
- ✅ `tickets` table
- ✅ Security policies
- ✅ Database indexes

### 2. Run the Development Server

```bash
cd t2d
npm run dev
```

Open http://localhost:3000

## 🔐 User Flow

### For Attendees:
1. **Register** at `/register` - Create account with email/password
2. **Login** at `/login` - Access your account
3. **Dashboard** at `/dashboard` - Generate your ticket with QR code
4. **Download** QR code image for the event
5. **Attend** - Bring QR code to event entrance

### For Staff:
1. Access `/scanner` - QR code scanner page
2. Click "Start Scanning"
3. Point camera at attendee's QR code
4. System validates and marks ticket as used
5. Green check = Valid | Red X = Invalid/Used

## 📱 Key Features

✅ User authentication (Supabase Auth)
✅ Unique ticket generation per user
✅ QR code with encrypted ticket data
✅ One-time ticket validation
✅ Staff scanner with camera
✅ Branded UI matching Think To Deploy theme
✅ Mobile-responsive design
✅ Download QR code as image

## 🗄️ Database Schema

### tickets table:
- `id` - UUID primary key
- `user_id` - Foreign key to auth.users
- `ticket_number` - Unique ticket identifier (T2D-XXXXX)
- `qr_code_data` - JSON data encoded in QR
- `checked_in` - Boolean (has ticket been used?)
- `checked_in_at` - Timestamp of check-in
- `created_at` - Ticket generation time
- `updated_at` - Last update time

## 🌐 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Option 2: Netlify
1. Push code to GitHub
2. Go to https://netlify.com
3. Import repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Add environment variables
7. Deploy!

## 🔧 Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 📦 Dependencies

Core packages:
- `next` - React framework
- `react` - UI library
- `@supabase/supabase-js` - Database client
- `@supabase/auth-helpers-nextjs` - Auth integration
- `qrcode` - QR code generation
- `html5-qrcode` - QR code scanning
- `tailwindcss` - Styling

## 🎯 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home (redirects to login) | Public |
| `/login` | User login | Public |
| `/register` | User registration | Public |
| `/dashboard` | User ticket page | Authenticated |
| `/scanner` | Staff QR scanner | Public (should add auth) |

## 🔒 Security Features

- Row Level Security (RLS) on database
- Users can only see their own tickets
- Passwords hashed by Supabase
- JWT-based authentication
- One-time ticket validation
- Secure QR code data

## 🎨 UI Components

All pages feature:
- Think To Deploy logo
- Purple (#9D4EDD) primary buttons
- Light gray (#EAEDEF) background
- Rounded corners and shadows
- Mobile-responsive design

## 📝 Notes

- Each user can only have ONE ticket
- Tickets cannot be deleted, only marked as used
- QR codes contain JSON with ticket info
- Camera permission required for scanner
- Works on mobile and desktop

## 🐛 Troubleshooting

**"Failed to fetch"**
- Check if dev server is running
- Verify Supabase credentials in `.env.local`

**"Unauthorized"**
- Make sure you're logged in
- Check if database tables were created

**Camera not working**
- Allow camera permissions in browser
- Use HTTPS in production (required for camera)

**Ticket not generating**
- Verify database connection
- Check SQL script was run in Supabase
- Look at browser console for errors

## 🎉 Next Steps

Optional enhancements:
- [ ] Add email verification
- [ ] Send ticket via email
- [ ] Staff authentication for scanner
- [ ] Admin dashboard (view all tickets)
- [ ] Export attendee list
- [ ] Ticket statistics
- [ ] Custom event details
- [ ] Multiple events support
