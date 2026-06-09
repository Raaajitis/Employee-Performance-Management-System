import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Star, MessageSquare, Calendar, User, TrendingUp } from 'lucide-react';

const PerformanceScorecard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch logged in user's profile details to get their ID
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const userStored = localStorage.getItem('epms_user');
      if (!userStored) return;
      const parsedUser = JSON.parse(userStored);
      
      const response = await axios.get(`/api/reviews/employee/${parsedUser.id}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching scorecard:', err);
      setError('Failed to load performance evaluations.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate total overall average
  const getAverageScore = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.score, 0);
    return sum / reviews.length;
  };

  // Helper to calculate category averages
  const getCategoryAverages = () => {
    if (reviews.length === 0) {
      return { tech: 0, comm: 0, team: 0, problem: 0, lead: 0 };
    }
    
    const count = reviews.length;
    let tech = 0, comm = 0, team = 0, problem = 0, lead = 0;
    
    reviews.forEach(r => {
      tech += r.technicalSkills;
      comm += r.communication;
      team += r.teamwork;
      problem += r.problemSolving;
      lead += r.leadership;
    });

    return {
      tech: tech / count,
      comm: comm / count,
      team: team / count,
      problem: problem / count,
      lead: lead / count
    };
  };

  const avgScore = getAverageScore();
  const categoryAverages = getCategoryAverages();

  // Read-only Star Rating display
  const RenderStars = ({ value }) => {
    const rounded = Math.round(value);
    return (
      <div className="flex gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            fill={star <= rounded ? 'currentColor' : 'none'} 
            className="shrink-0"
          />
        ))}
      </div>
    );
  };

  const SkillProgressBar = ({ label, value }) => {
    const percent = (value / 5) * 100;
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-slate-650 dark:text-slate-350">{label}</span>
          <span className="text-brand-600 dark:text-brand-400 font-extrabold">{value.toFixed(1)} / 5.0</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
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
      <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Performance Scorecard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review evaluations submitted by your managers.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-505 italic">
          <Award size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700 animate-pulse" />
          No performance reviews have been submitted for you yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Summary Panel (1/3 width) */}
          <div className="space-y-6">
            
            {/* Average score gauge card */}
            <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center space-y-4">
              <Award size={36} className="text-brand-500 mx-auto" />
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Average Rating</span>
              <div className="inline-flex items-end justify-center">
                <span className="text-5xl font-extrabold text-slate-850 dark:text-slate-100 leading-none">{avgScore.toFixed(2)}</span>
                <span className="text-lg text-slate-400 font-medium ml-1">/ 5.0</span>
              </div>
              <div className="flex justify-center mt-2">
                <RenderStars value={avgScore} />
              </div>
              <span className="block text-xs text-slate-400">Calculated over {reviews.length} appraisal cycles.</span>
            </div>

            {/* Category Breakdown */}
            <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
              <h3 className="font-bold text-slate-805 dark:text-slate-100 flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-brand-500" />
                Criteria Breakdown
              </h3>
              
              <div className="space-y-4">
                <SkillProgressBar label="Technical Skills" value={categoryAverages.tech} />
                <SkillProgressBar label="Communication" value={categoryAverages.comm} />
                <SkillProgressBar label="Teamwork" value={categoryAverages.team} />
                <SkillProgressBar label="Problem Solving" value={categoryAverages.problem} />
                <SkillProgressBar label="Leadership" value={categoryAverages.lead} />
              </div>
            </div>

          </div>

          {/* History list (2/3 width) */}
          <div className="glass bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-md">
              <MessageSquare size={18} className="text-brand-500" />
              Detailed Appraisal Logs
            </h3>

            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-slate-50/70 dark:bg-slate-800/20 border dark:border-slate-850 rounded-2xl space-y-4">
                  
                  {/* Review header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-700 dark:text-brand-400 font-bold text-xs shrink-0">
                        {rev.reviewerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evaluated By</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight mt-0.5">{rev.reviewerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Score display */}
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-955/20 border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-extrabold shrink-0">
                        <Star size={14} fill="currentColor" />
                        {rev.score.toFixed(2)}
                      </div>
                      
                      {/* Date */}
                      <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                        <Calendar size={13} />
                        {rev.reviewDate}
                      </span>
                    </div>
                  </div>

                  {/* Skill level details in grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white/60 dark:bg-slate-900/30 p-3.5 rounded-xl border dark:border-slate-850 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-medium">Technical</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{rev.technicalSkills} <span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-medium">Comm</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{rev.communication} <span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-medium">Teamwork</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{rev.teamwork} <span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-medium">Problem Solv</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{rev.problemSolving} <span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                    </div>
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-500 font-medium">Leadership</span>
                      <p className="font-extrabold text-slate-800 dark:text-slate-200">{rev.leadership} <span className="text-[10px] text-slate-400 font-normal">/5</span></p>
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1">
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Comments</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/40 dark:bg-slate-900/20 border dark:border-slate-850 p-3.5 rounded-xl italic">
                      "{rev.comments || 'No comments added.'}"
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default PerformanceScorecard;
