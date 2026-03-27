import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, CreditCard } from 'lucide-react';

interface VirtualAccountCardProps {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export default function VirtualAccountCard({
  accountNumber,
  bankName,
  accountName,
}: VirtualAccountCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-2xl p-6 md:p-8 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-100 text-sm">Virtual Account</p>
              <p className="font-semibold">{bankName}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Copied!
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mb-6">
          <p className="text-primary-100 text-sm mb-2">Account Name</p>
          <p className="text-xl md:text-2xl font-heading font-bold tracking-wide">
            {accountName}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-primary-100 text-sm mb-2">Account Number</p>
          <button
            onClick={() => copyToClipboard(accountNumber)}
            className="w-full group"
          >
            <div className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl p-4 transition-all flex items-center justify-between">
              <span className="text-3xl md:text-4xl font-heading font-bold tracking-wider">
                {accountNumber}
              </span>
              <div className="bg-white bg-opacity-20 group-hover:bg-opacity-30 p-3 rounded-lg transition-all">
                <Copy className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <p className="text-sm text-primary-100 mb-2">
            How to send money:
          </p>
          <ol className="text-sm space-y-1">
            <li>1. Open your mobile banking app</li>
            <li>2. Select "Transfer to Other Banks"</li>
            <li>3. Use the account details above</li>
            <li>4. Enter your donation amount</li>
            <li>5. Complete the transfer</li>
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-primary-100 text-sm"
        >
          Tap account number to copy
        </motion.div>
      </div>
    </motion.div>
  );
}
