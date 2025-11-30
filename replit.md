# Bcalm - AI Product Manager Launchpad

## Overview

This project develops a landing page for "Bcalm's AI Product Manager Launchpad," a 30-day educational program for students and recent graduates aspiring to AI Product Management roles from top Indian colleges. The platform offers comprehensive program details, including curriculum, career support, testimonials, instructor profiles, pricing, and enrollment. It also features an **AI PM Readiness Check** assessment for lead generation, providing personalized skill assessments and gap analysis. The project aims to equip emerging talent with essential AI Product Management skills, addressing a high-growth educational market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18, TypeScript, and Vite. It uses Wouter for routing, React Query for server state, and React hooks for local state. UI components are developed with Shadcn UI (New York style) based on Radix UI primitives, styled using Tailwind CSS with a custom design system, violet/navy palette, and Inter/Poppins fonts. Framer Motion is used for animations. The landing page includes sections like Hero, Career Support, Curriculum, and Pricing, designed with a mobile-first, responsive approach. Branding includes the Bcalm logo prominently in the navbar and footer.

### Backend

The backend uses Express.js with TypeScript on Node.js, integrating Vite middleware for development. It follows a RESTful API pattern. Data is stored in PostgreSQL, abstracted via an `IStorage` interface and implemented using `DatabaseStorage`.

### Authentication System (Supabase OTP)

Authentication uses Supabase email OTP (passwordless) with a 3-step modal flow:
1. **Email View**: User enters email, triggers `signInWithOtp()` which sends a 6-digit code
2. **OTP View**: User enters the 6-digit code, triggers `verifyOtp()` for verification
3. **Profile View** (new users only): Collects Name, College/Company, and Role

**Key Components:**
- `client/src/components/AuthModal.tsx` - Main auth modal with state machine
- `client/src/lib/supabase.ts` - Supabase client configuration
- `client/src/hooks/use-auth.ts` - Auth state management hook

**Backend Token Exchange:**
After Supabase authentication, the frontend calls `/api/resources/auth/supabase` to exchange the Supabase session for a backend JWT token. This ensures backward compatibility with existing download endpoints.

**Supabase Profiles Table Setup:**
Create this table in your Supabase dashboard (SQL Editor):
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  college_company TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

**Role Options:** Student, Recent Graduate, Product Manager, Product Analyst, Developer, QA

### Data Storage

**Production Database:** PostgreSQL (Neon serverless) with Drizzle ORM is used for persistent data. Key tables include `users`, `resources_users`, `resources`, `download_logs`, `assessment_questions`, `assessment_attempts`, and `assessment_answers`.
**File Storage:** Uploaded files are stored on disk in `uploads/resources/`, with metadata in PostgreSQL.
**Database Operations:** All CRUD operations are managed via Drizzle ORM through `DatabaseStorage`. Migrations are handled by `npm run db:push`. An admin user is auto-initialized.

### Form Handling & Validation

React Hook Form manages forms, with Zod for schema-based validation. Current forms, like waitlist signup and call scheduling, log data to the console, awaiting backend integration.

### Feature Specifications

#### AI PM Readiness Check

A comprehensive assessment system evaluating student preparedness across 8 skill dimensions, acting as a lead generation tool.
- **Questions**: 24 questions across 8 skill dimensions using a 5-point Likert scale.
- **Scoring**: Total score out of 120, mapped to 4 readiness bands (Internship Ready, On Track, Building Foundation, Early Explorer).
- **Functionality**: Autosave, resume incomplete attempts, personalized results with dimension breakdowns, and shareable results.
- **Authentication**: Integrates with `resources_users` system using JWT.
- **Shareable Results**: Unique share links for completed assessments with a privacy-first design (first name + initial, readiness band, score range), and viral sharing options (LinkedIn, WhatsApp, copy link).

#### Landing Page Redesign - Three-Fold Structure

