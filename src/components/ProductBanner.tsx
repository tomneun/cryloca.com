
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

interface ProductBannerProps {
  pseudonym: string;
  title: string;
  price: number;
  currency: string;
  image?: string;
  country: string;
  shopLogo?: string;
}

const ProductBanner = ({ pseudonym, title, price, currency, image, country, shopLogo }: ProductBannerProps) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/shop/${pseudonym}`)}
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors cursor-pointer h-48 flex flex-col"
    >
      <div className="h-24 bg-gray-700 relative rounded-t-lg overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingBag className="h-8 w-8 text-gray-500" />
          </div>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {shopLogo && (
              <img src={shopLogo} alt="Logo" className="w-6 h-6 rounded" />
            )}
            <h3 className="font-semibold text-sm truncate">@{pseudonym}</h3>
          </div>
          <p className="text-xs text-gray-400 truncate">{title}</p>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="text-red-400 font-bold text-sm">€{price}</span>
            <span className="text-xs text-gray-500">Ships from {country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
