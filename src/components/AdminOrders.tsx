
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

const AdminOrders = () => {
  const { orders } = useOrders();

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

  const totalRevenue = orders
    .filter(order => order.status !== 'pending')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-blue-400" />
          Alle Bestellungen ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-400">Wartend</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {orders.filter(o => o.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-400">Bezahlt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {orders.filter(o => ['confirmed', 'delivered', 'completed'].includes(o.status)).length}
              </div>
              <div className="text-sm text-gray-400">Abgewickelt</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {totalRevenue.toFixed(3)} XMR
              </div>
              <div className="text-sm text-gray-400">Gesamtumsatz</div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Noch keine Bestellungen vorhanden</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Bestellung</TableHead>
                  <TableHead className="text-gray-300">Verkäufer</TableHead>
                  <TableHead className="text-gray-300">Betrag</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Datum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} className="border-gray-700">
                    <TableCell className="text-gray-300">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      @{order.vendorPseudonym}
                    </TableCell>
                    <TableCell className="text-red-400 font-bold">
                      {order.totalAmount} {order.currency}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('de-DE')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
