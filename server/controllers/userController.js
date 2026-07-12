import User from '../models/User.js';

// جلب جميع المستخدمين (Admin فقط)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// جلب مستخدم محدد بالمعرف
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// تحديث مستخدم (Admin فقط)
export const updateUser = async (req, res, next) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updateData);
    if (password) {
      user.password = password;
    }
    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// حذف مستخدم (Admin فقط)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};