import * as yup from 'yup';

// ============================================================
// 1. قواعد التحقق من صحة بيانات تسجيل الدخول
// ============================================================
export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// ============================================================
// 2. قواعد التحقق من صحة بيانات التسجيل
// ============================================================
export const registerValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Full name is required'),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  staffNumber: yup
    .string()
    .min(3, 'Staff number must be at least 3 characters')
    .max(20, 'Staff number must not exceed 20 characters')
    .required('Staff number is required')
    .matches(/^[a-zA-Z0-9]+$/, 'Staff number can only contain letters and numbers'),
  
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(30, 'Password must not exceed 30 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  
  role: yup
    .string()
    .oneOf(['Staff', 'DocumentController', 'QualityManager', 'DepartmentManager', 'Admin'], 'Invalid role selected')
    .required('Role is required'),
  
  department: yup
    .string()
    .oneOf(
      ['General', 'ER', 'ICU', 'Lab', 'Pharmacy', 'HR', 'Radiology', 'Nursing'],
      'Invalid department selected'
    )
    .required('Department is required'),
});

// ============================================================
// 3. قواعد التحقق من صحة تحديث الملف الشخصي
// ============================================================
export const profileUpdateValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  email: yup
    .string()
    .email('Please enter a valid email address'),
  
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(30, 'Password must not exceed 30 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// ============================================================
// 4. دالة مساعدة للتحقق من صحة البيانات
// ============================================================
export const validateForm = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};

// ============================================================
// 5. تصدير جميع القواعد
// ============================================================
export default {
  loginValidationSchema,
  registerValidationSchema,
  profileUpdateValidationSchema,
  validateForm
};