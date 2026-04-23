# Phone Dealers General System

A comprehensive business management platform built specifically for phone shops and mobile device dealers. This all-in-one command center covers every aspect of running a modern phone retail business — from point-of-sale and inventory management to social media CRM, repair tracking, loyalty programs, and financial analytics.

## Overview

The Phone Dealers General System is a React-based single-page application designed to streamline operations for phone retailers. It features a dark-themed, professional dashboard interface with 32+ integrated modules that work together to give business owners complete visibility and control over their operations.

## Features

### Core Operations
- **Dashboard** — Real-time KPIs, revenue charts, AI insights panel, and live activity feed
- **POS Checkout** — Product grid, cart management, split payments, and digital receipt generation
- **Inventory Management** — Stock levels, low-stock alerts, product catalog with detail panels
- **Sales & Quotes** — Product picker, cart builder, and professional quote generation
- **Payments** — Transaction history, verification queue, and payment analytics

### Customer Management
- **Customer Database** — Contact cards, customer segments, and detailed profiles
- **Leads Pipeline** — Kanban board (Hot/Warm/Cold), AI-powered lead suggestions
- **Loyalty & Rewards** — 4-tier program, points tracking, and rewards catalog
- **Repair Booking Calendar** — Week view with appointment scheduling

### Social Media & Marketing
- **WhatsApp Command Center** — DM inbox, broadcast campaigns, and automation rules
- **Instagram Command Center** — DM inbox, post management, campaigns, and automations
- **TikTok Command Center** — DM inbox, video management, campaigns, and automations
- **SMS Campaign Center** — Campaign builder, templates, audience segments, and delivery analytics
- **Marketing Hub** — Campaign calendar, creative library, and performance analytics

### Business Intelligence
- **Analytics** — Revenue vs target tracking, sales funnel, customer segments, top products
- **AI Studio** — Content generator with template library for marketing copy
- **Price Intelligence** — Market price tracking and competitive analysis
- **Trade-In Calculator** — Device valuation and trade-in quote generation

### Financial & Operations
- **Wallet** — Balance tracking, transaction history, and top-up management
- **Expenses & Profit Tracker** — P&L statements, budget management, and financial charts
- **Purchase Orders & Suppliers** — Supplier management and order tracking
- **Reports & Export Center** — 8 report types with PDF, Excel, and CSV export
- **Delivery Tracking** — Order fulfillment and logistics monitoring

### Service & Warranty
- **Repairs** — Status tracking, repair timeline, and parts inventory
- **Warranty & Returns** — IMEI tracking, return processing, and refund management
- **Device Authentication** — Certificate verification and authenticity checking

### Team & Administration
- **Team Management** — Performance leaderboard and staff analytics
- **User Management** — Role-based access control, user creation and editing
- **Settings** — Branding, operations, templates, notifications, roles, automation, integrations, and security

### Public Storefront
- **Storefront** — Customer-facing product catalog with search and filtering
- **Product Detail Pages** — Full product information with variant selection

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Remix Icons (CDN)
- **State Management:** React Hooks + localStorage
- **Charts:** Custom chart components

## Authentication

The system includes a complete role-based authentication system with 5 demo accounts:

| Email | Password | Role | Modules |
|-------|----------|------|---------|
| admin@idealstechhub.com | admin123 | Admin | All 28 modules |
| kofi@idealstechhub.com | kofi123 | Sales Manager | 16 modules |
| abena@idealstechhub.com | abena123 | Sales Rep | 9 modules |
| ama@idealstechhub.com | ama123 | Technician | 5 modules |
| yaw@idealstechhub.com | yaw123 | Inventory Manager | 6 modules |

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Phone-dealers-general-system.git

# Navigate to project directory
cd Phone-dealers-general-system

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Supabase

Create a `.env.local` file with:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The frontend can connect with those public credentials. To create the database schema, apply [`supabase/migrations/20260423_init_core.sql`](supabase/migrations/20260423_init_core.sql) in the Supabase SQL editor or through the Supabase CLI.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── base/          # Reusable UI components
│   └── feature/       # Layout components (Sidebar, TopBar, AuthGuard)
├── hooks/             # Custom React hooks (auth, dark mode, notifications)
├── mocks/             # Mock data for all modules
├── pages/             # Page components (one folder per route)
├── router/            # Route configuration
├── i18n/              # Internationalization files
└── main.ts            # Application entry point
```

## Design System

- **Primary Blue:** `#1E5FBE`
- **Deep Navy:** `#0A1F4A`
- **Gold/Amber:** `#F5A623`
- **Light Blue:** `#EEF4FF`
- **Font:** System font stack with refined sizing (14px-16px base)
- **Border Radius:** `rounded-lg` (8px) for cards, `rounded-md` (6px) for buttons

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or feature requests, contact your system administrator.

---

Built with care for phone dealers everywhere.
