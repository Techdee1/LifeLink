import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Loader2, Shield, Clock, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        hospitalEmail: email,
        accountPassword: password,
      });
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand Story */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-medical.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#0F172A]/80 to-primary-900/70" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top — Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-lg font-heading font-bold text-white">LifeLink</span>
          </Link>

          {/* Center — Story */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl xl:text-4xl font-heading font-black text-white leading-tight mb-6">
                Powering emergency healthcare financing across Nigeria
              </h2>
              <p className="text-gray-300 leading-relaxed mb-10">
                Your hospital dashboard gives you real-time control over emergency
                cases, bridge loans, and patient funding — all in one place.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'Instant virtual account generation for every case' },
                  { icon: Shield, text: 'Bridge loans unlocked at 60% funding threshold' },
                  { icon: Clock, text: 'Real-time donation tracking and disbursement' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white/10 p-2 rounded-lg flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary-300" />
                    </div>
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom — Footer */}
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} LifeLink. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 relative">
        {/* Mobile back to home */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="bg-primary-500 p-2 rounded-xl">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-lg font-heading font-bold text-gray-900">LifeLink</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to your hospital dashboard
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-emergency-50 border border-emergency-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emergency-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hospital Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-gray-900 placeholder:text-gray-400 outline-none"
                placeholder="admin@hospital.org"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all text-gray-900 placeholder:text-gray-400 outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-[#1e293b] disabled:bg-gray-300 text-white disabled:text-gray-500 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-gray-900/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Signing in...</span>
                </>
              ) : (
                <span className="text-sm">Sign In</span>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New hospital?{' '}
              <Link to="/onboard" className="text-primary-600 hover:text-primary-500 font-semibold transition-colors">
                Register here
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                HEFAMA Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                24/7 Access
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
