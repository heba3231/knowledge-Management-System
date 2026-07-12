// src/auth/StaffLogin.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../Features/StaffSlice'; // ✅ مسار موحد
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const StaffLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.staff);

  const handleSubmit = async (credentials) => {
    dispatch(clearError());
    const result = await dispatch(loginUser(credentials));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <LoginForm
      title="Staff Login"
      subtitle="Sign in with your staff number and password"
      onSubmit={handleSubmit}
      isLoading={loading}
      error={error}
      showToggle={false}
      buttonText="Login"
      useStaffNumber={true}
    />
  );
};

export default StaffLogin;