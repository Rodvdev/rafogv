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

  const workshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      address: true,
      contact: true,
    },
  });

  if (!workshop) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
  }

  return NextResponse.json(workshop);
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

  // Update workshop
  const workshop = await prisma.workshop.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      services: data.services || [],
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
    if (workshop.address) {
      await prisma.address.update({
        where: { id: workshop.address.id },
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
          workshopId: id,
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
    if (workshop.contact) {
      await prisma.contact.update({
        where: { id: workshop.contact.id },
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
          workshopId: id,
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

  // Fetch updated workshop with relations
  const updatedWorkshop = await prisma.workshop.findUnique({
    where: { id },
    include: {
      address: true,
      contact: true,
    },
  });

  return NextResponse.json(updatedWorkshop);
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

  await prisma.workshop.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
