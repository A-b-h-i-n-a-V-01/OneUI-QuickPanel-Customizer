import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children }) => {
  return (
    <div className="relative mx-auto w-full max-w-[345px] aspect-[9/19.5] bg-[#08080a] rounded-[52px] p-3 shadow-2xl border-4 border-[#2c2e38] flex flex-col justify-between overflow-hidden transition-smooth glow-primary">
      {/* Speaker ear piece */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1c1d24] rounded-full z-30" />
      
      {/* Front camera punch hole */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0d0d0f] border border-[#2c2e38] rounded-full z-30 flex items-center justify-center">
        <div className="w-2 h-2 bg-[#121620] rounded-full" />
      </div>

      {/* Side buttons */}
      {/* Volume Rocker */}
      <div className="absolute right-[-4px] top-24 w-[3px] h-20 bg-[#2c2e38] rounded-l-md z-20" />
      {/* Power Button */}
      <div className="absolute right-[-4px] top-48 w-[3px] h-10 bg-[#2c2e38] rounded-l-md z-20" />

      {/* Screen container */}
      <div className="relative w-full h-full bg-[#0d0e12] rounded-[42px] overflow-hidden flex flex-col items-center justify-center z-10 select-none">
        {children}
      </div>
    </div>
  );
};
