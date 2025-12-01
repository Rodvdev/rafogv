import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/auth";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <DashboardLayoutClient session={session}>{children}</DashboardLayoutClient>;
}

