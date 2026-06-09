import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FolderKanban, CalendarCheck, FileText, ArrowRight, Activity, Clock } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard/summary');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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
      <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200 dark:border-red-900">
        {error}
      </div>
    );
  }

  // Pre-configured mock data for charts since we need visual widgets
  const projectsChartData = [
    { name: 'Not Started', value: 3, fill: '#94a3b8' },
    { name: 'In Progress', value: 5, fill: '#8b5cf6' },
    { name: 'Completed', value: 8, fill: '#10b981' },
    { name: 'On Hold', value: 2, fill: '#f59e0b' }
  ];

  const attendanceChartData = [
    { date: 'Mon', Present: 92, Absent: 8 },
    { date: 'Tue', Present: 95, Absent: 5 },
    { date: 'Wed', Present: 88, Absent: 12 },
    { date: 'Thu', Present: 96, Absent: 4 },
    { date: 'Fri', Present: 94, Absent: 6 }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Admin Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of the organization's workforce and projects.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Employees */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.totalEmployees || 0}</h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        {/* Active Projects */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.activeProjects || 0}</h3>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 p-4 rounded-xl">
            <FolderKanban size={24} />
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {data?.attendancePercentage ? `${data.attendancePercentage.toFixed(1)}%` : '0.0%'}
            </h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl">
            <CalendarCheck size={24} />
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{data?.pendingReviews || 0}</h3>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 p-4 rounded-xl">
            <FileText size={24} />
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Attendance Bar Chart */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl lg:col-span-2 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-brand-500" />
            Weekly Attendance Analysis
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Present" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Status Pie Chart */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <FolderKanban size={18} className="text-brand-500" />
              Project Status Distribution
            </h3>
            <div className="h-60 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t dark:border-slate-800 pt-4 mt-2">
            {projectsChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span>{item.name}: <b>{item.value}</b></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activities Section */}
      <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Clock size={18} className="text-brand-500" />
          Recent Activities
        </h3>
        <div className="divide-y dark:divide-slate-800">
          {data?.recentActivities?.map((activity, index) => (
            <div key={index} className="py-4 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                  <Activity size={16} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activity}</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
