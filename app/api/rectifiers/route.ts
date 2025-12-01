import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rectifiers = await prisma.engineRectifier.findMany({
    include: {
      address: true,
      contact: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(rectifiers);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const rectifier = await prisma.engineRectifier.create({
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      specialties: data.specialties || [],
      address: data.address
        ? {
            create: {
              street: data.address.street,
              district: data.address.district,
              province: data.address.province || "Lima",
              country: data.address.country || "Perú",
            },
          }
        : undefined,
      contact: data.contact
        ? {
            create: {
              phone: data.contact.phone,
              email: data.contact.email,
              website: data.contact.website,
            },
          }
        : undefined,
    },
    include: {
      address: true,
      contact: true,
    },
  });

  return NextResponse.json(rectifier);
}

