import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

import { useForm, useWatch } from "react-hook-form";

import { setupZodErrors } from "@/features/onboarding/utils/zodErrors";
import { LoaderCircle } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { verifyTaxCode } from "../actions/actions";
import type { ApiOptionsApicale } from "../types/apiOptionsType";
import { OnboardingSchema } from "../types/onboardingSchema";
import { ProductStatus } from "../types/productStatus";
import { ProductOptions } from "../types/productType";
import {
  defaultValues,
  stepOneSchema,
  StepOneSchema,
} from "../types/stepOneSchema";
import { StepTwoSchema } from "../types/stepTwoSchema";
import { SubunitOption } from "../types/subunitOptionsType";
import {
  apicale_infocamere_stepOne_map,
  apicale_ipa_stepOne_map,
  apicale_selfcare_stepOne_map,
  apiOptionsApicale,
  apiOriginValues,
  institutionOptions,
  ipaAOO_stepOne_map,
  ipaUO_stepOne_map,
  productOptions,
  subunitValues,
  trueFalseOptions,
} from "../utils/constants";
import {
  isApicaleInfoCamereData,
  isApicaleIpaData,
  isApicaleSelfCareData,
  isIpaAOOData,
  isIpaUOData,
} from "../utils/helpers";
import { DataTable } from "./DataTable";
import Header from "./Header";
import { columns } from "./OnboardingColumns";
import RadioCards from "./RadioCards";
import StepControls from "./StepControls";

type Props = {
  isStepThree: boolean;
  isFirstStep: boolean;
  prevStep: () => void;
  nextStep: () => void;
  updateFormData: (
    data: Partial<StepOneSchema> | Partial<StepTwoSchema>
  ) => void;
  formData: OnboardingSchema;
  getStepOneData: (data: OnboardingSchema) => StepOneSchema;
  isStepOneSubmitted: boolean;
  handleStepOneSubmit: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  goToStepFour: () => void;
};
function cleanAddress(address: string) {
  return address.replace(/null/g, "").trim();
}

