import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { hospitalAPI } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';

export default function Onboard() {
  const navigate = useNavigate();
  const { setHospitalId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: '',
    hefama: '',
    address: '',
    adminName: '',
    hospitalEmail: '',
    adminPhone: '',
    accountNumber: '',
    bankCode: '',
    accountName: '',
    accountPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.hospitalEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.adminPhone)) {
      setError('Phone must be 10-15 digits (e.g. 2348012345678)');
      return;
    }

    if (formData.accountPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.accountPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await hospitalAPI.onboard({
        hospitalName: formData.hospitalName,
        hefama: formData.hefama,
        address: formData.address,
        adminName: formData.adminName,
        hospitalEmail: formData.hospitalEmail,
        adminPhone: formData.adminPhone,
        settlementAccount: {
          accountNumber: formData.accountNumber,
          bankCode: formData.bankCode,
          accountName: formData.accountName,
        },
        accountPassword: formData.accountPassword,
      });

      setHospitalId(response.hospital_id);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success-50 to-success-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-success-500 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your hospital has been successfully onboarded.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary-500 p-3 rounded-full">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
          </div>

          <h1 className="text-3xl font-heading font-bold text-center text-gray-900 mb-2">
            Hospital Onboarding
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Register your hospital to access the LifeLink platform
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 bg-emergency-50 border border-emergency-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emergency-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HEFAMA Code *
                </label>
                <input
                  type="text"
                  name="hefama"
                  value={formData.hefama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="HEF-XXX-2026-X"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Phone *
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="2348012345678"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Email *
              </label>
              <input
                type="email"
                name="hospitalEmail"
                value={formData.hospitalEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin@hospital.org"
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Settlement Account Details
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Code *
                  </label>
                  <input
                    type="text"
                    name="bankCode"
                    value={formData.bankCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="058"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Security
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="accountPassword"
                    value={formData.accountPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering Hospital...
                </>
              ) : (
                'Register Hospital'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
