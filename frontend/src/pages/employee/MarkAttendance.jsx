import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck, Play, Square, History, Clock, Percent, AlertCircle, CheckCircle } from 'lucide-react';

const MarkAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [history, setHistory] = useState([]);
  const [percentage, setPercentage] = useState(0);
  
  // Attendance actions states
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [todayLog, setTodayLog] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clock runner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // 1. Fetch own logs
      const historyResponse = await axios.get('/api/attendance/my-history');
      setHistory(historyResponse.data);

      // 2. Fetch attendance rate
      const pctResponse = await axios.get('/api/attendance/my-percentage');
      setPercentage(pctResponse.data.percentage);

      // 3. Check today's status
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = historyResponse.data.find(rec => rec.date === today);
      if (todayRecord) {
        setTodayLog(todayRecord);
        setIsCheckedIn(true);
        if (todayRecord.checkOutTime) {
          setIsCheckedOut(true);
        }
      } else {
        setTodayLog(null);
        setIsCheckedIn(false);
        setIsCheckedOut(false);
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setError('');
    setSuccess('');
    setActionLoading(true);
    try {
      const response = await axios.post('/api/attendance/check-in');
      setSuccess('Checked in successfully!');
      fetchAttendanceData();
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.response?.data?.message || 'Check-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setSuccess('');
    setActionLoading(true);
    try {
      const response = await axios.post('/api/attendance/check-out');
      setSuccess('Checked out successfully!');
      fetchAttendanceData();
    } catch (err) {
      console.error('Check-out error:', err);
      setError(err.response?.data?.message || 'Check-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper styles for status labels
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'LATE':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default:
        return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Attendance Logger</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Register daily check-ins and check-outs.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Action Log Widget */}
          <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center gap-6 h-[500px]">
            <div className="space-y-2">
              <CalendarCheck size={36} className="text-brand-500 mx-auto" />
              <h3 className="font-bold text-slate-850 dark:text-slate-100 text-lg">Mark Attendance</h3>
              <p className="text-xs text-slate-400">Please register check-in when joining and check-out when leaving.</p>
            </div>

            {/* Live Clock Display */}
            <div className="space-y-1 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 px-8 py-6 rounded-2xl w-full">
              <span className="text-4xl font-extrabold font-mono tracking-tight text-brand-600 dark:text-brand-400">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Error / Success banners */}
            {(error || success) && (
              <div className="w-full">
                {error && (
                  <div className="flex items-center gap-2 bg-red-950/20 border border-red-500/30 text-red-200 p-2.5 rounded-xl text-xs text-left">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 bg-green-950/20 border border-green-500/30 text-green-200 p-2.5 rounded-xl text-xs text-left">
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={handleCheckIn}
                disabled={isCheckedIn || actionLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed transition-transform active:scale-95 disabled:active:scale-100"
              >
                <Play size={16} />
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!isCheckedIn || isCheckedOut || actionLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:shadow-none cursor-pointer disabled:cursor-not-allowed transition-transform active:scale-95 disabled:active:scale-100"
              >
                <Square size={16} />
                Check Out
              </button>
            </div>
          </div>

          {/* Log History list */}
          <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col h-[500px]">
            
            {/* Headers with Metrics */}
            <div className="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4 shrink-0">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <History size={18} className="text-brand-500" />
                My Login History
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-650 bg-brand-50 dark:bg-brand-950/40 px-3 py-1.5 rounded-xl border border-brand-100 dark:border-brand-900/30">
                <Percent size={14} />
                <span>Attendance Rate: <b>{percentage.toFixed(1)}%</b></span>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b dark:border-slate-800 font-semibold text-slate-500 uppercase">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Check-In</th>
                    <th className="px-4 py-3">Check-Out</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                  {history.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{log.date}</td>
                      <td className="px-4 py-3">{log.checkInTime || '—'}</td>
                      <td className="px-4 py-3">{log.checkOutTime || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-slate-400 dark:text-slate-500 italic">
                        No login history found. Check in to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
