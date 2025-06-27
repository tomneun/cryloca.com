
import { useState, useEffect } from 'react';

interface CryptoRates {
  btc: number;
  eth: number;
  xmr: number;
  usdt: number;
}

export const useCryptoRates = () => {
  const [rates, setRates] = useState<CryptoRates>({
    btc: 45000,
    eth: 2800,
    xmr: 180,
    usdt: 1
  });

  useEffect(() => {
    // Mock crypto rates - in real app, fetch from API
    const mockRates = {
      btc: 45000 + Math.random() * 1000,
      eth: 2800 + Math.random() * 200,
      xmr: 180 + Math.random() * 20,
      usdt: 1
    };
    setRates(mockRates);
  }, []);

  const convertEurToCrypto = (eurAmount: number, crypto: keyof CryptoRates) => {
    return (eurAmount / rates[crypto]).toFixed(6);
  };

  return { rates, convertEurToCrypto };
};