function StepOne({
  isStepThree,
  isFirstStep,
  prevStep,
  nextStep,
  updateFormData,
  formData,
  getStepOneData,
  isStepOneSubmitted,
  handleStepOneSubmit,
  goToStepFour,
  children,
  ...props
}: Props) {
  const [productOptionsToDisplay, setProductOptionsToDisplay] =
    useState<ProductOptions>(productOptions);
  const [dataTable, setDataTable] = useState<ProductStatus[] | undefined>(
    undefined
  );

  const [apiOption, setApiOption] = useState<ApiOptionsApicale>(
    apiOptionsApicale[0]
  );
  const [subunitOption, setSubunitOption] = useState<SubunitOption>(
    subunitValues[0]
  );
  const [isPIVAequalToTaxcode, setIsPIVAequalToTaxcode] = useState(false);
  function handleDataTable(data: ProductStatus[]) {
    setDataTable(data);
  }
  function handlePIVAEqualToTaxcode(value: boolean) {
    setIsPIVAequalToTaxcode(value);
  }
  function handleSubunitOption(value: SubunitOption) {
    setSubunitOption(value);
  }

  const form = useForm<StepOneSchema>({
    resolver: zodResolver(stepOneSchema),
    mode: "all",
    defaultValues: isStepOneSubmitted
      ? getStepOneData(formData)
      : defaultValues,
  });
  setupZodErrors();
  function handleProductOptions(data: ProductOptions) {
    setProductOptionsToDisplay(data);
  }

  const institutionType = useWatch({
    control: form.control,
    name: "institutionType",
  });

  const productId = useWatch({
    control: form.control,
    name: "productId",
  });

  const isPSP = institutionType === "PSP";
  const isAdditionalInformations =
    institutionType === "GSP" && productId === "prod-pagopa";
  const isSubunit = subunitOption === "AOO" || subunitOption === "UO";
  const isApicale = subunitOption === "Apicale";

  function onSubmit(values: StepOneSchema) {
    if (!isStepThree && updateFormData) {
      updateFormData(values);
      handleStepOneSubmit();
      nextStep();
    }
  }

  const taxCode = form.watch("taxcode");
  const subunitCode = form.watch("subunitCode");

  const [state, action, isPending] = useActionState(verifyTaxCode, null);

  useEffect(() => {
    if (isPIVAequalToTaxcode) {
      form.setValue("vatNumber", taxCode);
      form.trigger("vatNumber");
    }
  }, [isPIVAequalToTaxcode, taxCode, form]);

  useEffect(() => {
    if (!isSubunit) return;
    form.setValue("subunitType", subunitOption);
  }, [subunitOption, form, isSubunit]);

  useEffect(() => {
    if (!state || isPending) return;
    if (!state.success || !state.data) {
      toast.error(state.message);
      return;
    }

    const { data, endpoint, subunit, dataStatus } = state;
    if (!dataStatus) return;
    handleDataTable(dataStatus);

    console.log("🚀 ~ useEffect ~ dataStatus:", dataStatus);

    switch (subunit) {
      case "AOO":
        if (isIpaAOOData(data, subunit)) {
          form.reset(defaultValues);
          for (const [key, value] of ipaAOO_stepOne_map) {
            if (data[value]) {
              if (value === "indirizzo") {
                form.setValue(key, cleanAddress(data[value]));
              } else {
                form.setValue(key, data[value]);
              }
            }
          }
          form.setValue("subunit", "AOO");
          form.setValue("subunitType", "AOO");
        } else {
          toast.error("subunit not supported");
          return;
        }
        break;

      case "UO":
        if (isIpaUOData(data, subunit)) {
          form.reset(defaultValues);
          for (const [key, value] of ipaUO_stepOne_map) {
            if (data[value]) {
              if (value === "indirizzo") {
                form.setValue(key, cleanAddress(data[value]));
              } else {
                form.setValue(key, data[value]);
              }
            }
          }
          form.setValue("subunit", "UO");
          form.setValue("subunitType", "UO");
        } else {
          toast.error("subunit not supported");
          return;
        }
        break;
      case "Apicale":
        if (isApicaleSelfCareData(data, endpoint)) {
          if (data.institutions.length === 0) {
            toast.error("Codice fiscale non valido");
            return;
          } else {
            const institution = data.institutions[0];
            if (!institution) return;
            form.reset(defaultValues);
            for (const [key, value] of apicale_selfcare_stepOne_map) {
              if (value === "address") {
                form.setValue(key, cleanAddress(institution[value]));
              } else {
                form.setValue(key, institution[value]);
              }
            }
            form.setValue("subunit", "Apicale");
            if (institution.onboarding.length > 0) {
              const onboardings = institution.onboarding;
              const nonActiveContracts = productOptions.reduce(
                (acc: ProductOptions, item) => {
                  if (onboardings.find((el) => el.productId === item.value)) {
                    return [...acc];
                  } else {
                    return [...acc, item];
                  }
                },
                []
              );

              handleProductOptions(nonActiveContracts);
              if (nonActiveContracts.length === 0) {
                toast.error("L'ente ha sottoscritto tutti i prodotti attivi.");
                return;
              }
            }
            if (institution.geographicTaxonomies) {
              form.setValue(
                "code",
                institution.geographicTaxonomies.at(0)?.code
              );
              form.setValue(
                "desc",
                institution.geographicTaxonomies.at(0)?.desc
              );
            }
            if (data.paymentServiceProvider) {
              form.setValue("abiCode", data.paymentServiceProvider.abiCode);
              form.setValue(
                "businessRegisterNumber",
                data.paymentServiceProvider.businessRegisterNumber
              );
              form.setValue(
                "legalRegisterNumber",
                data.paymentServiceProvider.legalRegisterNumber
              );
              form.setValue(
                "vatNumberGroup",
                data.paymentServiceProvider.vatNumberGroup
              );
            }
          }
        }
        if (isApicaleIpaData(data, endpoint)) {
          const origin = form.getValues("origin");
          form.reset(defaultValues);
          for (const [key, value] of apicale_ipa_stepOne_map) {
            if (data[value]) {
              if (value === "address") {
                form.setValue(key, cleanAddress(data[value]));
              } else {
                form.setValue(key, data[value]);
              }
            }
          }
          form.setValue("origin", origin);
        }
        if (isApicaleInfoCamereData(data, endpoint)) {
          const taxcode = form.getValues("taxcode");
          form.reset(defaultValues);
          for (const [key, value] of apicale_infocamere_stepOne_map) {
            if (data[value]) {
              if (value === "address") {
                form.setValue(key, cleanAddress(data[value]));
              } else {
                form.setValue(key, data[value]);
              }
            }
          }
          form.setValue("taxcode", taxcode);
        }
        break;

      default:
        throw new Error(`unknown subunit ${subunit satisfies never}`);
    }

    form.trigger();
    toast.success("Dati caricati!");
  }, [state, isPending, form]);

  return (
    <div {...props}>
      {!isStepThree && (
        <form action={action} className="mb-8">
          <RadioCards
            form={form}
            subunitOption={subunitOption}
            subunitOptions={subunitValues}
            handleSubunitOption={handleSubunitOption}
          />
          <div
            className={cn(
              "flex  gap-2 py-12 px-4 items-center justify-between -mx-6 ",
              !isStepThree && "ui:bg-pagopa-primary ui:text-white"
            )}
          >
            <div className="shrink-0">
              <Label id="taxcode">
                {isApicale ? "Codice fiscale" : "Codice univoco"}
              </Label>
            </div>
            <div className="basis-full ">
              {isApicale ? (
                <Input
                  disabled={isStepThree}
                  name="taxcode"
                  id="taxcode"
                  placeholder=""
                  type="text"
                  className=" disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                  value={taxCode}
                  onChange={(event) => {
                    event.preventDefault();
                    form.setValue("taxcode", event.target.value, {
                      shouldValidate: form.formState.isSubmitted,
                    });
                  }}
                />
              ) : (
                <Input
                  disabled={isStepThree}
                  name="subunitCode"
                  id="subunitCode"
                  placeholder=""
                  type="text"
                  className=" disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                  value={subunitCode}
                  onChange={(event) => {
                    event.preventDefault();
                    form.setValue("subunitCode", event.target.value, {
                      shouldValidate: form.formState.isSubmitted,
                    });
                  }}
                />
              )}
            </div>

            {!isStepThree && (
              <div className="flex gap-2">
                {isApicale && (
                  <div>
                    <Select
                      key={apiOption}
                      disabled={isStepThree}
                      name="endpoint"
                      value={apiOption}
                      onValueChange={(value: ApiOptionsApicale) => {
                        setApiOption(value);
                      }}
                    >
                      <SelectTrigger className="ui:hover cursor-pointer disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {apiOptionsApicale.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="text-black">
                  <Button
                    className="w-fit sm:w-32"
                    disabled={isStepThree}
                    variant="outline"
                    type="submit"
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
                </div>
              </div>
            )}
          </div>
          {isApicale && form.formState.errors.taxcode ? (
            <p className="ui:text-destructive ui:text-sm ui:mt-2 ui:text-center">
              {form.formState.errors.taxcode?.message}
            </p>
          ) : (
            <p className="ui:text-destructive ui:text-sm ui:mt-2 ui:text-center">
              {form.formState.errors.subunitCode?.message}
            </p>
          )}
        </form>
      )}
      <div className="">
        {dataTable && (
          <Card className="shadow-2xl mb-16">
            <CardHeader>
              <CardTitle>Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={dataTable} />
            </CardContent>
          </Card>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto pb-10 px-4"
        >
          {isApicale ? (
            <input type="hidden" value="" name="taxcode" />
          ) : (
            <input type="hidden" value="" name="subunitCode" />
          )}
          <input type="hidden" value="" name="subunit" />
          {isStepThree && (
            <Header
              taxcode={formData.taxcode}
              businessName={formData.businessName}
              productId={formData.productId}
              subunit={formData.subunit}
              subunitCode={formData.subunitCode}
            />
          )}
          {!isStepThree && (
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-4 items-center justify-center">
                    <FormLabel>Prodotto</FormLabel>
                    <div>
                      <Select
                        disabled={isStepThree}
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
                            {productOptionsToDisplay.map((option) => (
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
          )}
          {children}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Dati Anagrafici</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-8">
                {!isStepThree && (
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6 col-end-13">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isPIVAequalToTaxcode}
                          onCheckedChange={handlePIVAEqualToTaxcode}
                          id="isPIVAequalToTaxcode"
                        />
                        <label
                          htmlFor="isPIVAequalToTaxcode"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          La PIVA coincide con il CF
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ragione sociale</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>businessName</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partita iva</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree || isPIVAequalToTaxcode}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>vatNumber</FormDescription>
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
                      name="digitalAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PEC</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>digitalAddress</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email di supporto</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>supportEmail</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="institutionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipologia</FormLabel>
                          <Select
                            disabled={isStepThree}
                            key={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {institutionOptions.map((option) => (
                                <SelectItem
                                  key={option["tag"]}
                                  value={option["value"]}
                                >
                                  {option["value"]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>institutionType</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isSubunit && (
                    <>
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="subunitType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipologia Subunit</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>subunitType</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="taxcode"
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
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Dati Geografici</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-8">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="registeredOffice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sede legale</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>registeredOffice</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Città</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>city</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comune</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>county</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice avviamento postale</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>zipCode</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paese</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>country</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Dati Prodotto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-8">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <Select
                            disabled={isStepThree}
                            key={field.value}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none hover:cursor-pointer">
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {apiOriginValues.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>origin</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="originId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>OriginId</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>originId</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-4">
                    <FormField
                      control={form.control}
                      name="recipientCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice SDI</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              disabled={isStepThree}
                              placeholder=""
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>recipientCode</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Dati Identificativi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-8">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>id</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              placeholder=""
                              disabled
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Id</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name="externalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>externalId</FormLabel>
                          <FormControl>
                            <Input
                              className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                              placeholder=""
                              disabled
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>externalId</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isPSP && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Dati PSP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-8">
                  <FormField
                    control={form.control}
                    name="businessRegisterNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>businessRegisterNumber</FormLabel>
                        <FormControl>
                          <Input
                            className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                            disabled={isStepThree}
                            placeholder=""
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          businessRegisterNumber
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="abiCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>abiCode</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>abiCode</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="pec"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>pec</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>pec</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>email</FormLabel>
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
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>address</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>address</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="legalRegisterNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>legalRegisterNumber</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              legalRegisterNumber
                            </FormDescription>
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
                        name="legalRegisterName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>legalRegisterName</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>legalRegisterName</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="vatNumberGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>vatNumberGroup</FormLabel>

                            <Select
                              disabled={isStepThree}
                              key={String(field.value)}
                              onValueChange={(value) => {
                                field.onChange(value === "true");
                              }}
                              defaultValue={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                  <SelectValue placeholder="" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {trueFalseOptions.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>vatNumberGroup</FormDescription>
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
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>code</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>code</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-6">
                      <FormField
                        control={form.control}
                        name="desc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>desc</FormLabel>
                            <FormControl>
                              <Input
                                className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                disabled={isStepThree}
                                placeholder=""
                                type="text"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>desc</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {isAdditionalInformations && (
            <>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>
                    Dati Addizionali GSP per il prodotto: prod-pagopa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-8">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="belongRegulatedMarket"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>belongRegulatedMarket</FormLabel>
                              <Select
                                disabled={isStepThree}
                                key={String(field.value)}
                                onValueChange={(value) => {
                                  field.onChange(value === "true");
                                }}
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {trueFalseOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>vatNumberGroup</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="regulatedMarketNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>regulatedMarketNote</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                regulatedMarketNote
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="ipa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ipa</FormLabel>
                              <Select
                                disabled={isStepThree}
                                key={String(field.value)}
                                onValueChange={(value) => {
                                  field.onChange(value === "true");
                                }}
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {trueFalseOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>ipa</FormDescription>
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
                          name="ipaCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ipaCode</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>ipaCode</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name="establishedByRegulatoryProvision"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                establishedByRegulatoryProvision
                              </FormLabel>

                              <Select
                                disabled={isStepThree}
                                key={String(field.value)}
                                onValueChange={(value) => {
                                  field.onChange(value === "true");
                                }}
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {trueFalseOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                establishedByRegulatoryProvision
                              </FormDescription>
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
                          name="establishedByRegulatoryProvisionNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                establishedByRegulatoryProvisionNote
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                establishedByRegulatoryProvisionNote
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-6">
                        <FormField
                          control={form.control}
                          name="otherNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>otherNote</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>otherNote</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="agentOfPublicService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>agentOfPublicService</FormLabel>

                              <Select
                                disabled={isStepThree}
                                key={String(field.value)}
                                onValueChange={(value) => {
                                  field.onChange(value === "true");
                                }}
                                defaultValue={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {trueFalseOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                agentOfPublicService
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="agentOfPublicServiceNote"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>agentOfPublicServiceNote</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                agentOfPublicServiceNote
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name="rea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>rea</FormLabel>
                              <FormControl>
                                <Input
                                  className="disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none"
                                  disabled={isStepThree}
                                  placeholder=""
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>rea</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          <StepControls
            updateFormData={updateFormData}
            goToStepFour={goToStepFour}
            prevStep={prevStep}
            isFirstStep={isFirstStep}
            isStepThree={isStepThree}
            form={form}
            defaultValues={defaultValues}
          />
        </form>
      </Form>
    </div>
  );
}

export default StepOne;
