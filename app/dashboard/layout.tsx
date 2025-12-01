import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/auth";
import DashboardSidebar from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <DashboardSidebar session={session} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

