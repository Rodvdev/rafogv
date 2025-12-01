-- CreateEnum
CREATE TYPE "WorkshopType" AS ENUM ('MECANICO', 'MULTIMARCA', 'ELECTRICO', 'FRENOS', 'SUSPENSION', 'DIRECCION', 'LLANTAS', 'DIAGNOSTICO', 'GNV_GLP', 'OFICIAL', 'A_DOMICILIO');

-- CreateEnum
CREATE TYPE "RectifierType" AS ENUM ('RECTIFICADORA', 'DIESEL', 'ELECTRICO', 'TORNERIA', 'COMPRESORES');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT,
    "district" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'Lima',
    "country" TEXT NOT NULL DEFAULT 'Perú',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "workshopId" TEXT,
    "rectifierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "phoneAlt" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "workshopId" TEXT,
    "rectifierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WorkshopType" NOT NULL,
    "description" TEXT,
    "services" TEXT[],
    "rating" DOUBLE PRECISION,
    "tenantId" TEXT,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngineRectifier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RectifierType" NOT NULL,
    "description" TEXT,
    "specialties" TEXT[],
    "rating" DOUBLE PRECISION,
    "tenantId" TEXT,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EngineRectifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_workshopId_key" ON "Address"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_rectifierId_key" ON "Address"("rectifierId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_workshopId_key" ON "Contact"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_rectifierId_key" ON "Contact"("rectifierId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_rectifierId_fkey" FOREIGN KEY ("rectifierId") REFERENCES "EngineRectifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_rectifierId_fkey" FOREIGN KEY ("rectifierId") REFERENCES "EngineRectifier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
