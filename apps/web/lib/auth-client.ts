import type { auth } from "@/lib/auth";
import {
  customSessionClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    customSessionClient<typeof auth>(),
    organizationClient({
      teams: {
        enabled: true,
      },
    }),
  ],
});

export default authClient;
