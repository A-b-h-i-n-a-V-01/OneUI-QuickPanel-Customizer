import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Image } from 'lucide-react';
import { DropzoneCard } from '../components/ui/DropzoneCard';
import { PhoneMockup } from '../components/phone/PhoneMockup';

interface WallpaperPageProps {
  wallpaperUrl: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const WallpaperPage: React.FC<WallpaperPageProps> = ({
  wallpaperUrl,
  onFileSelect,
  onClear,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 4</p>
        <h2 className="text-2xl font-black text-white">Upload Your Wallpaper</h2>
        <p className="text-gray-400 text-sm mt-1">
          Choose the background image that will appear behind your Quick Panel regions.
          Use the editor in the next step to position and style it.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-6 flex-1"
      >
        {/* Dropzone */}
        <div className="flex-1 flex flex-col gap-4">
          <DropzoneCard
            title="Background Wallpaper"
            description="Drop a high-resolution PNG, JPG, or WEBP image. Higher resolution = better export quality."
            previewUrl={wallpaperUrl}
            onFileSelect={onFileSelect}
            onClear={onClear}
            icon={<Image size={26} />}
          />

          {/* Tips */}
          <div className="glass-light rounded-xl p-4 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <p className="font-bold text-gray-300 mb-1.5">🖼 Wallpaper Tips</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use at least 1080×2400px for Samsung Galaxy S-series</li>
              <li>Portrait orientation works best</li>
              <li>You can adjust blur, brightness, and more in the editor</li>
              <li>High contrast images tend to look great behind panel regions</li>
            </ul>
          </div>
        </div>

        {/* Preview */}
        <div className="flex justify-center lg:justify-start">
          <div className="flex flex-col items-center gap-3">
            <PhoneMockup width={220}>
              {wallpaperUrl ? (
                <img
                  src={wallpaperUrl}
                  alt="Wallpaper preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-700">
                  <Image size={28} />
                  <p className="text-xs text-center px-4">Upload a wallpaper to preview</p>
                </div>
              )}
            </PhoneMockup>
            {wallpaperUrl && (
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Wallpaper Preview
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <button onClick={onBack} className="btn-ghost">
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!wallpaperUrl}
          className="btn-primary"
        >
          Next: Edit Wallpaper <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
