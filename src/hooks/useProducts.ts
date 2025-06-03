
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
        // Initialize with demo data
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoProducts: Product[] = [
      {
        id: 'demo-1',
        pseudonym: 'crypto_dealer',
        title: 'Privacy Guide PDF',
        description: 'Complete guide to digital privacy and anonymity. 150 pages of expert knowledge.',
        price: 0.05,
        currency: 'XMR',
        images: ['/placeholder.svg'],
        stock: 100,
        category: 'E-Books',
        visibility: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'demo-2',
        pseudonym: 'music_anon',
        title: 'Underground Beats Album',
        description: 'Exclusive electronic music collection. High quality FLAC files.',
        price: 0.08,
        currency: 'XMR',
        images: ['/placeholder.svg'],
        stock: 50,
        category: 'Music',
        visibility: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setProducts(demoProducts);
    localStorage.setItem('anonshop_products', JSON.stringify(demoProducts));
  };

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
