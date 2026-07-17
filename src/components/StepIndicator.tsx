import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[]; // Labels for each step
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const bg = isActive
          ? 'bg-[#4F8CFF] text-white'
          : isCompleted
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-white/5 text-gray-500';
        return (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${bg}`}
            >
              {isCompleted ? '✓' : stepNum}
            </div>
            <span className={`ml-2 text-sm ${isActive ? 'font-bold text-white' : ''}`}>{label}</span>
            {stepNum < totalSteps && (
              <span className="mx-2 text-gray-600">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
