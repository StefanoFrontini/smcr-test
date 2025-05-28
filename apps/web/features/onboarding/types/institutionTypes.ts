import { institutionValues } from "../utils/constants";

export type InstitutionValueOptions = (typeof institutionValues)[number];

type PSP = {
  tag: "psp";
  value: string;
};
type PA = {
  tag: "pa";
  value: string;
};
type GSP = {
  tag: "gsp";
  value: string;
};

type PT = {
  tag: "pt";
  value: string;
};
type SCP = {
  tag: "scp";
  value: string;
};

export type InstitutionOptions = Array<PSP | PA | GSP | PT | SCP>;
