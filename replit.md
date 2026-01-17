# Bcalm - AI Product Manager Launchpad

## Overview

This project develops a landing page for "Bcalm's AI Product Manager Launchpad," a 30-day educational program for students and recent graduates aspiring to AI Product Management roles from top Indian colleges. The platform offers comprehensive program details, including curriculum, career support, testimonials, instructor profiles, pricing, and enrollment. It also features an **AI PM Readiness Check** assessment for lead generation, providing personalized skill assessments and gap analysis. The project aims to equip emerging talent with essential AI Product Management skills, addressing a high-growth educational market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18, TypeScript, and Vite. It uses Wouter for routing, React Query for server state, and React hooks for local state. UI components are developed with Shadcn UI (New York style) based on Radix UI primitives, styled using Tailwind CSS with a custom design system, violet/navy palette, and Inter/Poppins fonts. Framer Motion is used for animations. The landing page includes sections like Hero, Career Support, Curriculum, and Pricing, designed with a mobile-first, responsive approach. Branding includes the Bcalm logo prominently in the navbar and footer.

### Backend

The backend uses Express.js with TypeScript on Node.js, integrating Vite middleware for development. It follows a RESTful API pattern. Data is stored in PostgreSQL, abstracted via an `IStorage` interface and implemented using `DatabaseStorage`. Authentication for the Free Resources system uses JWT tokens with bcrypt for password hashing.

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

#### Supabase Auth Integration (CV Score Feature)

The CV Score feature uses Supabase Auth for authentication with Google OAuth and Email/Password.
- **Session Storage**: Express session with memorystore for session management
- **User Profiles**: Stored in Supabase `profiles` table (not local PostgreSQL)
- **Auth Routes**:
  - `POST /api/auth/session` - Syncs Supabase session with backend
  - `GET /api/auth/user` - Returns current user profile
  - `GET /api/me` - Returns user ID and profile for routing decisions
  - `POST /api/auth/logout` - Ends session
- **Frontend Hook**: `useAuth()` hook provides `user`, `isLoading`, `isAuthenticated`, `logout`
- **Auth Flow**: Landing CTA → AuthModal → Google/Email login → Supabase callback → /auth/callback → /start → onboarding or upload

**IMPORTANT: Supabase Database Setup Required**

Before auth will work, you must run the SQL in `supabase/complete_setup.sql` in your Supabase SQL Editor. This creates:
1. `profiles` table with all required columns (email, first_name, last_name, avatar_url, onboarding_status, etc.)
2. `cv_submissions` table for storing uploaded CVs
3. `analysis_jobs` table for n8n analysis results
4. Row Level Security (RLS) policies for user and service_role access

**Google OAuth Setup:**
1. In Supabase Dashboard → Authentication → Providers → Enable Google
2. In Google Cloud Console: Create OAuth 2.0 credentials
3. Add Redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
4. If in "Testing" mode, add test users to OAuth consent screen

#### Auth Page & Modal

A unified authentication system with shared AuthCard component used on both `/auth` route and in modal.

**Layout (exact order):**
1. Logo (GraduationCap icon in purple gradient box)
2. Headline: "Welcome to BCALM"
3. Subtext: "Sign in to continue"
4. "Continue with Google" button (purple gradient, triggers Supabase OAuth)
5. "or" separator
6. Email field (label: "Email", placeholder: "you@example.com")
7. Password field (label: "Password", placeholder: "Enter password")
8. "Continue" button (purple gradient)
9. Helper links: "New here? Create account" | "Forgot password?"
10. Footer: "By continuing you agree to Terms & Privacy"

**Styling:**
- Card background: `rgba(20, 12, 40, 0.96)`
- Borders: `rgba(255,255,255,0.10)`
- Inputs: solid dark (#1a0033) with clear borders
- Primary buttons: purple gradient
- Page background: dark purple gradient

**Behaviors:**
- **Email/password auto-create**: Attempts sign-in first; if user doesn't exist, automatically creates account
- **"New here?" link**: Focuses email field, shows hint "We'll create your account if you're new."
- **"Forgot password?" link**: Switches to inline reset state with email-only field and "Send reset link" CTA; shows "Reset link sent" on success

**Files:**
- `client/src/components/AuthCard.tsx` - Shared component
- `client/src/pages/AuthPage.tsx` - Renders AuthCard on `/auth` route
- `client/src/components/AuthModal.tsx` - Wraps AuthCard in dialog

#### CTA Components

Three CTA systems are implemented for lead conversion:

**Navbar CTAs:**
- Logged OUT: "Start for free" (primary button) + "Sign in" (text link)
- Logged IN: "Start for Free" (primary button) + User avatar/name dropdown with "Change Profile" and "Logout"
- "Start for free" scrolls to the hero lead form

**StickyMobileCTA (mobile only, lg:hidden):**
- Fixed bottom bar with "Get your free CV score" text
- "Check my CV" button navigates to /start (anonymous) or /upload (authenticated)
- Safe area padding for iOS devices

**DesktopFloatingCTA (desktop only, hidden lg:block):**
- Fixed position right side (right: 24px, top: 58%)
- Shows "Get a clear CV review" + "Check my CV" button
- Appears after 18% page scroll with fade/slide animation
- Dismissible with × icon, persists for 7 days via localStorage key `bcalm_cta_dismissed_until`
- Hidden on /onboarding, /upload, /app, /start routes

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
  VITE_SUPABASE_URL="https://" \
  VITE_SUPABASE_ANON_KEY="" \
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
