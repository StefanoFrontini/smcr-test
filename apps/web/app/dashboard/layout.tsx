import { AppSidebar } from "@/components/layout/sidebar";
import { auth } from "@/lib/auth";
import { SidebarProvider } from "@repo/ui";
import { headers } from "next/headers";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <SidebarProvider>
      <AppSidebar
        name={session?.user.name || ""}
        email={session?.user.email || ""}
      />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
