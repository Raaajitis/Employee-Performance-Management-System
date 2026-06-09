import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Phone, Briefcase, Calendar, Award, AlertCircle, Upload } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [managerId, setManagerId] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available managers for employee assignment
    const fetchManagers = async () => {
      try {
        const response = await axios.get('/api/employees/managers');
        setManagers(response.data);
      } catch (err) {
        console.error('Error fetching managers:', err);
      }
    };
    fetchManagers();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Name, email, and password are required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        department,
        designation,
        contactNumber,
        joiningDate,
        profilePicture,
        managerId: managerId ? parseInt(managerId) : null
      };

      await axios.post('/api/auth/signup', payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Error occurred during registration. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-6">
          <div className="inline-flex bg-brand-600 text-white p-3 rounded-xl mb-3">
            <Award size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm">Join Employee Performance Management System</p>
        </div>

        <div className="glass bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-950/30 border border-green-500/30 text-green-200 p-3.5 rounded-xl text-xs">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-800 border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase size={16} />
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="Engineering"
                  />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Designation</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Briefcase size={16} />
                  </div>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="Software Engineer"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="+1 555-0199"
                  />
                </div>
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Joining Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Manager dropdown (only relevant for Employee) */}
              {role === 'EMPLOYEE' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Assign Manager</label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-800 border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option value="">-- Select Manager --</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.department} - {m.designation})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Profile Picture Upload */}
              <div className={role !== 'EMPLOYEE' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                  )}
                  <label className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-colors">
                    <Upload size={16} />
                    Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </label>
                </div>
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
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
