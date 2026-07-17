import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  width?: number;
}

/** Realistic Samsung Galaxy phone frame SVG border */
export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, width = 340 }) => {
  const height = width * (19.5 / 9);
  const borderRadius = width * 0.14;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width, height }}
    >
      {/* Outer phone body */}
      <div
        className="absolute inset-0 glow-blue"
        style={{
          background: 'linear-gradient(145deg, #1c1f2e 0%, #0d0f17 100%)',
          borderRadius,
          border: '3px solid #2a2d3e',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.04),
            0 24px 64px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.08)
          `,
        }}
      />

      {/* Volume buttons (left side) */}
      <div
        className="absolute"
        style={{
          left: -4,
          top: '22%',
          width: 3,
          height: '8%',
          background: '#2a2d3e',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        className="absolute"
        style={{
          left: -4,
          top: '31%',
          width: 3,
          height: '6%',
          background: '#2a2d3e',
          borderRadius: '2px 0 0 2px',
        }}
      />

      {/* Power button (right side) */}
      <div
        className="absolute"
        style={{
          right: -4,
          top: '26%',
          width: 3,
          height: '9%',
          background: '#2a2d3e',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Inner screen bezel */}
      <div
        className="absolute"
        style={{
          inset: 10,
          borderRadius: borderRadius - 6,
          background: '#07080b',
          overflow: 'hidden',
        }}
      >
        {/* Punch-hole camera notch */}
        <div
          className="absolute z-30 flex items-center justify-center"
          style={{
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#0a0b10',
            border: '1px solid #1a1d28',
            boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
          }}
        />

        {/* Screen content area */}
        <div
          className="absolute inset-0 overflow-hidden select-none"
          style={{ borderRadius: borderRadius - 6 }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
