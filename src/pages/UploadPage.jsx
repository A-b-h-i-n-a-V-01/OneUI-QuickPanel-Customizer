import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Smartphone } from 'lucide-react';
import { DropzoneCard } from '../components/ui/DropzoneCard';
import { PhoneMockup } from '../components/phone/PhoneMockup';



export const UploadPage = ({
  screenshotUrl,
  onFileSelect,
  onClear,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[#4F8CFF] text-xs font-bold uppercase tracking-wider mb-1">Step 1</p>
        <h2 className="text-2xl font-black text-white">Upload Your Quick Panel Screenshot</h2>
        <p className="text-gray-400 text-sm mt-1">
          Take a full screenshot of your expanded Samsung Quick Panel and upload it here.
          It will be used alignment guide during calibration.
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
            title="Quick Panel Screenshot"
            description="Drop a PNG, JPG, or WEBP. Use a full-screen screenshot including the status bar."
            previewUrl={screenshotUrl}
            onFileSelect={onFileSelect}
            onClear={onClear}
            icon={<Smartphone size={26} />}
          />

          {/* Tips */}
          <div className="glass-light rounded-xl p-4 border border-white/5 text-xs text-gray-400 leading-relaxed">
            <p className="font-bold text-gray-300 mb-1.5">📸 Screenshot Tips</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Swipe down twice to fully expand the Quick Panel</li>
              <li>Make sure all your enabled panels are visible</li>
              <li>Use the highest resolution screenshot available</li>
              <li>Avoid cropping — include the full screen height</li>
            </ul>
          </div>
        </div>

        {/* Phone preview */}
        <div className="flex justify-center lg:justify-start">
          <div className="flex flex-col items-center gap-3">
            <PhoneMockup width={220}>
              {screenshotUrl ? (
                <img
                  src={screenshotUrl}
                  alt="Screenshot preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-700">
                  <Smartphone size={28} />
                  <p className="text-xs text-center px-4">Upload a screenshot to preview</p>
                </div>
              )}
            </PhoneMockup>
            {screenshotUrl && (
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Preview
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
          disabled={!screenshotUrl}
          className="btn-primary"
        >
          Next: Select Panels <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
