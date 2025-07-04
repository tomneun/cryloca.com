
import { useState, useEffect } from 'react';

export interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isVisible: boolean;
  viewedAt?: string;
}

export interface Order {
  id: string;
  customerId: string;
  vendorPseudonym: string;
  customerCode: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'paid' | 'confirmed' | 'delivered' | 'completed';
  paymentAddress: string;
  txHash?: string;
  deliveryAddress: DeliveryAddress;
  createdAt: string;
  paidAt?: string;
  confirmedAt?: string;
  deliveredAt?: string;
  paymentDeadline: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('anonshop_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Failed to parse orders:', error);
        localStorage.removeItem('anonshop_orders');
      }
    }
  }, []);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'paymentDeadline'>) => {
    const newOrder: Order = {
      ...order,
      id: 'order-' + Date.now(),
      createdAt: new Date().toISOString(),
      paymentDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
    const newOrders = [...orders, newOrder];
    setOrders(newOrders);
    localStorage.setItem('anonshop_orders', JSON.stringify(newOrders));
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const newOrders = orders.map(order =>
      order.id === id ? { ...order, ...updates } : order
    );
    setOrders(newOrders);
    localStorage.setItem('anonshop_orders', JSON.stringify(newOrders));
  };

  const getOrdersByVendor = (pseudonym: string) => {
    return orders.filter(order => order.vendorPseudonym === pseudonym);
  };

  const revealDeliveryAddress = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && !order.deliveryAddress.isVisible) {
      updateOrder(orderId, {
        deliveryAddress: {
          ...order.deliveryAddress,
          isVisible: true,
          viewedAt: new Date().toISOString()
        }
      });
      
      // Schedule deletion of address after viewing
      setTimeout(() => {
        updateOrder(orderId, {
          deliveryAddress: {
            ...order.deliveryAddress,
            name: '[GELÖSCHT]',
            street: '[GELÖSCHT]',
            city: '[GELÖSCHT]',
            postalCode: '[GELÖSCHT]',
            country: '[GELÖSCHT]'
          }
        });
      }, 5000); // Delete after 5 seconds of viewing
    }
  };

  return {
    orders,
    addOrder,
    updateOrder,
    getOrdersByVendor,
    revealDeliveryAddress
  };
};
