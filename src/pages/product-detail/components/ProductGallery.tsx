import { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  condition: string;
}

export default function ProductGallery({ images, condition }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const conditionColor = condition === 'New' ? 'bg-emerald-500' : condition === 'Refurbished' ? 'bg-amber-500' : 'bg-slate-600';

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative bg-slate-50 rounded-2xl overflow-hidden aspect-square">
        <img
loading="lazy" decoding="async"           src={images[active]}
          alt="Product"
          className="w-full h-full object-cover object-top"
        />
        <div className={`absolute top-4 left-4 text-xs font-semibold text-white px-3 py-1.5 rounded-full ${conditionColor}`}>
          {condition}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
              active === i ? 'border-emerald-500' : 'border-transparent'
            }`}
          >
            <img loading="lazy" decoding="async" src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover object-top" />
          </button>
        ))}
      </div>
    </div>
  );
}
