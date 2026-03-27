import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Clock,
  TrendingUp,
  Building2,
  CreditCard,
  ChevronRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-heading font-bold text-white">LifeLink</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#impact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Our Impact
            </a>
            <a href="#contact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-white hover:text-primary-300 transition-colors px-4 py-2"
            >
              Hospital Login
            </Link>
            <Link
              to="/onboard"
              className="text-sm font-semibold bg-white text-[#0F172A] px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-all hover:scale-105"
            >
              Register Hospital
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-4"
          >
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#impact" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                Our Impact
              </a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <hr className="border-white/10" />
              <Link to="/login" className="text-white font-semibold">Hospital Login</Link>
              <Link
                to="/onboard"
                className="text-center font-semibold bg-white text-[#0F172A] px-5 py-2.5 rounded-xl"
              >
                Register Hospital
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-medical.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/75 to-[#0F172A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/15 backdrop-blur-sm border border-primary-400/20 text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Heart className="w-3.5 h-3.5" fill="currentColor" />
              Emergency Healthcare Financing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-black text-white leading-[1.1] mb-6">
              When Every{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                Second
              </span>{' '}
              Counts, We Bridge the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                Gap
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl">
              LifeLink connects hospitals, patients, and donors in real-time to fund
              emergency medical care. No more delays. No more lives lost to financing gaps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/onboard"
                className="group inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/25"
              >
                Register Your Hospital
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg border border-white/10 transition-all"
              >
                See How It Works
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5">
                <p className="text-sm text-gray-300">
                  <span className="text-white font-semibold">Now onboarding hospitals</span> across Nigeria
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-primary-500/10 rounded-3xl blur-3xl" />

              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { value: '<24h', label: 'Avg Response Time', icon: Clock, color: 'from-primary-500 to-primary-600' },
                  { value: '60%', label: 'Bridge Threshold', icon: TrendingUp, color: 'from-success-500 to-success-600' },
                  { value: '24/7', label: 'AI Chat Support', icon: Zap, color: 'from-secondary-500 to-secondary-600' },
                  { value: '₦0', label: 'Platform Fees', icon: Shield, color: 'from-warning-500 to-warning-600' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                  >
                    <div className={`bg-gradient-to-br ${stat.color} p-2.5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-heading font-black text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/40 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Hospital Registers a Case',
      description:
        'When a patient arrives needing emergency care, the hospital creates a case on LifeLink with the deposit target amount.',
      img: '/images/step-transfer.jpg',
      icon: Building2,
    },
    {
      number: '02',
      title: 'Community Rallies Support',
      description:
        'A unique virtual account is generated. Family and friends receive the link and contribute directly — every naira is tracked in real-time.',
      img: '/images/step-progress.jpg',
      icon: Users,
    },
    {
      number: '03',
      title: 'Bridge the Gap Instantly',
      description:
        'At 60% funding, LifeLink offers an instant bridge loan to cover the remaining amount, so treatment never has to wait.',
      img: '/images/step-bridge.jpeg',
      icon: Zap,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-4">
            How LifeLink Works
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            From emergency admission to fully funded — in three simple steps.
          </p>
        </motion.div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              {...stagger}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:direction-rtl' : ''
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative group">
                  <div className="absolute -inset-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-72 sm:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-bold tracking-widest text-primary-600">
                        STEP {step.number}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-primary-50 p-3 rounded-xl w-fit mb-5">
                  <step.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-500 leading-relaxed mb-6">
                  {step.description}
                </p>
                <div className="flex items-center gap-2 text-primary-600 font-semibold">
                  <span>Learn more</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: CreditCard,
      title: 'Virtual Account Generation',
      description: 'Unique Wema Bank accounts created instantly for each case. Direct transfers, zero middlemen.',
      color: 'bg-primary-50 text-primary-600',
    },
    {
      icon: TrendingUp,
      title: 'Bridge Loan Facility',
      description: 'At 60% funding, hospitals can access bridge loans to begin treatment immediately while funds keep coming.',
      color: 'bg-success-50 text-success-600',
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Live progress updates for hospitals, patients, and donors. Every naira accounted for transparently.',
      color: 'bg-warning-50 text-warning-600',
    },
    {
      icon: Shield,
      title: 'Verified Hospitals Only',
      description: 'HEFAMA-registered hospitals with verified settlement accounts. Your donations are safe and accounted for.',
      color: 'bg-secondary-50 text-secondary-600',
    },
    {
      icon: Users,
      title: 'AI-Powered Assistance',
      description: 'Multilingual AI chatbot supports Yoruba, Hausa, Igbo, Pidgin and English — helping every family navigate the process.',
      color: 'bg-emergency-50 text-emergency-600',
    },
    {
      icon: Zap,
      title: 'Instant Disbursement',
      description: 'Once funded, payments are disbursed directly to the hospital settlement account with full audit trail.',
      color: 'bg-primary-50 text-primary-600',
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Shield className="w-3.5 h-3.5" />
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-gray-900 mb-4">
            Built for Speed, Trust & Transparency
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Every feature is designed to remove barriers between patients and the care they need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              {...stagger}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 group"
            >
              <div className={`${feature.color.split(' ')[0]} p-3 rounded-xl w-fit mb-5 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color.split(' ')[1]}`} />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section id="impact" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/urgency-hospital.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0F172A]/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-white/10">
            <TrendingUp className="w-3.5 h-3.5" />
            Our Impact
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4">
            Real Numbers, Real Lives
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Behind every statistic is a family who got the help they needed when it mattered most.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { value: '<24h', label: 'Avg Response Time', sublabel: 'from case to funding' },
            { value: '₦0', label: 'Platform Fees', sublabel: 'zero cost to patients' },
            { value: '60%', label: 'Bridge Unlock', sublabel: 'instant loan access' },
            { value: '7+', label: 'Languages Supported', sublabel: 'including Yoruba & Hausa' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              {...stagger}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
            >
              <p className="text-3xl sm:text-4xl font-heading font-black text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-300">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          {...fadeUp}
          className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 text-center"
        >
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-warning-400" fill="currentColor" />
            ))}
          </div>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6 italic">
            "LifeLink saved my mother's life. Within hours of sharing the link, family and
            friends raised enough for her surgery. The bridge loan covered the rest while
            we waited. I don't know what we would have done without this platform."
          </p>
          <div>
            <p className="font-heading font-bold text-white">Adebayo Ogunleye</p>
            <p className="text-sm text-gray-400">Patient's family member, Lagos</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Hospitals */}
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-3xl p-8 md:p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
            <div className="relative z-10">
              <div className="bg-primary-500/20 p-3 rounded-xl w-fit mb-6">
                <Building2 className="w-7 h-7 text-primary-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                For Hospitals
              </h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                Register your hospital to start creating emergency funding cases.
                Get HEFAMA verified and give your patients access to instant healthcare financing.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Instant virtual account generation',
                  'Real-time payment tracking',
                  'Bridge loan facility at 60% funding',
                  'Dedicated hospital dashboard',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="bg-primary-500/20 p-1 rounded-full">
                      <ChevronRight className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/onboard"
                className="group inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* For Donors */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 md:p-12"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32 blur-3xl" />
            <div className="relative z-10">
              <div className="bg-white/20 p-3 rounded-xl w-fit mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                For Donors & Families
              </h3>
              <p className="text-primary-100 leading-relaxed mb-8">
                Received a LifeLink fundraising link? Your contribution goes directly to the
                hospital through a verified virtual account. Every naira is tracked transparently.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Transfer directly via any bank app',
                  'Real-time progress tracking',
                  'Share on WhatsApp & social media',
                  '100% transparent fund allocation',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary-50">
                    <div className="bg-white/20 p-1 rounded-full">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5">
                <p className="text-sm text-primary-100 mb-3">Have a case link? Enter the case ID:</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('caseId') as HTMLInputElement;
                    if (input.value.trim()) {
                      window.location.href = `/case/${input.value.trim()}`;
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="caseId"
                    type="text"
                    placeholder="e.g. 1042"
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="bg-white text-primary-600 font-bold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all hover:scale-105"
                  >
                    Go
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[#0F172A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-primary-500 p-2 rounded-xl">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-heading font-bold">LifeLink</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Bridging the gap between medical emergencies and the funds needed to save lives
              across Nigeria.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors">
                <Mail className="w-4 h-4 text-gray-300" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors">
                <Phone className="w-4 h-4 text-gray-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['How It Works', 'Features', 'Our Impact', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Hospitals */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">For Hospitals</h4>
            <ul className="space-y-3">
              <li><Link to="/onboard" className="text-sm text-gray-400 hover:text-white transition-colors">Register Hospital</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Hospital Login</Link></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard Guide</a></li>
              <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Bridge Loan Info</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                support@lifelink.ng
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                +234 800 LIFELINK
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LifeLink. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ImpactSection />
      <CTASection />
      <Footer />
    </div>
  );
}
