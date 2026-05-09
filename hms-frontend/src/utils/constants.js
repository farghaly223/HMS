// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  EMPLOYEE: 'EMPLOYEE',
};

// Appointment statuses
export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  INSURANCE: 'INSURANCE',
};

// Gender
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

// Role colors
export const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-700 border border-red-200',
  DOCTOR: 'bg-green-100 text-green-700 border border-green-200',
  PATIENT: 'bg-blue-100 text-blue-700 border border-blue-200',
  EMPLOYEE: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
};

// Status badge colors
export const STATUS_BADGE_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  APPROVED: 'bg-green-100 text-green-700',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  UNPAID: 'bg-red-100 text-red-700',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-700',
};

// Navigation links per role
export const NAV_LINKS = {
  ADMIN: [
    { to: '/', label: 'Dashboard' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/billing', label: 'Billing' },
  ],
  DOCTOR: [
    { to: '/', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/billing', label: 'Billing' },
  ],
  PATIENT: [
    { to: '/', label: 'Dashboard' },
    { to: '/patients', label: 'My Profile' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/billing', label: 'Billing' },
  ],
  EMPLOYEE: [
    { to: '/', label: 'Dashboard' },
    { to: '/billing', label: 'Billing' },
  ],
};
