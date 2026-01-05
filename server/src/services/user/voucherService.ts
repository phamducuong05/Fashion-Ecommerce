import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getMyVouchers = async (userId: number) => {
  const now = new Date();

  const userVouchers = await prisma.userVoucher.findMany({
    where: {
      userId: userId,
      isUsed: false,
      voucher: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gt: now },
      },
    },
    include: {
      voucher: {
        select: {
          id: true,
          code: true,
          description: true,
          value: true,
          type: true,
        },
      },
    },
  });

  return userVouchers.map((uv) => ({
    id: uv.voucher.id,
    userVoucherId: uv.id,
    code: uv.voucher.code,
    description: uv.voucher.description,
    value: uv.voucher.value,
    type: uv.voucher.type,
  }));
};

export default { getMyVouchers };
