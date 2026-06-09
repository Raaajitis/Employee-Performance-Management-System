import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Award, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      redirectUser(user.role);
    }
  }, [user]);

  const redirectUser = (role) => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'MANAGER') navigate('/manager/dashboard');
    else navigate('/employee/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // AuthContext will trigger useEffect redirect or we redirect directly
      const stored = localStorage.getItem('epms_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        redirectUser(parsed.role);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden px-4">
      {/* Background decoration gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      
      <div className="w-full max-w-md z-10">
        
        {/* Logo/Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-brand-600 text-white p-3.5 rounded-2xl shadow-xl shadow-brand-500/20 mb-4 animate-bounce">
            <Award size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">EPMS Portal</h2>
          <p className="text-slate-400 mt-2 text-sm">Employee Performance Management System</p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="glass bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Sign In</h3>

          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs animate-shake">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-brand-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none focus:outline-none cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6 text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold">Sign up here</Link>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        <div className="glass bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-4 mt-6 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">Quick Access Demo Accounts:</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => { setEmail('admin@epms.com'); setPassword('admin'); }}
              className="bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg border border-white/5 cursor-pointer font-medium"
            >
              Admin
            </button>
            <button 
              onClick={() => { setEmail('manager@epms.com'); setPassword('manager'); }}
              className="bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg border border-white/5 cursor-pointer font-medium"
            >
              Manager
            </button>
            <button 
              onClick={() => { setEmail('employee@epms.com'); setPassword('employee'); }}
              className="bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 rounded-lg border border-white/5 cursor-pointer font-medium"
            >
              Employee
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
