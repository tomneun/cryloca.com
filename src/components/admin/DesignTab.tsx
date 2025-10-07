import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Image, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useDesign } from '@/hooks/useDesign';

const THEMES = [
  { id: 'default', name: 'Standard', colors: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { id: 'neon', name: 'Neon', colors: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500' },
  { id: 'minimal', name: 'Minimal', colors: 'bg-gradient-to-r from-gray-700 to-gray-900' },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: 'bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600' }
];

const DesignTab = () => {
  const { settings, updateLogo, updateTheme, updateBackground, updateCustomText, updateCustomImage } = useDesign();
  const [logoUrl, setLogoUrl] = useState(settings.logo);
  const [backgroundUrl, setBackgroundUrl] = useState(settings.background);
  const [infoTitle, setInfoTitle] = useState(settings.customTexts['info_title'] || '');
  const [infoContent, setInfoContent] = useState(settings.customTexts['info_content'] || '');
  const [infoImage, setInfoImage] = useState(settings.customImages['info_banner'] || '');

  const handleLogoUpdate = () => {
    if (!logoUrl) {
      toast.error('Bitte Logo-URL eingeben');
      return;
    }
    updateLogo(logoUrl);
    toast.success('Logo aktualisiert');
  };

  const handleThemeChange = (themeId: string) => {
    updateTheme(themeId as any);
    toast.success(`Theme "${THEMES.find(t => t.id === themeId)?.name}" aktiviert`);
  };

  const handleBackgroundUpdate = () => {
    updateBackground(backgroundUrl);
    toast.success('Hintergrund aktualisiert');
  };

  const handleInfoUpdate = () => {
    updateCustomText('info_title', infoTitle);
    updateCustomText('info_content', infoContent);
    updateCustomImage('info_banner', infoImage);
    toast.success('Info-Seite aktualisiert');
  };

  return (
    <div className="space-y-6">
      {/* Logo Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-6 w-6 text-blue-400" />
            Logo-Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img 
              src={settings.logo} 
              alt="Current Logo" 
              className="h-16 w-auto bg-white rounded p-2"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
            <div className="flex-1">
              <Label htmlFor="logoUrl" className="text-gray-300">Logo-URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="logoUrl"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="/logo.png oder https://..."
                />
                <Button onClick={handleLogoUpdate} className="bg-blue-600 hover:bg-blue-700">
                  Speichern
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Tipp: Lade Bilder in den /public Ordner hoch und verwende /dateiname.png
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-purple-400" />
            Theme-Auswahl
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">Ein Klick ändert das gesamte Design</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  settings.theme === theme.id
                    ? 'border-primary scale-105'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className={`h-20 ${theme.colors} rounded mb-2`} />
                <p className="text-sm font-semibold text-gray-100">{theme.name}</p>
                {settings.theme === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-400" />
            Hintergrund-Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="backgroundUrl" className="text-gray-300">Hintergrund-URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="backgroundUrl"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
                placeholder="/background.jpg oder https://..."
              />
              <Button onClick={handleBackgroundUpdate} className="bg-green-600 hover:bg-green-700">
                Speichern
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Lade JPG-Bilder in den /public Ordner hoch
            </p>
          </div>
          {settings.background && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Vorschau:</p>
              <div 
                className="h-32 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${settings.background})` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Page Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-yellow-400" />
            Info-Seite verwalten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="infoTitle" className="text-gray-300">Titel</Label>
            <Input
              id="infoTitle"
              value={infoTitle}
              onChange={(e) => setInfoTitle(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
              placeholder="Shop News & Updates"
            />
          </div>

          <div>
            <Label htmlFor="infoContent" className="text-gray-300">Inhalt</Label>
            <Textarea
              id="infoContent"
              value={infoContent}
              onChange={(e) => setInfoContent(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 mt-1 min-h-[200px]"
              placeholder="Geben Sie hier Neuigkeiten und Updates ein..."
            />
          </div>

          <div>
            <Label htmlFor="infoImage" className="text-gray-300">Banner-Bild URL (optional)</Label>
            <Input
              id="infoImage"
              value={infoImage}
              onChange={(e) => setInfoImage(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 mt-1"
              placeholder="/info-banner.jpg oder https://..."
            />
            <p className="text-xs text-gray-400 mt-1">
              Lade Bilder in den /public Ordner hoch
            </p>
          </div>

          {infoImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Vorschau:</p>
              <img 
                src={infoImage} 
                alt="Info Banner" 
                className="max-h-48 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <Button onClick={handleInfoUpdate} className="bg-yellow-600 hover:bg-yellow-700 w-full">
            Info-Seite speichern
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignTab;
