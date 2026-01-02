import prisma from "../../utils/prisma";

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: true,
    },
  });
};
