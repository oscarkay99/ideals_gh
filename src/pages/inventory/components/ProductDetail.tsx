interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  color?: string;
  condition: string;
  price: string;
  stock: number;
  imei: string;
  location: string;
  supplier: string;
  lastRestocked: string;
  fastMover: boolean;
}

interface Props {
  product: InventoryProduct;
  onClose: () => void;
}

export default function ProductDetail({ product, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-800">Product Details</h3>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
              <i className="ri-close-line text-base" />
            </button>
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">{product.name}</h4>
          <p className="text-xs text-slate-400 mb-4">
            {product.id} · {product.category}{product.color ? ` · ${product.color}` : ''}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 uppercase">Price</p>
              <p className="text-sm font-bold text-slate-800">{product.price}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 uppercase">Stock</p>
              <p className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : product.stock <= 2 ? 'text-amber-600' : 'text-slate-800'}`}>{product.stock} units</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 uppercase">IMEI / Serial</p>
              <p className="text-xs font-mono text-slate-700">{product.imei}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 uppercase">Location</p>
              <p className="text-xs text-slate-700">{product.location}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 uppercase">Color</p>
              <p className="text-xs text-slate-700">{product.color || 'Not specified'}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Supplier</span>
              <span className="text-xs font-medium text-slate-800">{product.supplier}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Last Restocked</span>
              <span className="text-xs font-medium text-slate-800">{product.lastRestocked}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-xs text-slate-500">Fast Mover</span>
              <span className={`text-xs font-medium ${product.fastMover ? 'text-emerald-600' : 'text-slate-400'}`}>{product.fastMover ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer whitespace-nowrap">
              Edit Product
            </button>
            <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap">
              Restock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
