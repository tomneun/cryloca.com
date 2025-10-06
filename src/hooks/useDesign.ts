import { useState, useEffect } from 'react';

export interface DesignSettings {
  logo: string;
  theme: 'default' | 'neon' | 'minimal' | 'cyberpunk';
  background: string;
  customTexts: Record<string, string>;
  customImages: Record<string, string>;
}

const DEFAULT_SETTINGS: DesignSettings = {
  logo: '/logo.png',
  theme: 'default',
  background: '',
  customTexts: {},
  customImages: {}
};

export const useDesign = () => {
  const [settings, setSettings] = useState<DesignSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('design_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSettings = (newSettings: Partial<DesignSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('design_settings', JSON.stringify(updated));
  };

  const updateLogo = (logoUrl: string) => {
    updateSettings({ logo: logoUrl });
  };

  const updateTheme = (theme: DesignSettings['theme']) => {
    updateSettings({ theme });
  };

  const updateBackground = (background: string) => {
    updateSettings({ background });
  };

  const updateCustomText = (key: string, value: string) => {
    updateSettings({ 
      customTexts: { ...settings.customTexts, [key]: value } 
    });
  };

  const updateCustomImage = (key: string, value: string) => {
    updateSettings({ 
      customImages: { ...settings.customImages, [key]: value } 
    });
  };

  return {
    settings,
    updateLogo,
    updateTheme,
    updateBackground,
    updateCustomText,
    updateCustomImage
  };
};
