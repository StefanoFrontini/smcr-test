"use server";
import { $fetch } from "@/lib/fetch";
import { z } from "zod";
import { getPostData } from "../utils/getPostData";

import { getSelfCareSchema } from "@/features/onboarding/types/getSelfCareSchema";
import { OutputOption } from "../components/OnboardingForm";
import { ApiOptionsApicale } from "../types/apiOptionsType";
import { StatusSchema, statusSchema } from "../types/getFormStatusSchema";
import { getInfocamereSchema } from "../types/getInfocamereSchema";
import { getIpaSchema } from "../types/getIpaSchema";
import { getIpaSchemaAOO } from "../types/getIpaSchemaAOO";
import { getIpaSchemaUO } from "../types/getIpaSchemaUO";
import { getOnboardingStatusSchema } from "../types/getOnboardingStatusSchema";
import { onboardingSchema } from "../types/onboardingSchema";
import type { SubunitOption } from "../types/subunitOptionsType";
import {
  AOO_CODE_LENGTH,
  productValues,
  TAXCODE_BUSINESS_LENGTH,
  TAXCODE_PRIVATE_LENGTH,
  UO_CODE_LENGTH,
} from "../utils/constants";
import { isIpaAOOData, isIpaUOData } from "../utils/helpers";
import { isEmptyObj } from "../utils/isNotEmptyObj";
const SELFCARE = process.env.NEXT_PUBLIC_GET_INSTITUTION;
const IPA = process.env.NEXT_PUBLIC_GET_IPA;
const IPA_AOO = process.env.NEXT_PUBLIC_GET_IPA_AOO;
const IPA_UO = process.env.NEXT_PUBLIC_GET_IPA_UO;
const INFOCAMERE = process.env.NEXT_PUBLIC_GET_INFOCAMERE;
const SUBSCRIPTION_KEY_SELFCARE = process.env.API_KEY_PROD_GET_INSTITUTION;
const SUBSCRIPTION_KEY_IPA = process.env.API_KEY_PROD_GET_IPA;
const SUBSCRIPTION_KEY_INFOCAMERE = process.env.API_KEY_PROD_GET_INFOCAMERE;
const STATUS = process.env.NEXT_PUBLIC_GET_STATUS;
// const UPLOAD = process.env.NEXT_PUBLIC_UPLOAD;

type SuccessResponse = {
  success: true;
  data: {
    status: string;
    message: string;
    id: string;
    businessName: string;
  };
};

type ErrorResponse = {
  success: false;
  error: {
    message: string;
    status?: number;
    statusText?: string;
  } | null;
};

export type StatusActionState = {
  validationErrors: Record<string, { message: string }>;
  formValues: StatusSchema;
  apiResponse: (SuccessResponse | ErrorResponse) | undefined;
};

