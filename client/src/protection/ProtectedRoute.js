// src/protection/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * مكون حماية المسارات (للصفحات التي تتطلب تسجيل دخول فقط، مثل الإعدادات الشخصية)
 * إذا لم يكن المستخدم مصادقاً، يتم توجيهه إلى صفحة تسجيل الدخول للأدمن.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.staff);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;