import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FolderKanban, CalendarCheck, Award, Clock, Star, MessageSquare } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboard/summary');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching employee dashboard:', err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDashboard();
  }, []);

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'CHECKED_IN': return 'Checked In';
      case 'CHECKED_OUT': return 'Checked Out';
      default: return 'Not Marked';
    }
  };

  const getAttendanceStatusBadge = (status) => {
    switch (status) {
      case 'CHECKED_IN': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400';
      case 'CHECKED_OUT': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
    }
  };

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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Workspace</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor your daily check-in states, assigned operations, and performance scores.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Assigned Projects */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Projects</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.assignedProjectsCount || 0}</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
            <FolderKanban size={24} />
          </div>
        </div>

        {/* Attendance Status */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <div className="mt-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getAttendanceStatusBadge(data?.attendanceStatus)}`}>
                {getAttendanceStatusText(data?.attendanceStatus)}
              </span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 p-4 rounded-xl">
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* Performance Score */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance Score</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {data?.performanceScore ? data.performanceScore.toFixed(1) : '—'} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl">
            <Award size={24} />
          </div>
        </div>

        {/* Upcoming Appraisals */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Cycles</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.upcomingReviews || 0}</h3>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 p-4 rounded-xl">
            <Clock size={24} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects list */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <FolderKanban size={18} className="text-brand-500" />
            My Operations & Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.projects?.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight truncate">{proj.projectName}</h4>
                    <span className="text-[9px] font-bold bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-lg border border-brand-100 dark:border-brand-900/20">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-3 mt-1.5">{proj.description || 'No description added.'}</p>
                </div>
                <div className="border-t dark:border-slate-800 pt-3 mt-4 text-[10px] text-slate-450">
                  Manager: <span className="font-semibold text-slate-700 dark:text-slate-300">{proj.managerName || 'None'}</span>
                </div>
              </div>
            ))}
            {data?.projects?.length === 0 && (
              <div className="col-span-2 text-center py-12 text-slate-450 dark:text-slate-505 italic text-sm">
                You are not currently assigned to any projects.
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews Summary */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Award size={18} className="text-brand-500" />
            Recent Appraisals
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px]">
            {data?.recentReviews?.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 truncate">By: {rev.reviewerName}</span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg">
                    <Star size={12} fill="currentColor" />
                    {rev.score.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-slate-605 dark:text-slate-400 italic line-clamp-2">"{rev.comments || 'No comments added.'}"</p>
                <div className="text-[9px] text-slate-400 pt-1 text-right">
                  {rev.reviewDate}
                </div>
              </div>
            ))}
            {data?.recentReviews?.length === 0 && (
              <div className="text-center py-12 text-slate-450 dark:text-slate-505 italic text-sm flex-1 flex flex-col items-center justify-center">
                No performance reviews received yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;
