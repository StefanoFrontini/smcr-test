import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession, organization } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID,
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: false,
      teams: {
        enabled: true,
      },
    }),
    customSession(async ({ user, session }) => {
      const teams = await prisma.team.findMany({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
        select: {
          name: true, // Seleziona solo il campo `name` del team
        },
      });
      return {
        user: {
          ...user,
          teams,
        },
        session,
      };
    }),
  ],
});
