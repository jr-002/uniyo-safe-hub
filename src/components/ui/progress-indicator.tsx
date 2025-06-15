
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  showConnectors?: boolean;
  className?: string;
}

export const ProgressIndicator = ({
  steps,
  orientation = 'horizontal',
  showConnectors = true,
  className
}: ProgressIndicatorProps) => {
  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'active':
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const getStepStyles = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 border-green-600 text-white';
      case 'error':
        return 'bg-red-600 border-red-600 text-white';
      case 'active':
        return 'bg-primary border-primary text-primary-foreground';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  const getConnectorStyles = (currentIndex: number) => {
    const currentStep = steps[currentIndex];
    const nextStep = steps[currentIndex + 1];
    
    if (currentStep?.status === 'completed') {
      return 'bg-green-600';
    } else if (currentStep?.status === 'error') {
      return 'bg-red-600';
    } else {
      return 'bg-border';
    }
  };

  return (
    <div 
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className
      )}
      role="progressbar"
      aria-label="Process steps"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={cn(
              'flex items-center',
              orientation === 'vertical' ? 'flex-row' : 'flex-col'
            )}
          >
            {/* Step Circle */}
            <div
              className={cn(
                'flex items-center justify-center rounded-full border-2 transition-all duration-200',
                orientation === 'vertical' ? 'h-8 w-8' : 'h-10 w-10',
                getStepStyles(step.status)
              )}
              aria-current={step.status === 'active' ? 'step' : undefined}
            >
              {getStepIcon(step.status) || (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Content */}
            <div 
              className={cn(
                'text-center',
                orientation === 'vertical' ? 'ml-3 text-left' : 'mt-2'
              )}
            >
              <div 
                className={cn(
                  'text-sm font-medium',
                  step.status === 'active' && 'text-primary',
                  step.status === 'completed' && 'text-green-700',
                  step.status === 'error' && 'text-red-700',
                  step.status === 'pending' && 'text-muted-foreground'
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </div>

          {/* Connector */}
          {showConnectors && index < steps.length - 1 && (
            <div
              className={cn(
                'transition-all duration-200',
                orientation === 'vertical' 
                  ? 'h-8 w-0.5 ml-4 my-2' 
                  : 'h-0.5 flex-1 mx-4',
                getConnectorStyles(index)
              )}
              aria-hidden="true"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Multi-step form progress variant
export const FormProgress = ({ 
  currentStep, 
  totalSteps, 
  stepLabels = [] 
}: { 
  currentStep: number; 
  totalSteps: number; 
  stepLabels?: string[];
}) => {
  const steps: Step[] = Array.from({ length: totalSteps }, (_, index) => ({
    id: `step-${index + 1}`,
    title: stepLabels[index] || `Step ${index + 1}`,
    status: index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending'
  }));

  return (
    <div className="w-full">
      <ProgressIndicator steps={steps} orientation="horizontal" />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};
