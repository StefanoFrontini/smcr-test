"use client";

import { updateTeam } from "@/actions/admin";
import { Team } from "@prisma/client";
import { getColumns, MembersTable } from "@repo/ui";
import React from "react";

type Props = {
  teams: Array<Team>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    teams: Array<string>;
  }>;
};

export default function MembersTableWrapper({ teams, users }: Props) {
  return (
    <MembersTable
      columns={getColumns(teams, updateTeam as any) as any}
      data={users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        teams: user.teams,
      }))}
    />
  );
}
