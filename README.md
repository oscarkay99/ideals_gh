# Phone Dealers General System

A comprehensive business management platform built specifically for phone shops and mobile device dealers. This is an all-in-one command center for running a modern gadget retail business, combining sales, inventory, customer management, repairs, payments, marketing, reporting, and a public storefront in one system.

## Overview

The Phone Dealers General System is a React-based single-page application designed to streamline operations for phone retailers and gadget sellers. It includes an internal staff/admin workspace and a customer-facing storefront. The goal is to give business owners one place to manage day-to-day operations instead of splitting work across notebooks, spreadsheets, WhatsApp chats, and disconnected tools.

In practical terms, the system acts like a retail operating system for gadget businesses. It helps owners and staff manage:
- Sales and checkout
- Inventory and stock control
- Leads and customer relationships
- Repairs and warranty workflows
- Payments and reconciliation
- Marketing and campaign planning
- Reporting and performance tracking
- Team access and operational controls

## What The System Does

The current system covers these major business areas:

### Sales & Commerce
- **POS Checkout** — Product search, cart handling, IMEI capture, discounts, split/single payment flows, and receipt generation
- **Sales & Quotes** — Quote building, order preparation, and sales tracking
- **Inventory Management** — Product records, stock levels, low-stock visibility, condition, color, IMEI/serial tracking
- **Payments** — Transaction history, verification queue, and payment monitoring
- **Wallet** — Balance tracking and transaction history
- **Suppliers & Purchase Flow** — Supplier management and order support

### Customer & Service Operations
- **Customers** — Customer records, segmentation, and history
- **Leads Pipeline** — Lead capture, hot/warm/cold workflow, and follow-up support
- **Loyalty** — Points and rewards workflows
- **Repairs** — Repair queue, status tracking, repair notes, and timelines
- **Warranty & Returns** — Warranty checks, return handling, and device record support
- **Device Authentication** — Verification and authenticity-related workflows
- **Calendar** — Appointment and scheduling support

### Growth & Decision Support
- **Dashboard** — KPIs, live activity, and summary visibility
- **Analytics** — Revenue, customer, funnel, and performance reporting
- **AI Studio** — AI-assisted content and business prompt workflows
- **Price Intelligence** — Market-aware pricing support
- **Trade-In Calculator** — Device valuation and trade-in guidance
- **Delivery** — Delivery and fulfillment tracking support
- **Marketing** — Campaign planning, channel analytics, and creative performance
- **WhatsApp / Instagram / TikTok Workflows** — Social inbox, campaign, and automation-oriented experiences

### Team & Administration
- **Users & Roles** — Role-based access and user administration
- **Team Management** — Team visibility and performance support
- **Settings** — Branding, templates, automation, integrations, and security
- **Public Storefront** — Customer-facing product discovery and product detail pages

## What It Can Handle For A Business Owner

For a business owner, the main value is consolidation and control.

Instead of running operations across several separate tools, the system can centralize:
- Stock monitoring
- Checkout and order handling
- Quotes and payment follow-up
- Customer and lead management
- Repair tracking
- Loyalty and repeat-customer workflows
- Reporting and decision support
- Social and marketing planning
- Team permissions and activity visibility

This means the owner gets:
- **Better visibility** into what is selling, what is low in stock, what is overdue, and which customers need attention
- **Better control** over staff roles, sensitive actions, and operational consistency
- **Faster decisions** using dashboards, reports, trade-in support, and pricing insights
- **Stronger retention** through follow-up, loyalty, warranty, and repair workflows
- **Less operational leakage** from forgotten leads, missed follow-ups, untracked stock, or scattered records

## Repetitive Tasks It Reduces Or Eliminates

The system is especially useful where staff repeatedly do the same admin work. Based on the current modules, automation flows, and AI-assisted features, it helps reduce or eliminate:
- Manual lead follow-up reminders
- Manual low-stock checking
- Manual overdue payment reminders
- Manual repair completion updates
- Manual warranty expiry reminders
- Manual quote expiry reminders
- Manual lead assignment
- Manual customer lookup during checkout
- Manual upsell thinking during sales
- Manual trade-in estimation
- Manual receipt and quote preparation
- Manual sales-pattern analysis from raw transactions
- Manual campaign copy brainstorming and first-draft content generation

## Business Benefits

For owners and managers, the business benefits are:
- **Time savings** from less repetitive admin
- **Higher consistency** in follow-up, quoting, and customer handling
- **Improved accountability** through clearer records and role-based access
- **Better stock discipline** through visibility into inventory and reorder issues
- **More revenue opportunities** through upsells, loyalty, and lead management
- **Better customer experience** through quicker response, cleaner records, and more reliable service workflows
- **Improved decision quality** because the business is measured in one place

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
- **Settings** — Branding, operations, templates, roles, automation, integrations, and security

### Public Storefront
- **Storefront** — Customer-facing product catalog with search and filtering
- **Product Detail Pages** — Full product information and purchase context

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Icons:** Remix Icons (CDN)
- **State Management:** React Hooks + localStorage
- **Charts:** Custom chart components

## Current State

The current codebase is broad and capable, but not every module is equally production-complete.

### Already Present In The System
- Full internal application shell with role-based access
- Broad module coverage across retail, service, operations, and analytics
- Customer-facing storefront and product detail experience
- Mock/demo data for most modules
- Supabase-ready structure for real backend integration
- AI-assisted experiences in POS, AI Studio, and insight surfaces

### Partially Connected / Integration-Ready Areas
- Social channel OAuth/integration setup
- Supabase-backed real data in selected workflows
- Learned-pattern and AI insight persistence
- Payment, analytics, and external business integrations

### Important Note
- The README may describe some broader platform ambitions from earlier planning phases.
- The current routed app is focused on the modules visible in the codebase today.
- SMS is no longer part of the active routed application, even if some older copy or templates still mention it.

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

The application runs on `http://localhost:3000` by default. If that port is already in use, Vite automatically falls back to the next available port.

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
├── hooks/             # Custom React hooks (auth, inventory, sales, learned patterns, etc.)
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
