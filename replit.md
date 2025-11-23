# Bcalm - AI Product Manager Launchpad

## Overview

This project delivers a production-ready landing page for "Bcalm's AI Product Manager Launchpad," a 30-day intensive educational program aimed at students and recent graduates from top-tier Indian colleges (IITs, BITS, NITs, IIITs) aspiring to AI Product Management roles. The platform provides comprehensive program information, including a detailed curriculum, career support, testimonials, instructor profiles, pricing, and enrollment functionality, all accessible via smooth-scroll navigation. Additionally, the platform features an **AI PM Readiness Check** assessment system that evaluates student preparedness across 8 skill dimensions, serving as a lead generation tool with personalized results and gap analysis. The business vision is to equip emerging talent with the skills needed to excel in AI Product Management, tapping into a high-growth market for specialized education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing. State management relies on React Query for server state and React hooks for local component state. UI components are developed using Shadcn UI (New York style) built on Radix UI primitives, ensuring accessibility and customizability. Styling is managed with Tailwind CSS, incorporating a custom design system with CSS variables for theming, a primary violet and navy color palette, and Inter/Poppins fonts. Framer Motion is used for animations. The landing page is structured into multiple sections: Hero, Career Support, About, Curriculum, Why Bcalm, Testimonials, Instructors, Pricing, and a final CTA, all designed with a mobile-first, responsive approach. Key visual design inspirations include Reforge and hellopm.co, focusing on clean, minimal layouts, premium typography, and an aspirational aesthetic with a tiered spacing system for optimal readability and professionalism.

**Branding:** The Bcalm logo (orange graduation cap icon with "BCALM" wordmark and tagline) is displayed across the website in two placements: (1) Navbar - full logo at responsive size (35-45px height), clickable link to home; (2) Footer - full logo at 60px height above description text. Logo asset: attached_assets/587825421_122110881585061636_4522478478515908937_n_1763885253278.jpg.

### Backend Architecture

The backend utilizes Express.js with TypeScript on Node.js. It integrates custom Vite middleware for development with HMR. The API follows a RESTful pattern. Data storage uses PostgreSQL via `DatabaseStorage` implementation, with a clear `IStorage` interface for abstraction. Authentication is handled via JWT tokens for the Free Resources system, with bcrypt for password hashing.

### Data Storage

**Production Database:** The application uses PostgreSQL (Neon serverless) via Drizzle ORM for all persistent data. Database schema includes:
- `users`: Basic user accounts (id, username, password)
- `resources_users`: Free resources authentication (id, email, password, name, isAdmin, timestamps)
- `resources`: Educational resources (id, title, description, category, type, filePath, fileSize, originalFileName, mimeType, isActive, timestamps)
- `download_logs`: Download tracking (id, userId, resourceId, downloadedAt)
- `assessment_questions`: 24 questions across 8 skill dimensions (id, dimension, questionText, helperText, orderIndex)
- `assessment_attempts`: User assessment sessions (id, userId, totalScore, readinessBand, isCompleted, dimensionScores, createdAt, completedAt)
- `assessment_answers`: Individual question responses (id, attemptId, questionId, answerValue)

**File Storage:** Uploaded files are stored in `uploads/resources/` directory on disk, with metadata (originalFileName, mimeType) stored in PostgreSQL for proper download handling.

**Database Operations:** All CRUD operations use Drizzle ORM through the `DatabaseStorage` class. Migrations are managed via `npm run db:push`. Admin user (admin@bcalm.org) is auto-initialized on first startup.

### Form Handling & Validation

Form management is handled by React Hook Form, with Zod resolvers providing schema-based validation. Current user interactions involve waitlist signup and call scheduling, which log data to the console, awaiting backend integration.

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

## Features

### AI PM Readiness Check (November 2025)

A comprehensive assessment system that evaluates student preparedness for AI Product Management roles across 8 skill dimensions. This serves as a lead generation tool and helps students understand their gaps.

**Key Capabilities:**
- **24 Assessment Questions**: 3 questions per dimension across 8 skill areas (Product Thinking, AI/ML Fundamentals, Data & Metrics, User Research, Product Strategy, Communication, Technical Collaboration, Ethics & Responsible AI)
- **5-Point Likert Scale**: Responses range from "Not yet, this is new to me" (1 point) to "I can do this confidently and explain it to others" (5 points)
- **Scoring & Banding**: Total score out of 120 points, mapped to 4 readiness bands:
  - 96-120: Internship Ready
  - 72-95: On Track
  - 48-71: Building Foundation
  - 0-47: Early Explorer
- **Autosave & Resume**: Answers automatically saved after each question; users can resume incomplete assessments
- **Start Fresh**: Users can discard incomplete attempts and restart from scratch
- **Personalized Results**: Dimension-level breakdown showing scores and gaps, with contextual CTAs based on readiness band
- **Auth Integration**: Uses existing resources_users authentication system with JWT tokens
- **Shareable Results**: Viral sharing feature for lead generation with privacy-first design

**Frontend Pages:**
- `/ai-pm-readiness`: Landing page with hero, benefits, and CTA
- `/ai-pm-readiness/start`: Intro screen with format explanation and resume/start fresh options
- `/ai-pm-readiness/questions`: Question runner with one question per screen, progress tracking, and auto-advance
- `/ai-pm-readiness/results/:attemptId`: Results page with total score, readiness band, dimension breakdown, share buttons, and CTAs
- `/ai-pm-readiness/share/:shareToken`: Public share page showing first name + initial, readiness band, score range, and CTA

