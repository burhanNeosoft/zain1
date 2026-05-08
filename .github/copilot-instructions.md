<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructions-md-file -->

# AI Agent Instructions for Zain1 Project

**Project:** Zainab Najmi's professional website & booking system  
**Stack:** Next.js 15 (App Router) | TypeScript | Tailwind CSS | MongoDB (Mongoose) | Nodemailer

## Architecture Overview

This is a professional services booking platform with three main layers:

- **Public Pages** (`/src/app/page.tsx`, `/contact-us`, `/buba`): Marketing/contact pages using client-side state for slot selection
- **Admin Panel** (`/src/app/admin/(protected)/*`): Protected route requiring cookie-based auth; manages slots and views contacts
- **APIs** (`/src/app/api/*`): Next.js Route Handlers using Mongoose for MongoDB operations

### Critical Data Models
- **Slot**: Date (YYYY-MM-DD) + Time (HH:MM-HH:MM) range; tracks booking status; unique compound index on (date, time)
- **Contact**: Form submissions stored in MongoDB; used by admin dashboard to review inquiries
- **Booking**: Links Slots to client details; currently minimal but scaffolded for future payment integration

## Key Conventions & Patterns

### Database & Connectivity
- MongoDB URI via `MONGODB_URI` env var; database name via `DB_NAME` (defaults to 'zain1')
- Mongoose connection cached globally (see `src/lib/mongodb.ts`); avoid reconnecting in every request
- All models prevent double-instantiation: `mongoose.models.ModelName || mongoose.model('ModelName', schema)`
- Slot schema enforces formats: date `YYYY-MM-DD`, time `HH:MM-HH:MM` (use regex validators)

### API Patterns
- **Admin Login** (`/api/admin/login`): Simple email/password check; sets `admin-auth=true` cookie (8-hour maxAge, httpOnly)
- **GET /api/admin/slots**: Fetch all slots (with optional `?date` query param for filtering)
- **POST /api/admin/slots**: Create new slots; body: `{date, times: string[]}`
- **DELETE /api/admin/slots**: Cleanup past unbooked slots (called by home page via `fetch`)
- **POST /api/contact**: Save contact form + send email (currently uses Gmail with app password)
- **GET /api/admin/slots/archive**: Fetch attended slots with booking details via aggregation pipeline

### Protected Routes
- Admin routes protected via cookie check in `src/app/admin/(protected)/layout.tsx`: `redirect("/admin/login")` if `admin-auth !== "true"`
- Use `cookies()` from `next/headers` (server-side only); no JWT, just session cookie

### Client-Side State & Slots
- Home page (`page.tsx`): Fetches available slots via `fetchAvailableSlots()`; groups by date, filters booked ones, displays in collapsible panels
- Time format conversions: `to12h()` for 24→12-hour display; `to12hRange()` for slot ranges
- Slot grouping: `reduce()` with date as key to organize for UI display

### Styling & Theme
- Tailwind CSS v4 with postcss plugin; dark mode supported via `dark:` prefix
- Theme context in `src/app/theme-context.ts` + `ThemeProvider` for theme switching
- SCSS modules for complex components (e.g., `components/quotation/`, `WhyBuyOnline.module.scss`)
- No component library; build inline with Tailwind or use `react-icons` for SVG icons

## Development Workflow

**Start dev server:** `npm run dev` (runs Next.js on port 3000 with Turbopack)  
**Build:** `npm run build`  
**Lint:** `npm run lint` (ESLint via Next.js config)

### Common Tasks
- **Add a new slot**: POST to `/api/admin/slots` with `{date: "2026-05-10", times: ["09:00-09:30", ...]}`
- **Create admin page**: Use `(protected)` layout group; auth is automatic via layout redirect
- **Fetch data server-side**: Use `fetch` in Server Components; rely on MongoDB models for queries (no separate ORM layers)
- **Update Mongoose schema**: Add fields to model → let client pass data → validate in API handler

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name (defaults to 'zain1')
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: For `/api/admin/login`
- `GOOGLE_APP_PASS`: Gmail app password for contact form emails
- `NEXT_PUBLIC_BASE_URL`: Public app URL; used in SSR fetch calls (e.g., admin dashboard)

## Common Mistakes to Avoid

1. **Don't re-export Mongoose models:** Use the pattern `mongoose.models.X || mongoose.model('X', ...)` to prevent errors
2. **Don't create unprotected admin routes:** Always wrap in `(protected)` layout with cookie check
3. **Don't use absolute positioning for layouts:** Tailwind flexbox/grid; `flex`, `justify-center`, `items-center`
4. **Don't fetch slots every render:** Use `useEffect` with dependency array; fetch once on mount
5. **Date format consistency:** Always store as `YYYY-MM-DD` strings; validate in schema
6. **Timezone handling:** Dates are naive strings; no timezone conversion—assumes user's local date input

## File Structure Reference

```
src/app/
  ├─ page.tsx                    # Home/booking page; slot display & contact form
  ├─ api/
  │  ├─ admin/
  │  │  ├─ login/route.ts        # Cookie-based auth
  │  │  ├─ logout/route.ts
  │  │  └─ slots/
  │  │     ├─ route.ts           # GET/POST/DELETE slots
  │  │     └─ archive/route.ts   # GET attended slots via aggregation
  │  └─ contact/route.ts         # POST contact form
  ├─ admin/(protected)/
  │  ├─ layout.tsx               # Auth check; cookie redirect
  │  ├─ dashboard/page.tsx       # Contact list view
  │  └─ slots/page.tsx           # Slot management UI
  └─ contact-us/page.tsx         # Contact page
src/components/
  ├─ SlotManagement.tsx          # Admin slot creation form
  ├─ ArchiveSlots.tsx            # Admin attended slots table
  └─ quotation/                  # Quotation/pricing components
src/models/
  ├─ Slot.ts                     # Mongoose schema + cleanup statics
  ├─ Contact.ts
  └─ Booking.ts
src/lib/
  └─ mongodb.ts                  # Cached Mongoose connection
```
