// src/protection/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.staff);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/staff-login" replace />;
  }

  // تحقق من أن دور المستخدم موجود في قائمة الأدوار المسموح بها
  if (!allowedRoles.includes(user?.role)) {
    // إذا لم يكن لديه صلاحية، أعد توجيهه إلى لوحة التحكم (أو صفحة 403)
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;