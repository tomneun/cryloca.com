import { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { useVisibleVendors } from '@/hooks/useVisibleVendors';
import AdminContact from '@/components/AdminContact';
import MarketplaceHeader from '@/components/MarketplaceHeader';
import WelcomeSection from '@/components/WelcomeSection';
import EmptyMarketplace from '@/components/EmptyMarketplace';
import VendorGrid from '@/components/VendorGrid';

const Index = () => {
  const { session } = useSession();
  const { getPublicProducts } = useProducts();

  useEffect(() => {
    document.title = 'Cryloca: No Limit Center';
  }, []);

  const publicProducts = getPublicProducts();
  const visibleVendors = useVisibleVendors(publicProducts);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <MarketplaceHeader session={session} />

      <div className="container mx-auto px-4 py-6">
        <WelcomeSection />

        {Object.keys(visibleVendors).length === 0 ? (
          <EmptyMarketplace session={session} />
        ) : (
          <VendorGrid visibleVendors={visibleVendors} />
        )}
      </div>
      
      <AdminContact />
    </div>
  );
};

export default Index;
