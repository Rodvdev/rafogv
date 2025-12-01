import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const rectifier = await prisma.engineRectifier.update({
    where: { id: params.id },
    data,
    include: {
      address: true,
      contact: true,
    },
  });

  return NextResponse.json(rectifier);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.engineRectifier.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}

