import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { organization } from "better-auth/plugins";
import { customSession } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
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
