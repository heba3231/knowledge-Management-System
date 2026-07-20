// src/features/StaffSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// ✅ استيراد api بدلاً من axios مباشر
import api from '../services/api';

// ❌ حذف API_URL الثابت
// const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = createAsyncThunk(
  'staff/login',
  async ({ email, staffNumber, password }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (staffNumber) {
        payload.staffNumber = staffNumber;
      } else if (email) {
        payload.email = email;
      } else {
        throw new Error('Email or staff number is required');
      }
      payload.password = password;

      // ✅ استخدام api بدلاً من axios مع المسار النسبي
      const response = await api.post('/auth/login', payload);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'staff/register',
  async (userData, { rejectWithValue }) => {
    try {
      // ✅ استخدام api
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'staff/profile',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ استخدام api (التوكن يُضاف تلقائياً بواسطة interceptor)
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  success: false
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
        state.success = false;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });
  }
});

export const { logout, clearError, clearSuccess } = staffSlice.actions;
export default staffSlice.reducer;