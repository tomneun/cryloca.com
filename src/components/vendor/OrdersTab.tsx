
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrdersTab = () => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Bestellungen</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Hier werden Ihre Bestellungen angezeigt.</p>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
