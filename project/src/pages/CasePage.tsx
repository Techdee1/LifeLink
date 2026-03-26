import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { CaseDetailSkeleton } from '../components/Skeleton';
import { caseAPI } from '../lib/api-service';
import type { CaseDetails } from '../types/api';
import ProgressBar from '../components/ProgressBar';
import VirtualAccountCard from '../components/VirtualAccountCard';
import BridgeApplicationModal from '../components/BridgeApplicationModal';

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const [showBridgeModal, setShowBridgeModal] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <CaseDetailSkeleton />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emergency-50 to-emergency-100 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emergency-500 p-4 rounded-full">
                <Heart className="w-10 h-10 text-white" fill="white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              Emergency Medical Fund
            </h1>
            <p className="text-lg text-gray-600">
              Help {caseData.patient} get the urgent medical care they need
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {caseData.hospital}
            </p>
          </div>

          <ProgressBar
            percentage={percentage}
            raisedAmount={raisedAmount}
            targetAmount={caseData.target_amount}
          />

          {percentage >= 60 && percentage < 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-full flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">
                    Bridge Credit Unlocked!
                  </h3>
                  <p className="text-primary-50 mb-4">
                    You've reached 60% of the target. You can now apply for a bridge
                    loan to cover up to 40% of the remaining amount while waiting for
                    donations.
                  </p>
                  {caseData.is_bridge_eligible && (
                    <button
                      onClick={() => setShowBridgeModal(true)}
                      className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-primary-50 transition-all"
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
              <h3 className="text-2xl font-heading font-bold mb-2">
                Target Reached!
              </h3>
              <p className="text-success-50">
                The deposit has been fully funded. Thank you for your support!
              </p>
            </motion.div>
          )}

          <VirtualAccountCard
            accountNumber={caseData.virtual_account}
            bankName={caseData.hospital ? "WEMA BANK" : "WEMA BANK"}
            accountName={caseData.patient}
          />

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Transfer to Virtual Account
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Family and friends can send money directly to the virtual account
                    above
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Real-time Progress Tracking
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Watch the progress bar update automatically as donations come in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-2 rounded-full flex-shrink-0">
                  <span className="text-primary-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Bridge Loan Option
                  </h4>
                  <p className="text-gray-600 text-sm">
                    At 60%, apply for an instant bridge loan to cover the gap while
                    donations continue
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warning-800">
                <strong>Time-sensitive:</strong> Medical emergencies require immediate
                action. Every contribution counts toward saving a life.
              </p>
            </div>
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
