import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import EditRectifierForm from "./EditRectifierForm";

export default async function EditRectifierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;

  return <EditRectifierForm id={id} />;
}

