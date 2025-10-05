
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { useVisibleVendors } from '@/hooks/useVisibleVendors';
import { ShoppingBag } from 'lucide-react';
import AdminContact from '@/components/AdminContact';
import CaptchaChallenge from '@/components/CaptchaChallenge';
import BuySellChoice from '@/components/BuySellChoice';
import MarketplaceHeader from '@/components/MarketplaceHeader';
import WelcomeSection from '@/components/WelcomeSection';
import EmptyMarketplace from '@/components/EmptyMarketplace';
import VendorGrid from '@/components/VendorGrid';

const Index = () => {
  const { session, isAuthenticated } = useSession();
  const { getPublicProducts } = useProducts();
  const [showCaptcha, setShowCaptcha] = useState(true);
  const [showChoice, setShowChoice] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'NO LIMIT CENTER';
  }, []);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    setShowChoice(true);
  };

  const handleBuyClick = () => {
    setShowChoice(false);
    setShowMarketplace(true);
  };

  const handleSellClick = () => {
    navigate('/vendor-login');
  };

  // Show CAPTCHA first
  if (showCaptcha && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShoppingBag className="h-12 w-12 text-red-500" />
            <h1 className="text-4xl font-bold">NO LIMIT CENTER</h1>
          </div>
          <CaptchaChallenge onSuccess={handleCaptchaSuccess} />
        </div>
        <AdminContact />
      </div>
    );
  };

  // Show Buy/Sell choice after CAPTCHA
  if (showChoice && !isAuthenticated) {
    const handleChoice = (choice: 'buyer' | 'seller') => {
      if (choice === 'buyer') {
        handleBuyClick();
      } else {
        handleSellClick();
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <BuySellChoice onChoice={handleChoice} />
        </div>
        <AdminContact />
      </div>
    );
  };

  // Show marketplace after "Buy" selection or if authenticated
  const publicProducts = getPublicProducts();
  const visibleVendors = useVisibleVendors(publicProducts);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <MarketplaceHeader session={session} />

      <div className="container mx-auto px-4 py-8">
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
