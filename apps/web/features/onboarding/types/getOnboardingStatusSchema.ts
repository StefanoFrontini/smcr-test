import * as z from "zod";

export const BillingSchema = z.object({
  vatNumber: z.string(),
  recipientCode: z.string().optional(),
  publicServices: z.boolean(),
});
export type Billing = z.infer<typeof BillingSchema>;

export const InstitutionSchema = z.object({
  id: z.string(),
  institutionType: z.string(),
  taxCode: z.string(),
  subunitCode: z.string().optional(),
  subunitType: z.string().optional(),
  origin: z.string(),
  originId: z.string(),
  description: z.string(),
  digitalAddress: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  geographicTaxonomies: z.array(z.any()),
});
export type Institution = z.infer<typeof InstitutionSchema>;

export const UserSchema = z.object({
  id: z.string(),
  role: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const getOnboardingStatusSchema = z.array(
  z.object({
    id: z.string(),
    productId: z.string(),
    institution: InstitutionSchema,
    users: z.array(UserSchema),
    billing: BillingSchema,
    status: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
);
export type GetOnboardingStatusSchema = z.infer<
  typeof getOnboardingStatusSchema
>;
