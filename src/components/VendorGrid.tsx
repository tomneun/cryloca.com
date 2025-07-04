
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface VendorGridProps {
  visibleVendors: Record<string, Product[]>;
}

const VendorGrid = ({ visibleVendors }: VendorGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(visibleVendors).map(([vendorPseudonym, products]) => {
        const bannerData = localStorage.getItem(`vendor_banner_${vendorPseudonym}`);
        let customBanner = null;
        let isVisible = true;
        
        if (bannerData) {
          try {
            const parsed = JSON.parse(bannerData);
            customBanner = parsed.bannerImage;
            isVisible = parsed.isVisible && !parsed.invisibleMode;
          } catch (error) {
            console.error('Failed to parse banner for', vendorPseudonym);
          }
        }

        // Don't show if vendor disabled banner visibility
        if (!isVisible) return null;
        
        return (
          <div 
            key={vendorPseudonym}
            onClick={() => navigate(`/shop/${vendorPseudonym}`)}
            className="bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors cursor-pointer overflow-hidden"
          >
            {/* Banner Image - Fixed Height */}
            <div className="h-48 bg-gray-700 relative">
              {customBanner ? (
                <img 
                  src={customBanner} 
                  alt={`Shop Banner von @${vendorPseudonym}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ShoppingBag className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Shop Info */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">@{vendorPseudonym}</h3>
                <span className="text-sm text-gray-400">{products.length} Produkte</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Zum Shop besuchen
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VendorGrid;
