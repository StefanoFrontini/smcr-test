import { Button } from "@repo/ui";
import { UseFormReturn } from "react-hook-form";
import { StepOneSchema } from "../types/stepOneSchema";
import { StepTwoSchema } from "../types/stepTwoSchema";
import CheckStatusDialog from "./CheckStatusDialog";

type Props = {
  prevStep: () => void;
  isFirstStep?: boolean;
  isStepThree: boolean;
  form: UseFormReturn<StepOneSchema> | UseFormReturn<StepTwoSchema>;
  defaultValues: StepOneSchema | StepTwoSchema;
  goToStepFour: () => void;
  updateFormData: (
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ) => void;
};
export default function Controls({
  isFirstStep = false,
  isStepThree,
  goToStepFour,
  form,
  defaultValues,
  updateFormData,
}: Props) {
  return (
    <>
      {!isStepThree && (
        <div className="flex justify-between pt-8">
          <div className="flex gap-4">
            <Button
              variant={isStepThree ? "default" : "outline"}
              className="hover: cursor-pointer w-fit sm:w-32"
              type="button"
              onClick={() => {
                form.reset(defaultValues);
              }}
            >
              Reset
            </Button>
            {isFirstStep && (
              <CheckStatusDialog
                goToStepFour={goToStepFour}
                updateFormData={updateFormData}
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              name="prev"
              variant="outline"
              className="w-fit sm:w-32 hover: cursor-pointer disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
              disabled={isFirstStep}
            >
              Indietro
            </Button>
            <Button
              name="next"
              variant={form.formState.isValid ? "pagopaprimary" : "outline"}
              type="submit"
              className="w-fit sm:w-32"
            >
              Avanti
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
