import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Calendar, FolderKanban, Users, User, Clock, X, AlertCircle } from 'lucide-react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Form states
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [priority, setPriority] = useState('MEDIUM');
  const [managerId, setManagerId] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchManagers();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      // Filter out admins from project mapping for simplicity
      const list = response.data.filter(e => e.role === 'EMPLOYEE' || e.role === 'MANAGER');
      setEmployees(list);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedId(null);
    setProjectName('');
    setDescription('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStatus('NOT_STARTED');
    setPriority('MEDIUM');
    setManagerId('');
    setSelectedEmployeeIds([]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setIsEditMode(true);
    setSelectedId(p.id);
    setProjectName(p.projectName);
    setDescription(p.description || '');
    setStartDate(p.startDate || '');
    setEndDate(p.endDate || '');
    setStatus(p.status);
    setPriority(p.priority);
    setManagerId(p.managerId || '');
    setSelectedEmployeeIds(p.employeeIds || []);
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project.');
      }
    }
  };

  const handleEmployeeToggle = (empId) => {
    if (selectedEmployeeIds.includes(empId)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter(id => id !== empId));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, empId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!projectName || !managerId) {
      setError('Project name and manager are required fields.');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload = {
        projectName,
        description,
        startDate: startDate || null,
        endDate: endDate || null,
        status,
        priority,
        managerId: parseInt(managerId),
        employeeIds: selectedEmployeeIds
      };

      if (isEditMode) {
        await axios.put(`/api/projects/${selectedId}`, payload);
      } else {
        await axios.post('/api/projects', payload);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      setError(err.response?.data?.message || 'Error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Badges styling helpers
  const getStatusBadge = (s) => {
    switch (s) {
      case 'COMPLETED':
        return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'IN_PROGRESS':
        return 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30';
      case 'ON_HOLD':
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'HIGH':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20';
      case 'MEDIUM':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
      default:
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Project Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Audit active operations and team allocations.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="space-y-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityBadge(proj.priority)}`}>
                      {proj.priority} Priority
                    </span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug">{proj.projectName}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-medium ${getStatusBadge(proj.status)}`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6">{proj.description || 'No description provided.'}</p>

                <div className="space-y-3.5 border-t dark:border-slate-800 pt-4 mb-6">
                  {/* Manager */}
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <User size={15} className="text-slate-400" />
                    <span>Manager: <b className="text-slate-800 dark:text-slate-200">{proj.managerName || 'None'}</b></span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar size={15} className="text-slate-400" />
                    <span>Duration: <b className="text-slate-800 dark:text-slate-200">{proj.startDate || '—'}</b> to <b className="text-slate-800 dark:text-slate-200">{proj.endDate || '—'}</b></span>
                  </div>

                  {/* Employees assigned count */}
                  <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <Users size={15} className="text-slate-400" />
                    <span>Allocated Staff: <b className="text-slate-800 dark:text-slate-200">{proj.employees?.length || 0} employees</b></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t dark:border-slate-800 pt-4 mt-auto">
                <button
                  onClick={() => openEditModal(proj)}
                  className="px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="px-3.5 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-500 italic">
              No projects created yet. Click "Create Project" to add one.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b dark:border-slate-800 shrink-0">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {isEditMode ? 'Modify Project details' : 'Create Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3 rounded-xl text-xs shrink-0">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Project Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="E.g., Payroll Automation"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500 h-24"
                    placeholder="Enter project targets..."
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {/* Manager */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Project Manager (Required)</label>
                  <select
                    value={managerId}
                    onChange={(e) => setManagerId(e.target.value)}
                    className="block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                    required
                  >
                    <option value="">-- Choose Manager --</option>
                    {managers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Employees Multi-check list */}
                <div className="col-span-2 space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocate Staff</label>
                  <div className="border dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 max-h-48 overflow-y-auto space-y-2">
                    {employees.map((emp) => (
                      <label key={emp.id} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.includes(emp.id)}
                          onChange={() => handleEmployeeToggle(emp.id)}
                          className="w-4.5 h-4.5 text-brand-600 bg-slate-100 border-slate-300 rounded-lg focus:ring-brand-500"
                        />
                        <span>{emp.name} <span className="text-xs text-slate-400">({emp.department} • {emp.designation})</span></span>
                      </label>
                    ))}
                    {employees.length === 0 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">No employees found to allocate.</span>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800 mt-6 shrink-0">
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
                    'Save Project'
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

export default ProjectManagement;
