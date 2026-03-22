import { Router } from 'express';
import { createCategory, getCategoryById, listCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, createCategory);
router.get('/', authenticateJWT, listCategories);
router.get('/:id', authenticateJWT, getCategoryById);
router.put('/:id', authenticateJWT, updateCategory);
router.delete('/:id', authenticateJWT, deleteCategory);

export default router;
