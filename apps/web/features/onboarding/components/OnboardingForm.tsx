"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";

import useClipboard from "@/hooks/useClipboard";
import { useActionState, useEffect, useState } from "react";
import { onSubmitFormData } from "../actions/actions";
import { OnboardingSchema } from "../types/onboardingSchema";
import {
  StepOneSchema,
  defaultValues as defaultValuesStepOne,
} from "../types/stepOneSchema";
import {
  StepTwoSchema,
  defaultValues as defaultValuesStepTwo,
} from "../types/stepTwoSchema";
import { getPostData } from "../utils/getPostData";
import { getStepOneData, getStepTwoData } from "../utils/getStepData";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { FormContext } from "../context/FormContext";
import { useStep } from "../hooks/useStep";
import StepFour from "./StepFour";
import StepperComponent from "./StepperComponent";

const outputOptions = ["clipboard", "uat", "prod"] as const;
export type OutputOption = (typeof outputOptions)[number];

export default function OnboardingForm() {
  const {
    currentStep,
    isFirstStep,
    isStepThree,
    nextStep,
    prevStep,
    goToStepOne,
    handleStepChange,
    steps,
    goToStepFour,
  } = useStep();
  const { isCopied, copyToClipboard } = useClipboard();

  const [formData, setFormData] = useState<OnboardingSchema>({
    ...defaultValuesStepOne,
    ...defaultValuesStepTwo,
  });
  const [isStepOneSubmitted, setIsStepOneSubmitted] = useState(false);
  const [isSetTwoSubmitted, setIsSetTwoSubmitted] = useState(false);
  const [outputOption, setOutputOption] = useState<OutputOption>("clipboard");

  function handleStepOneSubmit(): void {
    setIsStepOneSubmitted(true);
  }
  function resetStepOneData() {
    setIsStepOneSubmitted(false);
  }
  function resetStepTwoData() {
    setIsSetTwoSubmitted(false);
  }
  function handleStepTwoSubmit(): void {
    setIsSetTwoSubmitted(true);
  }
  function updateFormData(
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ): void {
    setFormData((prev) => {
      console.log({ ...prev, ...data });
      return { ...prev, ...data };
    });
  }

  const [state, action, isPending] = useActionState(onSubmitFormData, null);
  async function handleSubmit() {
    if (outputOption === "clipboard") {
      console.log({ formData });
      console.log({ getPostData: getPostData(formData) });
      copyToClipboard(JSON.stringify(getPostData(formData)));
    } else {
      const newFormData = new FormData();
      newFormData.append("output", outputOption);
      newFormData.append("data", JSON.stringify(formData));
      return action(newFormData);
    }
  }
  useEffect(() => {
    if (!state || isPending) return;
    if (!state.success) {
      toast.error(state.message);
      return;
    }
    toast.success(state.message);
    resetStepOneData();
    resetStepTwoData();
    nextStep();
  }, [state, isPending, nextStep]);

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            isStepThree={isStepThree}
            isFirstStep={isFirstStep}
            prevStep={prevStep}
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            getStepOneData={getStepOneData}
            isStepOneSubmitted={isStepOneSubmitted}
            handleStepOneSubmit={handleStepOneSubmit}
            style={{ viewTransitionName: "stepOne" }}
            goToStepFour={goToStepFour}
          >
            <StepperComponent
              currentStep={currentStep}
              handleStepChange={handleStepChange}
              steps={steps}
            />
          </StepOne>
        );
      case 2:
        return (
          <StepTwo
            goToStepFour={goToStepFour}
            isStepThree={isStepThree}
            prevStep={prevStep}
            nextStep={nextStep}
            updateFormData={updateFormData}
            isStepTwoSubmitted={isSetTwoSubmitted}
            handleStepTwoSubmit={handleStepTwoSubmit}
            getStepTwoData={getStepTwoData}
            formData={formData}
            style={{ viewTransitionName: "stepTwo" }}
          >
            <StepperComponent
              currentStep={currentStep}
              handleStepChange={handleStepChange}
              steps={steps}
            />
          </StepTwo>
        );
      case 3:
        return (
          <>
            <StepOne
              goToStepFour={goToStepFour}
              isStepThree={isStepThree}
              isFirstStep={isFirstStep}
              prevStep={prevStep}
              nextStep={nextStep}
              updateFormData={updateFormData}
              formData={formData}
              getStepOneData={getStepOneData}
              isStepOneSubmitted={isStepOneSubmitted}
              handleStepOneSubmit={handleStepOneSubmit}
            ></StepOne>
            <StepTwo
              goToStepFour={goToStepFour}
              isStepThree={isStepThree}
              prevStep={prevStep}
              nextStep={nextStep}
              updateFormData={updateFormData}
              isStepTwoSubmitted={isSetTwoSubmitted}
              handleStepTwoSubmit={handleStepTwoSubmit}
              getStepTwoData={getStepTwoData}
              formData={formData}
            />
            <form action={handleSubmit}>
              <div className="flex justify-end gap-4 pt-8">
                <Button
                  variant="outline"
                  className="w-fit sm:w-32 hover: cursor-pointer"
                  onClick={prevStep}
                  disabled={isFirstStep}
                  type="button"
                >
                  Indietro
                </Button>

                <Select
                  key={outputOption}
                  name="output"
                  value={outputOption}
                  onValueChange={(value: OutputOption) => {
                    setOutputOption(value);
                  }}
                >
                  <SelectTrigger className="ui:hover cursor-pointer disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {outputOptions.map((option: OutputOption) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  variant="pagopaprimary"
                  type="submit"
                  className="w-fit sm:w-32"
                >
                  {isPending ? (
                    <LoaderCircle
                      className="ui:animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    "Invia"
                  )}
                </Button>
              </div>
            </form>
          </>
        );
      case 4:
        return (
          <StepFour
            formData={formData}
            resetStepOneData={resetStepOneData}
            resetStepTwoData={resetStepTwoData}
            goToStepOne={goToStepOne}
          >
            <StepperComponent
              currentStep={currentStep}
              handleStepChange={handleStepChange}
              steps={steps}
            />
          </StepFour>
        );
      default:
        throw new Error(`Invalid currentStep: ${currentStep satisfies never}`);
    }
  }

  return (
    <FormContext.Provider value={{ formData, updateFormData, goToStepFour }}>
      <div className="container flex flex-col py-8  max-w-3xl mx-auto ">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            {isStepThree && (
              <StepperComponent
                currentStep={currentStep}
                handleStepChange={handleStepChange}
                steps={steps}
              />
            )}
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </FormContext.Provider>
  );
}
