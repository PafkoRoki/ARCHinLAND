import React from 'react';

export interface StepperProps {
  children: React.ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: Record<string, any>;
  nextButtonProps?: Record<string, any>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (step: number, isActive: boolean) => React.ReactNode;
  [key: string]: any;
}

export interface StepProps {
  children: React.ReactNode;
  [key: string]: any;
}

declare const Stepper: React.FC<StepperProps>;
export default Stepper;

export const Step: React.FC<StepProps>;
