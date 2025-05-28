import { z } from "zod";
import {
  AOO_CODE_LENGTH,
  TAXCODE_BUSINESS_LENGTH,
  UO_CODE_LENGTH,
} from "../utils/constants";

export const stepOneRefinementValidation = (
  data: any,
  ctx: z.RefinementCtx
) => {
  if (
    data.subunit === "Apicale" &&
    data.taxcode.length !== TAXCODE_BUSINESS_LENGTH
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Il campo codice fiscale deve essere di ${TAXCODE_BUSINESS_LENGTH} caratteri`,
      path: ["taxcode"],
    });
  }
  if (data.origin === "IPA" && !data.originId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "OriginId è obbligatorio quando il campo origin è IPA",
      path: ["originId"],
    });
  }
  if (!data.productId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Il campo productId è obbligatorio",
      path: ["productId"],
    });
  }
  if (data.institutionType === "PSP") {
    if (!data.abiCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo ABI Code è obbligatorio",
        path: ["abiCode"],
      });
    }
    if (!data.businessRegisterNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Business Register Number è obbligatorio",
        path: ["businessRegisterNumber"],
      });
    }
    if (!data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Address è obbligatorio",
        path: ["address"],
      });
    }
    if (!data.pec) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo PEC è obbligatorio",
        path: ["pec"],
      });
    }
    if (!data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Email è obbligatorio",
        path: ["email"],
      });
    }
    if (!data.legalRegisterNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Legal Register Number è obbligatorio",
        path: ["legalRegisterNumber"],
      });
    }
    if (!data.legalRegisterName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Legal Register Name è obbligatorio",
        path: ["legalRegisterName"],
      });
    }
    if (!data.code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Code è obbligatorio",
        path: ["code"],
      });
    }
    if (!data.desc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Desc è obbligatorio",
        path: ["desc"],
      });
    }
  }
  if (data.institutionType === "GSP" && data.productId === "prod-pagopa") {
    if (!data.regulatedMarketNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Regulated Market Note è obbligatorio",
        path: ["regulatedMarketNote"],
      });
    }
    if (!data.ipaCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo IPA Code è obbligatorio",
        path: ["ipaCode"],
      });
    }
    if (!data.establishedByRegulatoryProvisionNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Il campo Established by Regulatory Provision Note è obbligatorio",
        path: ["establishedByRegulatoryProvisionNote"],
      });
    }
    if (!data.agentOfPublicServiceNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Agent of Public Service Note è obbligatorio",
        path: ["agentOfPublicServiceNote"],
      });
    }
    if (!data.otherNote) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo Other Note è obbligatorio",
        path: ["otherNote"],
      });
    }
    if (!data.rea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo REA è obbligatorio",
        path: ["rea"],
      });
    }
  }
  if (data.subunit === "AOO") {
    if (data.subunitCode?.length !== AOO_CODE_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Il campo univoco di una AOO deve avere ${AOO_CODE_LENGTH} caratteri`,
        path: ["subunitCode"],
      });
    }
    if (!data.subunitType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo subunitType é obbligatorio",
        path: ["subunitType"],
      });
    }
  }
  if (data.subunit === "UO") {
    if (data.subunitCode?.length !== UO_CODE_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Il codice univoco di una UO deve avere ${UO_CODE_LENGTH} caratteri`,
        path: ["subunitCode"],
      });
    }
    if (!data.subunitType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Il campo subunitType é obbligatorio",
        path: ["subunitType"],
      });
    }
  }
};
