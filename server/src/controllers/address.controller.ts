import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import addressService from "../services/address.service";

const getList = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).send();
  const list = await addressService.getAddresses(userId);
  res.json(list);
};

const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).send();
  const item = await addressService.createAddress(userId, req.body);
  res.json(item);
};

const update = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).send();
  const item = await addressService.updateAddress(userId, Number(id), req.body);
  res.json(item);
};

const remove = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).send();
  await addressService.deleteAddress(userId, Number(id));
  res.json({ message: "Deleted" });
};

export default { getList, create, update, remove };
