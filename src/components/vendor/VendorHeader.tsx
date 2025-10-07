import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogOut, Home } from 'lucide-react';
const VendorHeader = () => {
  const { destroySession } = useSession();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (confirm('Möchten Sie Ihren Shop wirklich löschen? Alle Daten gehen verloren.')) {
      destroySession();
      navigate('/');
    }
  };
  
  return (
    <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-orange-500" />
            <h1 className="text-xl font-bold">Mein Shop</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Home className="h-4 w-4 mr-2" />
              Zum Marktplatz
            </Button>
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-400 hover:text-gray-100">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Shop löschen
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default VendorHeader;