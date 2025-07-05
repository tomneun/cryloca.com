
import { useSession } from '@/hooks/useSession';

const ShopTab = () => {
  const { session } = useSession();

  if (!session) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Shop: @{session.pseudonym}</h2>
          <p className="text-gray-400">Erstellt am: {new Date(session.createdAt).toLocaleDateString('de-DE')}</p>
          <p className="text-sm text-gray-500 mt-2">
            Shop-URL: /shop/{session.pseudonym}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopTab;
