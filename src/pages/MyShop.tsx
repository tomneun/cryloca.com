
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorHeader from '@/components/vendor/VendorHeader';
import ShopTab from '@/components/vendor/ShopTab';
import ProductsTab from '@/components/vendor/ProductsTab';
import OrdersTab from '@/components/vendor/OrdersTab';
import ConfigurationTab from '@/components/vendor/ConfigurationTab';
import TelegramBotTab from '@/components/vendor/TelegramBotTab';
import VendorBanner from '@/components/VendorBanner';
import MessagesTab from '@/components/vendor/MessagesTab';

const MyShop = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <VendorHeader />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 mb-8">
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="banner">Banner</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bot">Telegram Bot</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="shop">
            <ShopTab />
          </TabsContent>

          <TabsContent value="banner">
            <VendorBanner />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="bot">
            <TelegramBotTab />
          </TabsContent>

          <TabsContent value="configuration">
            <ConfigurationTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyShop;
