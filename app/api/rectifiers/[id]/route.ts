import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  const rectifier = await prisma.engineRectifier.update({
    where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.engineRectifier.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

