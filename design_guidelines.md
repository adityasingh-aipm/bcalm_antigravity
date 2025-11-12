# AI Product Manager Launchpad - Design Guidelines

## Design Approach
**Reference-Based Approach**: Draw inspiration from premium educational platforms Reforge, Maven, and Product School - clean, minimal, aspirational layouts that convey credibility and exclusivity.

## Visual Identity

**Color Palette:**
- Primary background: White (#FFFFFF)
- Primary accent: Dark Navy (#0b132b)
- Secondary accent: Bright Violet (#6a3df0)
- Use violet for CTAs, highlights, and interactive elements
- Use navy for headings and primary text

**Typography:**
- Font Family: Inter or Poppins from Google Fonts
- Heading hierarchy: Bold weights (600-700) for impact
- Body text: Regular (400) and Medium (500) weights
- Generous line-height for readability (1.6-1.8)

## Layout System

**Spacing:**
- Use Tailwind units: 4, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Section padding: py-20 to py-32 on desktop, py-12 to py-16 on mobile
- Container max-width: max-w-7xl with mx-auto
- Content sections: max-w-6xl for optimal reading

**Responsive Strategy:**
- Desktop-first approach with mobile optimizations
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Component Library

### Navigation
- Sticky header with transparent-to-solid transition on scroll
- Logo left, navigation links center, dual CTAs right
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
- Full viewport height (90vh) with AI-themed background illustration (neural network pattern or product UI overlay)
- Centered content with bold headline, compelling subheadline
- Dual gradient buttons: "Join the Waitlist" (primary violet) and "Schedule a Call" (outlined navy)
- Metrics badges displaying "200+ students registered" and "Next Cohort: December 2, 2025"
- Subtle background: Abstract AI neural network visualization or geometric patterns in light gradients

### Cards & Grid Layouts
- 4-column grid for "Why This Program" highlights (2 columns on tablet, 1 on mobile)
- 3-column layout for testimonials and instructor profiles
- Elevated cards with subtle shadows, hover lift animations
- Icons/emojis for visual hierarchy in feature cards

### Testimonials
- Student quote cards with profile placeholder images (circular avatars)
- Name, college, and degree displayed below quotes
- Soft background tints for card differentiation

### Instructor Profiles
- Professional headshot placeholders (square or circular)
- Name, title, company clearly displayed
- Brief bio or expertise areas
- LinkedIn icon links

### CTAs & Forms
- Gradient buttons (violet to lighter violet) with white text
- Modal popup for "Schedule a Call" form with fields: Name, Email, College, Phone
- WhatsApp and email contact icons with hover states
- Newsletter signup in footer

### Footer
- Multi-column layout: Brand/description, Quick Links, Social Media, Contact
- Social icons: LinkedIn, Twitter, Instagram
- Legal links: Terms, Privacy Policy, Contact
- Copyright notice: © 2025 AI Product Manager Launchpad

## Animations & Interactions

**Framer Motion Effects:**
- Smooth scroll behavior throughout
- Fade-in-up animations for section entries (stagger children)
- Hover lift on cards (translateY -4px)
- Button hover: slight scale (1.02) and glow effect
- Gradient button transitions

**Scroll Interactions:**
- Sticky navigation with background opacity change
- Parallax effect on hero background (subtle)
- Progressive reveal of sections as user scrolls

## Content Strategy

### Tone & Voice
- Aspirational and elite positioning
- Credibility through instructor credentials and student testimonials
- FOMO elements: "Limited seats", "Hand-picked students", cohort deadlines
- Professional yet approachable language

### Section Flow
1. Hero with immediate value proposition and social proof
2. About Program (2-3 paragraphs establishing credibility)
3. Curriculum Overview (4-week breakdown with downloadable CTA)
4. Why This Program (4 key differentiators)
5. Student Testimonials (3 authentic quotes)
6. Instructor Showcase (3 AI Product Leaders)
7. Final CTA (dual action: waitlist + call scheduling)
8. Footer (comprehensive links and contact)

## Images

**Hero Background:**
- Large, full-width AI-themed illustration (neural network patterns, geometric AI visualization, or abstract product interface mockups)
- Semi-transparent overlay to ensure text readability
- Gradient from transparent to white at bottom for seamless transition

**Instructor Photos:**
- Professional headshots (300x300px minimum)
- Circular or rounded square frames
- Placeholder: Professional silhouettes with initials

**Testimonial Avatars:**
- Student profile photos (150x150px)
- Circular frames
- Placeholder: Colorful avatar backgrounds with initials

**Buttons on Images:**
- Blurred glass-morphism backgrounds (backdrop-blur-md)
- Semi-transparent white/dark backgrounds for readability
- No additional hover blur effects (rely on button's native states)

## Accessibility & Performance
- Semantic HTML5 structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Optimized images with lazy loading
- Fast page load with minimal dependencies