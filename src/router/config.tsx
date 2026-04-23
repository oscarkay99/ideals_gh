import type { RouteObject } from "react-router-dom";
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
import WhatsAppPage from "../pages/whatsapp/page";
import InstagramPage from "../pages/instagram/page";
import AuthenticationPage from "../pages/authentication/page";
import TradeInPage from "../pages/tradein/page";
import PriceIntelPage from "../pages/priceintel/page";
import WalletPage from "../pages/wallet/page";
import DeliveryPage from "../pages/delivery/page";
import TikTokPage from "../pages/tiktok/page";
import SMSPage from "../pages/sms/page";
import LoyaltyPage from "../pages/loyalty/page";
import ExpensesPage from "../pages/expenses/page";
import CalendarPage from "../pages/calendar/page";
import POSPage from "../pages/pos/page";
import SuppliersPage from "../pages/suppliers/page";
import WarrantyPage from "../pages/warranty/page";
import ReportsPage from "../pages/reports/page";
import ProfilePage from "../pages/profile/page";

const routes: RouteObject[] = [
  { path: "/signin", element: <SignInPage /> },
  {
    path: "/",
    element: <AuthGuard><DashboardPage /></AuthGuard>,
  },
  {
    path: "/users",
    element: <AuthGuard><UsersPage /></AuthGuard>,
  },
  { path: "/analytics", element: <AuthGuard><AnalyticsPage /></AuthGuard> },
  { path: "/inventory", element: <AuthGuard><InventoryPage /></AuthGuard> },
  { path: "/leads", element: <AuthGuard><LeadsPage /></AuthGuard> },
  { path: "/sales", element: <AuthGuard><SalesPage /></AuthGuard> },
  { path: "/payments", element: <AuthGuard><PaymentsPage /></AuthGuard> },
  { path: "/customers", element: <AuthGuard><CustomersPage /></AuthGuard> },
  { path: "/repairs", element: <AuthGuard><RepairsPage /></AuthGuard> },
  { path: "/marketing", element: <AuthGuard><MarketingPage /></AuthGuard> },
  { path: "/ai-studio", element: <AuthGuard><AIStudioPage /></AuthGuard> },
  { path: "/team", element: <AuthGuard><TeamPage /></AuthGuard> },
  { path: "/settings", element: <AuthGuard><SettingsPage /></AuthGuard> },
  { path: "/whatsapp", element: <AuthGuard><WhatsAppPage /></AuthGuard> },
  { path: "/instagram", element: <AuthGuard><InstagramPage /></AuthGuard> },
  { path: "/authentication", element: <AuthGuard><AuthenticationPage /></AuthGuard> },
  { path: "/trade-in", element: <AuthGuard><TradeInPage /></AuthGuard> },
  { path: "/price-intel", element: <AuthGuard><PriceIntelPage /></AuthGuard> },
  { path: "/wallet", element: <AuthGuard><WalletPage /></AuthGuard> },
  { path: "/delivery", element: <AuthGuard><DeliveryPage /></AuthGuard> },
  { path: "/store", element: <StorefrontPage /> },
  { path: "/store/catalog", element: <StorefrontPage /> },
  { path: "/store/product/:id", element: <ProductDetailPage /> },
  { path: "/tiktok", element: <AuthGuard><TikTokPage /></AuthGuard> },
  { path: "/sms", element: <AuthGuard><SMSPage /></AuthGuard> },
  { path: "/loyalty", element: <AuthGuard><LoyaltyPage /></AuthGuard> },
  { path: "/expenses", element: <AuthGuard><ExpensesPage /></AuthGuard> },
  { path: "/calendar", element: <AuthGuard><CalendarPage /></AuthGuard> },
  { path: "/pos", element: <AuthGuard><POSPage /></AuthGuard> },
  { path: "/suppliers", element: <AuthGuard><SuppliersPage /></AuthGuard> },
  { path: "/warranty", element: <AuthGuard><WarrantyPage /></AuthGuard> },
  { path: "/reports", element: <AuthGuard><ReportsPage /></AuthGuard> },
  { path: "/profile", element: <AuthGuard><ProfilePage /></AuthGuard> },
  { path: "*", element: <NotFound /> },
];

export default routes;
