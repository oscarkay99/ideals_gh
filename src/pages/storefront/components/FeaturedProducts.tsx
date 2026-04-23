import { useNavigate } from 'react-router-dom';
import { featuredProducts } from '@/mocks/products';

const conditionColors: Record<string, string> = {
  New: 'bg-emerald-500 text-white',
  Used: 'bg-slate-700 text-white',
  Refurbished: 'bg-amber-500 text-white',
};

const badgeColors: Record<string, string> = {
  'Best Seller': 'bg-emerald-100 text-emerald-700',
  Sale: 'bg-red-100 text-red-600',
  'Low Stock': 'bg-amber-100 text-amber-700',
};

export default function FeaturedProducts() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-emerald-600 text-xs font-semibold uppercase tracking-[0.15em] mb-3">Handpicked for You</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">Featured Gadgets</h2>
          <p className="text-slate-500 mt-3 text-base">Authentic products, competitive prices, real warranties.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/store/product/${product.id}`)}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              {/* Image */}
              <div className="relative bg-slate-50 aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${conditionColors[product.condition]}`}>
                  {product.condition}
                </div>
                {product.badge && (
                  <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-1">{product.category}</p>
                <h3 className="text-sm font-semibold text-slate-800 leading-tight mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 flex items-center justify-center text-emerald-500">
                    <i className="ri-shield-check-line text-xs" />
                  </div>
                  <span className="text-[10px] text-slate-500">{product.warranty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-slate-900">{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-slate-400 line-through">{product.originalPrice}</p>
                    )}
                  </div>
                  <div className={`text-[10px] font-medium ${product.stock <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {product.stock <= 2 ? `Only ${product.stock} left` : 'In Stock'}
                  </div>
                </div>

                <button className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/store/catalog')}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-medium px-6 py-3 rounded-full hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
          >
            View All Products
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line text-sm" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
