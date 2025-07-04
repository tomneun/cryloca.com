
import { useOrders } from '@/hooks/useOrders';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Package, Clock, CheckCircle, Truck } from 'lucide-react';

const VendorOrders = () => {
  const { session } = useSession();
  const { getOrdersByVendor, revealDeliveryAddress } = useOrders();

  if (!session) return null;

  const vendorOrders = getOrdersByVendor(session.pseudonym);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'paid': return 'bg-blue-500';
      case 'confirmed': return 'bg-green-500';
      case 'delivered': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'delivered': return <Truck className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Wartet auf Zahlung';
      case 'paid': return 'Bezahlt';
      case 'confirmed': return 'Bestätigt';
      case 'delivered': return 'Geliefert';
      case 'completed': return 'Abgeschlossen';
      default: return 'Unbekannt';
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bestellungen ({vendorOrders.length})</h3>
      
      {vendorOrders.length === 0 ? (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Noch keine Bestellungen erhalten</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendorOrders.map(order => (
            <Card key={order.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Bestellung #{order.id.slice(-8)}</CardTitle>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Artikel</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-400">
                          {item.quantity}x {item.title} - {item.price} {order.currency}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="font-bold text-red-400">
                        Gesamt: {order.totalAmount} {order.currency}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Lieferadresse</h4>
                    {order.deliveryAddress.isVisible ? (
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>{order.deliveryAddress.name}</div>
                        <div>{order.deliveryAddress.street}</div>
                        <div>{order.deliveryAddress.postalCode} {order.deliveryAddress.city}</div>
                        <div>{order.deliveryAddress.country}</div>
                        {order.deliveryAddress.viewedAt && (
                          <div className="text-red-400 text-xs mt-2">
                            ⚠️ Adresse wird in Kürze gelöscht
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="text-gray-500 text-sm mb-2">
                          Adresse verborgen (wird nach Anzeige gelöscht)
                        </div>
                        <Button
                          size="sm"
                          onClick={() => revealDeliveryAddress(order.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Einmalig anzeigen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Bestellt: {new Date(order.createdAt).toLocaleString('de-DE')}</span>
                  <span>Kunden-Code: {order.customerCode}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
