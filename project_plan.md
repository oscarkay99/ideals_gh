# GadgetFlow Command Center

## 1. Project Description
GadgetFlow Command Center is a premium, full-stack gadget retail management system designed for phone, laptop, and accessory sellers in Accra, Ghana. It combines an internal staff/admin dashboard with a public customer-facing storefront and support experience. The system is built for WhatsApp-first sales culture, Mobile Money payments, and trust-driven commerce.

**Target Users**: Gadget retailers, sales reps, technicians, and customers in Ghana.
**Core Value**: Unified command center for inventory, leads, sales, payments, repairs, and customer relationships — paired with a premium public storefront.

## 2. Page Structure

### Internal (Admin/Staff)
- `/` - Dashboard (Executive Command Center)
- `/inventory` - Inventory Management
- `/leads` - Lead Pipeline
- `/sales` - Sales & Quotes
- `/payments` - Payments & Reconciliation
- `/customers` - Customer Profiles
- `/repairs` - Repair Queue
- `/marketing` - Marketing Campaigns
- `/ai-studio` - AI Studio
- `/team` - Team Performance
- `/settings` - Settings

### Public (Customer-Facing)
- `/store` - Storefront Landing Page
- `/store/catalog` - Product Catalog
- `/store/product/:id` - Product Detail
- `/store/quote/:id` - Quote Page
- `/store/order/:id` - Order Status
- `/store/warranty` - Warranty Check
- `/store/repair-tracking` - Repair Tracking
- `/auth/signin` - Sign In
- `/auth/signup` - Sign Up
- `/auth/reset` - Reset Password

## 3. Core Features
- [x] Premium dashboard with KPIs, charts, AI summary
- [x] Inventory management with condition/IMEI tracking
- [x] Lead pipeline (Hot/Warm/Cold)
- [x] Sales & quote generation
- [x] Payment tracking (MoMo, Cash, Transfer, Card)
- [x] Customer profiles with LTV and segmentation
- [x] Repair queue and tracking
- [x] Marketing campaign management
- [x] AI Studio for content generation
- [x] Team performance leaderboard
- [x] Settings and configuration
- [x] Public storefront with WhatsApp CTA
- [x] Product catalog with filters
- [x] Product detail with conversion focus
- [x] Quote, order status, warranty, repair tracking pages
- [x] Auth screens

## 4. Data Model Design
(Mock data only — no Supabase connected yet)

### Products
- id, name, category, condition, price, stock, imei, warranty, images, specs

### Leads
- id, customer, source, status (hot/warm/cold), assignedRep, lastContact, notes

### Sales/Orders
- id, customer, items, total, paymentMethod, status, deliveryType

### Payments
- id, orderId, amount, method, status, reference, date

### Customers
- id, name, phone, email, segment, ltv, purchaseCount, warrantyItems

### Repairs
- id, customer, device, issue, status, technician, eta, cost

## 5. Backend / Third-party Integration Plan
- Supabase: Not connected (Phase 2 — auth, database, real-time)
- Shopify: Not connected
- Stripe: Not connected
- WhatsApp API: Future integration for lead capture

## 6. Development Phase Plan

### Phase 1: Core UI (Current)
- Goal: Build all 6 main sections with premium UI
- Deliverable: Dashboard, Storefront, Product Detail, Payments, AI Studio, Settings

### Phase 2: Extended Internal Screens
- Goal: Inventory, Leads, Sales, Customers, Repairs, Marketing, Team
- Deliverable: All internal management screens

### Phase 3: Public Storefront Screens
- Goal: Catalog, Quote, Order Status, Warranty, Repair Tracking, Auth
- Deliverable: Complete customer-facing experience

### Phase 4: Backend Integration
- Goal: Connect Supabase for real data
- Deliverable: Auth, database, real-time updates
