type BillingData = {
  businessName: string;
  digitalAddress: string;
  recipientCode: string;
  registeredOffice: string;
  taxcode: string;
  vatNumber: string;
  city: string;
  county: string;
  country: string;
  zipCode: string;
};

type User = {
  name: string;
  surname: string;
  email: string;
  taxCode: string;
  role: "MANAGER" | "OPERATOR" | "DELEGATE" | "SUB-DELEGATE";
};

type Users = Array<User>;

type AssistanceContacts = {
  supportEmail?: string;
};

type Origin = "IPA" | "SELC" | "INFOCAMERE" | "PDND_INFOCAMERE" | "IVASS";

type ProductId = string;

type TaxCode = string;
type DpoData = {
  address: string;
  pec: string;
  email: string;
};
type PspData = {
  abiCode: string;
  businessRegisterNumber: string;
  dpoData: DpoData;
  legalRegisterNumber: string;
  legalRegisterName: string;
  vatNumberGroup: boolean;
};

type GeographicTaxonomies = Array<{
  code?: string;
  desc?: string;
}>;

type AdditionalInformations = {
  belongRegulatedMarket: boolean;
  regulatedMarketNote: string;
  ipa: boolean;
  ipaCode: string;
  establishedByRegulatoryProvision: boolean;
  establishedByRegulatoryProvisionNote: string;
  agentOfPublicService: boolean;
  agentOfPublicServiceNote: string;
  otherNote: string;
};

type CompanyInformations = {
  rea: string;
};

export type Common = {
  billingData: BillingData;
  users: Users;
  origin: Origin;
  productId: ProductId;
  taxCode: TaxCode;
  assistanceContacts: AssistanceContacts;
  geographicTaxonomies: GeographicTaxonomies;
};

export type PostPsp = Common & {
  institutionType: "PSP";
  originId?: string;
  pspData: PspData;
};

export type PostPa = Common & {
  institutionType: "PA";
  originId?: string;
};

export type PostPt = Common & {
  institutionType: "PT";
  originId?: string;
};

export type PostGspProdPa = Common & {
  institutionType: "GSP";
  originId?: string;
  additionalInformations: AdditionalInformations;
  companyInformations: CompanyInformations;
};

export type PostGsp = Common & {
  institutionType: "GSP";
  originId?: string;
};

export type PostScp = Common & {
  institutionType: "SCP";
  originId?: string;
};
