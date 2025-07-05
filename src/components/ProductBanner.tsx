
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';

interface ProductBannerProps {
  pseudonym: string;
  title: string;
  price: number;
  currency: string;
  image?: string;
  country: string;
  shopLogo?: string;
}

const ProductBanner = ({
  pseudonym,
  title,
  image,
  country,
  shopLogo
}: ProductBannerProps) => {
  const navigate = useNavigate();
  
  // Get sales count from localStorage
  const salesCount = parseInt(localStorage.getItem(`sales_count_${pseudonym}`) || '0');

  return (
    <div 
      onClick={() => navigate(`/shop/${pseudonym}`)} 
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors cursor-pointer h-48 flex flex-col"
    >
      <div className="h-32 bg-gray-700 relative rounded-t-lg overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingBag className="h-8 w-8 text-gray-500" />
          </div>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {shopLogo && <img src={shopLogo} alt="Logo" className="w-6 h-6 rounded" />}
            <h3 className="font-semibold text-sm truncate flex items-center gap-1">
              @{pseudonym}
              {salesCount > 0 && (
                <div className="flex items-center gap-1 bg-yellow-600 rounded-full px-2 py-0.5 text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{salesCount}</span>
                </div>
              )}
            </h3>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Visit Shop</span>
            <span className="text-xs text-gray-500">Ships from {country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
