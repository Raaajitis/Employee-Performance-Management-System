import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, FolderKanban, FileEdit, CalendarCheck, Award, ArrowRight, UserCheck } from 'lucide-react';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchManagerDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboard/summary');
        setData(response.data);
      } catch (err) {
        console.error('Error loading manager dashboard:', err);
        setError('Failed to load team analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchManagerDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Team Workspace</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Supervise allocated staff, operational projects, and reviews.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Team Members Count */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Team Size</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.teamMembersCount || 0}</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Managed Projects */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Managed Projects</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.assignedProjectsCount || 0}</h3>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 p-4 rounded-xl">
            <FolderKanban size={24} />
          </div>
        </div>

        {/* Team Attendance Rate */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Team Presence Today</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {data?.teamAttendanceToday ? `${data.teamAttendanceToday.toFixed(0)}%` : '0%'}
            </h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl">
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* Pending Team Reviews */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Appraisals</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.pendingReviewsCount || 0}</h3>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 p-4 rounded-xl">
            <FileEdit size={24} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Team Roster with evaluation trigger */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Users size={18} className="text-brand-500" />
            My Team Members
          </h3>
          <div className="space-y-4">
            {data?.teamMembers?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{member.name}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{member.designation || 'Specialist'} • {member.department}</p>
                </div>
                <button
                  onClick={() => navigate('/manager/reviews', { state: { employeeId: member.id, employeeName: member.name } })}
                  className="bg-brand-50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Evaluate
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
            {data?.teamMembers?.length === 0 && (
              <div className="text-center py-12 text-slate-450 dark:text-slate-505 italic text-sm">
                No reportees assigned under your profile.
              </div>
            )}
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FolderKanban size={18} className="text-brand-500" />
            Assigned Projects
          </h3>
          <div className="space-y-4">
            {data?.projects?.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-xl">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm leading-snug">{proj.projectName}</h4>
                  <span className="text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-lg border border-brand-100 dark:border-brand-900/30">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{proj.description || 'No description added.'}</p>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400">
                  <span>Start: <b className="text-slate-600 dark:text-slate-300">{proj.startDate || '—'}</b></span>
                  <span>End: <b className="text-slate-600 dark:text-slate-300">{proj.endDate || '—'}</b></span>
                </div>
              </div>
            ))}
            {data?.projects?.length === 0 && (
              <div className="text-center py-12 text-slate-450 dark:text-slate-505 italic text-sm">
                No active projects assigned.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;
