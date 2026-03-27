import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Heart,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Users,
  Shield,
  Zap,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { CaseDetailSkeleton } from '../components/Skeleton';
import { caseAPI } from '../lib/api-service';
import type { CaseDetails } from '../types/api';
import ProgressBar from '../components/ProgressBar';
import VirtualAccountCard from '../components/VirtualAccountCard';
import BridgeApplicationModal from '../components/BridgeApplicationModal';
import RiskScoreCard from '../components/RiskScoreCard';
import CasePredictionCard from '../components/CasePredictionCard';

function ShareButtons({ caseId, patientName }: { caseId: string; patientName: string }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const caseUrl = `${window.location.origin}/case/${caseId}`;
  const shareText = `Help ${patientName} get urgent medical care. Every contribution saves a life.`;

  const copyLink = () => {
    navigator.clipboard.writeText(caseUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + caseUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(caseUrl)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </button>
      <button
        onClick={shareTwitter}
        className="flex items-center gap-2 bg-[#0F172A] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
      >
        <Share2 className="w-4 h-4" />
        Twitter/X
      </button>
      <button
        onClick={copyLink}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
      >
        {linkCopied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
        {linkCopied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}

function DonorActivity() {
  const recentDonors = [
    { name: 'Anonymous', amount: 50000, time: '2 hours ago' },
    { name: 'Someone', amount: 25000, time: '5 hours ago' },
    { name: 'A kind soul', amount: 100000, time: '1 day ago' },
    { name: 'Anonymous', amount: 15000, time: '2 days ago' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-secondary-50 p-2.5 rounded-xl">
          <Users className="w-5 h-5 text-secondary-600" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold text-gray-900">Recent Supporters</h3>
          <p className="text-sm text-gray-500">Every contribution makes a difference</p>
        </div>
      </div>
      <div className="space-y-3">
        {recentDonors.map((donor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{donor.name}</p>
                <p className="text-xs text-gray-400">{donor.time}</p>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-900">
              ₦{donor.amount.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: 'Verified Hospital',
      description: 'HEFAMA registered & verified',
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: Zap,
      title: 'Instant Transfer',
      description: 'Funds reach hospital directly',
      color: 'text-warning-600',
      bg: 'bg-warning-50',
    },
    {
      icon: Users,
      title: 'Transparent Tracking',
      description: 'Real-time progress updates',
      color: 'text-success-600',
      bg: 'bg-success-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {indicators.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className={`${item.bg} p-2.5 rounded-xl`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [showBridgeModal, setShowBridgeModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const { data: caseData, isLoading, error, refetch } = useQuery<CaseDetails>({
    queryKey: ['case', caseId],
    queryFn: () => caseAPI.getDetails(Number(caseId)),
    refetchInterval: 5000,
    enabled: !!caseId,
  });

  const percentage = caseData?.percentage || 0;
  const raisedAmount = caseData?.raised_amount || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CaseDetailSkeleton />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-emergency-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            Case Not Found
          </h2>
          <p className="text-gray-600">
            Unable to load case details. Please check the case ID and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-medical.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-[#0F172A]/70 to-[#0F172A]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-24">
          {/* Nav Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-heading font-bold text-white">LifeLink</span>
            </div>
            <div className="hidden md:flex">
              <ShareButtons caseId={caseId!} patientName={caseData.patient} />
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-emergency-500/20 backdrop-blur-sm border border-emergency-400/30 text-emergency-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-emergency-400 rounded-full animate-pulse" />
              Emergency Medical Fund
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight mb-4">
              Help {caseData.patient} Get{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-400">
                Life-Saving Care
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-3 leading-relaxed">
              Every second counts in a medical emergency. Your contribution directly
              funds urgent treatment and gives hope to a family in crisis.
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                {caseData.hospital}
              </span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span>Case #{caseId}</span>
            </div>
          </motion.div>

          {/* Mobile Share Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 md:hidden"
          >
            <ShareButtons caseId={caseId!} patientName={caseData.patient} />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 md:-mt-12 relative z-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Progress Section */}
          <ProgressBar
            percentage={percentage}
            raisedAmount={raisedAmount}
            targetAmount={caseData.target_amount}
          />

          {/* Trust Indicators */}
          <TrustIndicators />

          {/* Bridge Unlocked / Target Reached */}
          {percentage >= 60 && percentage < 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">
                    Bridge Credit Unlocked!
                  </h3>
                  <p className="text-primary-50 mb-4">
                    You've reached 60% of the target. Apply for a bridge loan to cover
                    up to 40% of the remaining amount while waiting for donations.
                  </p>
                  {caseData.is_bridge_eligible && (
                    <button
                      onClick={() => setShowBridgeModal(true)}
                      className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all hover:scale-105"
                    >
                      Apply for Bridge Loan
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {percentage >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-2xl p-6 shadow-xl text-center"
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-bold mb-2">Target Reached!</h3>
              <p className="text-success-50">
                The deposit has been fully funded. Thank you for your support!
              </p>
            </motion.div>
          )}

          {/* AI Insights */}
          <div className="space-y-4">
            <RiskScoreCard
              caseId={Number(caseId)}
              targetAmount={caseData.target_amount}
              raisedAmount={raisedAmount}
              percentage={percentage}
            />
            <CasePredictionCard
              caseId={Number(caseId)}
              percentage={percentage}
            />
          </div>

          {/* Two Column: Virtual Account + Donor Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <VirtualAccountCard
                accountNumber={caseData.virtual_account}
                bankName="WEMA BANK"
                accountName={caseData.patient}
              />
            </div>
            <div className="lg:col-span-2">
              <DonorActivity />
            </div>
          </div>

          {/* How It Works - Collapsible */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-50 p-2.5 rounded-xl">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-900">
                  How It Works
                </h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  showHowItWorks ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showHowItWorks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-6 pb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      step: '01',
                      title: 'Transfer to Virtual Account',
                      description:
                        'Family and friends send money directly to the virtual account above using any banking app.',
                      img: '/images/step-transfer.jpg',
                    },
                    {
                      step: '02',
                      title: 'Real-time Progress',
                      description:
                        'Watch the progress bar update automatically as donations come in. Share the link to rally more support.',
                      img: '/images/step-progress.jpg',
                    },
                    {
                      step: '03',
                      title: 'Bridge Loan Option',
                      description:
                        'At 60% funding, apply for an instant bridge loan to cover the gap while donations continue.',
                      img: '/images/step-bridge.jpeg',
                    },
                  ].map((item, index) => (
                    <div key={index} className="group">
                      <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-3 left-3 text-white/80 text-xs font-bold tracking-widest">
                          STEP {item.step}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Urgency Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <div className="absolute inset-0">
              <img
                src="/images/urgency-hospital.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 to-[#0F172A]/70" />
            </div>
            <div className="relative z-10 p-6 md:p-8 flex items-center gap-4">
              <div className="bg-warning-500/20 p-3 rounded-full flex-shrink-0">
                <Clock className="w-6 h-6 text-warning-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-bold text-white mb-1">
                  Time-Sensitive Emergency
                </h3>
                <p className="text-gray-300 text-sm">
                  Medical emergencies require immediate action. Every contribution
                  counts toward saving a life. Share this page to help reach the target faster.
                </p>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 transition-all hover:scale-105"
                >
                  Share Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-primary-500" fill="currentColor" />
              <span className="text-sm font-heading font-bold text-gray-700">LifeLink</span>
            </div>
            <p className="text-xs text-gray-400">
              Powering emergency healthcare financing across Nigeria.
              <br />
              Funds are transferred directly to verified hospital accounts.
            </p>
          </div>
        </motion.div>
      </div>

      {showBridgeModal && (
        <BridgeApplicationModal
          caseId={Number(caseId)}
          accountNumber={caseData.virtual_account}
          onClose={() => setShowBridgeModal(false)}
          onSuccess={() => {
            refetch();
            setShowBridgeModal(false);
          }}
        />
      )}
    </div>
  );
}
