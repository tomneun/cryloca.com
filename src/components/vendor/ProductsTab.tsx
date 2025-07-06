
import { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Edit, Trash2, Eye, EyeOff, Power, PowerOff } from 'lucide-react';
import ProductForm from '@/components/ProductForm';

const ProductsTab = () => {
  const { session } = useSession();
  const { products, deleteProduct, updateProduct } = useProducts();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  if (!session) return null;

  const myProducts = products.filter(p => p.pseudonym === session.pseudonym);

  const toggleVisibility = (productId: string, currentVisibility: boolean) => {
    updateProduct(productId, { visibility: !currentVisibility });
  };

  const toggleActive = (productId: string, currentStock: number) => {
    // Toggle between 0 and 1 for temporary activation/deactivation
    updateProduct(productId, { stock: currentStock > 0 ? 0 : 1 });
  };

  const deleteProductWithConfirm = (productId: string, productTitle: string) => {
    if (confirm(`Produkt "${productTitle}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      deleteProduct(productId);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Produkt Management ({myProducts.length})</h3>
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
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => toggleActive(product.id, product.stock)} 
                    className={`${product.stock > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                  >
                    {product.stock > 0 ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  </Button>
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
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                      {product.stock > 0 ? 'Aktiv' : 'Inaktiv'}
                    </span>
                    <span className="text-sm text-gray-500">Lager: {product.stock}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setEditingProduct(product.id);
                    setShowProductForm(true);
                  }} className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Edit className="h-4 w-4 mr-1" />
                    Bearbeiten
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => deleteProductWithConfirm(product.id, product.title)}
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

      {showProductForm && (
        <ProductForm
          productId={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </>
  );
};

export default ProductsTab;
