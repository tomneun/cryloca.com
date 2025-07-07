
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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <style>{`
        .neon-glow {
          box-shadow: 0 0 5px rgba(34, 211, 238, 0.3);
        }
        .neon-glow:hover {
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.6);
        }
      `}</style>
      
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">No Limit Center: Vendor Area</h1>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="border-2 border-cyan-400 text-white bg-red-700 hover:bg-red-600 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-300 neon-glow"
              >
                Marktplatz
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout} 
                className="border-2 border-red-400 bg-red-600 hover:bg-red-700 hover:border-red-300 hover:shadow-[0_0_15px_rgba(248,113,113,0.6)] transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Shop löschen
              </Button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default VendorHeader;
