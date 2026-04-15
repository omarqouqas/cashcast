# Cashcast Technology Stack

## Core Language

**TypeScript** - Statically typed JavaScript for type safety and better developer experience.

---

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | React framework with App Router, server components, API routes |
| React | 18 | UI component library |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Lucide React | - | Icon library |
| React Hook Form | - | Form state management and validation |
| Zod | - | Schema validation (forms, API inputs) |

---

## Backend & Database

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service (PostgreSQL database, Auth, Row Level Security) |
| PostgreSQL | Relational database (via Supabase) |
| Next.js API Routes | Serverless API endpoints |

---

## Payments & Subscriptions

| Technology | Purpose |
|------------|---------|
| Stripe | Payment processing, subscription management |
| Stripe Webhooks | Subscription lifecycle events |

---

## Analytics & Monitoring

| Technology | Purpose |
|------------|---------|
| PostHog | Product analytics, user behavior tracking, feature flags |

---

## Email

| Technology | Purpose |
|------------|---------|
| Resend | Transactional email (invoice sending, notifications) |

---

## PDF & Document Generation

| Technology | Purpose |
|------------|---------|
| React PDF Renderer | Invoice PDF generation |
| pdfjs-dist | PDF bank statement parsing/import |

---

## Import/Export

| Technology | Purpose |
|------------|---------|
| XLSX | Excel file parsing (.xlsx, .xls) |
| Custom CSV parser | CSV file parsing with delimiter detection |
| pdfjs-dist | PDF text extraction |

---

## Development Tools

| Technology | Purpose |
|------------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Static type checking |

---

## Hosting & Deployment

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting, CI/CD, serverless functions |
| Supabase Cloud | Database hosting |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│  Next.js App Router + React 18 + Tailwind CSS          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js Server                        │
│  Server Components + API Routes + Server Actions        │
└──────────┬──────────────────────────────────┬───────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐          ┌───────────────────────┐
│      Supabase        │          │    External Services  │
│  - PostgreSQL DB     │          │  - Stripe (payments)  │
│  - Auth              │          │  - Resend (email)     │
│  - Row Level Security│          │  - PostHog (analytics)│
└──────────────────────┘          └───────────────────────┘
```
