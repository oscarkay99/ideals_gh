import type { RouteObject } from "react-router-dom";
import AppShell from "@/components/feature/AppShell";
import NotFound from "../pages/NotFound";
import SignInPage from "../pages/signin/page";
import UsersPage from "../pages/users/page";
import AuthGuard from "../components/feature/AuthGuard";
import DashboardPage from "../pages/dashboard/page";
import StorefrontPage from "../pages/storefront/page";
import ProductDetailPage from "../pages/product-detail/page";
import PaymentsPage from "../pages/payments/page";
import AIStudioPage from "../pages/ai-studio/page";
import SettingsPage from "../pages/settings/page";
import MarketingPage from "../pages/marketing/page";
import InventoryPage from "../pages/inventory/page";
import LeadsPage from "../pages/leads/page";
import SalesPage from "../pages/sales/page";
import CustomersPage from "../pages/customers/page";
import TeamPage from "../pages/team/page";
import RepairsPage from "../pages/repairs/page";
import AnalyticsPage from "../pages/analytics/page";
import AuthenticationPage from "../pages/authentication/page";
import TradeInPage from "../pages/tradein/page";
import PriceIntelPage from "../pages/priceintel/page";
import WalletPage from "../pages/wallet/page";
import DeliveryPage from "../pages/delivery/page";
import LoyaltyPage from "../pages/loyalty/page";
import ExpensesPage from "../pages/expenses/page";
import CalendarPage from "../pages/calendar/page";
import POSPage from "../pages/pos/page";
import SuppliersPage from "../pages/suppliers/page";
import WarrantyPage from "../pages/warranty/page";
import ReportsPage from "../pages/reports/page";
import ProfilePage from "../pages/profile/page";
import AccessDeniedPage from "../pages/AccessDenied";
import AuditLogsPage from "../pages/audit-logs/page";

const routes: RouteObject[] = [
  { path: "/signin", element: <SignInPage /> },
  { path: "/store", element: <StorefrontPage /> },
  { path: "/store/catalog", element: <StorefrontPage /> },
  { path: "/store/product/:id", element: <ProductDetailPage /> },
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <AuthGuard requiredModule="Dashboard"><DashboardPage /></AuthGuard> },
      { path: "/access-denied", element: <AuthGuard><AccessDeniedPage /></AuthGuard> },
      { path: "/users", element: <AuthGuard requiredModule="Users"><UsersPage /></AuthGuard> },
      { path: "/analytics", element: <AuthGuard requiredModule="Analytics"><AnalyticsPage /></AuthGuard> },
      { path: "/inventory", element: <AuthGuard requiredModule="Inventory"><InventoryPage /></AuthGuard> },
      { path: "/leads", element: <AuthGuard requiredModule="Leads"><LeadsPage /></AuthGuard> },
      { path: "/sales", element: <AuthGuard requiredModule="Sales"><SalesPage /></AuthGuard> },
      { path: "/payments", element: <AuthGuard requiredModule="Payments"><PaymentsPage /></AuthGuard> },
      { path: "/customers", element: <AuthGuard requiredModule="Customers"><CustomersPage /></AuthGuard> },
      { path: "/repairs", element: <AuthGuard requiredModule="Repairs"><RepairsPage /></AuthGuard> },
      { path: "/marketing", element: <AuthGuard requiredModule="Marketing"><MarketingPage /></AuthGuard> },
      { path: "/ai-studio", element: <AuthGuard requiredModule="AI Studio"><AIStudioPage /></AuthGuard> },
      { path: "/team", element: <AuthGuard requiredModule="Team"><TeamPage /></AuthGuard> },
      { path: "/settings", element: <AuthGuard requiredModule="Settings"><SettingsPage /></AuthGuard> },
      { path: "/authentication", element: <AuthGuard requiredModule="Authentication"><AuthenticationPage /></AuthGuard> },
      { path: "/trade-in", element: <AuthGuard requiredModule="Trade-In"><TradeInPage /></AuthGuard> },
      { path: "/price-intel", element: <AuthGuard requiredModule="Price Intel"><PriceIntelPage /></AuthGuard> },
      { path: "/wallet", element: <AuthGuard requiredModule="Wallet"><WalletPage /></AuthGuard> },
      { path: "/delivery", element: <AuthGuard requiredModule="Delivery"><DeliveryPage /></AuthGuard> },
      { path: "/loyalty", element: <AuthGuard requiredModule="Loyalty"><LoyaltyPage /></AuthGuard> },
      { path: "/expenses", element: <AuthGuard requiredModule="Expenses"><ExpensesPage /></AuthGuard> },
      { path: "/calendar", element: <AuthGuard requiredModule="Calendar"><CalendarPage /></AuthGuard> },
      { path: "/pos", element: <AuthGuard requiredModule="POS"><POSPage /></AuthGuard> },
      { path: "/suppliers", element: <AuthGuard requiredModule="Suppliers"><SuppliersPage /></AuthGuard> },
      { path: "/warranty", element: <AuthGuard requiredModule="Warranty"><WarrantyPage /></AuthGuard> },
      { path: "/reports", element: <AuthGuard requiredModule="Reports"><ReportsPage /></AuthGuard> },
      { path: "/audit-logs", element: <AuthGuard requiredModule="Audit Logs"><AuditLogsPage /></AuthGuard> },
      { path: "/profile", element: <AuthGuard><ProfilePage /></AuthGuard> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
