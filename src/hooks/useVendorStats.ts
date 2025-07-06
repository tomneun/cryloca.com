
import { useState, useEffect } from 'react';

export interface VendorStat {
  id: string;
  type: 'sale' | 'view' | 'contact';
  description: string;
  amount?: number;
  currency?: string;
  timestamp: string;
}

export const useVendorStats = (pseudonym: string) => {
  const [stats, setStats] = useState<VendorStat[]>([]);

  useEffect(() => {
    const savedStats = localStorage.getItem(`vendor_stats_${pseudonym}`);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Failed to parse vendor stats:', error);
      }
    }
  }, [pseudonym]);

  const addStat = (stat: Omit<VendorStat, 'id' | 'timestamp'>) => {
    const newStat: VendorStat = {
      ...stat,
      id: 'stat-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    const newStats = [...stats, newStat];
    setStats(newStats);
    localStorage.setItem(`vendor_stats_${pseudonym}`, JSON.stringify(newStats));
  };

  const deleteStat = (id: string) => {
    const newStats = stats.filter(stat => stat.id !== id);
    setStats(newStats);
    localStorage.setItem(`vendor_stats_${pseudonym}`, JSON.stringify(newStats));
  };

  const clearAllStats = () => {
    setStats([]);
    localStorage.removeItem(`vendor_stats_${pseudonym}`);
  };

  return {
    stats,
    addStat,
    deleteStat,
    clearAllStats
  };
};
