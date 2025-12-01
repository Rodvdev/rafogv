import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding users...");

  // Check if super admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "oficina@rgvautoparts.com" },
  });

  if (existingAdmin) {
    console.log("⚠️  Super admin already exists. Skipping user seed.");
    return;
  }

  // Create super admin
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: "oficina@rgvautoparts.com",
      name: "Super Admin",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log("✅ Super admin created:", superAdmin.email);
  console.log("   Password: admin123");
  console.log("   Role: SUPER_ADMIN");
}

main()
  .catch((e) => {
    console.error("❌ User seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

