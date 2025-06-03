
import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  pseudonym: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  stock: number;
  category: string;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('anonshop_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse products:', error);
        localStorage.removeItem('anonshop_products');
      }
    }
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    localStorage.setItem('anonshop_products', JSON.stringify(newProducts));
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const newProducts = products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(newProducts);
    localStorage.setItem('anonshop_products', JSON.stringify(newProducts));
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(product => product.id !== id);
    setProducts(newProducts);
    localStorage.setItem('anonshop_products', JSON.stringify(newProducts));
  };

  const getProductsByPseudonym = (pseudonym: string) => {
    return products.filter(product => product.pseudonym === pseudonym && product.visibility);
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getPublicProducts = () => {
    return products.filter(product => product.visibility);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByPseudonym,
    getProductById,
    getPublicProducts
  };
};
