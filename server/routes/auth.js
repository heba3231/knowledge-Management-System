import express from 'express';
import {
  registerUser,
  loginUser,
  adminLogin,
  getProfile
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// تسجيل مستخدم جديد
router.post('/register', authLimiter, registerUser);

// تسجيل الدخول (للموظفين)
router.post('/login', authLimiter, loginUser);

// تسجيل الدخول كـ Admin
router.post('/admin/login', authLimiter, adminLogin);

// جلب بيانات المستخدم الحالي
router.get('/profile', verifyToken, getProfile);

export default router;