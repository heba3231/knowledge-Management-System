import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { verifyToken, adminAuthenticate } from '../middleware/auth.js';

const router = express.Router();

// جميع المسارات تتطلب Admin
router.use(verifyToken);
router.use(adminAuthenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;