"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@repo/ui";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Shield,
  SquareTerminal,
  TextCursorInput,
} from "lucide-react";
import * as React from "react";
import { NavUser } from "./nav-footer";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nav-main";

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  main: [
    {
      label: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      label: "Onboarding",
      url: "/dashboard/onboarding",
      icon: TextCursorInput,
    },
    {
      label: "Admin",
      url: "/dashboard/admin/organizations",
      icon: Shield,
    },
  ],
};

type Props = {
  name: string;
  email: string;
};

export function AppSidebar({
  name,
  email,
  ...props
}: Props & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
      {...props}
    >
      <SidebarHeader>
        <NavHeader teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.main} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={{ name, email, avatar: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
