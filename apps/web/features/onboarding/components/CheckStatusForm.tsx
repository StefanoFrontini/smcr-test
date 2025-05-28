"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  DialogClose,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useStatus } from "../hooks/useStatus";
import { StatusSchema, statusSchema } from "../types/getFormStatusSchema";
import { StepOneSchema } from "../types/stepOneSchema";
import { StepTwoSchema } from "../types/stepTwoSchema";
import { SubunitOption } from "../types/subunitOptionsType";
import { productOptions, subunitValues } from "../utils/constants";
import Status from "./Status";

type Props = {
  goToStepFour: () => void;
  updateFormData: (
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ) => void;
};

export function CheckStatusForm({ goToStepFour, updateFormData }: Props) {
  const [subunitOption, setSubunitOption] = useState<SubunitOption>(
    subunitValues[0]
  );
  const isApicale = subunitOption === "Apicale";

  let { state, action, isPending, status, isStatusPending } = useStatus({
    taxcode: "",
    subunit: "Apicale",
    productId: "prod-pagopa",
    subunitCode: "",
  });
  status = "pending";
  isStatusPending = true;

  const form = useForm<StatusSchema>({
    resolver: zodResolver(statusSchema),
    errors: state.validationErrors,
    mode: "onChange",
    values: state.formValues,
  });

  return (
    <Form {...form}>
      <form
        action={action}
        onSubmit={(e) => {
          e.stopPropagation();
        }}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="taxcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice fiscale</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2">
                <FormLabel>Prodotto</FormLabel>
                <div>
                  <Select
                    name="productId"
                    key={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                        <SelectValue placeholder="Seleziona un prodotto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {productOptions.map((option) => (
                          <SelectItem
                            key={option["tag"]}
                            value={option["value"]}
                          >
                            {option["value"]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subunit"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2">
                <FormLabel>Subunit</FormLabel>
                <div>
                  <Select
                    name="subunit"
                    key={field.value}
                    defaultValue={field.value}
                    value={subunitOption}
                    onValueChange={(value: SubunitOption) => {
                      setSubunitOption(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                        <SelectValue placeholder="Select a subunit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {subunitValues.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        {!isApicale && (
          <FormField
            control={form.control}
            name="subunitCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice univoco</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button
          type="submit"
          variant={isStatusPending ? "outline" : "pagopaprimary"}
          className="mt-4"
        >
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
      </form>
      {state.apiResponse?.success && (
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{state.formValues.taxcode}</p>
            <p>{state.formValues.productId}</p>
            <p>{state.formValues.subunit}</p>
            <p>{state.formValues.subunitCode}</p>
          </CardContent>
          <CardFooter className=" justify-between">
            <Status status={status} />
            {isStatusPending && (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="pagopaprimary"
                  onClick={() => {
                    if (state.apiResponse?.success) {
                      updateFormData({
                        ...state.formValues,
                        businessName: state.apiResponse.data.businessName,
                      });
                      goToStepFour();
                    }
                  }}
                >
                  Carica il contratto
                </Button>
              </DialogClose>
            )}
          </CardFooter>
        </Card>
      )}
    </Form>
  );
}
