
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { ShoppingBag, LogOut } from 'lucide-react';

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
    <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">No Limit Center: Vendor Area</h1>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-white rounded-md bg-red-700 hover:bg-red-600">
              Marktplatz
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
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