**Backend API:**
- `GET /api/assessment/questions`: Returns all 24 questions
- `POST /api/assessment/attempts`: Creates new attempt or returns existing incomplete
- `DELETE /api/assessment/attempts/incomplete`: Clears user's incomplete attempt
- `POST /api/assessment/answers/:attemptId`: Saves answer with autosave
- `POST /api/assessment/complete/:attemptId`: Completes attempt, calculates scores, and generates unique shareToken
- `GET /api/assessment/results/:attemptId`: Returns results with dimension analysis (authenticated)
- `GET /api/assessment/resume`: Checks for incomplete attempts
- `GET /api/assessment/share/:shareToken`: Public endpoint returning display name, readiness band, score range (no authentication required)

**Shareable Results Feature (November 2025):**
- **Unique Share Links**: Each completed assessment gets a unique shareToken generated via nanoid
- **Privacy-First Design**: Public share page only shows first name + last initial (e.g., "John D."), readiness band, and score range
- **Viral Sharing Options**: 
  - LinkedIn sharing with pre-filled text
  - WhatsApp sharing via deep link
  - Copy link with clipboard API and toast feedback
- **Lead Generation**: Public share page includes prominent CTA to take assessment, driving new signups
- **No Authentication Required**: Share pages are publicly accessible without login to maximize viral reach

**Technical Implementation:**
- Database: 3 tables (assessment_questions, assessment_attempts with shareToken field, assessment_answers) with proper FK constraints
- Authentication: Assessment routes protected with JWT middleware; share endpoint is public
- Validation: Zod schemas for request/response validation
- State Management: React Query for server state, local state for UI
- Error Handling: Proper loading states, error boundaries, and user feedback
- Privacy: Only first name + initial exposed publicly, full data requires authentication

### Landing Page Redesign - Three-Fold Structure (November 2025)

The landing page hero has been redesigned with a three-fold structure for improved conversion and user experience:

**Fold 1 - Hero Section:**
- **Gradient Glow**: Subtle radial gradient blur behind headline for premium visual anchor
- **Element Order**: Headline → Subheadline → Primary CTA → Secondary CTA → Social proof → Cohort info → Secondary links
- **Updated Copy**: "Become interview-ready for AI Product roles in 30 days" with "Designed for non-tech students & recent graduates"
- **Primary CTA**: "Contact on WhatsApp" button with WhatsApp icon, opens wa.me link to 919398354912 with pre-filled message. Full-width on mobile (375px edge-to-edge, sharp corners), centered on desktop (448px, rounded corners)
- **Secondary CTA**: "Download Free Resources" button with Download icon, links to /resources page. Outline variant with glass-morphism styling (white/10 background, backdrop blur). Same width behavior as primary CTA
- **Social Proof**: Light styling with icon, "Trusted by 200+ students from IITs, BITS, NITs & IIITs" - appears AFTER CTAs
- **Cohort Info**: Simple text line with calendar icon, "Next cohort starts: December 2, 2025" (not a card)
- **Secondary Links**: Inline text links with subtle grey styling - "Schedule a call · Take the AI PM Readiness Check"
- **Spacing**: Mobile-first vertical rhythm (16/20px headline-sub, 12/16px CTA-social, 8/12px between others, 32/40px gap to next section)

**Fold 2 - Why Bcalm Works:**
- New `WhyBcalmWorksSection` component with heading and subtitle
- **Card 1 - Instructor**: "Learn from a Product Leader" with 3 credentials bullets (Rakesh Malloju from Zepto, 8+ years experience, real AI PM career coach)
- **Card 2 - Shortlist**: "10x Your Shortlist Chances" with 3 outcome bullets (portfolio projects, optimized resume, insider signals)
- **Responsive Layout**: Side-by-side on desktop, stacked vertically on mobile

**Instructors Section** (positioned immediately after Why Bcalm Works):
- Heading: "Learn Directly from AI Product Leaders"
- Three instructor profiles with avatars, name, title, company, and college
- **Rakesh Malloju**: Senior Director of Product at Zepto, Musigma, IIM Calcutta (LinkedIn profile linked)
- **Aditya Singh**: Product Manager at Apollo247, IIT Delhi (LinkedIn profile linked)
- **Akhil Joy**: Head of Design (UI/UX) at Swiggy, Uber, Zepto, MGU (LinkedIn profile linked)
- Three-column grid on desktop, stacked on mobile
- Hover elevation effect on cards

**Fold 3 - Sticky Quicklinks:**
- New `StickyQuicklinks` component that becomes sticky (fixed position) when scrolling
- **Navigation Links**: Overview, Curriculum, Instructor, Outcomes, Reviews, Pricing, FAQ
- **Anchors**: Links to section IDs (#about, #curriculum, #instructors, #career-support, #reviews, #pricing, #why-bcalm)
- **Mobile**: Horizontally scrollable on narrow screens, fixed at top when sticky

**Technical Implementation:**
- Responsive CTA using `w-screen -ml-4 md:w-full md:ml-0` for true full-width on mobile
- Framer Motion animations for smooth hero element transitions
- Tailwind responsive breakpoints (md: 768px) for mobile-first design
- Tested and verified at 375px mobile and 1024px desktop viewports
- Testing: E2E tests with Playwright covering full flow including public share page