The landing page hero features a redesigned three-fold structure for improved conversion.
- **Fold 1 - Hero Section**: Includes a gradient glow, updated copy ("Become interview-ready for AI Product roles in 30 days"), primary ("Contact on WhatsApp") and secondary ("Download Free Resources") CTAs, social proof, cohort info, and secondary links.
- **Fold 2 - Why Bcalm Works**: A new section highlighting instructor expertise ("Learn from a Product Leader") and career advantages ("10x Your Shortlist Chances").
- **Instructors Section**: Features profiles of three AI Product Leaders (Rakesh Malloju, Aditya Singh, Akhil Joy) with their credentials.
- **Fold 3 - Sticky Quicklinks**: A `StickyQuicklinks` component provides navigation to key sections (Overview, Curriculum, Instructor, Outcomes, Reviews, Pricing, FAQ) via anchor links, with horizontal scroll on mobile.

#### Hackathon Landing Page

A dedicated landing page at `/hackathon` for "Think Beyond Data and Analysis" hackathon targeting Business Analysts, Data Analysts, and college students.
- **URL**: bcalm.org/hackathon
- **Sections**: Hero, Features (3 cards), How It Works (4-step timeline), Why Join (3 reasons), Testimonials (3 cards), Registration Form, FAQ Accordion, Footer
- **Registration Flow**: Form with Full Name, Phone, Gmail, Company/College → OTP verification modal → Success screen with countdown timer
- **Database**: `hackathon_registrations` table stores registrations with OTP verification
- **API Endpoints**:
  - `POST /api/hackathon/register` - Creates registration, generates OTP
  - `POST /api/hackathon/verify` - Verifies OTP and completes registration
  - `POST /api/hackathon/resend-otp` - Resends OTP
- **OTP System**: Currently uses generated codes stored in database. For production SMS delivery, Twilio integration is required (see setup instructions below).
- **UTM Tracking**: Captures utm_source, utm_medium, utm_campaign from URL parameters

#### GTM Attribution Tracking

A comprehensive analytics tracking system for multi-channel campaigns with UTM parameter support.
- **Core Events**: `first_page_launch`, various `_page_view` events, `user_signup`, `user_login`, `assessment_started`, `assessment_completed`, `assessment_dropped`.
- **Data Captured**: Page details, UTM parameters, referrer, user info, assessment scores.
- **Session Management**: `first_page_launch` tracks once per session using `sessionStorage`.
- **UTM Behavior**: UTMs are page-specific and not carried over during internal navigation. `navigationSource` tracks internal page flow.
- **Database Storage**: All events are stored in a Supabase `events` table with schema:
  ```sql
  CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb
  );
  ```
- **Supabase Configuration**: Client configured in `client/src/lib/supabase.ts` using environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Production Deployment**: Before publishing to Replit, run this command to embed Supabase variables into the production build:
  ```bash
  VITE_SUPABASE_URL="https://rhwvwvvwjwvtlxzqooii.supabase.co" \
  VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3Z3dnZ3and2dGx4enFvb2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODQzOTEsImV4cCI6MjA3ODE2MDM5MX0.tvv9lDe_4PACmq4s1j1jkwAPiTEYATjLZUaDtW_e4Ms" \
  npm run build && mkdir -p server/public && cp -r dist/public/* server/public/
  ```
  This ensures Supabase analytics tracking works in production. Immediately after running this, click Publish in Replit.

## External Dependencies

### UI & Styling

- **Radix UI**: Accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Class Variance Authority (CVA)**: For component variant APIs.
- **Framer Motion**: Animation library.
- **Embla Carousel**: Carousel functionality.
- **React Icons & Lucide React**: Icon libraries.

### Form & Data Management

- **React Hook Form**: Form state management.
- **Zod**: Schema validation.
- **TanStack React Query**: Server state management.
- **Date-fns**: Date manipulation.

### Backend & Database

- **Express**: Web application framework.
- **Drizzle ORM**: TypeScript ORM for SQL.
- **@neondatabase/serverless**: Neon PostgreSQL driver.
- **Connect-pg-simple**: PostgreSQL session store.

### Development Tools

- **Vite**: Build tool and dev server.
- **TypeScript**: Type-safe JavaScript.
- **TSX**: TypeScript executor for Node.js.
- **ESBuild**: JavaScript bundler.