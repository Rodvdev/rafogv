import { redirect } from "next/navigation";
import { auth } from "../../../api/auth/[...nextauth]/auth";
import EditWorkshopForm from "./EditWorkshopForm";

export default async function EditWorkshopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  const { id } = await params;

  return <EditWorkshopForm id={id} />;
}

