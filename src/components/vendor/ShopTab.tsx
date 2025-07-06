
import { useSession } from '@/hooks/useSession';
import { useVendorStats } from '@/hooks/useVendorStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, BarChart3, TrendingUp, Eye, MessageCircle } from 'lucide-react';

const ShopTab = () => {
  const { session } = useSession();
  const { stats, deleteStat, clearAllStats } = useVendorStats(session?.pseudonym || '');

  if (!session) return null;

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'sale': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'view': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'contact': return <MessageCircle className="h-4 w-4 text-purple-400" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
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

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              Verkäufer Statistiken
            </CardTitle>
            {stats.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm('Alle Statistiken löschen?')) {
                    clearAllStats();
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Alle löschen
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Noch keine Statistiken vorhanden</p>
          ) : (
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    {getStatIcon(stat.type)}
                    <div>
                      <p className="text-gray-200">{stat.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(stat.timestamp).toLocaleString('de-DE')}
                      </p>
                    </div>
                    {stat.amount && (
                      <span className="text-green-400 font-semibold ml-2">
                        {stat.amount} {stat.currency}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteStat(stat.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopTab;
