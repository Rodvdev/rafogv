import { redirect } from "next/navigation";
import { auth } from "../../api/auth/[...nextauth]/auth";
import UsersContent from "./UsersContent";

export default async function UsersPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  // Solo SUPER_ADMIN puede acceder
  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return <UsersContent />;
}

