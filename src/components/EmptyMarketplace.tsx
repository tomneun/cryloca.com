
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { UserSession } from '@/hooks/useSession';

interface EmptyMarketplaceProps {
  session: UserSession | null;
}

const EmptyMarketplace = ({ session }: EmptyMarketplaceProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-400 mb-2">Noch keine Shops verfügbar</h3>
      <p className="text-gray-500">Seien Sie der Erste, der einen Shop erstellt!</p>
      {session && (
        <Button onClick={() => navigate('/my-shop')} className="mt-4 bg-red-600 hover:bg-red-700">
          Erstellen Sie Ihren Shop
        </Button>
      )}
    </div>
  );
};

export default EmptyMarketplace;
