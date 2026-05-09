import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, Droplet, MapPin, AlertCircle } from 'lucide-react';
import { patientAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { LoadingSpinner, Card, Button } from '../components/UIComponents';
import MedicalHistory from '../components/MedicalHistory';
import { formatDate } from '../utils/helpers';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const res = await patientAPI.getById(id);
      setPatient(res.data);
    } catch (err) {
      toast.error('Error loading patient details');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600">Patient not found</p>
        <Button onClick={() => navigate('/patients')} className="mt-4">
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/patients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-600 text-sm mt-1">Patient ID: {patient.id}</p>
        </div>
      </div>

      {/* Patient Information Card */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Gender & DOB */}
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Basic Details</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Gender</span>
                  <span className="text-gray-900 font-semibold">{patient.gender || '-'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Date of Birth</span>
                  <span className="text-gray-900 font-semibold">
                    {patient.dateOfBirth ? formatDate(patient.dateOfBirth) : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2 mt-4">Health Information</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Droplet className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <span className="text-gray-700 font-medium block text-sm">Blood Group</span>
                    <span className="text-red-700 font-bold text-lg">{patient.bloodGroup || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Contact Information */}
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Contact Information</p>
              <div className="space-y-3">
                {patient.phone && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-gray-700 font-medium text-sm block">Phone</span>
                      <span className="text-blue-700 font-semibold">{patient.phone}</span>
                    </div>
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="text-gray-700 font-medium text-sm block">Emergency Contact</span>
                      <span className="text-orange-700 font-semibold">{patient.emergencyContact}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {patient.address && (
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2 mt-4">Address</p>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-900">{patient.address}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Medical History Section - Only visible to doctors and admins */}
      {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && (
        <MedicalHistory
          patientId={id}
          isDoctor={user?.role === 'DOCTOR' || user?.role === 'ADMIN'}
        />
      )}

      {/* Notes */}
      <Card className="p-6 bg-blue-50 border-blue-200 border-2">
        <h3 className="font-semibold text-blue-900 mb-3">📋 Patient Record Notes</h3>
        <p className="text-sm text-blue-800">
          This patient profile contains important health information. Only authorized healthcare professionals
          should access this information. Always ensure patient privacy and confidentiality.
        </p>
      </Card>
    </div>
  );
}
