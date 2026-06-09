import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, Award, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setSuccess(response.data.message || 'Reset link sent successfully!');
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Error executing request. Please check connections.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-600 text-white p-3.5 rounded-2xl mb-4">
            <Award size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">EPMS Portal</h2>
          <p className="text-slate-400 mt-2 text-sm">Recover your account password</p>
        </div>

        <div className="glass bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Forgot Password</h3>
          <p className="text-xs text-slate-400 mb-6">Enter your registered email address and we'll send you instructions to reset your password.</p>

          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 bg-green-950/30 border border-green-500/30 text-green-200 p-3.5 rounded-xl text-xs">
              <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Send Instructions'
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 font-semibold">
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
