// client/src/services/workshopService.js
import api from './api';

export const getWorkshops = async () => {
  const response = await api.get('/workshops');
  return response.data;
};

export const getWorkshopById = async (id) => {
  const response = await api.get(`/workshops/${id}`);
  return response.data;
};

export const createWorkshop = async (formData) => {
  const response = await api.post('/workshops', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateWorkshop = async (id, data) => {
  const response = await api.put(`/workshops/${id}`, data);
  return response.data;
};

export const deleteWorkshop = async (id) => {
  const response = await api.delete(`/workshops/${id}`);
  return response.data;
};