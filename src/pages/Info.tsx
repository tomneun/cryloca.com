import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useDesign } from '@/hooks/useDesign';

const Info = () => {
  const navigate = useNavigate();
  const { settings } = useDesign();

  // Get admin-configured info content
  const infoContent = settings.customTexts['info_content'] || 'No news available at the moment.';
  const infoTitle = settings.customTexts['info_title'] || 'Shop News & Updates';
  const infoImage = settings.customImages['info_banner'];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {infoTitle}
          </h1>

          {infoImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={infoImage} 
                alt="Info Banner" 
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {infoContent}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              Stay tuned for more updates from Cryloca.com
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Info;
