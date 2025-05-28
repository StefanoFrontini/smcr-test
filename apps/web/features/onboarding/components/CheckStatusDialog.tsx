import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { StepOneSchema } from "../types/stepOneSchema";
import { StepTwoSchema } from "../types/stepTwoSchema";
import { CheckStatusForm } from "./CheckStatusForm";
type Props = {
  goToStepFour: () => void;
  updateFormData: (
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ) => void;
};

function CheckStatusDialog({ goToStepFour, updateFormData }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Check status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Check status</DialogTitle>
          <DialogDescription>
            Compila i campi e clicca su "Cerca"
          </DialogDescription>
        </DialogHeader>
        <CheckStatusForm
          goToStepFour={goToStepFour}
          updateFormData={updateFormData}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CheckStatusDialog;
