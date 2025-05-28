import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useFieldArray, useForm } from "react-hook-form";
import {
  defaultValues,
  stepTwoSchema,
  StepTwoSchema,
} from "../types/stepTwoSchema";

import { LoaderCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { getUserTaxCode } from "../actions/actions";
import { OnboardingSchema } from "../types/onboardingSchema";
import { StepOneSchema } from "../types/stepOneSchema";
import { roleOptions } from "../utils/constants";
import Header from "./Header";
import StepControls from "./StepControls";

type Props = {
  isStepThree: boolean;
  prevStep: () => void;
  nextStep: () => void;
  goToStepFour: () => void;
  updateFormData: (
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ) => void;
  isStepTwoSubmitted: boolean;
  handleStepTwoSubmit: () => void;
  getStepTwoData: (data: OnboardingSchema) => StepTwoSchema;
  formData: OnboardingSchema;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export default function StepTwo({
  isStepThree,
  prevStep,
  nextStep,
  goToStepFour,
  updateFormData,
  handleStepTwoSubmit,
  isStepTwoSubmitted,
  getStepTwoData,
  formData,
  children,
  ...props
}: Props) {
  const form = useForm<StepTwoSchema>({
    resolver: zodResolver(stepTwoSchema),
    mode: "all",
    defaultValues: isStepTwoSubmitted
      ? getStepTwoData(formData)
      : defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });
  function handleAddUser() {
    append({
      name: "",
      surname: "",
      email: "",
      role: "MANAGER",
      taxCode: "",
    });
  }
  function handleRemoveUser(index: number) {
    remove(index);
  }

  function onSubmit(values: StepTwoSchema, event: any) {
    if (!isStepThree) {
      updateFormData(values);
      handleStepTwoSubmit();
      if (event.nativeEvent.submitter.name === "next") {
        nextStep();
      }
      if (event.nativeEvent.submitter.name === "prev") {
        prevStep();
      }
    }
  }

  const [state, action, isPending] = useActionState(getUserTaxCode, null);

  useEffect(() => {
    if (isPending || !state) return;
    if (state.success && state.data) {
      append({
        name: state.data.name,
        surname: state.data.surname,
        email: "",
        role: "MANAGER",
        taxCode: state.taxCode as string,
      });
    } else if (!state.success) {
      toast.error(`${state.message}`);
    } else {
      toast.error("User found but no data");
    }
  }, [state, append, isPending]);

  return (
    <div {...props}>
      {!isStepThree && (
        <Header
          taxcode={formData.taxcode}
          businessName={formData.businessName}
          productId={formData.productId}
          subunitCode={formData.subunitCode}
          subunit={formData.subunit}
        />
      )}
      {children}
      <h2 className="text-2xl font-semibold px-4">Utenti</h2>
      {!isStepThree && (
        <form action={action}>
          <div className="flex gap-4 py-8 px-4 items-center justify-between">
            <div className="shrink-0">
              <Label id="taxCode">Codice fiscale</Label>
            </div>

            <div className="basis-full">
              <Input
                id="taxCode"
                name="taxCode"
                placeholder=""
                type="text"
                className="w-full"
              />
            </div>
            {!isStepThree && (
              <Button className="w-fit sm:w-32" type="submit" variant="outline">
                {isPending ? (
                  <LoaderCircle
                    className="ui:animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  "Cerca"
                )}
              </Button>
            )}
          </div>
        </form>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10 px-4"
        >
          {!isStepThree && (
            <Button
              type="button"
              onClick={handleAddUser}
              variant="outline"
              className="w-fit"
            >
              Aggiungi
            </Button>
          )}

          {fields.map((field, index) => (
            <div key={field.id}>
              <Card className="shadow-xl">
                <CardContent>
                  <>
                    <div className="flex gap-4  items-center mb-4">
                      <div className="p-2 ui:bg-secondary rounded-lg text-sm ">{`Utente #${index + 1}`}</div>
                      {!isStepThree && (
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => handleRemoveUser(index)}
                        >
                          Rimuovi
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-12 gap-4 space-y-8">
                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name={`users.${index}.name`}
                          key={`users.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>name</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name={`users.${index}.surname`}
                          key={`users.${index}.surname`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cognome</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>surname</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 space-y-8">
                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name={`users.${index}.email`}
                          key={`users.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="email"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>email</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name={`users.${index}.role`}
                          key={`users.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ruolo</FormLabel>
                              <Select
                                disabled={isStepThree}
                                key={field.value}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roleOptions.map((option) => (
                                    <SelectItem
                                      key={option["tag"]}
                                      value={option["value"]}
                                    >
                                      {option["value"]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>role</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name={`users.${index}.taxCode`}
                          key={`users.${index}.taxCode`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Codice fiscale</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>taxcode</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                </CardContent>
              </Card>
            </div>
          ))}

          <StepControls
            goToStepFour={goToStepFour}
            updateFormData={updateFormData}
            prevStep={prevStep}
            isStepThree={isStepThree}
            form={form}
            defaultValues={defaultValues}
          />
        </form>
      </Form>
    </div>
  );
}
