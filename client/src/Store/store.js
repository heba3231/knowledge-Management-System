// src/store.js (أو src/Store/store.js)
import { configureStore } from '@reduxjs/toolkit';
import staffReducer from '../Features/StaffSlice'; // ✅ مسار صحيح

const store = configureStore({
  reducer: {
    staff: staffReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;