import { Router } from 'express';

import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  createCategory 
} from '../controllers/productController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getAllProducts); 
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct); 
router.post('/categories', authenticate, createCategory);

export default router;