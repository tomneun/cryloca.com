
import { useState, useEffect } from 'react';

export interface CryptoWallet {
  btcAddress: string;
  xmrAddress: string;
  lastUpdated: string;
}

export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet>({
    btcAddress: '',
    xmrAddress: '',
    lastUpdated: ''
  });

  useEffect(() => {
    const savedWallets = localStorage.getItem('admin_crypto_wallets');
    if (savedWallets) {
      try {
        setWallets(JSON.parse(savedWallets));
      } catch (error) {
        console.error('Failed to parse wallets:', error);
        localStorage.removeItem('admin_crypto_wallets');
      }
    }
  }, []);

  const updateWallets = (newWallets: Omit<CryptoWallet, 'lastUpdated'>) => {
    const updatedWallets = {
      ...newWallets,
      lastUpdated: new Date().toISOString()
    };
    setWallets(updatedWallets);
    localStorage.setItem('admin_crypto_wallets', JSON.stringify(updatedWallets));
  };

  return {
    wallets,
    updateWallets
  };
};
