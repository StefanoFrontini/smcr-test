"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export type UpdateTeamFormState = {
  data: string;
  error?: string;
};

export async function updateTeam(
  prevState: UpdateTeamFormState | null,
  formData: FormData,
): Promise<UpdateTeamFormState> {
  const team = formData.get("team") as string | null;
  const user = formData.get("user") as string | null;
  console.log("ACTION", team, user);

  if (team === null || user === null) {
    return { data: "", error: "Team cannot be undefined." };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null || !session.user.id) {
    return { data: "", error: "Team cannot be undefined." };
  }

  const response = await prisma.member.updateMany({
    data: {
      teamId: team,
    },
    where: {
      userId: user,
    },
  });

  console.log(response);

  return { data: team };
}
