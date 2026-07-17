import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Sliders, Image, Download, Save } from 'lucide-react';




const FEATURE_LIST = [
  { icon: <Image size={18} />, title: 'Upload Your Screenshot', desc: 'Drop in your Samsung Quick Panel screenshot to use guide.' },
  { icon: <Sliders size={18} />, title: 'Manual Calibration', desc: 'Drag and resize translucent overlays to match each panel region exactly.' },
  { icon: <Sparkles size={18} />, title: 'Wallpaper Editor', desc: 'Position, zoom, rotate, and apply filters to your background image live.' },
  { icon: <Download size={18} />, title: 'Export PNGs', desc: 'Download individual PNG files per panel ready for Samsung One UI.' },
  { icon: <Save size={18} />, title: 'Save Calibration', desc: 'Store your calibration in the browser and skip recalibration next time.' },
];

export const HomePage = ({ hasSavedCalibration, onStart, onResume }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-12 pb-16 px-6 max-w-3xl mx-auto w-full">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="text-center mb-12"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4F8CFF]/10 border border-[#4F8CFF]/25 text-[#4F8CFF] text-xs font-bold mb-6">
          <Sparkles size={13} /> Samsung One UI Quick Panel Editor
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-5 leading-[1.1]">
          Create Perfect
          <br />
          <span className="bg-gradient-to-r from-[#4F8CFF] via-[#8eb5ff] to-[#4F8CFF] bg-clip-text text-transparent">
            Quick Panel Backgrounds
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
          Manually calibrate your Samsung Galaxy Quick Panel regions and position your wallpaper with pixel-perfect precision. No automatic detection. Pure creative control.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="btn-primary text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#4F8CFF]/25"
          >
            Start Calibration <ArrowRight size={18} />
          </motion.button>

          {hasSavedCalibration && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onResume('wallpaper-upload')}
              className="btn-secondary text-sm px-6 py-4 rounded-2xl"
            >
              <Save size={15} /> Resume (skip recalibration)
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {FEATURE_LIST.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="glass-light rounded-2xl p-4 border border-white/5 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4F8CFF]/12 text-[#4F8CFF] flex items-center justify-center flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-0.5">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
