import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import addressService from "../../services/user/addressService";

const getList = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).send();
  const list = await addressService.getAddresses(userId);
  res.json(list);
};

const create = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).send();
  try {
    const item = await addressService.createAddress(userId, req.body);
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const update = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).send();
  try {
    const item = await addressService.updateAddress(userId, Number(id), req.body);
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).send();
  try {
    await addressService.deleteAddress(userId, Number(id));
    res.json({ message: "Deleted" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default { getList, create, update, remove };
