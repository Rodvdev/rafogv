import { redirect } from "next/navigation";
import { auth } from "../api/auth/[...nextauth]/auth";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <DashboardContent />;
}

