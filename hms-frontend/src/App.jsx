import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getUser, getToken } from './utils/helpers';
import { USER_ROLES } from './utils/constants';

// Components
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DoctorList from './pages/DoctorList';
import DoctorRegistration from './pages/DoctorRegistration';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';

// Protected route component
function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

// Role-based route component
function RoleRoute({ children, allowedRoles }) {
  const user = getUser();
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Main layout component with navbar and sidebar
function MainLayout({ children }) {
  const user = getUser();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {user && <SideBar />}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Auth layout (for login/register)
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}

function App() {
  const user = getUser();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />

        {/* Admin Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <MainLayout><AdminDashboard /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor-dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                <MainLayout><DoctorDashboard /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Doctor Registration Route */}
        <Route 
          path="/doctor-registration" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                <DoctorRegistration />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Patient Routes */}
        <Route 
          path="/patient-dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.PATIENT]}>
                <MainLayout><PatientDashboard /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Doctors Routes */}
        <Route 
          path="/doctors" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT]}>
                <MainLayout><DoctorList /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Patients Routes */}
        <Route 
          path="/patients" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT]}>
                <MainLayout><PatientList /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/patients/:id" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DOCTOR]}>
                <MainLayout><PatientDetail /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Appointments Routes */}
        <Route 
          path="/appointments" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT]}>
                <MainLayout><Appointments /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Billing Routes */}
        <Route 
          path="/billing" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.PATIENT, USER_ROLES.EMPLOYEE, USER_ROLES.DOCTOR]}>
                <MainLayout><Billing /></MainLayout>
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
