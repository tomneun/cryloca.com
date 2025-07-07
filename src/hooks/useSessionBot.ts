
import { useState, useEffect } from 'react';

export interface SessionBotConfig {
  sessionId: string;
  botActive: boolean;
  encryptionEnabled: boolean;
  pgpPublicKey?: string;
  lastActivity?: string;
}

export const useSessionBot = (pseudonym: string) => {
  const [config, setConfig] = useState<SessionBotConfig | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem(`session_bot_${pseudonym}`);
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to parse session bot config:', error);
      }
    }
  }, [pseudonym]);

  const updateConfig = (updates: Partial<SessionBotConfig>) => {
    const newConfig = { ...config, ...updates } as SessionBotConfig;
    setConfig(newConfig);
    localStorage.setItem(`session_bot_${pseudonym}`, JSON.stringify(newConfig));
  };

  const activateBot = (sessionId: string, encryptionEnabled = false, pgpPublicKey?: string) => {
    const newConfig: SessionBotConfig = {
      sessionId,
      botActive: true,
      encryptionEnabled,
      pgpPublicKey,
      lastActivity: new Date().toISOString()
    };
    setConfig(newConfig);
    localStorage.setItem(`session_bot_${pseudonym}`, JSON.stringify(newConfig));
  };

  const deactivateBot = () => {
    if (config) {
      const newConfig = { ...config, botActive: false };
      setConfig(newConfig);
      localStorage.setItem(`session_bot_${pseudonym}`, JSON.stringify(newConfig));
    }
  };

  return {
    config,
    updateConfig,
    activateBot,
    deactivateBot
  };
};
