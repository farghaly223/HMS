import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Trash2, CheckCircle, Loader2, X, Search, Filter } from 'lucide-react';
import { doctorAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { LoadingSpinner, Modal, Button, FormInput, Card, EmptyState } from '../components/UIComponents';
import { STATUS_BADGE_COLORS } from '../utils/constants';

export default function DoctorList() {
  const user = getUser();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState('all');

  const [form, setForm] = useState({
    userId: user?.userId,
    name: '',
    specialization: '',
    phone: '',
    email: '',
    experienceYears: 0,
    consultationFee: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, filterApproved]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorAPI.getAll();
      setDoctors(res.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.phone && d.phone.includes(searchTerm))
      );
    }

    // Approval filter
    if (filterApproved === 'approved') {
      filtered = filtered.filter((d) => d.isApproved);
    } else if (filterApproved === 'pending') {
      filtered = filtered.filter((d) => !d.isApproved);
    }

    setFilteredDoctors(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (form.consultationFee <= 0) newErrors.consultationFee = 'Consultation fee must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await doctorAPI.create(form);
      toast.success('Doctor profile created! Awaiting admin approval.');
      resetForm();
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await doctorAPI.approve(id);
      toast.success('Doctor approved!');
      fetchDoctors();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      toast.success('Doctor deleted');
      fetchDoctors();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const resetForm = () => {
    setForm({
      userId: user?.userId,
      name: '',
      specialization: '',
      phone: '',
      email: '',
      experienceYears: 0,
      consultationFee: 0,
    });
    setErrors({});
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 text-sm mt-1">Manage healthcare professionals</p>
        </div>
        {user?.role === 'DOCTOR' && (
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialization, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Doctors</option>
            <option value="approved">Approved Only</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </Card>

      {/* Doctor Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title="Create Doctor Profile"
        size="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="Dr. John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          <FormInput
            label="Specialization"
            placeholder="Cardiology"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            error={errors.specialization}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Phone"
              placeholder="1234567890"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <FormInput
              label="Email"
              placeholder="doctor@example.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Experience (years)"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value) })}
            />
            <FormInput
              label="Consultation Fee"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.consultationFee}
              onChange={(e) => setForm({ ...form, consultationFee: parseFloat(e.target.value) })}
              error={errors.consultationFee}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting ? 'Creating...' : 'Create Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No Doctors Found"
          description={
            searchTerm || filterApproved !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No doctors registered yet'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doctor.isApproved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {doctor.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Consultation Fee</p>
                  <p className="text-lg font-bold text-gray-900">${doctor.consultationFee}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Experience</p>
                  <p className="text-sm text-gray-800">{doctor.experienceYears} years</p>
                </div>
                {doctor.phone && (
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Phone</p>
                    <p className="text-sm text-gray-800">{doctor.phone}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {user?.role === 'ADMIN' && (
                <div className="mt-4 flex gap-2">
                  {!doctor.isApproved && (
                    <Button
                      onClick={() => handleApprove(doctor.id)}
                      variant="success"
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(doctor.id)}
                    variant="danger"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-sm text-gray-600">
        Showing {filteredDoctors.length} of {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
