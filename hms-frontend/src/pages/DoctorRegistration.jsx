import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, AlertCircle } from 'lucide-react';
import { doctorAPI } from '../services/ApiService';
import toast from 'react-hot-toast';
import { getUser } from '../utils/helpers';
import { Button, Card, FormInput, FormTextarea } from '../components/UIComponents';

export default function DoctorRegistration() {
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userId: user?.userId,
    name: '',
    specialization: '',
    phone: '',
    email: '',
    experienceYears: 0,
    consultationFee: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (form.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!form.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }

    if (form.experienceYears < 0) {
      newErrors.experienceYears = 'Experience years cannot be negative';
    }

    if (!form.consultationFee || parseFloat(form.consultationFee) <= 0) {
      newErrors.consultationFee = 'Consultation fee must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await doctorAPI.create({
        userId: user?.userId,
        name: form.name,
        specialization: form.specialization,
        phone: form.phone,
        email: form.email,
        experienceYears: parseInt(form.experienceYears),
        consultationFee: parseFloat(form.consultationFee),
      });

      toast.success('Doctor profile created successfully! Awaiting admin approval.');
      navigate('/doctor-dashboard');
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Profile Registration</h1>
            <p className="text-sm text-gray-600">Create your professional doctor profile</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alert */}
        <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Profile Approval Required</p>
              <p className="text-sm text-blue-800 mt-1">
                Your profile will be reviewed by the hospital admin. You'll receive approval notification once verified.
              </p>
            </div>
          </div>
        </Card>

        {/* Registration Form */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Register as a Doctor</h2>
              <p className="text-gray-600 text-sm">Fill in your professional information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  placeholder="Dr. John Smith"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Phone Number"
                    placeholder="1234567890"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    error={errors.phone}
                    required
                  />

                  <FormInput
                    label="Email Address"
                    placeholder="doctor@hospital.com"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>

              <div className="space-y-4">
                <FormInput
                  label="Specialization"
                  placeholder="e.g., Cardiology, Pediatrics, Orthopedics, etc."
                  value={form.specialization}
                  onChange={handleChange('specialization')}
                  error={errors.specialization}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Years of Experience"
                    type="number"
                    min="0"
                    max="60"
                    value={form.experienceYears}
                    onChange={handleChange('experienceYears')}
                    error={errors.experienceYears}
                  />

                  <FormInput
                    label="Consultation Fee ($)"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.consultationFee}
                    onChange={handleChange('consultationFee')}
                    error={errors.consultationFee}
                    required
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>💡 Tip:</strong> Set a competitive consultation fee based on your experience and specialization. 
                    You can update this later after approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating Profile...' : 'Create Doctor Profile'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">✅ What Happens Next</h3>
            <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
              <li>Your profile will be submitted for admin review</li>
              <li>Admin will verify your credentials</li>
              <li>You'll be notified when approved</li>
              <li>You can then start accepting appointments</li>
            </ol>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Required Fields</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Full Name (at least 3 characters)</li>
              <li>✓ Specialization</li>
              <li>✓ Phone Number (10+ digits)</li>
              <li>✓ Valid Email Address</li>
              <li>✓ Consultation Fee (> $0)</li>
            </ul>
          </Card>
        </div>

        {/* Support Card */}
        <Card className="p-6 bg-amber-50 border-amber-200 mt-6">
          <h3 className="font-semibold text-amber-900 mb-2">📞 Need Help?</h3>
          <p className="text-sm text-amber-800">
            If you have any issues with profile creation or don't receive approval notification within 24 hours,
            please contact the hospital administration.
          </p>
        </Card>
      </div>
    </div>
  );
}
