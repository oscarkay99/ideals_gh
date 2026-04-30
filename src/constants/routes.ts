export const ROUTES = {
  // Auth
  SIGNIN: '/signin',

  // Internal — Core
  DASHBOARD: '/',
  ANALYTICS: '/analytics',
  AI_STUDIO: '/ai-studio',

  // Internal — Commerce
  POS: '/pos',
  INVENTORY: '/inventory',
  LEADS: '/leads',
  SALES: '/sales',
  PAYMENTS: '/payments',
  CUSTOMERS: '/customers',
  REPAIRS: '/repairs',
  WARRANTY: '/warranty',

  // Internal — Intelligence
  WHATSAPP: '/whatsapp',
  INSTAGRAM: '/instagram',
  TIKTOK: '/tiktok',
  SMS: '/sms',
  PRICE_INTEL: '/price-intel',
  TRADE_IN: '/trade-in',
  DELIVERY: '/delivery',

  // Internal — Finance
  WALLET: '/wallet',
  EXPENSES: '/expenses',
  SUPPLIERS: '/suppliers',
  REPORTS: '/reports',
  MARKETING: '/marketing',

  // Internal — Growth
  LOYALTY: '/loyalty',
  CALENDAR: '/calendar',

  // Internal — Operations
  AUTHENTICATION: '/authentication',
  TEAM: '/team',
  USERS: '/users',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Public Storefront
  STORE: '/store',
  STORE_CATALOG: '/store/catalog',
  STORE_PRODUCT: (id: string) => `/store/product/${id}`,
} as const;
