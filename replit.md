# Bcalm - AI Product Manager Launchpad

## Overview

This project delivers a production-ready landing page for "Bcalm's AI Product Manager Launchpad," a 30-day intensive educational program aimed at students and recent graduates from top-tier Indian colleges (IITs, BITS, NITs, IIITs) aspiring to AI Product Management roles. The platform provides comprehensive program information, including a detailed curriculum, career support, testimonials, instructor profiles, pricing, and enrollment functionality, all accessible via smooth-scroll navigation. Additionally, the platform features an **AI PM Readiness Check** assessment system that evaluates student preparedness across 8 skill dimensions, serving as a lead generation tool with personalized results and gap analysis. The business vision is to equip emerging talent with the skills needed to excel in AI Product Management, tapping into a high-growth market for specialized education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing. State management relies on React Query for server state and React hooks for local component state. UI components are developed using Shadcn UI (New York style) built on Radix UI primitives, ensuring accessibility and customizability. Styling is managed with Tailwind CSS, incorporating a custom design system with CSS variables for theming, a primary violet and navy color palette, and Inter/Poppins fonts. Framer Motion is used for animations. The landing page is structured into multiple sections: Hero, Career Support, About, Curriculum, Why Bcalm, Testimonials, Instructors, Pricing, and a final CTA, all designed with a mobile-first, responsive approach. Key visual design inspirations include Reforge and hellopm.co, focusing on clean, minimal layouts, premium typography, and an aspirational aesthetic with a tiered spacing system for optimal readability and professionalism.

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

**Frontend Pages:**
- `/ai-pm-readiness`: Landing page with hero, benefits, and CTA
- `/ai-pm-readiness/start`: Intro screen with format explanation and resume/start fresh options
- `/ai-pm-readiness/questions`: Question runner with one question per screen, progress tracking, and auto-advance
- `/ai-pm-readiness/results/:attemptId`: Results page with total score, readiness band, dimension breakdown, and CTAs

**Backend API:**
- `GET /api/assessment/questions`: Returns all 24 questions
- `POST /api/assessment/attempts`: Creates new attempt or returns existing incomplete
- `DELETE /api/assessment/attempts/incomplete`: Clears user's incomplete attempt
- `POST /api/assessment/answers/:attemptId`: Saves answer with autosave
- `POST /api/assessment/complete/:attemptId`: Completes attempt and calculates scores
- `GET /api/assessment/results/:attemptId`: Returns results with dimension analysis
- `GET /api/assessment/resume`: Checks for incomplete attempts

**Technical Implementation:**
- Database: 3 new tables with proper FK constraints and cascade deletes
- Authentication: All routes protected with JWT middleware
- Validation: Zod schemas for request/response validation
- State Management: React Query for server state, local state for UI
- Error Handling: Proper loading states, error boundaries, and user feedback
- Testing: E2E tests with Playwright covering full flow, autosave, and start fresh