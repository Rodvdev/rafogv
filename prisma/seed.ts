import { PrismaClient, WorkshopType, RectifierType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // -----------------------------
  // DATA
  // -----------------------------

  const workshops = [
    {
      name: "Iza Motors San Martín de Porres",
      type: WorkshopType.MECANICO,
      services: ["mecánica", "mantenimiento", "alineamiento"],
      district: "San Martín de Porres",
      street: "Av. Naranjal 159",
      phone: null,
    },
    {
      name: "Alineamiento J. Ocaña E.I.R.L.",
      type: WorkshopType.DIRECCION,
      services: ["alineamiento", "frenos"],
      district: "La Victoria",
      street: "Jr. Hipólito Unanue 936",
      phone: null,
    },
    {
      name: "Cavalié Taller Automotriz",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Lima",
      street: "Jr. José Gálvez 1469",
      phone: null,
    },
    {
      name: "Bosch Car Service - Cordaez",
      type: WorkshopType.MULTIMARCA,
      services: ["mecánica", "diagnóstico", "eléctrico"],
      district: "Pueblo Libre",
      street: "Av. de la Marina 785",
      phone: null,
    },
    {
      name: "BLUEMEC Automotriz",
      type: WorkshopType.MECANICO,
      services: ["mecánica", "frenos"],
      district: "Lima",
      street: "Av. Colonial 2320",
      phone: null,
    },
    {
      name: "DiagnostiCAR",
      type: WorkshopType.DIAGNOSTICO,
      services: ["scanner", "diagnóstico"],
      district: "Miraflores",
      street: "Av. José Pardo 1167",
      phone: null,
    },
    {
      name: "Total Car Service",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Lince",
      street: "Av. Paseo de la República 1878",
      phone: null,
    },
    {
      name: "GLF Automotriz",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Magdalena del Mar",
      street: "Av. Antonio José de Sucre 558",
      phone: null,
    },
    {
      name: "IZA MOTORS PERU SAC",
      type: WorkshopType.MECANICO,
      services: ["mecánica", "frenos"],
      district: "San Juan de Lurigancho",
      street: "Av. El Bosque 256",
      phone: null,
    },
    {
      name: "Iza Motor Peru SAC - Zárate",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "San Juan de Lurigancho",
      street: "Las Mercedes 951",
      phone: null,
    },
    {
      name: "Taller Automotriz Kaisal",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "San Miguel",
      street: "Av. La Paz 650",
      phone: null,
    },
    {
      name: "Automotriz Lima World",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Breña",
      street: "Av. República de Venezuela 1353",
      phone: null,
    },
    {
      name: "Mecánicos a Domicilio en Lima - 24 Horas",
      type: WorkshopType.A_DOMICILIO,
      services: ["mecánica a domicilio"],
      district: "Lima",
      street: "Jr. Loreto 665",
      phone: null,
    },
    {
      name: "JCH Llantas - Local La Marina",
      type: WorkshopType.LLANTAS,
      services: ["llantas", "alineamiento"],
      district: "Pueblo Libre",
      street: "Av. de la Marina 380",
      phone: null,
    },
    {
      name: "MC CAR",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Los Olivos",
      street: "Av. Tomás Valle 850",
      phone: null,
    },
    {
      name: "RST Automotriz",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "Surquillo",
      street: "C. Víctor Alzamora 256",
      phone: null,
    },
    {
      name: "Volkswagen Limawagen Chorrillos",
      type: WorkshopType.OFICIAL,
      services: ["servicio oficial Volkswagen"],
      district: "Chorrillos",
      street: "Av. Defensores del Morro 1491",
      phone: null,
    },
    {
      name: "AGAMOTORS - Taller GNV/GLP",
      type: WorkshopType.GNV_GLP,
      services: ["conversión GNV", "GLP"],
      district: "La Victoria",
      street: "Av. Aviación 1296",
      phone: null,
    },
    {
      name: "Germania Automotriz",
      type: WorkshopType.MECANICO,
      services: ["mecánica general"],
      district: "San Luis",
      street: "Av. San Luis 824",
      phone: null,
    },
    {
      name: "KIA Taller Villarán",
      type: WorkshopType.OFICIAL,
      services: ["servicio oficial KIA"],
      district: "La Victoria",
      street: "Av. Carlos Villarán 802",
      phone: null,
    },
  ];

  const rectifiers = [
    {
      name: "American Diesel Motors S.R.L.",
      type: RectifierType.DIESEL,
      specialties: ["rectificación", "motores diesel"],
      district: "San Juan de Lurigancho",
      street: "Av. Próceres de la Independencia 1305",
      phone: "322-7070",
    },
    {
      name: "Rivera Diesel Motors S.A.C.",
      type: RectifierType.DIESEL,
      specialties: ["rectificación", "cigüeñales"],
      district: "Ate",
      street: "Av. Calca 239",
      phone: "349-4178",
    },
    {
      name: "Rectificaciones Carrera",
      type: RectifierType.DIESEL,
      specialties: ["rectificación de motor"],
      district: "San Juan de Lurigancho",
      street: "Av. El Sol 542",
      phone: "387-0893",
    },
    {
      name: "Montalvo Compresores y Motores",
      type: RectifierType.COMPRESORES,
      specialties: ["motores eléctricos", "tornería"],
      district: "Lima",
      street: "Jr. Alemania 2267",
      phone: "425-5377",
    },
    {
      name: "La Filotecnia",
      type: RectifierType.RECTIFICADORA,
      specialties: ["rectificación de motor"],
      district: "La Victoria",
      street: "Jr. García Naranjo 275",
      phone: "423-1233",
    },
    {
      name: "Rectificaciones Motor Mini",
      type: RectifierType.RECTIFICADORA,
      specialties: ["rectificado de bloques"],
      district: "La Victoria",
      street: "Los Brillantes 599",
      phone: null,
    },
    {
      name: "Rectificadora Universal S.A.C.",
      type: RectifierType.RECTIFICADORA,
      specialties: ["rectificación de motor"],
      district: "La Victoria",
      street: "Av. Iquitos 1159",
      phone: null,
    },
    {
      name: "Rectificaciones Señor de los Milagros",
      type: RectifierType.RECTIFICADORA,
      specialties: ["rectificación"],
      district: "San Luis",
      street: "Av. San Luis 1041",
      phone: null,
    },
    {
      name: "Spraycrom S.A.C.",
      type: RectifierType.TORNERIA,
      specialties: ["tornería", "rectificado"],
      district: "San Luis",
      street: "Av. De La Rosa Toro 195",
      phone: null,
    },
    {
      name: "Motores Vega S.A.C.",
      type: RectifierType.RECTIFICADORA,
      specialties: ["rectificación", "cigüeñales"],
      district: "La Victoria",
      street: "Jr. Italia 1057",
      phone: null,
    },
  ];

  // -----------------------------
  // SEED INSERTIONS
  // -----------------------------

  // Check for existing data to avoid duplicates
  const existingWorkshops = await prisma.workshop.count();
  const existingRectifiers = await prisma.engineRectifier.count();

  if (existingWorkshops > 0 || existingRectifiers > 0) {
    console.log(
      `⚠️  Database already contains data (${existingWorkshops} workshops, ${existingRectifiers} rectifiers). Skipping seed.`
    );
    console.log("   To reseed, clear the database first.");
    return;
  }

  let createdWorkshops = 0;
  let createdRectifiers = 0;

  // Insert workshops
  for (const w of workshops) {
    try {
      await prisma.workshop.create({
        data: {
          name: w.name,
          type: w.type,
          services: w.services,
          address: {
            create: {
              street: w.street,
              district: w.district,
            },
          },
          contact: {
            create: {
              phone: w.phone,
            },
          },
        },
      });
      createdWorkshops++;
    } catch (error) {
      console.error(`❌ Error creating workshop "${w.name}":`, error);
    }
  }

  // Insert rectifiers
  for (const r of rectifiers) {
    try {
      await prisma.engineRectifier.create({
        data: {
          name: r.name,
          type: r.type,
          specialties: r.specialties,
          address: {
            create: {
              street: r.street,
              district: r.district,
            },
          },
          contact: {
            create: {
              phone: r.phone,
            },
          },
        },
      });
      createdRectifiers++;
    } catch (error) {
      console.error(`❌ Error creating rectifier "${r.name}":`, error);
    }
  }

  console.log(
    `✅ Seed completed: ${createdWorkshops} workshops, ${createdRectifiers} rectifiers created.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

