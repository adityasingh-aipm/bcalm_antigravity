# Bcalm - AI Product Manager Launchpad

## Overview

Production-ready landing page for "Bcalm's AI Product Manager Launchpad" - a 30-day intensive educational program targeting students and recent graduates from top-tier Indian colleges (IITs, BITS, NITs, IIITs) who want to break into AI Product Management roles. The landing page features comprehensive program information with smooth-scroll navigation, detailed curriculum, career support offerings, testimonials, instructor profiles, pricing, and enrollment functionality.

## Recent Changes (November 2025)

**Major Content Enrichments Completed:**
- Updated branding from "AI PM Launchpad" to "Bcalm" throughout all components
- Added CareerSupportSection with 4-card grid (Resume, Portfolio, Interview Prep, Job Board)
- Expanded CurriculumSection to show detailed 4-week breakdown with expandable cards containing learning outcomes and assignments
- Created WhyBcalmSection with comparison table (Traditional Bootcamps vs. Bcalm)
- Expanded TestimonialsSection from 3 to 6 student reviews with AI-generated avatars
- Created PricingSection with ₹14,999 pricing (₹24,999 strikethrough), comprehensive feature checklist, and dual CTAs
- Implemented quick links navigation bar in hero section for smooth scrolling to all major sections
- Added proper section IDs for anchor navigation (#career-support, #about, #curriculum, #why-bcalm, #reviews, #instructors, #pricing)
- Enhanced accessibility with aria-expanded attributes on curriculum toggles and proper anchor tags
- Comprehensive end-to-end testing completed and passed

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. The application currently has two routes: a landing page (`/`) and a 404 not-found page.

**State Management**: React Query (TanStack Query) for server state management and data fetching. Local component state managed with React hooks (`useState`, `useEffect`).

**UI Component Library**: Shadcn UI (New York style variant) built on Radix UI primitives, providing accessible, customizable components. The design system uses a comprehensive set of pre-built components (buttons, dialogs, cards, forms, etc.) with Tailwind CSS for styling.

**Styling Approach**: Tailwind CSS with a custom design system that includes:
- CSS custom properties for theming (colors, shadows, spacing)
- Design tokens defined in CSS variables (HSL color format)
- Responsive breakpoints following Tailwind's default system
- Custom color palette featuring primary violet (#6a3df0) and navy (#0b132b) accents
- Typography using Inter and Poppins fonts from Google Fonts

**Animation**: Framer Motion for scroll-triggered animations, page transitions, and interactive UI elements.

**Component Structure**: Page-level components in `client/src/pages/`, reusable UI components in `client/src/components/`, and Shadcn UI primitives in `client/src/components/ui/`. 

**Landing Page Sections (in order)**:
1. **HeroSection** - Hero with headline, dual CTAs (Join Waitlist, Schedule Call), and quick links navigation bar for smooth scrolling
2. **CareerSupportSection** (id="career-support") - 4-card grid showing Resume Optimization, Portfolio Building, Interview Prep, and Job Board access
3. **AboutSection** (id="about") - Program overview and value proposition
4. **CurriculumSection** (id="curriculum") - Detailed 4-week breakdown with expandable cards showing What You Learn (bullets), Outcome, and Hands-on Assignment for each week
5. **WhyBcalmSection** (id="why-bcalm") - Comparison table contrasting Traditional Bootcamps vs. Bcalm benefits
6. **TestimonialsSection** (id="reviews") - 6 student testimonials with AI-generated avatars from IIT, BITS, NIT, IIIT students
7. **InstructorsSection** (id="instructors") - 3 instructor profiles with AI-generated headshots (Google, Microsoft, AI Startup backgrounds)
8. **PricingSection** (id="pricing") - Pricing card with ₹14,999 (special cohort price from ₹24,999), 13-item feature checklist, 7-day refund guarantee, and dual CTAs
9. **CTASection** - Final enrollment call-to-action
10. **Footer** - Branding, legal links, social media, and contact information

**Generated Assets**: 10 AI-generated images including hero background, 3 instructor headshots, and 6 student testimonial avatars stored in `attached_assets/generated_images/`.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**Server Setup**: Custom Vite middleware integration for development with HMR (Hot Module Replacement). Production builds serve static assets from the `dist/public` directory.

**API Structure**: RESTful API pattern with routes prefixed with `/api`. Currently, the route registration system is set up but minimal routes are implemented - the backend is prepared for future expansion.

**Data Storage**: In-memory storage implementation (`MemStorage` class) for development. The storage interface defines CRUD operations for users, designed to be easily swapped with a database implementation.

**Session Management**: Connect-pg-simple dependency included for PostgreSQL session storage (prepared for future use).

### Data Storage

**Database ORM**: Drizzle ORM configured for PostgreSQL with schema definitions in TypeScript.

**Database Provider**: Configured to use Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`.

**Schema Design**: Simple user schema with id, username, and password fields. Uses PostgreSQL's `gen_random_uuid()` for primary key generation. Schema validation with Zod through drizzle-zod.

**Migration Strategy**: Drizzle Kit configured with migrations output to `./migrations` directory. Schema push command available via `npm run db:push`.

**Current Implementation**: The application uses in-memory storage for development, but the database infrastructure is configured and ready for production use when `DATABASE_URL` environment variable is provided.

### Form Handling & Validation

**Form Library**: React Hook Form with Zod resolvers for schema-based validation.

**User Interactions**: Two primary user actions captured through dialog forms:
1. Waitlist signup (name, email, college, phone)
2. Schedule a call (same fields)

Both forms use local state, display toast notifications on submission, and currently log data to console (prepared for backend integration).

### Path Aliases & Module Resolution

**TypeScript/Vite Aliases**:
- `@/*` → `client/src/*` (frontend code)
- `@shared/*` → `shared/*` (shared types/schemas)
- `@assets/*` → `attached_assets/*` (images and assets)

This allows clean imports throughout the application without relative path complexity.

## External Dependencies

### UI & Styling

- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Class Variance Authority (CVA)**: For creating variant-based component APIs
- **Framer Motion**: Animation library for React
- **Embla Carousel**: Carousel/slider functionality
- **React Icons**: Icon library (using Simple Icons for social media)
- **Lucide React**: Icon set for UI elements

### Form & Data Management

- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **TanStack React Query**: Server state management and data fetching
- **Date-fns**: Date manipulation and formatting

### Backend & Database

- **Express**: Web application framework
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **@neondatabase/serverless**: Neon's serverless PostgreSQL driver
- **Connect-pg-simple**: PostgreSQL session store for Express

### Development Tools

- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type-safe JavaScript
- **TSX**: TypeScript executor for Node.js
- **ESBuild**: JavaScript bundler for production builds
- **Replit Plugins**: Development banner, error overlay, and cartographer for Replit environment

### Design System References

The visual design draws inspiration from premium educational platforms (Reforge, Maven, Product School) with emphasis on:
- Clean, minimal layouts with generous whitespace
- Premium typography hierarchy
- Aspirational, credible aesthetic
- Mobile-first responsive design
- Smooth animations and hover effects