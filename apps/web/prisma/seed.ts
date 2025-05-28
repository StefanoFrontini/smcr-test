import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: {
      id: randomUUID(),
      name: "PagoPA",
      slug: "pago-pa",
      logo: "https://www.anitec-assinform.it/imgpub/2050616/0/0/2197912210o__ologo-pagopa-spa.png",
      createdAt: new Date(),
    },
  });

  console.log({ message: "Base organization created successfully.", org });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
