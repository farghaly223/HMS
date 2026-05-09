import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../utils/helpers';
import { NAV_LINKS } from '../utils/constants';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Receipt,
  FileText 
} from 'lucide-react';

const iconMap = {
  Dashboard: LayoutDashboard,
  Doctors: Stethoscope,
  Patients: Users,
  'My Profile': Users,
  Appointments: Calendar,
  Billing: Receipt,
};

export default function SideBar() {
  const user = getUser();
  const location = useLocation();
  const links = NAV_LINKS[user?.role] || [];

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 shadow-sm">
      <nav className="p-6 space-y-2">
        {links.map((link) => {
          const Icon = iconMap[link.label] || LayoutDashboard;
          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Info Section */}
      <div className="px-6 py-4 border-t border-gray-200 mt-6">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Quick Info</p>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">User ID</p>
            <p className="text-sm font-semibold text-blue-700">{user?.userId}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Role</p>
            <p className="text-sm font-semibold text-green-700">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
