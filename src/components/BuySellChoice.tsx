
import { Button } from '@/components/ui/button';
import { ShoppingBag, Store } from 'lucide-react';

interface BuySellChoiceProps {
  onChoice: (choice: 'buyer' | 'seller') => void;
}

const BuySellChoice = ({ onChoice }: BuySellChoiceProps) => {
  return (
    <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShoppingBag className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Willkommen bei NO LIMIT CENTER</h2>
        <p className="text-gray-400">Was möchten Sie tun?</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => onChoice('buyer')}
          className="w-full bg-red-600 hover:bg-red-700 py-4 text-lg"
        >
          <ShoppingBag className="h-6 w-6 mr-3" />
          Ich bin ein Käufer
        </Button>
        
        <Button
          onClick={() => onChoice('seller')}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 py-4 text-lg"
        >
          <Store className="h-6 w-6 mr-3" />
          Ich bin ein Verkäufer
        </Button>
      </div>
    </div>
  );
};

export default BuySellChoice;
