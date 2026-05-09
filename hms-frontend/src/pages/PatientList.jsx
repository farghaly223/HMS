import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { LoadingSpinner, Modal, Button, FormInput, FormSelect, FormTextarea, Card, EmptyState } from '../components/UIComponents';

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function PatientList() {
  const user = getUser();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const emptyForm = {
    userId: user?.userId,
    name: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      if (user?.role === 'PATIENT') {
        const res = await patientAPI.getMyProfile();
        setPatients(res.data ? [res.data] : []);
      } else {
        const res = await patientAPI.getAll();
        setPatients(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    let filtered = patients;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.phone && p.phone.includes(searchTerm)) ||
          (p.bloodGroup && p.bloodGroup.includes(searchTerm))
      );
    }
    setFilteredPatients(filtered);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editing) {
        await patientAPI.update(editing, form);
        toast.success('Patient profile updated');
      } else {
        await patientAPI.create(form);
        toast.success('Patient profile created');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setErrors({});
      fetchPatients();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (patient) => {
    setForm({
      userId: patient.userId,
      name: patient.name || '',
      phone: patient.phone || '',
      gender: patient.gender || 'MALE',
      dateOfBirth: patient.dateOfBirth || '',
      bloodGroup: patient.bloodGroup || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
    });
    setEditing(patient.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await patientAPI.delete(id);
      toast.success('Patient deleted');
      fetchPatients();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/patients/${id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'PATIENT' ? 'My Profile' : 'Patients'}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {user?.role === 'PATIENT' ? 'Manage your health information' : 'Manage patient records'}
          </p>
        </div>
        {(user?.role === 'PATIENT' || user?.role === 'DOCTOR') && patients.length === 0 && (
          <Button
            onClick={() => {
              setForm(emptyForm);
              setEditing(null);
              setShowForm(true);
            }}
            variant="primary"
          >
            <Plus className="w-4 h-4" />
            {user?.role === 'PATIENT' ? 'Create Profile' : 'Add Patient'}
          </Button>
        )}
      </div>

      {/* Search */}
      {patients.length > 0 && (
        <Card className="p-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </Card>
      )}

      {/* Patient Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
          setForm(emptyForm);
          setErrors({});
        }}
        title={editing ? 'Edit Patient' : 'Create Patient Profile'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Gender"
              options={GENDERS}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              error={errors.gender}
              required
            />
            <FormInput
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Phone"
              placeholder="1234567890"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <FormInput
              label="Blood Group"
              placeholder="O+"
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Address"
            placeholder="123 Main St, City, State"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2}
          />

          <FormInput
            label="Emergency Contact"
            placeholder="Contact phone number"
            value={form.emergencyContact}
            onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
          />

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
              {submitting ? 'Saving...' : (editing ? 'Update Profile' : 'Create Profile')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm(emptyForm);
                setErrors({});
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Patients List */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Found"
          description={
            searchTerm
              ? 'No patients match your search'
              : user?.role === 'PATIENT'
              ? 'Create your patient profile to get started'
              : 'No patients registered yet'
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Gender</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Blood Group</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {patient.bloodGroup || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && (
                          <button
                            onClick={() => handleViewDetails(patient.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details and medical history"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {(user?.role === 'PATIENT' || user?.role === 'ADMIN') && (
                          <button
                            onClick={() => handleEdit(patient)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
            Showing {filteredPatients.length} of {patients.length} patient{patients.length !== 1 ? 's' : ''}
          </div>
        </Card>
      )}
    </div>
  );
}
