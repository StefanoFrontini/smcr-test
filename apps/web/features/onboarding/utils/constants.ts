import { InstitutionOptions } from "../types/institutionTypes";
import { ProductOptions } from "../types/productType";
import { RoleOptions } from "../types/roleType";

export const institutionValues = ["PSP", "PA", "GSP", "PT", "SCP"] as const;

export const institutionOptions: InstitutionOptions = [
  { tag: "psp", value: institutionValues[0] },
  { tag: "pa", value: institutionValues[1] },
  { tag: "gsp", value: institutionValues[2] },
  { tag: "pt", value: institutionValues[3] },
  { tag: "scp", value: institutionValues[4] },
];

export const productValues = [
  "prod-pagopa",
  "prod-interop",
  "prod-pn",
  "prod-io",
  "prod-io-sign",
  "",
] as const;

export const productOptions: ProductOptions = [
  { tag: "prod-pagopa", value: productValues[0] },
  { tag: "prod-interop", value: productValues[1] },
  { tag: "prod-pn", value: productValues[2] },
  { tag: "prod-io", value: productValues[3] },
  { tag: "prod-io-sign", value: productValues[4] },
];

export const apiOriginValues = [
  "IPA",
  "SELC",
  "INFOCAMERE",
  "PDND_INFOCAMERE",
  "IVASS",
] as const;

export const roleValues = [
  "MANAGER",
  "OPERATOR",
  "DELEGATE",
  "SUB-DELEGATE",
] as const;

export const roleOptions: RoleOptions = [
  { tag: "manager", value: roleValues[0] },
  { tag: "operator", value: roleValues[1] },
  { tag: "delegate", value: roleValues[2] },
  { tag: "subdelegate", value: roleValues[3] },
];

export const subunitValues = ["Apicale", "AOO", "UO"] as const;

export const apiOptionsApicale = ["selfcare", "ipa", "infocamere"] as const;

export const VAT_NUMBER_LENGTH = 11;
export const TAXCODE_BUSINESS_LENGTH = 11;
export const TAXCODE_PRIVATE_LENGTH = 16;
export const ZIPCODE_LENGTH = 5;
export const AOO_CODE_LENGTH = 7;
export const UO_CODE_LENGTH = 6;

export const trueFalseOptions = ["true", "false"] as const;

export const ipaAOO_stepOne_map = new Map([
  ["subunitCode", "id"],
  ["taxcode", "codiceFiscaleEnte"],
  ["businessName", "denominazioneAoo"],
  ["digitalAddress", "mail1"],
  ["origin", "origin"],
  ["address", "indirizzo"],
  ["registeredOffice", "indirizzo"],
  ["zipCode", "CAP"],
] as const);

export const ipaUO_stepOne_map = new Map([
  ["subunitCode", "id"],
  ["taxcode", "codiceFiscaleEnte"],
  ["businessName", "descrizioneUo"],
  ["digitalAddress", "mail1"],
  ["origin", "origin"],
  ["address", "indirizzo"],
  ["registeredOffice", "indirizzo"],
  ["zipCode", "CAP"],
] as const);

export const apicale_selfcare_stepOne_map = new Map([
  ["id", "id"],
  ["externalId", "externalId"],
  ["origin", "origin"],
  ["originId", "originId"],
  ["businessName", "description"],
  ["legalRegisterName", "description"],
  ["institutionType", "institutionType"],
  ["digitalAddress", "digitalAddress"],
  ["address", "address"],
  ["zipCode", "zipCode"],
  ["taxcode", "taxCode"],
  ["city", "city"],
  ["county", "county"],
  ["country", "country"],
  ["registeredOffice", "address"],
] as const);

export const apicale_ipa_stepOne_map = new Map([
  ["taxcode", "taxCode"],
  ["originId", "originId"],
  ["businessName", "description"],
  ["digitalAddress", "digitalAddress"],
  ["address", "address"],
  ["zipCode", "zipCode"],
] as const);

export const apicale_infocamere_stepOne_map = new Map([
  ["businessName", "businessName"],
  ["digitalAddress", "digitalAddress"],
  ["city", "city"],
  ["county", "county"],
  ["zipCode", "zipCode"],
  ["address", "address"],
  ["digitalAddress", "digitalAddress"],
] as const);
