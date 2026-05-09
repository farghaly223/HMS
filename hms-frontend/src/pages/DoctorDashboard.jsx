import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, CheckCircle, FileText, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { getUser } from '../utils/helpers';
import { Card, Button } from '../components/UIComponents';
import { doctorAPI, appointmentAPI } from '../services/ApiService';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Try to get doctor profile
      const doctorsRes = await doctorAPI.getAll().catch(() => ({ data: [] }));
      const doctors = doctorsRes.data || [];
      const myProfile = doctors.find(d => d.userId === user?.userId);
      setDoctorProfile(myProfile);

      // Get appointments
      const appointmentsRes = await appointmentAPI.getByDoctor().catch(() => ({ data: [] }));
      const appointments = appointmentsRes.data || [];

      setStats({
        totalPatients: new Set(appointments.map(a => a.patientId)).size,
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter((a) => a.status === 'COMPLETED').length,
        pendingAppointments: appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED').length,
      });

      setRecentAppointments(appointments.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
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

  // If doctor profile doesn't exist, show registration prompt
  if (!doctorProfile) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome Dr. {user?.username}!</p>
        </div>

        {/* Main Alert Card */}
        <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-orange-900 mb-2">
                Complete Your Doctor Profile
              </h2>
              <p className="text-orange-800 mb-4">
                To start accepting appointments and managing patients, you need to complete your doctor profile. 
                This includes your specialization, experience, and consultation fee information.
              </p>
              <p className="text-sm text-orange-700 mb-6">
                After submission, your profile will be reviewed by the hospital admin for approval.
              </p>
              
              <Button
                onClick={() => navigate('/doctor-registration')}
                variant="primary"
                size="lg"
                className="inline-flex gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Doctor Profile Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              What You'll Need
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Your full name</li>
              <li>✓ Medical specialization (Cardiology, Pediatrics, etc.)</li>
              <li>✓ Years of experience</li>
              <li>✓ Contact phone number</li>
              <li>✓ Professional email address</li>
              <li>✓ Consultation fee amount</li>
            </ul>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              What Happens Next
            </h3>
            <ol className="space-y-2 text-sm text-green-800 list-decimal list-inside">
              <li>Submit your profile information</li>
              <li>Admin reviews and verifies details</li>
              <li>Your profile gets approved</li>
              <li>Start accepting patient appointments</li>
              <li>Manage medical records and billing</li>
            </ol>
          </Card>
        </div>

        {/* Features Card */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-4">✨ Features You'll Get After Registration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div>📋 View your patient list</div>
            <div>📅 Manage appointments</div>
            <div>📝 Add medical histories</div>
            <div>💰 Track billing records</div>
            <div>📊 View statistics</div>
            <div>🔔 Get notifications</div>
          </div>
        </Card>
      </div>
    );
  }

  // If doctor profile exists, show normal dashboard
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Dr. {doctorProfile.name}! ({doctorProfile.specialization})</p>
      </div>

      {/* Profile Status Card */}
      {!doctorProfile.isApproved && (
        <Card className="p-6 bg-yellow-50 border-yellow-200 border-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900">Profile Pending Approval</p>
              <p className="text-sm text-yellow-800">Your profile is under review. You'll be notified once approved.</p>
            </div>
          </div>
        </Card>
      )}

      {doctorProfile.isApproved && (
        <Card className="p-6 bg-green-50 border-green-200 border-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">✅ Profile Approved</p>
              <p className="text-sm text-green-800">Your profile is active. You can now accept appointments and manage patients.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
          color="bg-blue-500"
          trend="8"
        />
        <StatCard
          icon={Calendar}
          label="All Appointments"
          value={stats.totalAppointments}
          color="bg-yellow-500"
          trend="12"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completedAppointments}
          color="bg-green-500"
          trend="5"
        />
        <StatCard
          icon={FileText}
          label="Pending"
          value={stats.pendingAppointments}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Appointments */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
          <p className="text-sm text-gray-600 mt-1">Your upcoming and recent patient appointments</p>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No appointments scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Patient</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appt) => (
                  <tr key={appt.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{appt.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Patient {appt.patientId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(appt.appDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{appt.reason || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appt.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700'
                            : appt.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Quick Access */}
      <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left hover:border-green-300">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">View Patients</h3>
            <p className="text-xs text-gray-600">See all your patients and their profiles</p>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left hover:border-green-300">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Add Medical History</h3>
            <p className="text-xs text-gray-600">Document patient medical records and history</p>
          </button>
          <button className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200 text-left hover:border-green-300">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">Manage Appointments</h3>
            <p className="text-xs text-gray-600">Update appointment status and notes</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
