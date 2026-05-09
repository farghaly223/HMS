import { useState, useEffect } from 'react';
import { Calendar, Receipt, User, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { getUser } from '../utils/helpers';
import { Card } from '../components/UIComponents';
import { appointmentAPI, patientAPI, billingAPI } from '../services/ApiService';

export default function PatientDashboard() {
  const user = getUser();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    pendingBills: 0,
    totalBills: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, billingRes] = await Promise.all([
        appointmentAPI.getByPatient(user?.userId).catch(() => ({ data: [] })),
        billingAPI.getMyInvoices().catch(() => ({ data: [] })),
      ]);

      const appts = appointmentsRes.data || [];
      const bills = billingRes.data || [];

      setAppointments(appts.slice(0, 3));
      setInvoices(bills.slice(0, 3));

      setStats({
        upcomingAppointments: appts.filter(
          (a) => a.status === 'PENDING' || a.status === 'CONFIRMED'
        ).length,
        completedAppointments: appts.filter((a) => a.status === 'COMPLETED').length,
        pendingBills: bills.filter((b) => b.paymentStatus !== 'PAID').length,
        totalBills: bills.length,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {description && <p className="text-xs text-gray-600 mt-2">{description}</p>}
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
        <h1 className="text-4xl font-bold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.username}! Manage your health and appointments here.</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          label="Upcoming Appointments"
          value={stats.upcomingAppointments}
          color="bg-blue-500"
          description="Scheduled visits"
        />
        <StatCard
          icon={Activity}
          label="Completed Visits"
          value={stats.completedAppointments}
          color="bg-green-500"
          description="Past appointments"
        />
        <StatCard
          icon={Receipt}
          label="Pending Bills"
          value={stats.pendingBills}
          color="bg-orange-500"
          description="Invoices due"
        />
        <StatCard
          icon={User}
          label="Total Invoices"
          value={stats.totalBills}
          color="bg-purple-500"
          description="All invoices"
        />
      </div>

      {/* Upcoming Appointments */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
          <p className="text-sm text-gray-600 mt-1">Your scheduled appointments with healthcare providers</p>
        </div>

        {appointments.filter((a) => a.status !== 'COMPLETED').length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3 p-6">
            {appointments
              .filter((a) => a.status !== 'COMPLETED')
              .map((appt) => (
                <div key={appt.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Appointment #{appt.id}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        📅 {new Date(appt.appDate).toLocaleDateString()} at{' '}
                        {new Date(appt.appDate).toLocaleTimeString()}
                      </p>
                      {appt.reason && (
                        <p className="text-sm text-gray-600 mt-1">Reason: {appt.reason}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        appt.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </Card>

      {/* Recent Bills */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">Your billing history and payment status</p>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No invoices</p>
          </div>
        ) : (
          <div className="space-y-3 p-6">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Invoice #{invoice.id}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Amount: <span className="font-semibold">${invoice.totalAmount}</span> (Tax: $
                      {invoice.tax})
                    </p>
                    <p className="text-sm text-gray-600">Method: {invoice.paymentMethod}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : invoice.paymentStatus === 'PARTIALLY_PAID'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Health Tips */}
      <Card className="p-6 bg-green-50 border-green-200 border-2">
        <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Health Tips
        </h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• Keep your appointment schedule up-to-date for better health management</li>
          <li>• Pay your bills on time to avoid service interruptions</li>
          <li>• Contact your doctor if you have questions about your medical records</li>
          <li>• Review your medical history regularly for accuracy</li>
        </ul>
      </Card>

      {/* Action Required Alert */}
      {stats.pendingBills > 0 && (
        <Card className="p-6 bg-orange-50 border-orange-200 border-2">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900">Payment Due</h3>
              <p className="text-sm text-orange-800 mt-1">
                You have {stats.pendingBills} pending invoice{stats.pendingBills !== 1 ? 's' : ''} requiring
                payment.
              </p>
              <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                View Bills
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
