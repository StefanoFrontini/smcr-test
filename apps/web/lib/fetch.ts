import { createFetch } from "@better-fetch/fetch";

export const $fetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_PROD_BASE_PATH}`,
});
