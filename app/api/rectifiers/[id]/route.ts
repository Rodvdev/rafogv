import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const rectifier = await prisma.engineRectifier.findUnique({
    where: { id },
    include: {
      address: true,
      contact: true,
    },
  });

  if (!rectifier) {
    return NextResponse.json({ error: "Rectifier not found" }, { status: 404 });
  }

  return NextResponse.json(rectifier);
}

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

  // Update rectifier
  const rectifier = await prisma.engineRectifier.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      specialties: data.specialties || [],
      rating: data.rating,
      checked: data.checked,
      tenantId: data.tenantId,
    },
    include: {
      address: true,
      contact: true,
    },
  });

  // Update address if provided
  if (data.address) {
    if (rectifier.address) {
      await prisma.address.update({
        where: { id: rectifier.address.id },
        data: {
          street: data.address.street,
          district: data.address.district,
          province: data.address.province || "Lima",
          country: data.address.country || "Perú",
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        },
      });
    } else {
      await prisma.address.create({
        data: {
          rectifierId: id,
          street: data.address.street,
          district: data.address.district,
          province: data.address.province || "Lima",
          country: data.address.country || "Perú",
          latitude: data.address.latitude,
          longitude: data.address.longitude,
        },
      });
    }
  }

  // Update contact if provided
  if (data.contact) {
    if (rectifier.contact) {
      await prisma.contact.update({
        where: { id: rectifier.contact.id },
        data: {
          phone: data.contact.phone,
          phoneAlt: data.contact.phoneAlt,
          email: data.contact.email,
          whatsapp: data.contact.whatsapp,
          website: data.contact.website,
          facebook: data.contact.facebook,
          instagram: data.contact.instagram,
        },
      });
    } else {
      await prisma.contact.create({
        data: {
          rectifierId: id,
          phone: data.contact.phone,
          phoneAlt: data.contact.phoneAlt,
          email: data.contact.email,
          whatsapp: data.contact.whatsapp,
          website: data.contact.website,
          facebook: data.contact.facebook,
          instagram: data.contact.instagram,
        },
      });
    }
  }

  // Fetch updated rectifier with relations
  const updatedRectifier = await prisma.engineRectifier.findUnique({
    where: { id },
    include: {
      address: true,
      contact: true,
    },
  });

  return NextResponse.json(updatedRectifier);
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
