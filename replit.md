# Bcalm - AI Product Manager Launchpad

## Overview

This project delivers a production-ready landing page for "Bcalm's AI Product Manager Launchpad," a 30-day intensive educational program aimed at students and recent graduates from top-tier Indian colleges (IITs, BITS, NITs, IIITs) aspiring to AI Product Management roles. The platform provides comprehensive program information, including a detailed curriculum, career support, testimonials, instructor profiles, pricing, and enrollment functionality, all accessible via smooth-scroll navigation. The business vision is to equip emerging talent with the skills needed to excel in AI Product Management, tapping into a high-growth market for specialized education.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for development and bundling. Wouter handles client-side routing. State management relies on React Query for server state and React hooks for local component state. UI components are developed using Shadcn UI (New York style) built on Radix UI primitives, ensuring accessibility and customizability. Styling is managed with Tailwind CSS, incorporating a custom design system with CSS variables for theming, a primary violet and navy color palette, and Inter/Poppins fonts. Framer Motion is used for animations. The landing page is structured into multiple sections: Hero, Career Support, About, Curriculum, Why Bcalm, Testimonials, Instructors, Pricing, and a final CTA, all designed with a mobile-first, responsive approach. Key visual design inspirations include Reforge and hellopm.co, focusing on clean, minimal layouts, premium typography, and an aspirational aesthetic with a tiered spacing system for optimal readability and professionalism.

### Backend Architecture

The backend utilizes Express.js with TypeScript on Node.js. It integrates custom Vite middleware for development with HMR. The API follows a RESTful pattern. Data storage is currently an in-memory solution (`MemStorage`) for development, with a clear interface for future database integration.

### Data Storage

The application is configured with Drizzle ORM for PostgreSQL, using Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`. A simple user schema is defined with `id`, `username`, and `password` fields, leveraging PostgreSQL's `gen_random_uuid()` and Zod for schema validation. Drizzle Kit is set up for migrations. The system is designed to seamlessly transition from in-memory storage to a production database by configuring the `DATABASE_URL` environment variable.

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