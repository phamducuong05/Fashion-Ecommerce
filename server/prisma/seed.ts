// prisma/seed.ts
import prisma from "../src/utils/prisma";
import { faker } from "@faker-js/faker";

const randomElement = <T>(array: T[]) =>
  array[Math.floor(Math.random() * array.length)];

async function main() {
  console.log('🇺🇸 Starting seeding with "isUpdate" field...');

  // --- BƯỚC 1: DỌN DẸP DỮ LIỆU ---
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();

  await prisma.supportMessage.deleteMany();
  await prisma.userVoucher.deleteMany();
  await prisma.address.deleteMany();
  await prisma.voucher.deleteMany();

  await prisma.user.deleteMany();

  console.log("🧹 Cleanup done.");

  // --- BƯỚC 2: TẠO ADMIN ---
  console.log("🛡️ Creating Admin...");
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      email: "admin@gmail.com",
      password: "123",
      fullName: "Super Admin",
      phone: "0909000000",
      role: "ADMIN",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHT9KQ3vag-Gdd9sjA7pi6zl2f_ho4Gh7Vg&s",
    },
  });

  // --- BƯỚC 3: TẠO VOUCHER (CÓ isUpdate) ---
  console.log("🎫 Creating Vouchers...");
  const vouchers = await prisma.voucher.createManyAndReturn({
    data: [
      {
        code: "WELCOME10",
        value: 10000,
        stock: 1000,
        usedCount: 150,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
        isActive: false, // <--- Thêm ở đây
      },
      {
        code: "SUMMER25",
        value: 20000,
        stock: 100,
        usedCount: 89,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
        isActive: true, // <--- Thử để true (Ví dụ mã này vừa được cập nhật lại)
      },
      {
        code: "FREESHIP",
        value: 30000,
        stock: 500,
        usedCount: 450,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
        isActive: false,
      },
      {
        code: "VIPMEMBER",
        value: 50000,
        stock: 50,
        usedCount: 5,
        startDate: new Date(),
        endDate: new Date("2025-12-31"),
        isActive: false,
      },
    ],
  });

  // --- BƯỚC 4: TẠO 50 USER THƯỜNG ---
  console.log("👤 Creating 50 Users...");

  for (let i = 0; i < 50; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    const user = await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: "123",
        fullName: fullName,
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
        role: "USER",

        addresses: {
          create: {
            recipientName: fullName,
            phone: faker.phone.number(),
            city: faker.location.city(),
            district: faker.location.state(),
            ward: faker.location.zipCode(),
            detail: faker.location.streetAddress(),
            isDefault: true,
          },
        },
      },
    });

    if (Math.random() > 0.5) {
      const randomVoucher = randomElement(vouchers);
      await prisma.userVoucher.create({
        data: {
          userId: user.id,
          voucherId: randomVoucher.id,
          isUsed: false,
        },
      });
    }
  }

  // --- BƯỚC 5: TẠO SUPPORT MESSAGES ---
  console.log("📩 Creating Support Messages...");

  const supportTopics = [
    "I haven't received my order yet.",
    "Can I change my shipping address?",
    "Product damaged on arrival.",
    "Return request.",
    "Payment issue.",
  ];

  await prisma.supportMessage.createMany({
    data: Array.from({ length: 20 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      content: `${randomElement(supportTopics)} - ${faker.lorem.sentences(1)}`,
      status: randomElement(["PENDING", "RESOLVED"]),
      createdAt: faker.date.recent({ days: 30 }),
    })),
  });

  console.log("🏁 XONG! Database updated with isUpdate field.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
