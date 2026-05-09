// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (!amount) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Validation helpers
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone?.replace(/\D/g, '') || '');
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// User helper
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Status helpers
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-green-100 text-green-700 border border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
    APPROVED: 'bg-green-100 text-green-700 border border-green-200',
    PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    PAID: 'bg-green-100 text-green-700 border border-green-200',
    UNPAID: 'bg-red-100 text-red-700 border border-red-200',
    PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-700';
};

// Role helpers
export const isAdmin = (user) => user?.role === 'ADMIN';
export const isDoctor = (user) => user?.role === 'DOCTOR';
export const isPatient = (user) => user?.role === 'PATIENT';
export const isEmployee = (user) => user?.role === 'EMPLOYEE';

export const canAccess = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
