import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Loader2, Search, Filter } from 'lucide-react';
import { appointmentAPI, doctorAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { LoadingSpinner, Modal, Button, FormInput, FormSelect, FormTextarea, Card, EmptyState } from '../components/UIComponents';
import { formatDateTime } from '../utils/helpers';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Appointments() {
  const user = getUser();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [form, setForm] = useState({
    doctorId: '',
    appDate: '',
    reason: '',
    patientId: user?.userId,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, doctorsRes] = await Promise.all([
        getAppointments(),
        doctorAPI.getAll().catch(() => ({ data: [] })),
      ]);

      setAppointments(appointmentsRes.data || []);
      setDoctors((doctorsRes.data || []).filter((d) => d.isApproved));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAppointments = async () => {
    if (user?.role === 'PATIENT') {
      return await appointmentAPI.getByPatient(user.userId);
    } else if (user?.role === 'DOCTOR') {
      return await appointmentAPI.getByDoctor();
    } else {
      return await appointmentAPI.getAll();
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.id.toString().includes(searchTerm) ||
          a.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    setFilteredAppointments(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.doctorId) newErrors.doctorId = 'Doctor is required';
    if (!form.appDate) newErrors.appDate = 'Appointment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await appointmentAPI.book({
        ...form,
        doctorId: parseInt(form.doctorId),
        patientId: user?.userId,
      });
      toast.success('Appointment booked successfully!');
      setShowForm(false);
      setForm({ doctorId: '', appDate: '', reason: '', patientId: user?.userId });
      setErrors({});
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled');
      fetchData();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 text-sm mt-1">Manage your healthcare appointments</p>
        </div>
        {user?.role === 'PATIENT' && (
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
          >
            <Plus className="w-4 h-4" />
            Book Appointment
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      {appointments.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by appointment ID or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </Card>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setForm({ doctorId: '', appDate: '', reason: '', patientId: user?.userId });
          setErrors({});
        }}
        title="Book Appointment"
        size="md"
      >
        <form onSubmit={handleBook} className="space-y-4">
          <FormSelect
            label="Select Doctor"
            options={doctors.map((d) => ({
              value: d.id,
              label: `Dr. ${d.name} - ${d.specialization}`,
            }))}
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            error={errors.doctorId}
            required
          />

          <FormInput
            label="Appointment Date & Time"
            type="datetime-local"
            value={form.appDate}
            onChange={(e) => setForm({ ...form, appDate: e.target.value })}
            error={errors.appDate}
            required
          />

          <FormTextarea
            label="Reason for Visit"
            placeholder="Describe your symptoms or reason for the appointment"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={3}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting ? 'Booking...' : 'Book Appointment'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setForm({ doctorId: '', appDate: '', reason: '', patientId: user?.userId });
                setErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Appointments"
          description={
            searchTerm || filterStatus !== 'all'
              ? 'No appointments match your filters'
              : 'No appointments scheduled yet'
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    {user?.role === 'DOCTOR' ? 'Patient ID' : 'Doctor ID'}
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{appt.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user?.role === 'DOCTOR' ? appt.patientId : appt.doctorId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(appt.appDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appt.reason || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2 flex-wrap">
                        {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && appt.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(appt.id, 'CONFIRMED')}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-xs font-medium"
                          >
                            Confirm
                          </button>
                        )}
                        {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && appt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                            className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 text-xs font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {(user?.role === 'PATIENT' || user?.role === 'ADMIN') &&
                          (appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                            <button
                              onClick={() => handleCancel(appt.id)}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-xs font-medium"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
            Showing {filteredAppointments.length} of {appointments.length} appointment
            {appointments.length !== 1 ? 's' : ''}
          </div>
        </Card>
      )}
    </div>
  );
}
