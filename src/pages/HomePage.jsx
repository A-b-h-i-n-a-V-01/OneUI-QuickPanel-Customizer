import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Sliders, Image, Download, Save, Eye } from 'lucide-react';
import { PhoneMockup } from '../components/phone/PhoneMockup';

const FEATURE_LIST = [
  { icon: <Image size={18} />, title: 'Upload Screenshot', desc: 'Drop in your Samsung Quick Panel screenshot to serve as a pixel-perfect calibration guide.' },
  { icon: <Sliders size={18} />, title: 'Manual Calibration', desc: 'Drag and resize translucent overlays to lock onto each quick panel region exactly.' },
  { icon: <Sparkles size={18} />, title: 'Wallpaper Editor', desc: 'Position, zoom, rotate, and apply custom blur filters to your background image live.' },
  { icon: <Eye size={18} />, title: 'Interactive Preview', desc: 'Verify how your custom background panels align within a simulated Galaxy device mockup.' },
  { icon: <Download size={18} />, title: 'Export PNG Overlays', desc: 'Download individual pre-cropped PNG files ready to import directly into Samsung Theme Park.' },
  { icon: <Save size={18} />, title: 'Save & Load Profiles', desc: 'Store your custom device dimensions in the browser and reload them to skip calibration next time.' },
];

export const HomePage = ({ hasSavedCalibration, onStart, onResume }) => {
  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 py-12 lg:py-20 gap-16 lg:gap-24 overflow-x-hidden">
      {/* Asymmetric Hero Split-Screen */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 w-full">
        {/* Left Column: Brand Copy & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-start text-left"
        >
          {/* Subtle Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300 text-[11px] font-semibold tracking-wider uppercase mb-6">
            <Sparkles size={12} className="text-primary" /> Samsung One UI Quick Panel Customizer
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6">
            Create Pixel-Perfect 
            <span className="block text-primary">Quick Panel Backgrounds</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 max-w-[55ch] leading-relaxed mb-8">
            Take absolute control over your Samsung Galaxy themes. Manually calibrate custom panel regions and position wallpapers with sub-pixel precision. No automated templates. Pure creative control.
          </p>

          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onStart}
              className="btn-primary flex items-center justify-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all duration-200"
            >
              Start Calibration <ArrowRight size={16} />
            </button>

            {hasSavedCalibration && (
              <button
                onClick={() => onResume('wallpaper-upload')}
                className="btn-secondary flex items-center justify-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all duration-200"
              >
                <Save size={15} /> Resume Workflow
              </button>
            )}
          </div>
        </motion.div>

        {/* Right Column: Visual Mockup / Interactive Component */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 flex justify-center lg:justify-end"
        >
          <div className="relative group">
            {/* Soft Ambient Shadow Glow */}
            <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-tr from-primary/5 to-transparent blur-3xl opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
            
            <PhoneMockup width={270}>
              {/* Simulated UI Mockup inside Phone */}
              <div className="w-full h-full bg-[#0b0c10] flex flex-col p-4 justify-start gap-4">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono tracking-tight pb-1 border-b border-white/5">
                  <span>12:45</span>
                  <div className="flex gap-1.5 items-center">
                    <span>5G</span>
                    <div className="w-3.5 h-2 border border-gray-500 rounded-sm p-0.5 flex items-center"><div className="w-full h-full bg-gray-500 rounded-2xs" /></div>
                  </div>
                </div>
                {/* Simulated Quick Panel Cards */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <div className="h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center px-3 gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><Sparkles size={11} /></div>
                    <div className="flex-1 h-3.5 rounded-md bg-white/[0.05] w-2/3" />
                  </div>
                  <div className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 rounded bg-white/[0.06] w-1/3" />
                      <div className="w-4 h-4 rounded-full bg-white/[0.08]" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i === 1 ? 'bg-primary text-white' : 'bg-white/[0.05]'}`}>
                            <div className="w-2.5 h-2.5 rounded-full border border-current" />
                          </div>
                          <div className="h-2 rounded bg-white/[0.05] w-4/5" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3 flex flex-col gap-2">
                    <div className="flex justify-between text-[9px] text-gray-500"><span className="w-8 h-2 rounded bg-white/[0.06]" /><span className="w-6 h-2 rounded bg-white/[0.06]" /></div>
                    <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden"><div className="h-full bg-primary w-3/4" /></div>
                  </div>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid Features Layout (Asymmetric, non-generic) */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col items-start text-left max-w-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-3">
            Engineered Workflow
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every step is designed to give you precise control, skipping visual assumptions and letting you lock down coordinates manually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {FEATURE_LIST.map((f, i) => {
            // Apply asymmetric sizes to bento items (the 1st and 5th items are larger/different styled)
            const isFeatured = i === 0 || i === 4;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`
                  rounded-2xl p-6 border transition-all duration-300 flex flex-col gap-4 text-left
                  ${isFeatured 
                    ? 'bg-white/[0.03] border-white/[0.08] md:col-span-2 shadow-sm' 
                    : 'bg-white/[0.015] border-white/[0.04]'
                  }
                  hover:border-white/[0.12] hover:bg-white/[0.04] group
                `}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                  {f.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">{f.title}</h3>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-[60ch]">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
