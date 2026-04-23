interface PosProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface CartItem {
  id: string;
  qty: number;
  discount: number;
}

interface ProductGridProps {
  products: PosProduct[];
  cart: CartItem[];
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  onAddToCart: (id: string) => void;
  categories: string[];
}

export default function ProductGrid({
  products,
  cart,
  search,
  onSearch,
  category,
  onCategory,
  onAddToCart,
  categories,
}: ProductGridProps) {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex-1">
          <i className="ri-search-line text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search product or scan barcode..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-600 outline-none w-full"
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${category === cat ? 'text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            style={category === cat ? { background: '#1E5FBE' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
        {products.map(p => {
          const inCart = cart.find(c => c.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => onAddToCart(p.id)}
              disabled={p.stock === 0}
              className={`bg-white rounded-2xl p-3 border text-left transition-all cursor-pointer ${p.stock === 0 ? 'opacity-50 cursor-not-allowed border-slate-100' : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'} ${inCart ? 'border-blue-300 bg-blue-50/50' : ''}`}
            >
              <div className="w-full h-20 rounded-xl bg-slate-50 overflow-hidden mb-2">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1">{p.name}</p>
              <p className="text-[10px] text-slate-400 mb-1">{p.sku}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: '#1E5FBE' }}>GHS {p.price.toLocaleString()}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.stock <= 2 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                  {p.stock === 0 ? 'Out' : `${p.stock} left`}
                </span>
              </div>
              {inCart && (
                <div className="mt-1.5 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#1E5FBE' }}>{inCart.qty}</span>
                  <span className="text-[10px] text-blue-600 font-medium">in cart</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
