import { cn } from "@/lib/utils";

export type Step = {
  id: number;
  name: string;
};

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="text-sm flex flex-col items-center"
              onClick={() => onStepClick && step.id <= currentStep && onStepClick(step.id)}
            >
              <span
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full",
                  "transition-colors duration-200 ease-in-out",
                  step.id < currentStep 
                    ? "bg-green-500 text-white cursor-pointer" 
                    : step.id === currentStep
                    ? "bg-yellow-500 text-white"
                    : "bg-white border-2 border-slate-300 text-slate-500",
                  onStepClick && step.id <= currentStep ? "cursor-pointer" : ""
                )}
              >
                {step.id}
              </span>
              <span 
                className={cn(
                  "mt-2 font-medium",
                  step.id <= currentStep ? "text-slate-500" : "text-slate-500"
                )}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
