import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { patientAPI } from '../services/ApiService';
import { Modal, Button, FormInput, FormTextarea, LoadingSpinner, EmptyState } from './UIComponents';
import { formatDate } from '../utils/helpers';

export default function MedicalHistory({ patientId, isDoctor = false }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    notes: '',
    medications: '',
    tests: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId]);

  const fetchMedicalHistory = async () => {
    setLoading(true);
    try {
      const res = await patientAPI.getMedicalHistory(patientId);
      setHistory(res.data || []);
    } catch (err) {
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!form.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!form.treatment.trim()) newErrors.treatment = 'Treatment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editing) {
        await patientAPI.updateMedicalHistory(patientId, editing, form);
        toast.success('Medical record updated successfully');
      } else {
        await patientAPI.addMedicalHistory(patientId, form);
        toast.success('Medical record added successfully');
      }
      resetForm();
      setShowForm(false);
      fetchMedicalHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving medical record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      visitDate: record.visitDate?.split('T')[0] || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      medications: record.medications || '',
      tests: record.tests || '',
    });
    setEditing(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await patientAPI.deleteMedicalHistory(patientId, id);
      toast.success('Medical record deleted');
      fetchMedicalHistory();
    } catch (err) {
      toast.error('Error deleting medical record');
    }
  };

  const resetForm = () => {
    setForm({
      visitDate: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      notes: '',
      medications: '',
      tests: '',
    });
    setErrors({});
    setEditing(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Medical History</h2>
          <p className="text-gray-600 text-sm mt-1">Patient medical records and visit history</p>
        </div>
        {isDoctor && (
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            variant="primary"
            size="md"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </Button>
        )}
      </div>

      {/* Medical History Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        title={editing ? 'Edit Medical Record' : 'Add Medical Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Visit Date"
            type="date"
            value={form.visitDate}
            onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
            error={errors.visitDate}
            required
          />

          <FormInput
            label="Diagnosis"
            placeholder="Enter diagnosis"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            error={errors.diagnosis}
            required
          />

          <FormInput
            label="Treatment"
            placeholder="Enter treatment details"
            value={form.treatment}
            onChange={(e) => setForm({ ...form, treatment: e.target.value })}
            error={errors.treatment}
            required
          />

          <FormInput
            label="Medications"
            placeholder="Prescribed medications (e.g., Aspirin 500mg daily)"
            value={form.medications}
            onChange={(e) => setForm({ ...form, medications: e.target.value })}
          />

          <FormInput
            label="Tests"
            placeholder="Tests conducted (e.g., Blood Test, X-Ray)"
            value={form.tests}
            onChange={(e) => setForm({ ...form, tests: e.target.value })}
          />

          <FormTextarea
            label="Additional Notes"
            placeholder="Any additional medical notes or observations"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
          />

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : (editing ? 'Update Record' : 'Add Record')}
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

      {/* Medical History List */}
      {history.length === 0 ? (
        <EmptyState
          title="No Medical Records"
          description="No medical history records found for this patient"
        />
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Record Header */}
              <div
                onClick={() =>
                  setExpandedId(expandedId === record.id ? null : record.id)
                }
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {record.diagnosis}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Visit Date: {formatDate(record.visitDate)}
                    </p>
                  </div>
                  {isDoctor && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(record);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record.id);
                        }}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Record Details - Expandable */}
              {expandedId === record.id && (
                <div className="p-4 space-y-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Treatment
                      </p>
                      <p className="text-gray-800">{record.treatment}</p>
                    </div>
                    {record.medications && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Medications
                        </p>
                        <p className="text-gray-800">{record.medications}</p>
                      </div>
                    )}
                  </div>
                  {record.tests && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Tests
                      </p>
                      <p className="text-gray-800">{record.tests}</p>
                    </div>
                  )}
                  {record.notes && (
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Notes
                      </p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded">
                        {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
