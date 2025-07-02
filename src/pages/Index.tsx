import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Store, Shield, User, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import ProductBanner from '@/components/ProductBanner';
import AdminContact from '@/components/AdminContact';
const Index = () => {
  const {
    session,
    createSession,
    isAuthenticated
  } = useSession();
  const {
    getPublicProducts
  } = useProducts();
  const {
    getTotalItems
  } = useCart();
  const {
    rates,
    convertEurToCrypto
  } = useCryptoRates();
  const [pseudonym, setPseudonym] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'NO LIMIT CENTER';
  }, []);
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pseudonym.trim()) {
      setError('Pseudonym is required');
      return;
    }
    if (pseudonym.length < 3 || pseudonym.length > 20) {
      setError('Pseudonym must be between 3-20 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(pseudonym)) {
      setError('Pseudonym can only contain letters, numbers, and underscores');
      return;
    }
    createSession(pseudonym);
    navigate('/');
  };
  const publicProducts = getPublicProducts();
  
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
  }, {} as Record<string, typeof publicProducts>);
  
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold">NO LIMIT CENTER</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label htmlFor="pseudonym" className="block text-sm font-medium text-gray-300 mb-2">
                  Choose your pseudonym
                </label>
                <Input id="pseudonym" type="text" value={pseudonym} onChange={e => setPseudonym(e.target.value)} className="bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500" placeholder="your_pseudonym" maxLength={20} />
                <p className="text-xs text-gray-400 mt-1">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>
              
              {error && <div className="text-red-400 text-sm">{error}</div>}
              
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Enter Marketplace
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => navigate('/rules')} className="text-gray-400 hover:text-gray-100">
                <Shield className="h-4 w-4 mr-2" />
                Rules
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <AdminContact />
      </div>;
  }
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-8 w-8 text-red-500" />
                <h1 className="text-2xl font-bold">NLC</h1>
              </div>
              <span className="text-gray-400">@{session?.pseudonym}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/rules')} className="text-gray-400 hover:text-gray-100">
                <Shield className="h-4 w-4 mr-2" />
                Rules
              </Button>
              
              <Button onClick={() => navigate('/checkout')} className="bg-red-600 hover:bg-red-700 relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>}
              </Button>
              
              <Button onClick={() => navigate('/my-shop')} className="bg-blue-600 hover:bg-blue-700">
                <Store className="h-4 w-4 mr-2" />
                My Shop
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Anonymous Marketplace</h2>
          <p className="text-gray-400 text-lg">
            Discover unique digital products from verified vendors
          </p>
        </div>

        {/* Vendor Shops Grid */}
        {Object.keys(visibleVendors).length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No shops available yet</h3>
            <p className="text-gray-500">Be the first to create a shop!</p>
            <Button onClick={() => navigate('/my-shop')} className="mt-4 bg-red-600 hover:bg-red-700">
              Create Your Shop
            </Button>
          </div>
        ) : (
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
                  country="Germany" // Default - should come from vendor data
                />
              );
            })}
          </div>
        )}
      </div>
      
      <AdminContact />
    </div>
  );
};

export default Index;
