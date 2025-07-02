
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useProducts, Product } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  productId?: string | null;
  onClose: () => void;
}

const ProductForm = ({ productId, onClose }: ProductFormProps) => {
  const { session } = useSession();
  const { addProduct, updateProduct, getProductById } = useProducts();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'XMR',
    stock: '',
    category: '',
    visibility: true
  });

  const [productImage, setProductImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          currency: product.currency,
          stock: product.stock.toString(),
          category: product.category,
          visibility: product.visibility
        });
        setProductImage(product.images[0] || null);
      }
    }
  }, [productId, getProductById]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Titel ist erforderlich';
    if (!formData.description.trim()) newErrors.description = 'Beschreibung ist erforderlich';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Gültiger Preis erforderlich';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Gültiger Lagerbestand erforderlich';
    if (!formData.category.trim()) newErrors.category = 'Kategorie ist erforderlich';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !session) return;

    const productData = {
      pseudonym: session.pseudonym,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      currency: formData.currency,
      stock: parseInt(formData.stock),
      category: formData.category.trim(),
      visibility: formData.visibility,
      images: productImage ? [productImage] : []
    };

    if (productId) {
      updateProduct(productId, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold">
            {productId ? 'Produkt bearbeiten' : 'Neues Produkt'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label className="text-gray-300 mb-3 block">Product Image</Label>
            <ImageUpload
              currentImage={productImage}
              onImageChange={setProductImage}
              placeholder="Upload product image"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                  placeholder="z.B. Privacy Guide PDF"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Beschreibung</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1 w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-red-500 focus:outline-none"
                  placeholder="Detaillierte Produktbeschreibung..."
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-gray-300">Preis</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                    placeholder="0.05"
                  />
                  {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <Label htmlFor="currency" className="text-gray-300">Währung</Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="mt-1 w-full h-10 px-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-red-500 focus:outline-none"
                  >
                    <option value="XMR">XMR</option>
                    <option value="TOKEN">TOKEN</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock" className="text-gray-300">Lagerbestand</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                    placeholder="100"
                  />
                  {errors.stock && <p className="text-red-400 text-sm mt-1">{errors.stock}</p>}
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">Kategorie</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100 focus:border-red-500"
                    placeholder="E-Books"
                  />
                  {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="visibility"
                  checked={formData.visibility}
                  onChange={(e) => setFormData({...formData, visibility: e.target.checked})}
                  className="rounded bg-gray-700 border-gray-600"
                />
                <Label htmlFor="visibility" className="text-gray-300">Öffentlich sichtbar</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {productId ? 'Aktualisieren' : 'Erstellen'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
