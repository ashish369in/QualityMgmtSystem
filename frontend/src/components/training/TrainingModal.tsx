import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface TrainingStep {
  title: string;
  content: React.ReactNode;
  image?: string;
}

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: TrainingStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  steps,
  currentStep,
  onNext,
  onPrevious,
  onComplete,
}) => {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{steps[currentStep]?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="min-h-[300px] flex flex-col items-center justify-center p-4">
            {steps[currentStep]?.content}
            {steps[currentStep]?.image && (
              <img
                src={steps[currentStep].image}
                alt="Training step illustration"
                className="max-w-full h-auto mt-4 rounded-lg shadow-md"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={onPrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
            {isLastStep ? (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Complete Training
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
