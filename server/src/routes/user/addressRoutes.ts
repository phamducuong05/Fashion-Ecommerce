import { Router } from "express";
import addressController from "../../controllers/user/addressController";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", addressController.getList);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.remove);

export default router;
