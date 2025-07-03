
import { Product } from '@/hooks/useProducts';

export const useVisibleVendors = (publicProducts: Product[]) => {
  // Filter products by vendor banner visibility and invisible mode
  const visibleVendors = publicProducts.reduce((acc, product) => {
    const bannerData = localStorage.getItem(`vendor_banner_${product.pseudonym}`);
    let isVendorVisible = true;
    
    if (bannerData) {
      try {
        const parsed = JSON.parse(bannerData);
        isVendorVisible = parsed.isVisible && !parsed.invisibleMode;
      } catch (error) {
        console.error('Failed to parse banner data for', product.pseudonym);
      }
    }
    
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
