
import { Product } from '@/hooks/useProducts';

export const useVisibleVendors = (publicProducts: Product[]) => {
  // Group products by vendor and filter by banner visibility
  const visibleVendors = publicProducts.reduce((acc, product) => {
    const bannerData = localStorage.getItem(`vendor_banner_${product.pseudonym}`);
    let isVendorVisible = true;
    
    if (bannerData) {
      try {
        const parsed = JSON.parse(bannerData);
        // Check if vendor has enabled banner visibility and is not in invisible mode
        isVendorVisible = parsed.isVisible && !parsed.invisibleMode;
      } catch (error) {
        console.error('Failed to parse banner data for', product.pseudonym);
      }
    }
    
    // Only include vendors who have banner visibility enabled
    if (isVendorVisible) {
      if (!acc[product.pseudonym]) {
        acc[product.pseudonym] = [];
      }
      acc[product.pseudonym].push(product);
    }
    
    return acc;
  }, {} as Record<string, Product[]>);

  return visibleVendors;
};
