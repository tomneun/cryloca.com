
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store, Shield, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { UserSession } from '@/hooks/useSession';
import { useDesign } from '@/hooks/useDesign';
import logo from '@/assets/logo.png';

interface MarketplaceHeaderProps {
  session: UserSession | null;
}

const MarketplaceHeader = ({ session }: MarketplaceHeaderProps) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { settings } = useDesign();

  return (
    <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={settings.logo || logo} 
                alt="Cryloca Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = logo;
                }}
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Cryloca</h1>
                <p className="text-xs text-gray-400">No Limit Center</p>
              </div>
            </div>
            {session && <span className="text-gray-400">@{session?.pseudonym}</span>}
          </div>
          
          {/* Centered Marketplace Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-green-600 hover:bg-green-700 font-semibold"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Marktplatz
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/rules')} className="text-gray-400 hover:text-gray-100">
              <Shield className="h-4 w-4 mr-2" />
              Regeln
            </Button>
            
            {session && (
              <>
                <Button onClick={() => navigate('/checkout')} className="bg-red-600 hover:bg-red-700 relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Warenkorb
                  {getTotalItems() > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>}
                </Button>
                
                <Button onClick={() => navigate('/my-shop')} className="bg-blue-600 hover:bg-blue-700">
                  <Store className="h-4 w-4 mr-2" />
                  Mein Shop
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
