import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You don\'t have permission to perform this action.');
    } else if (error.response?.status === 400) {
      toast.error(message || 'Invalid request. Please check your input.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(message || 'Something went wrong');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  validateToken: (token) => api.get('/auth/validate?token=' + token),
};

export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  approve: (id) => api.put(`/doctors/${id}/approve`),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  getMyProfile: () => api.get('/patients/my-profile'),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  addMedicalHistory: (patientId, data) => api.post(`/patients/${patientId}/medical-history`, data),
  getMedicalHistory: (patientId) => api.get(`/patients/${patientId}/medical-history`),
  updateMedicalHistory: (patientId, historyId, data) => api.put(`/patients/${patientId}/medical-history/${historyId}`, data),
  deleteMedicalHistory: (patientId, historyId) => api.delete(`/patients/${patientId}/medical-history/${historyId}`),
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: () => api.get('/appointments/doctor'),
  book: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status?status=${status}`),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

export const billingAPI = {
  getAll: () => api.get('/billing'),
  getById: (id) => api.get(`/billing/${id}`),
  getMyInvoices: () => api.get('/billing/my-invoices'),
  getByAppointment: (appointmentId) => api.get(`/billing/appointment/${appointmentId}`),
  create: (data) => api.post('/billing', data),
  updateStatus: (id, status) => api.put(`/billing/${id}/status?status=${status}`),
  payInvoice: (id, paymentMethod) => api.put(`/billing/${id}/pay?paymentMethod=${paymentMethod}`),
  markPaid: (id) => api.put(`/billing/${id}/mark-paid`),
};

export default api;
