import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, AlertCircle, Loader2 } from 'lucide-react';
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
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-12">
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-gradient-to-br from-primary-500 to-secondary-500 p-4 rounded-[24px] shadow-2xl shadow-primary-500/20 mb-6"
            >
              <Heart className="w-10 h-10 text-white" fill="white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-3">
              LifeLink
            </h1>
            <p className="text-slate-400 font-medium text-center">
              Elevating emergency healthcare through <br/> instant medical financing.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-emergency-500/10 border border-emergency-500/20 rounded-2xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-emergency-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-emergency-200 leading-relaxed">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                Hospital Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-white font-medium placeholder:text-slate-600 outline-none"
                placeholder="admin@hospital.org"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                Access Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-white font-medium placeholder:text-slate-600 outline-none"
                placeholder="••••••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0F172A] hover:bg-slate-100 disabled:bg-slate-700 disabled:text-slate-400 font-extrabold py-5 px-6 rounded-[24px] transition-all flex items-center justify-center gap-3 shadow-xl overflow-hidden relative group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="uppercase tracking-widest text-sm">Verifying...</span>
                </>
              ) : (
                <span className="uppercase tracking-widest text-sm font-black">Authorize Access</span>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            New hospital? <Link to="/onboard" className="text-primary-400 hover:text-primary-300 font-bold ml-1 transition-colors">Request Onboarding</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
