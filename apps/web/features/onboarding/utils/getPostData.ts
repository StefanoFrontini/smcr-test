import {
  PostGsp,
  PostGspProdPa,
  PostPa,
  PostPsp,
  PostPt,
} from "../types/apiTypes";
import { OnboardingSchema } from "../types/onboardingSchema";

export function getPostData(
  formData: OnboardingSchema
): PostPsp | PostPa | PostGsp | PostGspProdPa | PostPt {
  const geographicTaxonomies =
    formData.institutionType === "PSP"
      ? [
          {
            code: formData.code,
            desc: formData.desc,
          },
        ]
      : [];
  const data = {
    billingData: {
      businessName: formData.businessName,
      digitalAddress: formData.digitalAddress,
      recipientCode: formData.recipientCode,
      registeredOffice: formData.registeredOffice,
      taxcode: formData.taxcode,
      vatNumber: formData.vatNumber,
      city: formData.city,
      county: formData.county,
      country: formData.country,
      zipCode: formData.zipCode,
    },
    origin: formData.origin,
    users: formData.users,
    assistanceContacts: {
      supportEmail: formData.supportEmail,
    },
    taxCode: formData.taxcode,
    productId: formData.productId,
    geographicTaxonomies,
  };
  const commonData =
    formData.subunit === "AOO" || formData.subunit === "UO"
      ? {
          ...data,
          subunitCode: formData.subunitCode,
          subunitType: formData.subunitType,
        }
      : data;
  switch (formData.institutionType) {
    case "PSP": {
      const pspData = {
        ...commonData,
        institutionType: "PSP" as const,
        pspData: {
          abiCode: formData.abiCode ?? "",
          businessRegisterNumber: formData.businessRegisterNumber ?? "",
          dpoData: {
            address: formData.address ?? "",
            pec: formData.pec ?? "",
            email: formData.email ?? "",
          },
          legalRegisterNumber: formData.legalRegisterNumber ?? "",
          legalRegisterName: formData.legalRegisterName ?? "",
          vatNumberGroup: formData.vatNumberGroup ?? false,
        },
      };
      if (formData.originId === "") {
        return pspData;
      } else {
        return {
          ...pspData,
          originId: formData.originId,
        };
      }
    }

    case "PA": {
      const paData = {
        ...commonData,
        institutionType: "PA" as const,
      };
      if (formData.originId === "") {
        return paData;
      } else {
        return {
          ...paData,
          originId: formData.originId,
        };
      }
    }
    case "PT": {
      const ptData = {
        ...commonData,
        institutionType: "PT" as const,
      };
      if (formData.originId === "") {
        return ptData;
      } else {
        return {
          ...ptData,
          originId: formData.originId,
        };
      }
    }
    case "GSP": {
      const gsp = {
        ...commonData,
        companyInformations: {
          rea: formData.rea ?? "",
        },
        institutionType: "GSP" as const,
      };
      const gspData =
        formData.originId === ""
          ? gsp
          : { ...gsp, originId: formData.originId };

      if (formData.productId === "prod-pagopa") {
        return {
          ...gspData,
          additionalInformations: {
            belongRegulatedMarket: formData.belongRegulatedMarket ?? false,
            regulatedMarketNote: formData.regulatedMarketNote ?? "",
            ipa: formData.ipa ?? false,
            ipaCode: formData.ipaCode ?? "",
            establishedByRegulatoryProvision:
              formData.establishedByRegulatoryProvision ?? false,
            establishedByRegulatoryProvisionNote:
              formData.establishedByRegulatoryProvisionNote ?? "",
            agentOfPublicService: formData.agentOfPublicService ?? false,
            agentOfPublicServiceNote: formData.agentOfPublicServiceNote ?? "",
            otherNote: formData.otherNote ?? "",
          },
        } satisfies PostGspProdPa;
      } else {
        return gspData satisfies PostGsp;
      }
    }
    case "SCP":
      return {
        ...commonData,

        institutionType: "GSP",
      };
    default:
      throw new Error(
        `Invalid institutionType: ${formData.institutionType satisfies never}`
      );
  }
}
