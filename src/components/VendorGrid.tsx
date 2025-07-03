
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
        
        if (bannerData) {
          try {
            const parsed = JSON.parse(bannerData);
            customBanner = parsed.bannerImage;
          } catch (error) {
            console.error('Failed to parse banner for', vendorPseudonym);
          }
        }
        
        return (
          <ProductBanner
            key={vendorPseudonym}
            pseudonym={vendorPseudonym}
            title={featuredProduct.title}
            price={featuredProduct.price}
            currency="EUR"
            image={customBanner || featuredProduct.images[0]}
            country="Germany"
          />
        );
      })}
    </div>
  );
};

export default VendorGrid;
