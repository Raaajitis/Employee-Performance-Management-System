import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, UserCheck, AlertCircle } from 'lucide-react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [managerId, setManagerId] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get('/api/employees/managers');
      setManagers(response.data);
    } catch (err) {
      console.error('Error fetching managers:', err);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(`/api/employees/search?query=${e.target.value}`);
      setEmployees(response.data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('EMPLOYEE');
    setDepartment('');
    setDesignation('');
    setContactNumber('');
    setJoiningDate(new Date().toISOString().split('T')[0]);
    setManagerId('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (emp) => {
    setIsEditMode(true);
    setSelectedId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setPassword('••••••••'); // placeholder
    setRole(emp.role);
    setDepartment(emp.department || '');
    setDesignation(emp.designation || '');
    setContactNumber(emp.contactNumber || '');
    setJoiningDate(emp.joiningDate || '');
    setManagerId(emp.managerId || '');
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete their login credentials.')) {
      try {
        await axios.delete(`/api/employees/${id}`);
        fetchEmployees();
        fetchManagers(); // In case a manager was deleted
      } catch (err) {
        console.error('Error deleting employee:', err);
        alert(err.response?.data?.message || 'Failed to delete employee.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitLoading(true);

    try {
      if (isEditMode) {
        // Edit mode
        const payload = {
          id: selectedId,
          name,
          email,
          role,
          department,
          designation,
          contactNumber,
          joiningDate,
          managerId: managerId ? parseInt(managerId) : null
        };
        await axios.put(`/api/employees/${selectedId}`, payload);
      } else {
        // Add mode
        const payload = {
          name,
          email,
          password,
          role,
          department,
          designation,
          contactNumber,
          joiningDate,
          managerId: managerId ? parseInt(managerId) : null
        };
        await axios.post('/api/employees', payload);
      }
      setModalOpen(false);
      fetchEmployees();
      fetchManagers();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Error executing action. Verify data inputs.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Employee Profiles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and audit workforce registration details.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Controls Bar */}
      <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            className="block w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:border-brand-500"
            placeholder="Search by name, department, designation..."
          />
        </div>
      </div>

      {/* Employees Data Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 border-b dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department & Role</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center shrink-0">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{emp.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{emp.designation || 'Not Set'}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{emp.department || 'Not Set'} • <b className="text-brand-600 dark:text-brand-400">{emp.role}</b></p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {emp.managerName ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                          <UserCheck size={12} />
                          {emp.managerName}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">None Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{emp.contactNumber || '—'}</td>
                    <td className="px-6 py-4">{emp.joiningDate || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-500 hover:text-red-600 cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400 dark:text-slate-500 italic">
                      No employees registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Employee Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 border-b dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3 rounded-xl text-xs">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="jane@company.com"
                    required
                  />
                </div>

                {/* Password (only on Add) */}
                {!isEditMode && (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="Engineering"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="Senior Developer"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="+1 555-0150"
                  />
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Assign Manager (relevant if employee is not admin) */}
                {role !== 'ADMIN' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assign Manager</label>
                    <select
                      value={managerId}
                      onChange={(e) => setManagerId(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    >
                      <option value="">-- None --</option>
                      {managers.filter(m => m.id !== selectedId).map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md text-sm font-semibold cursor-pointer flex items-center justify-center min-w-[80px]"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
