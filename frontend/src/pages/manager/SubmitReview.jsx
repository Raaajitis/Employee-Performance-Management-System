import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MessageSquare, Award, AlertCircle, CheckCircle, ArrowLeft, Users } from 'lucide-react';

const SubmitReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  
  // Rating states (1-5)
  const [technicalSkills, setTechnicalSkills] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [teamwork, setTeamwork] = useState(0);
  const [problemSolving, setProblemSolving] = useState(0);
  const [leadership, setLeadership] = useState(0);
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if redirected with a state (pre-selected employee)
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('/api/employees/team');
      setTeam(response.data);
      
      // If employee details were passed in state, preselect
      if (location.state && location.state.employeeId) {
        setEmployeeId(location.state.employeeId);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleStarClick = (category, rating) => {
    switch (category) {
      case 'tech': setTechnicalSkills(rating); break;
      case 'comm': setCommunication(rating); break;
      case 'team': setTeamwork(rating); break;
      case 'problem': setProblemSolving(rating); break;
      case 'lead': setLeadership(rating); break;
      default: break;
    }
  };

  // Star Rating UI component
  const StarRatingInput = ({ label, category, value }) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-850 rounded-2xl gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(category, star)}
              className={`p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer ${
                star <= value ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
              }`}
            >
              <Star size={24} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!employeeId) {
      setError('Please select an employee.');
      return;
    }

    if (technicalSkills === 0 || communication === 0 || teamwork === 0 || problemSolving === 0 || leadership === 0) {
      setError('Please provide a rating (1-5) for all categories.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId: parseInt(employeeId),
        technicalSkills,
        communication,
        teamwork,
        problemSolving,
        leadership,
        comments
      };

      await axios.post('/api/reviews', payload);
      setSuccess('Performance review submitted successfully!');
      
      // Reset form
      setTechnicalSkills(0);
      setCommunication(0);
      setTeamwork(0);
      setProblemSolving(0);
      setLeadership(0);
      setComments('');
      
      setTimeout(() => {
        navigate('/manager/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Review submit error:', err);
      setError(err.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/manager/dashboard')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Performance Review</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Submit skill evaluations for team members.</p>
        </div>
      </div>

      <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-950/30 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-xs">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 bg-green-950/30 border border-green-500/30 text-green-200 p-3.5 rounded-xl text-xs animate-pulse">
            <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {fetchLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Employee Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Team Member</label>
              <div className="relative">
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="block w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none"
                  required
                >
                  <option value="">-- Choose Employee --</option>
                  {team.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ratings Grid */}
            <div className="space-y-3">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Evaluate Core Criteria</span>
              <StarRatingInput label="Technical Skills" category="tech" value={technicalSkills} />
              <StarRatingInput label="Communication" category="comm" value={communication} />
              <StarRatingInput label="Teamwork" category="team" value={teamwork} />
              <StarRatingInput label="Problem Solving" category="problem" value={problemSolving} />
              <StarRatingInput label="Leadership" category="lead" value={leadership} />
            </div>

            {/* Score Calculator Preview */}
            <div className="p-4 bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100 dark:border-brand-900/30 rounded-2xl flex justify-between items-center text-sm font-medium">
              <span className="text-slate-700 dark:text-slate-300">Live Estimated Score:</span>
              <span className="text-brand-600 dark:text-brand-400 font-extrabold text-lg">
                {((technicalSkills + communication + teamwork + problemSolving + leadership) / 5.0).toFixed(1)} / 5.0
              </span>
            </div>

            {/* Review Comments */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Review Comments</label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-slate-400">
                  <MessageSquare size={16} />
                </div>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 text-slate-800 dark:text-white text-sm rounded-xl focus:outline-none focus:border-brand-500 h-28"
                  placeholder="Provide details on strengths, achievements, and improvement areas..."
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Submit Review'
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitReview;
