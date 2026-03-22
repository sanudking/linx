import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import Button from '../common/Button';

const EduVerification = ({ email, onVerified }) => {
  const [state, setState] = useState('idle'); // idle | sent | error
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.sendVerification();
      setState('sent');
    } catch (err) {
      setError(err.message || 'Failed to send verification email');
      setState('error');
    } finally {
      setLoading(false);
    }
  };

  if (state === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Check your inbox</h3>
        <p className="text-sm text-gray-400 mb-6">
          We sent a verification link to <span className="text-primary-400">{email}</span>.
          Please click the link to verify your academic email.
        </p>
        <button
          onClick={handleSend}
          className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1.5 mx-auto transition-colors"
        >
          <RefreshCw size={13} />
          Resend email
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <Mail size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-300">Verify your academic email</p>
          <p className="text-xs text-amber-400/70 mt-0.5">
            Verify <strong>{email}</strong> to unlock all features.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <Button onClick={handleSend} loading={loading} className="w-full">
        Send Verification Email
      </Button>
    </div>
  );
};

export default EduVerification;
