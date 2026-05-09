import { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, Receipt, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { getUser } from '../utils/helpers';
import { Card } from '../components/UIComponents';
import { doctorAPI, patientAPI, appointmentAPI, billingAPI } from '../services/ApiService';

export default function AdminDashboard() {
  const user = getUser();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalInvoices: 0,
    pendingApprovals: 0,
    completedAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [doctorsRes, patientsRes, appointmentsRes, billingRes] = await Promise.all([
        doctorAPI.getAll().catch(() => ({ data: [] })),
        patientAPI.getAll().catch(() => ({ data: [] })),
        appointmentAPI.getAll().catch(() => ({ data: [] })),
        billingAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const doctors = doctorsRes.data || [];
      const patients = patientsRes.data || [];
      const appointments = appointmentsRes.data || [];
      const invoices = billingRes.data || [];

      setStats({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalInvoices: invoices.length,
        pendingApprovals: doctors.filter((d) => !d.isApproved).length,
        completedAppointments: appointments.filter((a) => a.status === 'COMPLETED').length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.username}! Here's your hospital overview.</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Stethoscope}
          label="Total Doctors"
          value={stats.totalDoctors}
          color="bg-green-500"
          trend="12"
        />
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
          color="bg-blue-500"
          trend="8"
        />
        <StatCard
          icon={Calendar}
          label="Total Appointments"
          value={stats.totalAppointments}
          color="bg-yellow-500"
          trend="15"
        />
        <StatCard
          icon={Receipt}
          label="Total Invoices"
          value={stats.totalInvoices}
          color="bg-purple-500"
          trend="5"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Doctor Approvals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-600">Doctors waiting for approval</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedAppointments}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-600">Successfully completed visits</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Approve Doctors</h3>
            <p className="text-xs text-gray-600">Review and approve pending doctor registrations</p>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Manage Users</h3>
            <p className="text-xs text-gray-600">View and manage all system users</p>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">View Reports</h3>
            <p className="text-xs text-gray-600">Generate and download system reports</p>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">System Settings</h3>
            <p className="text-xs text-gray-600">Configure system parameters and rules</p>
          </button>
        </div>
      </Card>

      {/* Alerts */}
      {stats.pendingApprovals > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200 border-2">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900">Action Required</h3>
              <p className="text-sm text-yellow-800 mt-1">
                You have {stats.pendingApprovals} doctor profile{stats.pendingApprovals !== 1 ? 's' : ''} waiting for approval.
              </p>
              <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                Review Approvals
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
