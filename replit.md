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