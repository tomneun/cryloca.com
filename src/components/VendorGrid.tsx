
import ProductBanner from '@/components/ProductBanner';
import { Product } from '@/hooks/useProducts';

interface VendorGridProps {
  visibleVendors: Record<string, Product[]>;
}

const VendorGrid = ({ visibleVendors }: VendorGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(visibleVendors).map(([vendorPseudonym, products]) => {
        const featuredProduct = products[0];
        const bannerData = localStorage.getItem(`vendor_banner_${vendorPseudonym}`);
        let customBanner = null;
        let shopName = '';
        
        if (bannerData) {
          try {
            const parsed = JSON.parse(bannerData);
            customBanner = parsed.bannerImage;
            shopName = parsed.shopName || '';
          } catch (error) {
            console.error('Failed to parse banner for', vendorPseudonym);
          }
        }
        
        return (
          <div key={vendorPseudonym} className="space-y-2">
            <ProductBanner
              pseudonym={vendorPseudonym}
              title={featuredProduct.title}
              price={featuredProduct.price}
              currency="EUR"
              image={customBanner || featuredProduct.images[0]}
              country="Germany"
            />
            {shopName && (
              <p className="text-center text-gray-300 font-semibold text-sm">
                {shopName}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VendorGrid;
