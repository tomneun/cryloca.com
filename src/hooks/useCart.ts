
import { useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  sellerPseudonym: string;
  image?: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('anonshop_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart:', error);
        localStorage.removeItem('anonshop_cart');
      }
    }
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = cart.map(cartItem =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }

    setCart(newCart);
    localStorage.setItem('anonshop_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.productId !== productId);
    setCart(newCart);
    localStorage.setItem('anonshop_cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('anonshop_cart', JSON.stringify(newCart));
  };

  const decreaseQuantity = (productId: string) => {
    const item = cart.find(i => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const increaseQuantity = (productId: string) => {
    const item = cart.find(i => i.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('anonshop_cart');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    decreaseQuantity,
    increaseQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };
};
