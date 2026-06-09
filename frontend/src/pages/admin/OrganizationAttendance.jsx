import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Filter, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';

const OrganizationAttendance = () => {
  const [todayLogs, setTodayLogs] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  
  // Date filter states
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0] // 7 days ago
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // today

  const [loadingToday, setLoadingToday] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyQueried, setHistoryQueried] = useState(false);

  useEffect(() => {
    fetchTodayLogs();
  }, []);

  const fetchTodayLogs = async () => {
    setLoadingToday(true);
    try {
      const response = await axios.get('/api/attendance/org-today');
      setTodayLogs(response.data);
    } catch (err) {
      console.error('Error fetching today attendance:', err);
    } finally {
      setLoadingToday(false);
    }
  };

  const handleFetchHistory = async (e) => {
    e.preventDefault();
    setLoadingHistory(true);
    setHistoryQueried(true);
    try {
      const response = await axios.get(`/api/attendance/org-history?startDate=${startDate}&endDate=${endDate}`);
      setHistoryLogs(response.data);
    } catch (err) {
      console.error('Error fetching history attendance:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Helper styles for status labels
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'LATE':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      case 'LEAVE':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
      default:
        return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle size={14} className="text-emerald-500 shrink-0" />;
      case 'LATE':
        return <Clock size={14} className="text-amber-500 shrink-0" />;
      default:
        return <AlertCircle size={14} className="text-red-500 shrink-0" />;
    }
  };

  // Calculations for period metrics
  const getHistoryMetrics = () => {
    if (historyLogs.length === 0) return { present: 0, late: 0, absent: 0, percentage: 0 };
    
    const total = historyLogs.length;
    const present = historyLogs.filter(l => l.status === 'PRESENT').length;
    const late = historyLogs.filter(l => l.status === 'LATE').length;
    const absent = historyLogs.filter(l => l.status === 'ABSENT').length;
    
    const percentage = ((present + late) / total) * 100.0;
    
    return { present, late, absent, percentage };
  };

  const metrics = getHistoryMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Workforce Attendance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor daily log-ins and historical attendance logs.</p>
      </div>

      {/* Grid: Left: Today's Logins, Right: Historical Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Logins (1/3 width) */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col h-[650px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              Today's Live Check-ins
            </h3>
            <button 
              onClick={fetchTodayLogs}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
          </div>

          {loadingToday ? (
            <div className="flex items-center justify-center flex-1">
              <div className="w-6 h-6 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
              {todayLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-850 dark:text-slate-100 text-sm truncate">{log.employeeName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      In: <b className="text-slate-700 dark:text-slate-300">{log.checkInTime || '—'}</b> • Out: <b className="text-slate-700 dark:text-slate-300">{log.checkOutTime || '—'}</b>
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${getStatusBadge(log.status)}`}>
                    {getStatusIcon(log.status)}
                    {log.status}
                  </span>
                </div>
              ))}
              {todayLogs.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 italic text-sm">
                  No logins recorded today yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historical Logs Search (2/3 width) */}
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col h-[650px]">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 text-md">
            <Calendar size={18} className="text-brand-500" />
            Historical Attendance Logs
          </h3>

          {/* Date Query Form */}
          <form onSubmit={handleFetchHistory} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-6 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border dark:border-slate-850">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-xs rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-1.5 bg-white dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-xs rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loadingHistory}
              className="bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Filter size={14} />
              Filter Records
            </button>
          </form>

          {/* Query Results */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {loadingHistory ? (
              <div className="flex items-center justify-center flex-1">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : historyQueried ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Period Metrics summary */}
                <div className="grid grid-cols-4 gap-4 p-4 mb-4 bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100/50 dark:border-brand-900/20 rounded-xl text-center shrink-0">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Query Total</span>
                    <p className="text-lg font-bold text-slate-850 dark:text-slate-100">{historyLogs.length}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-emerald-500 uppercase font-medium">Present</span>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{metrics.present}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-amber-500 uppercase font-medium">Late</span>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{metrics.late}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-brand-650 uppercase font-medium">Rate</span>
                    <p className="text-lg font-bold text-brand-600 dark:text-brand-450">{metrics.percentage.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Table View */}
                <div className="flex-1 overflow-y-auto border dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/40 border-b dark:border-slate-800 font-semibold text-slate-500 uppercase">
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">In / Out</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                      {historyLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">{log.employeeName}</td>
                          <td className="px-4 py-2.5">{log.date}</td>
                          <td className="px-4 py-2.5">{log.checkInTime || '—'} to {log.checkOutTime || '—'}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadge(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {historyLogs.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-12 text-slate-400 dark:text-slate-500 italic">
                            No attendance records found for this period.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
                <Calendar size={48} className="mb-3 text-slate-300 dark:text-slate-700" />
                Select date ranges above to inspect historical attendance data.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrganizationAttendance;
