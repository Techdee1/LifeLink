import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { hospitalAPI } from '../lib/api-service';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { label: 'Hospital Details', icon: Building2 },
  { label: 'Admin & Contact', icon: User },
  { label: 'Settlement Account', icon: CreditCard },
  { label: 'Security', icon: Lock },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-success-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold mt-2 text-center hidden sm:block ${
                  isCurrent ? 'text-primary-600' : isCompleted ? 'text-success-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-3">
                <div
                  className={`h-0.5 rounded-full transition-all ${
                    isCompleted ? 'bg-success-400' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Onboard() {
  const navigate = useNavigate();
  const { setHospitalId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(0);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!formData.hospitalName || !formData.hefama || !formData.address) {
          setError('Please fill in all hospital details');
          return false;
        }
        return true;
      case 1: {
        if (!formData.adminName || !formData.hospitalEmail || !formData.adminPhone) {
          setError('Please fill in all contact details');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.hospitalEmail)) {
          setError('Please enter a valid email address');
          return false;
        }
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.adminPhone)) {
          setError('Phone must be 10-15 digits (e.g. 2348012345678)');
          return false;
        }
        return true;
      }
      case 2:
        if (!formData.accountNumber || !formData.bankCode || !formData.accountName) {
          setError('Please fill in all account details');
          return false;
        }
        return true;
      case 3:
        if (formData.accountPassword.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.accountPassword !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setError('');
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

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
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md border border-gray-100"
        >
          <div className="bg-success-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-500" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-500 mb-6">
            Your hospital has been registered on LifeLink. You can now sign in to your dashboard.
          </p>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-sm text-gray-400">Redirecting to login...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-gray-900 placeholder:text-gray-400 outline-none';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-500 p-1.5 rounded-lg">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-base font-heading font-bold text-gray-900">LifeLink</span>
          </Link>
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 transition-colors"
          >
            Already registered?
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 mb-2">
              Register Your Hospital
            </h1>
            <p className="text-gray-500">
              Complete the steps below to join the LifeLink platform
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator currentStep={step} />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="bg-emergency-50 border border-emergency-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-emergency-700">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 0: Hospital Details */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-50 p-2.5 rounded-xl">
                          <Building2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-bold text-gray-900">Hospital Details</h2>
                          <p className="text-sm text-gray-400">Basic information about your facility</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital Name</label>
                        <input name="hospitalName" value={formData.hospitalName} onChange={handleChange} className={inputClass} placeholder="e.g. Lagos General Hospital" required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">HEFAMA Code</label>
                          <input name="hefama" value={formData.hefama} onChange={handleChange} className={inputClass} placeholder="HEF-XXX-2026-X" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                          <input name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="Hospital address" required />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1: Admin & Contact */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-50 p-2.5 rounded-xl">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-bold text-gray-900">Admin & Contact</h2>
                          <p className="text-sm text-gray-400">Who manages this hospital account?</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Full Name</label>
                        <input name="adminName" value={formData.adminName} onChange={handleChange} className={inputClass} placeholder="e.g. Dr. Aisha Okafor" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital Email</label>
                        <input type="email" name="hospitalEmail" value={formData.hospitalEmail} onChange={handleChange} className={inputClass} placeholder="admin@hospital.org" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                        <input type="tel" name="adminPhone" value={formData.adminPhone} onChange={handleChange} className={inputClass} placeholder="2348012345678" required />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Settlement Account */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-50 p-2.5 rounded-xl">
                          <CreditCard className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-bold text-gray-900">Settlement Account</h2>
                          <p className="text-sm text-gray-400">Where funded deposits will be settled</p>
                        </div>
                      </div>

                      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-2">
                        <p className="text-sm text-primary-700">
                          Funds raised through LifeLink will be settled into this account. Please ensure the details are correct.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-5">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                          <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={inputClass} placeholder="0123456789" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Code</label>
                          <input name="bankCode" value={formData.bankCode} onChange={handleChange} className={inputClass} placeholder="058" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Name</label>
                        <input name="accountName" value={formData.accountName} onChange={handleChange} className={inputClass} placeholder="Hospital settlement account name" required />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Security */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary-50 p-2.5 rounded-xl">
                          <Lock className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-heading font-bold text-gray-900">Account Security</h2>
                          <p className="text-sm text-gray-400">Create a secure password for your dashboard</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <input type="password" name="accountPassword" value={formData.accountPassword} onChange={handleChange} className={inputClass} placeholder="Minimum 8 characters" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="Re-enter your password" required />
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mt-2">
                        <p className="text-xs text-gray-500 leading-relaxed">
                          By registering, you confirm that this is a HEFAMA-verified hospital and that
                          all details provided are accurate. LifeLink will verify your information before
                          activating your account.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white disabled:text-gray-500 font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-primary-500/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Hospital
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Step counter text */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Step {step + 1} of {STEPS.length}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
