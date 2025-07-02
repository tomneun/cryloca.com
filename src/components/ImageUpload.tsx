
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Download } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  allowDownload?: boolean;
}

const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  acceptedTypes = "image/*",
  maxSize = 5,
  className = "",
  placeholder = "Upload image",
  allowDownload = false
}: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = 'banner.png';
      link.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver 
            ? 'border-red-500 bg-red-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        } ${currentImage ? 'bg-gray-800' : 'bg-gray-700'}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
            <div className="flex gap-2 justify-center">
              {allowDownload && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadImage}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Upload className="h-4 w-4 mr-1" />
                Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onImageChange(null)}
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer py-8"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 mb-1">{placeholder}</p>
            <p className="text-xs text-gray-500">
              Drag & drop or click to select (max {maxSize}MB)
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
