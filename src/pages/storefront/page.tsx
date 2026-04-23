import StorefrontNav from './components/StorefrontNav';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import TrustSection from './components/TrustSection';

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-white">
      <StorefrontNav />
      <HeroSection />
      {/* Trust bar */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'ri-shield-check-line', label: 'Authentic Products', sub: '100% genuine, verified' },
              { icon: 'ri-award-line', label: 'Warranty Included', sub: 'On every purchase' },
              { icon: 'ri-secure-payment-line', label: 'Mobile Money', sub: 'MoMo, Cash, Transfer' },
              { icon: 'ri-truck-line', label: 'Same-Day Delivery', sub: 'Greater Accra' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <i className={`${item.icon} text-base`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[10px] text-slate-400">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FeaturedProducts />
      <TrustSection />
    </div>
  );
}
