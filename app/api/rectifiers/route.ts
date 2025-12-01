import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const checked = searchParams.get("checked");
  const district = searchParams.get("district");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive" as const,
    };
  }

  if (checked !== null && checked !== undefined) {
    where.checked = checked === "true";
  }

  if (district) {
    where.address = {
      district: {
        contains: district,
        mode: "insensitive" as const,
      },
    };
  }

  // Build orderBy object
  let orderBy: Record<string, "asc" | "desc"> | { address: { district: "asc" | "desc" } } = {};
  
  if (sortBy === "name") {
    orderBy = { name: sortOrder as "asc" | "desc" };
  } else if (sortBy === "type") {
    orderBy = { type: sortOrder as "asc" | "desc" };
  } else if (sortBy === "district") {
    orderBy = { address: { district: sortOrder as "asc" | "desc" } };
  } else if (sortBy === "checked") {
    orderBy = { checked: sortOrder as "asc" | "desc" };
  } else {
    orderBy = { createdAt: sortOrder as "asc" | "desc" };
  }

  const [rectifiers, total] = await Promise.all([
    prisma.engineRectifier.findMany({
      where,
      include: {
        address: true,
        contact: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.engineRectifier.count({ where }),
  ]);

  return NextResponse.json({
    data: rectifiers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
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

