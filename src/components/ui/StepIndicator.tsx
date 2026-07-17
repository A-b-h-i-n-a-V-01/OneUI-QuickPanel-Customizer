import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;  // 1-indexed
  steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <React.Fragment key={stepNum}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? 'bg-[#34C97A]/20 text-[#34C97A] border border-[#34C97A]/40'
                    : isActive
                    ? 'bg-[#4F8CFF] text-white shadow-lg shadow-[#4F8CFF]/30'
                    : 'bg-white/5 text-gray-600 border border-white/8'
                  }
                `}
              >
                {isCompleted ? <Check size={14} /> : stepNum}
              </div>
              <span
                className={`
                  mt-1.5 text-[10px] font-semibold whitespace-nowrap hidden sm:block
                  ${isActive ? 'text-white' : isCompleted ? 'text-[#34C97A]' : 'text-gray-600'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {idx < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 transition-all duration-300 mb-4 sm:mb-5"
                style={{
                  background: isCompleted
                    ? 'rgba(52,201,122,0.4)'
                    : 'rgba(255,255,255,0.07)',
                  minWidth: 16,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
