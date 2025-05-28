import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadContract } from "../actions/actions";
import { useStatus } from "../hooks/useStatus";
import { OnboardingSchema } from "../types/onboardingSchema";
import ContractUpload from "./ContractUpload";
import HeaderLogo from "./HeaderLogo";
import Status from "./Status";

type Props = {
  formData: OnboardingSchema;
  resetStepOneData: () => void;
  resetStepTwoData: () => void;
  goToStepOne: () => void;
  children?: React.ReactNode;
};

function StepFour({
  formData,
  resetStepOneData,
  resetStepTwoData,
  goToStepOne,
  children,
}: Props) {
  const {
    handleStatusChange,
    action,
    isPending,
    isStatusCompleted,
    isStatusPending,
    id,
    status,
  } = useStatus({
    taxcode: formData.taxcode,
    subunit: formData.subunit,
    subunitCode: formData.subunitCode,
    productId: formData.productId,
  });

  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const [contractState, contractAction, contractIsPending] = useActionState(
    uploadContract,
    null
  );
  function handleFilesChange(files: (File & { preview: string })[]) {
    setFiles(files);
  }

  useEffect(() => {
    if (!contractState || contractIsPending) return;
    if (!contractState.success) {
      toast.error(contractState.message);
      return;
    }
    handleStatusChange("completed");
    toast.success(contractState.message);
  }, [contractState, contractIsPending, handleStatusChange]);

  return (
    <div className="container flex flex-col py-8 gap-8  max-w-3xl mx-auto ">
      <HeaderLogo />
      {children}
      <form
        action={action}
        className="flex items-center justify-between
      gap-2"
      >
        <input type="hidden" name="productId" value={formData.productId} />
        <input type="hidden" name="taxcode" value={formData.taxcode} />
        <input type="hidden" name="subunit" value={formData.subunit} />
        <input type="hidden" name="subunitCode" value={formData.subunitCode} />

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 ">
              <Status status={status} />

              <div>
                <Button
                  type="submit"
                  variant={
                    isStatusPending || isStatusCompleted
                      ? "outline"
                      : "pagopaprimary"
                  }
                >
                  {isPending ? (
                    <LoaderCircle
                      className="ui:animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : (
                    "Check"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Dati Ente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Ragione Sociale:</span>
              <span>{formData.businessName}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Codice Fiscale:</span>
              <span>{formData.taxcode}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Prodotto:</span>
              <span>{formData.productId}</span>
            </div>
            {formData.subunitCode && (
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Codice Subunit:</span>
                <span>{formData.subunitCode}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
      {isStatusPending && (
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl ">Carica il contratto</CardTitle>
          </CardHeader>
          <CardContent>
            <ContractUpload files={files} onFilesChange={handleFilesChange} />
          </CardContent>
        </Card>
      )}
      {isStatusPending && files.length > 0 && (
        <form
          action={async () => {
            if (!files[0]) return;

            const formData = new FormData();
            formData.append("contract", files[0], files[0].name);
            formData.append("id", id);

            return contractAction(formData);
          }}
        >
          <div className="flex justify-end mt-4">
            <Button
              variant="pagopaprimary"
              type="submit"
              disabled={contractIsPending}
            >
              {contractIsPending ? (
                <LoaderCircle
                  className="ui:animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                "Invia contratto"
              )}
            </Button>
          </div>
        </form>
      )}
      {isStatusCompleted && (
        <div className="flex justify-end mt-4">
          <Button
            variant="pagopaprimary"
            onClick={() => {
              resetStepOneData();
              resetStepTwoData();
              goToStepOne();
            }}
          >
            Nuovo onboarding
          </Button>
        </div>
      )}
    </div>
  );
}

export default StepFour;
