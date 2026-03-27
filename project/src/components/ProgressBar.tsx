import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  raisedAmount: number;
  targetAmount: number;
}

export default function ProgressBar({
  percentage,
  raisedAmount,
  targetAmount,
}: ProgressBarProps) {
  const getProgressColor = () => {
    if (percentage >= 100) return 'from-success-500 to-success-600';
    if (percentage >= 60) return 'from-primary-500 to-primary-600';
    return 'from-warning-500 to-warning-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Amount Raised</p>
          <p className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
            ₦{raisedAmount.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Target</p>
          <p className="text-xl md:text-2xl font-heading font-bold text-gray-600">
            ₦{targetAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
          </motion.div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary-700"
            style={{ left: '60%' }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-primary-700 text-white text-xs font-bold px-2 py-1 rounded">
                Bridge Unlock
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-primary-700 border-l-transparent border-r-transparent mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                percentage >= 100
                  ? 'bg-success-500'
                  : percentage >= 60
                  ? 'bg-primary-500'
                  : 'bg-warning-500'
              }`}
            />
            <span className="text-sm font-semibold text-gray-700">
              {percentage >= 100
                ? 'Fully Funded'
                : percentage >= 60
                ? 'Bridge Eligible'
                : 'In Progress'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="text-right"
          >
            <p className="text-3xl font-heading font-bold text-gray-900">
              {percentage}%
            </p>
            <p className="text-xs text-gray-600">Complete</p>
          </motion.div>
        </div>
      </div>

      {percentage >= 60 && percentage < 100 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Remaining Amount:</span>
            <span className="font-bold text-gray-900">
              ₦{(targetAmount - raisedAmount).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Available Bridge Credit (40%):</span>
            <span className="font-bold text-primary-600">
              ₦{Math.round(targetAmount * 0.4).toLocaleString()}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
