import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Solo SUPER_ADMIN puede ver usuarios
  if (session.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Solo SUPER_ADMIN puede actualizar usuarios
  if (session.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const data = await request.json();

  const updateData: {
    email?: string;
    name?: string | null;
    password?: string;
    role?: UserRole;
  } = {};

  if (data.email) {
    // Verificar si el email ya existe en otro usuario
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    updateData.email = data.email;
  }

  if (data.name !== undefined) {
    updateData.name = data.name || null;
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  if (data.role) {
    updateData.role = data.role as UserRole;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Solo SUPER_ADMIN puede eliminar usuarios
  if (session.user?.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  // No permitir eliminar el propio usuario
  if (id === session.user?.id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

