
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Eye, EyeOff, Store } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface VendorBannerData {
  pseudonym: string;
  bannerImage: string | null;
  isVisible: boolean;
  invisibleMode: boolean;
  shopName: string;
}

const VendorBanner = () => {
  const { session } = useSession();
  const [bannerData, setBannerData] = useState<VendorBannerData>({
    pseudonym: session?.pseudonym || '',
    bannerImage: null,
    isVisible: true,
    invisibleMode: false,
    shopName: ''
  });
  const [tempShopName, setTempShopName] = useState('');

  useEffect(() => {
    if (session) {
      const savedBanner = localStorage.getItem(`vendor_banner_${session.pseudonym}`);
      if (savedBanner) {
        try {
          const parsed = JSON.parse(savedBanner);
          setBannerData({ ...parsed, shopName: parsed.shopName || '' });
          setTempShopName(parsed.shopName || '');
        } catch (error) {
          console.error('Failed to parse banner data:', error);
        }
      } else {
        setBannerData(prev => ({
          ...prev,
          pseudonym: session.pseudonym
        }));
      }
    }
  }, [session]);

  const saveBannerData = (newData: VendorBannerData) => {
    setBannerData(newData);
    if (session) {
      localStorage.setItem(`vendor_banner_${session.pseudonym}`, JSON.stringify(newData));
    }
  };

  const handleBannerImageChange = (imageUrl: string | null) => {
    const newData = {
      ...bannerData,
      bannerImage: imageUrl
    };
    saveBannerData(newData);
  };

  const handleVisibilityChange = (value: string) => {
    const newData = {
      ...bannerData,
      isVisible: value === 'visible'
    };
    saveBannerData(newData);
  };

  const toggleInvisibleMode = () => {
    const newData = {
      ...bannerData,
      invisibleMode: !bannerData.invisibleMode
    };
    saveBannerData(newData);
  };

  const handleShopNameSave = () => {
    const newData = {
      ...bannerData,
      shopName: tempShopName.trim()
    };
    saveBannerData(newData);
  };

  if (!session) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Shop Banner & Name</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="text-gray-300 mb-3 block flex items-center gap-2">
            <Store className="h-4 w-4" />
            Shop Name
          </Label>
          <div className="flex gap-2">
            <Input
              value={tempShopName}
              onChange={(e) => setTempShopName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100"
              placeholder="Geben Sie Ihren Shop-Namen ein"
              maxLength={50}
            />
            <Button
              onClick={handleShopNameSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Speichern
            </Button>
          </div>
          {bannerData.shopName && (
            <p className="text-sm text-gray-400 mt-2">
              Aktueller Name: <span className="text-green-400">{bannerData.shopName}</span>
            </p>
          )}
        </div>

        <div>
          <Label className="text-gray-300 mb-3 block">Banner Image (Fixed Size)</Label>
          <ImageUpload
            currentImage={bannerData.bannerImage}
            onImageChange={handleBannerImageChange}
            placeholder="Upload your shop banner"
            allowDownload={true}
            className="w-full max-w-md"
          />
        </div>

        <div>
          <Label className="text-gray-300 mb-3 block">Banner Visibility</Label>
          <RadioGroup
            value={bannerData.isVisible ? 'visible' : 'hidden'}
            onValueChange={handleVisibilityChange}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visible" id="visible" />
              <Label htmlFor="visible" className="text-gray-300">Show on marketplace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hidden" id="hidden" />
              <Label htmlFor="hidden" className="text-gray-300">Hide from marketplace</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Button
            onClick={toggleInvisibleMode}
            variant={bannerData.invisibleMode ? "destructive" : "outline"}
            className={bannerData.invisibleMode ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
          >
            {bannerData.invisibleMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Invisible Mode: ON
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Invisible Mode: OFF
              </>
            )}
          </Button>
          <p className="text-gray-400 text-xs mt-2">
            Invisible mode overrides banner visibility and hides your shop completely from the marketplace
          </p>
        </div>

        {bannerData.bannerImage && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
            <div className="bg-gray-900 rounded p-2">
              <img
                src={bannerData.bannerImage}
                alt="Banner Preview"
                className="w-full max-w-sm h-32 object-cover rounded"
              />
              {bannerData.shopName && (
                <p className="text-center text-gray-300 mt-2 font-semibold">
                  {bannerData.shopName}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorBanner;
