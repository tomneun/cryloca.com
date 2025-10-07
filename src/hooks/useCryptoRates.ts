
import { useState, useEffect } from 'react';

interface CryptoRates {
  btc: number;
  eth: number;
  xmr: number;
  ltc: number;
  usdt: number;
}

export const useCryptoRates = () => {
  const [rates, setRates] = useState<CryptoRates>({
    btc: 45000,
    eth: 2800,
    xmr: 180,
    ltc: 85,
    usdt: 1
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,monero,litecoin,tether&vs_currencies=eur'
        );
        const data = await response.json();
        
        setRates({
          btc: data.bitcoin?.eur || 45000,
          eth: data.ethereum?.eur || 2800,
          xmr: data.monero?.eur || 180,
          ltc: data.litecoin?.eur || 85,
          usdt: data.tether?.eur || 1
        });
      } catch (error) {
        console.error('Failed to fetch crypto rates:', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const convertEurToCrypto = (eurAmount: number, crypto: keyof CryptoRates) => {
    return (eurAmount / rates[crypto]).toFixed(6);
  };

  return { rates, convertEurToCrypto };
};
