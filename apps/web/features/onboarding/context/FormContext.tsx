"use client";

import { createContext, useContext } from "react";
import { OnboardingSchema } from "../types/onboardingSchema";

type FormContextType = {
  formData: OnboardingSchema;
  updateFormData: (data: Partial<OnboardingSchema>) => void;
  goToStepFour: () => void;
};

export const FormContext = createContext<FormContextType | null>(null);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
