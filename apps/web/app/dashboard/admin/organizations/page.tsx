import MembersTableWrapper from "@/components/admin/members-table-wrapper";
import CreateTeam from "@/components/admin/teams/create-team";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Team } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Checkbox,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  SidebarTrigger,
} from "@repo/ui";
import { FilterIcon } from "lucide-react";
import { headers as nextHeaders } from "next/headers";

export default async function Page() {
  const headers = await nextHeaders();
  const organization = await auth.api.getFullOrganization({
    query: {
      organizationSlug: process.env.NEXT_PUBLIC_ORGANIZATION_SLUG,
    },
    headers,
  });
  if (!organization) {
    throw new Error("Nessuna organizzazione di base");
  }

  const teams =
    ((await auth.api.listOrganizationTeams({
      query: {
        organizationId: organization?.id,
      },
      headers,
    })) as Array<Team>) || [];

  const users = (
    await prisma.user.findMany({
      include: {
        members: {
          select: {
            id: true,
            teamId: true,
          },
        },
      },
    })
  ).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    teams: user.members
      .filter((member) => !!member.teamId)
      .map((team) => team.teamId) as Array<string>,
  }));

  return (
    <div className="w-full flex flex-col gap-4">
      <header className="flex h-16 shrink-0 items-center border-b border-border gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="size-4" />

          <div className="bg-muted w-px h-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                Dashboard
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Organization</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="inline-flex justify-between items-center px-4">
        <div className="inline-flex items-center gap-2">
          <Input placeholder="Search by name or email" className="w-64" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Teams
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="1" />
                    <Label
                      htmlFor="1"
                      className="flex grow justify-between gap-2 font-normal"
                    >
                      Account
                    </Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <CreateTeam />
      </div>

      <div className="container mx-auto px-4">
        <MembersTableWrapper teams={teams} users={users} />
      </div>
    </div>
  );
}
