import { useState } from "react";
import { Portfolio } from "@shared/schema";
import { ThemeSelector } from "./theme-selector";
import { PersonalDetailsForm } from "./personal-details-form";
import { ExperienceForm } from "./experience-form";
import { ProjectsForm } from "./projects-form";
import { PortfolioPreview } from "./portfolio-preview";
import { SampleDataGenerator } from "./sample-data-generator";
import { StepIndicator, Step } from "./step-indicator";

interface PortfolioBuilderProps {
  portfolio: Portfolio;
}

const steps: Step[] = [
  { id: 1, name: "Theme" },
  { id: 2, name: "Details" },
  { id: 3, name: "Experience" },
  { id: 4, name: "Projects" },
  { id: 5, name: "Preview" },
];

export function PortfolioBuilder({ portfolio }: PortfolioBuilderProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };
  
  const handleEdit = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block text-transparent bg-clip-text">Create Your Portfolio</h1>
          <p className="mt-2 text-sm text-slate-500">
            Follow the steps below to generate your professional portfolio
          </p>
        </div>
        <div>
          <SampleDataGenerator 
            portfolio={portfolio} 
            onSampleApplied={() => setCurrentStep(2)} 
          />
        </div>
      </div>
      
      <StepIndicator
        steps={steps} 
        currentStep={currentStep} 
        onStepClick={handleStepClick}
      />
      
      {currentStep === 1 && (
        <ThemeSelector 
          selectedTheme={portfolio.theme} 
          onNext={handleNext} 
        />
      )}
      
      {currentStep === 2 && (
        <PersonalDetailsForm 
          portfolio={portfolio} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      )}
      
      {currentStep === 3 && (
        <ExperienceForm 
          portfolio={portfolio} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      )}
      
      {currentStep === 4 && (
        <ProjectsForm 
          portfolio={portfolio} 
          onBack={handleBack} 
          onNext={handleNext} 
        />
      )}
      
      {currentStep === 5 && (
        <PortfolioPreview 
          portfolio={portfolio} 
          onBack={handleBack} 
          onEdit={handleEdit} 
        />
      )}
    </div>
  );
}
