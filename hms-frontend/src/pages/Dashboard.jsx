import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/helpers';
import { USER_ROLES } from '../utils/constants';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    // Redirect to role-specific dashboard
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case USER_ROLES.ADMIN:
        navigate('/admin-dashboard');
        break;
      case USER_ROLES.DOCTOR:
        navigate('/doctor-dashboard');
        break;
      case USER_ROLES.PATIENT:
        navigate('/patient-dashboard');
        break;
      case USER_ROLES.EMPLOYEE:
        navigate('/billing');
        break;
      default:
        navigate('/login');
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything, just redirects
}
