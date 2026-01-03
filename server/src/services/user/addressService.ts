import prisma from "../../utils/prisma";

// GET
const getAddresses = async (userId: number) => {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

// CREATE
const createAddress = async (userId: number, data: any) => {
  if (!data.recipientName || !data.phone || !data.city || !data.detail) {
    throw new Error("Missing required fields");
  }

  if (data.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const count = await prisma.address.count({ where: { userId } });
  const finalIsDefault = count === 0 ? true : data.isDefault || false;

  return await prisma.address.create({
    data: {
      userId: userId,
      recipientName: data.recipientName,
      phone: data.phone,
      city: data.city,
      district: data.district || null,
      ward: data.ward || null,
      detail: data.detail,
      isDefault: finalIsDefault,
    },
  });
};

// UPDATE
const updateAddress = async (userId: number, addressId: number, data: any) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id: addressId },
    data: {
      recipientName: data.recipientName,
      phone: data.phone,
      city: data.city,
      district: data.district,
      ward: data.ward,
      detail: data.detail,
      isDefault: data.isDefault,
    },
  });
};

// DELETE
const deleteAddress = async (userId: number, addressId: number) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw new Error("Address not found or unauthorized");

  return await prisma.address.delete({
    where: { id: addressId },
  });
};

export default { getAddresses, createAddress, updateAddress, deleteAddress };
