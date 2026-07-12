import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// تسجيل مستخدم جديد
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, staffNumber, password, role, department } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { staffNumber }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email or staff number already exists'
      });
    }

    const user = new User({ name, email, staffNumber, password, role, department });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// تسجيل الدخول (للموظفين العاديين)
export const loginUser = async (req, res, next) => {
  try {
    const { email, staffNumber, password } = req.body;
    let user;

    if (email) {
      user = await User.findOne({ email }).select('+password');
    } else if (staffNumber) {
      user = await User.findOne({ staffNumber }).select('+password');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email or staff number required'
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    // منع الأدمن من تسجيل الدخول من هنا (مثل السيرفر الأصلي)
    if (user.role === 'Admin') {
      return res.status(403).json({ success: false, message: 'Please use the Admin login page.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// تسجيل الدخول كـ Admin
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(403).json({ success: false, message: 'Account not found' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Not an admin account.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Wrong password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// جلب بيانات المستخدم الحالي
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};