console.log({
  SELFCARE,
  IPA,
  INFOCAMERE,
  SUBSCRIPTION_KEY_SELFCARE,
  SUBSCRIPTION_KEY_IPA,
  SUBSCRIPTION_KEY_INFOCAMERE,
  IPA_AOO,
  IPA_UO,
  STATUS,
});
export async function onboardingStatus(
  state: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  console.log("Server Action - FormData entries:");
  formData.forEach((value, key) => console.log(key, value));
  const subunit = formData.get("subunit") as SubunitOption;

  const isSubunit = subunit === "AOO" || subunit === "UO";
  const taxcode = formData.get("taxcode") as string;
  const productId = formData.get("productId") as StatusSchema["productId"];
  const values: StatusSchema = {
    subunit,
    taxcode,
    productId,
    subunitCode: formData.get("subunitCode")?.toString() ?? "",
  };

  try {
    const { error: parseError } = statusSchema.safeParse(values);
    console.log(
      parseError,
      `${STATUS}?taxcode=${values.taxcode}${isSubunit ? `&subunitCode=${values.subunitCode}` : ""}`
    );
    if (parseError) {
      const errors: StatusActionState["validationErrors"] = {};
      for (const { path, message } of parseError?.issues ?? []) {
        errors[path.join(".")] = { message };
      }
      return {
        apiResponse: undefined,
        formValues: values,
        validationErrors: errors,
      };
    }
  } catch (parseError) {
    console.log(parseError);
    if (parseError instanceof z.ZodError) {
      const errors: StatusActionState["validationErrors"] = {};
      for (const { path, message } of parseError?.issues ?? []) {
        errors[path.join(".")] = { message };
      }
      return {
        apiResponse: undefined,
        formValues: values,
        validationErrors: errors,
      };
    }
  }

  try {
    const { data, error } = await $fetch(
      `${STATUS}?taxcode=${values.taxcode}${isSubunit ? `&subunitCode=${values.subunitCode}` : ""}`,
      {
        method: "GET",
        headers: {
          "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY_SELFCARE}`,
        },
        output: getOnboardingStatusSchema,
      }
    );

    if (error) {
      if (error.status === 404) {
        return {
          formValues: values,
          validationErrors: {},
          apiResponse: {
            success: false,
            error: {
              message: "Ente non trovato",
            },
          },
        };
      } else {
        console.log(error);
        return {
          formValues: values,
          validationErrors: {},
          apiResponse: {
            success: false,
            error: {
              message: error.message ?? "Qualcosa è andato storto",
            },
          },
        };
      }
    }

    if (!data) {
      return {
        formValues: values,
        validationErrors: {},
        apiResponse: {
          success: false,
          error: {
            message: "Dati non trovati",
          },
        },
      };
    }
    console.log("DATA: ", data);
    const product = data.find(
      (product) => product.productId === values.productId
    );
    if (!product) {
      return {
        formValues: values,
        validationErrors: {},
        apiResponse: {
          success: false,
          error: {
            message: `L'ente: ${values.taxcode}${isSubunit ? ` e codice univoco: ${values.subunitCode}` : ""} non ha sottoscritto il prodotto: ${values.productId}`,
          },
        },
      };
    }

    return {
      formValues: values,
      validationErrors: {},
      apiResponse: {
        success: true,
        data: {
          id: product.id,
          status: product.status,
          businessName: product.institution.description,
          message: `Trovato prodotto: ${values.productId} per l'ente: ${values.taxcode}. Stato: ${product.status}
      `,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      formValues: values,
      validationErrors: {},
      apiResponse: {
        success: false,
        error: {
          message: "Errore di validazione dei dati provenienti dall'API",
        },
      },
    };
  }
}

export async function getUserTaxCode(state: any, formData: FormData) {
  const taxCodeFormData = formData.get("taxCode") as string;
  const taxCode = taxCodeFormData.trim().toUpperCase();
  if (taxCode.length !== TAXCODE_PRIVATE_LENGTH) {
    return {
      success: false,
      taxCode,
      message: `il codice fiscale deve avere ${TAXCODE_PRIVATE_LENGTH} caratteri`,
    };
  }
  const { data, error } = await $fetch(
    `${process.env.NEXT_PUBLIC_GET_USERS_PATH}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": `${process.env.API_KEY_PROD_GET_USERS}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fiscalCode: taxCode,
      }),
      output: z.object({
        user: z.object({
          id: z.string(),
          name: z.string(),
          surname: z.string(),
        }),
      }),
    }
  );

  if (error) {
    if (error.status === 404) {
      return {
        success: false,
        taxCode,
        message: "User not found",
      };
    } else {
      console.log(error);
      throw new Error();
    }
  }
  console.log(data);
  return { success: true, taxCode, data: data.user };
}
export async function uploadContract(state: any, formData: FormData) {
  const contract = formData.get("contract") as File;
  const id = 1;
  // const id = formData.get("id") as string;

  // if (!contract || !id) {
  //   return {
  //     success: false,
  //     message: "File or ID missing",
  //   };
  // }

  formData.delete("id");
  console.log(`${process.env.UAT}/${id}/consume`);

  try {
    const response = await fetch(`${process.env.UAT}/${id}/consume`, {
      method: "PUT",
      headers: {
        Accept: "application/problem+json",
        // "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY_IPA}`,
      },
      body: formData,
    });
    return {
      success: true,
      message: "Upload del contratto avvenuto con successo!",
    };
    // const data = response;

    // const data = await response.json();
    // const { data, error } = await $fetch(`${UPLOAD}${id}/consume`, {
    //   method: "PUT",
    //   headers: {
    //     Accept: "application/problem+json",
    //     "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY_IPA}`,
    //   },
    //   body: formData,
    // });
    // if (!data) {
    //   return {
    //     success: false,
    //     message: "Dati non trovati",
    //   };
    // }

    // if (error) {
    //   return {
    //     success: false,
    //     message: error.message || "Upload failed",
    //   };
    // }

    return {
      success: true,
      message: "Upload del contratto avvenuto con successo!",
      // data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "C'è stato un errore nell'upload del contratto",
    };
  }
}
export async function verifyTaxCode(state: any, formData: FormData) {
  const subunit = formData.get("subunitOption") as SubunitOption;
  console.log({ subunit });
  let codeToSearch = "";

  switch (subunit) {
    case "AOO": {
      const subunitCodeAOOFormData = formData.get("subunitCode") as string;
      const subunitCodeAOO = subunitCodeAOOFormData.trim().toUpperCase();
      if (subunitCodeAOO.length !== AOO_CODE_LENGTH) {
        return {
          success: false,
          subunitCodeAOO,
          message: `il codice univoco deve avere ${AOO_CODE_LENGTH} caratteri`,
        };
      } else {
        codeToSearch = subunitCodeAOO;
      }
      break;
    }
    case "UO": {
      const subunitCodeUOFormData = formData.get("subunitCode") as string;
      const subunitCodeUO = subunitCodeUOFormData.trim().toUpperCase();
      if (subunitCodeUO.length !== UO_CODE_LENGTH) {
        return {
          success: false,
          subunitCodeUO,
          message: `il codice univoco deve avere ${UO_CODE_LENGTH} caratteri`,
        };
      } else {
        codeToSearch = subunitCodeUO;
      }

      break;
    }
    case "Apicale": {
      const taxCodeFormData = formData.get("taxcode") as string;
      const taxCode = taxCodeFormData.trim().toUpperCase();
      if (taxCode.length !== TAXCODE_BUSINESS_LENGTH) {
        return {
          success: false,
          taxCode,
          message: `il codice fiscale deve avere ${TAXCODE_BUSINESS_LENGTH} caratteri`,
        };
      } else {
        codeToSearch = taxCode;
      }
      break;
    }

    default:
      throw new Error(`subunit non trovata ${subunit satisfies never}`);
  }

  function fetchConfig(code: string, subunit: SubunitOption) {
    if (subunit === "AOO" || subunit === "UO") {
      return {
        apikey: `${SUBSCRIPTION_KEY_IPA}`,
        schema: subunit === "AOO" ? getIpaSchemaAOO : getIpaSchemaUO,
        url: `${subunit === "AOO" ? IPA_AOO : IPA_UO}${code}`,
      };
    }
    const endpoint = formData.get("endpoint") as ApiOptionsApicale;
    switch (endpoint) {
      case "selfcare":
        return {
          apikey: `${SUBSCRIPTION_KEY_SELFCARE}`,
          schema: getSelfCareSchema,
          url: `${SELFCARE}?taxCode=${code}`,
          endpoint,
        };
      case "ipa":
        return {
          apikey: `${SUBSCRIPTION_KEY_IPA}`,
          schema: getIpaSchema,
          url: `${IPA}${code}`,
          endpoint,
        };
      case "infocamere":
        return {
          apikey: `${SUBSCRIPTION_KEY_INFOCAMERE}`,
          schema: getInfocamereSchema,
          url: `${INFOCAMERE}${code}`,
          endpoint,
        };

      default:
        throw new Error(`Invalid endpoint: ${endpoint satisfies never}`);
    }
  }
  const { url, schema, apikey, endpoint } = fetchConfig(codeToSearch, subunit);
  try {
    const { data, error } = await $fetch(url, {
      method: "GET",
      headers: {
        "Ocp-Apim-Subscription-Key": apikey,
      },
      output: schema,
    });
    console.log({ data, error });

    if (error) {
      if (error.status === 404) {
        return {
          success: false,
          code: codeToSearch,
          message: "Ente non trovato",
        };
      } else {
        console.log(error);
        return {
          success: false,
          code: codeToSearch,
          message: error.message,
        };
      }
    }

    if (!data || isEmptyObj(data)) {
      return {
        success: false,
        code: codeToSearch,
        message: "Dati non trovati",
      };
    }
    console.log(data);
    if (isIpaAOOData(data, subunit) || isIpaUOData(data, subunit)) {
      const subunitCode = formData.get("subunitCode") as string;
      try {
        const { data: dataStatus, error: errorStatus } = await $fetch(
          `${STATUS}?taxcode=${data.codiceFiscaleEnte}&subunitCode=${subunitCode}`,
          {
            method: "GET",
            headers: {
              "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY_SELFCARE}`,
            },
            output: getOnboardingStatusSchema,
          }
        );
        const dataTable = dataStatus
          ?.map((el) => {
            return {
              product: el.productId,
              status: el.status,
              updatedAt: el.updatedAt,
              taxcode: data.codiceFiscaleEnte,
              subunitCode,
              subunit,
              businessName: el.institution.description,
            };
          })
          .filter((el) =>
            (productValues.slice(0, -1) as unknown as string).includes(
              el.product
            )
          );
        return {
          success: true,
          code: codeToSearch,
          data,
          subunit,
          endpoint,
          dataStatus: dataTable,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          code: codeToSearch,
          message: `Errore di validazione dei dati ricevuti:\n ${JSON.stringify(error)}`,
        };
      }
    } else {
      try {
        const { data: dataStatus, error: errorStatus } = await $fetch(
          `${STATUS}?taxcode=${codeToSearch}`,
          {
            method: "GET",
            headers: {
              "Ocp-Apim-Subscription-Key": `${SUBSCRIPTION_KEY_SELFCARE}`,
            },
            output: getOnboardingStatusSchema,
          }
        );

        const dataTable = dataStatus
          ?.map((el) => {
            return {
              product: el.productId,
              status: el.status,
              updatedAt: el.updatedAt,
              taxcode: codeToSearch,
              subunitCode: "",
              subunit,
              businessName: el.institution.description,
            };
          })
          .filter((el) =>
            (productValues.slice(0, -1) as unknown as string).includes(
              el.product
            )
          );
        return {
          success: true,
          code: codeToSearch,
          data,
          subunit,
          endpoint,
          dataStatus: dataTable,
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          code: codeToSearch,
          message: `Errore di validazione dei dati ricevuti:\n ${JSON.stringify(error)}`,
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      code: codeToSearch,
      message: `Errore di validazione dei dati ricevuti:\n ${JSON.stringify(error)}`,
    };
  }
}

export async function onSubmitFormData(state: any, formData: FormData) {
  const output = formData.get("output") as OutputOption;
  const dataFromUI = formData.get("data") as string;
  try {
    const { data: dataFromUIParsed, error: parseError } =
      onboardingSchema.safeParse(JSON.parse(dataFromUI));

    if (parseError) {
      const errors: Record<string, { message: string }> = {};
      for (const { path, message } of parseError?.issues ?? []) {
        errors[path.join(".")] = { message };
      }
      console.log(errors);

      let result = "";
      for (const [key, value] of Object.entries(errors)) {
        result += `${key}: ${value.message}\n`;
      }
      return {
        success: false,
        validationErrors: errors,
        message: `Errore: \n ${result}`,
      };
    }

    if (output === "clipboard") {
      return { success: false, message: "clipboard not supported" };
    }

    const endpoint =
      output === "prod" ? `${process.env.PROD}` : `${process.env.UAT}`;

    const { data, error } = await $fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getPostData(dataFromUIParsed)),
    });
    console.log("DATA: ", data);
    if (error) {
      console.error(error);
    }

    return {
      success: true,
      validationErrors: {},
      message: "Dati inviati!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      validationErrors: {},
      message: `Errore: \n ${JSON.stringify(error)}`,
    };
  }
}
