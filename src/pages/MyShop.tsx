
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Plus, Edit, Trash2, Eye, EyeOff, LogOut, Store, Image, Package, ShoppingCart } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import VendorOrders from '@/components/VendorOrders';
import VendorBanner from '@/components/VendorBanner';

const MyShop = () => {
  const { session, destroySession } = useSession();
  const { products, deleteProduct, updateProduct } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!session) {
    navigate('/');
    return null;
  }

  const myProducts = products.filter(p => p.pseudonym === session.pseudonym);

  const handleLogout = () => {
    if (confirm('Möchten Sie Ihren Shop wirklich löschen? Alle Daten gehen verloren.')) {
      destroySession();
      navigate('/');
    }
  };

  const toggleVisibility = (productId: string, currentVisibility: boolean) => {
    updateProduct(productId, {
      visibility: !currentVisibility
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold">No Limit Center: Vendor Area</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-slate-500 rounded-md bg-red-700 hover:bg-red-600">
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

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
            <TabsTrigger value="shop" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Store className="h-4 w-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Image className="h-4 w-4 mr-2" />
              Banner
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Bestellungen
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Produkte
            </TabsTrigger>
          </TabsList>

          {/* Shop Info Tab */}
          <TabsContent value="shop">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Shop Informationen</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Shop Name</h3>
                  <p className="text-xl">@{session.pseudonym}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Erstellt am</h3>
                  <p>{new Date(session.createdAt).toLocaleDateString('de-DE')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Shop-URL</h3>
                  <p className="text-blue-400">/shop/{session.pseudonym}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Statistiken</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Produkte</p>
                      <p className="text-2xl font-bold text-red-400">{myProducts.length}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Sichtbare Produkte</p>
                      <p className="text-2xl font-bold text-green-400">{myProducts.filter(p => p.visibility).length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Banner Tab */}
          <TabsContent value="banner">
            <VendorBanner />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <VendorOrders />
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Meine Produkte ({myProducts.length})</h3>
                <Button onClick={() => setShowProductForm(true)} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Produkt hinzufügen
                </Button>
              </div>

              {myProducts.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                  <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-400 mb-2">Noch keine Produkte</h4>
                  <p className="text-gray-500 mb-4">Fügen Sie Ihr erstes digitales Produkt hinzu</p>
                  <Button onClick={() => setShowProductForm(true)} className="bg-red-600 hover:bg-red-700">
                    Erstes Produkt erstellen
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myProducts.map(product => (
                    <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <div className="aspect-video bg-gray-700 relative">
                        <img src={product.images[0] || '/placeholder.svg'} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => toggleVisibility(product.id, product.visibility)} 
                            className="bg-gray-900/80 hover:bg-gray-900"
                          >
                            {product.visibility ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2 truncate">{product.title}</h4>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-red-400 font-bold">{product.price} {product.currency}</span>
                          <span className="text-sm text-gray-500">Lager: {product.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingProduct(product.id);
                              setShowProductForm(true);
                            }} 
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Bearbeiten
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => {
                              if (confirm('Produkt wirklich löschen?')) {
                                deleteProduct(product.id);
                              }
                            }} 
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm 
          productId={editingProduct} 
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }} 
        />
      )}
    </div>
  );
};

export default MyShop;
