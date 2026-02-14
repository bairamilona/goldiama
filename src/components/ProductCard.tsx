import React, { useState } from 'react';
import { ShoppingBag, Award, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '@/app/contexts/CartContext';
import { useCurrency } from '@/app/contexts/CurrencyContext';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    metal: string;
    weight: string;
    purity: string;
    price: number;
    availability: string;
    image: string;
  };
  splineElement: React.ReactNode;
  onViewDetails: () => void;
}

export function ProductCard({ product, splineElement, onViewDetails }: ProductCardProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      weight: product.weight,
      metal: product.metal,
      purity: product.purity,
      image: product.image,
    });
    
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="flex flex-col group relative">
      {/* Spline Visual Card */}
      <div className="relative mb-4">
        {splineElement}
        
        {/* Quick View Button (on hover) */}
        <button
          onClick={onViewDetails}
          className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg z-40"
        >
          <Info size={16} className="text-gray-900" />
        </button>

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 z-40">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            product.availability === 'In Stock' 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-amber-50 text-amber-700'
          }`}>
            {product.availability}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2.5 font-['Inter']">
        {/* Title & Description */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-0.5">{product.title}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{product.description}</p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100">
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Metal</div>
            <div className="text-[11px] font-semibold text-gray-900">{product.metal}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Weight</div>
            <div className="text-[11px] font-semibold text-gray-900">{product.weight}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Purity</div>
            <div className="text-[11px] font-semibold text-gray-900">{product.purity}</div>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Price</span>
            <span className="text-xl font-bold text-gray-900 font-['Inter'] lining-nums">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#B8A07E] text-white hover:bg-[#A08F6D]'
            }`}
          >
            {justAdded ? (
              <>
                <Award size={14} />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                Add to Cart
              </>
            )}
          </motion.button>
        </div>

        {/* Additional Info */}
        <p className="text-[9px] text-gray-400 text-center mt-1">
          Free insured shipping • Certified authenticity • 30-day returns
        </p>
      </div>
    </div>
  );
}