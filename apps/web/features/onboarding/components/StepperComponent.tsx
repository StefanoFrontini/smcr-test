import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@repo/ui";
import type { Steps } from "../hooks/useStep";

type Props = {
  currentStep: number;
  handleStepChange: (step: number) => void;
  steps: Steps;
};

export default function StepperComponent({
  currentStep,
  handleStepChange,
  steps,
}: Props) {
  return (
    <div className="ui:mx-auto ui:max-w-xl ui:space-y-8 ui:text-center">
      <Stepper value={currentStep} onValueChange={handleStepChange}>
        {steps.map((step) => (
          <StepperItem key={step} step={step} className="not-last:ui:flex-1">
            <StepperTrigger asChild>
              <StepperIndicator />
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>

      <div className="ui:flex ui:justify-center ui:space-x-4"></div>
    </div>
  );
}
