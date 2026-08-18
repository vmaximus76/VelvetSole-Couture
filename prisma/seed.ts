import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_TENANT = {
  brandName: "VelvetSole Couture",
  domain: "demo.velvetsolecouture.local",
};

const DEMO_USER = {
  email: "demo@velvetsolecouture.local",
  name: "Demo Admin",
  password: "VelvetSole!Demo1",
  role: "ADMIN",
};

const PRODUCTS = [
  {
    title: "The Velvet Archive — Vol. 1",
    description: "A curated collection of studio-shot clips from our debut season.",
    priceCents: 4999,
    deliverableS3Key: "seed/velvet-archive-vol-1.mp4",
    published: true,
  },
  {
    title: "Midnight Opulence Pack",
    description: "Low-light, high-contrast footage shot with our signature lighting setup.",
    priceCents: 3999,
    deliverableS3Key: "seed/midnight-opulence-pack.mp4",
    published: true,
  },
  {
    title: "Golden Hour Selects",
    description: "A short-form pack of our most requested golden-hour footage.",
    priceCents: 1999,
    deliverableS3Key: "seed/golden-hour-selects.mp4",
    published: true,
  },
  {
    title: "The Signature Collection",
    description: "Our flagship pack — the full-length, full-quality release.",
    priceCents: 4999,
    deliverableS3Key: "seed/signature-collection.mp4",
    published: true,
  },
];

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { domain: DEMO_TENANT.domain },
    update: {},
    create: DEMO_TENANT,
  });

  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
  await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {
      passwordHash,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
      tenantId: tenant.id,
    },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      role: DEMO_USER.role,
      tenantId: tenant.id,
      passwordHash,
    },
  });

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { tenantId_title: { tenantId: tenant.id, title: product.title } },
      update: product,
      create: { ...product, tenantId: tenant.id },
    });
  }

  console.log(`Seeded ${PRODUCTS.length} products for tenant "${tenant.brandName}".`);
  console.log(`Demo login -> email: ${DEMO_USER.email}  password: ${DEMO_USER.password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
