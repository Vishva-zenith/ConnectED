import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  FolderGit2,
  BookOpenCheck,
  Cpu,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, doubts, projects, problemsSolutions, opportunities, setIsCopilotOpen } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-slate-900">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 border border-blue-400/30 p-6 sm:p-8 shadow-xl text-slate-900">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 text-slate-900 text-xs px-3.5 py-1 rounded-full font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Student AI Ecosystem</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              Target Goal: <span className="text-amber-700 font-bold">{user.careerGoal}</span> • {user.college} ({user.year})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="bg-white hover:bg-slate-50 text-blue-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Ask AI Copilot</span>
            </button>
            <button
              onClick={() => navigate('/doubts')}
              className="bg-blue-700/60 hover:bg-blue-700/80 text-slate-900 border border-white/30 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer backdrop-blur-xs"
            >
              Ask Anonymous Doubt
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Reputation Score</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{user.reputationPoints} <span className="text-xs font-normal text-amber-600">PTS</span></p>
          <p className="text-[11px] text-slate-500 font-medium">No recent activity</p>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Active Doubts</span>
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{doubts.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">No active topics yet</p>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Cross-College Teams</span>
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{projects.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">No team matches yet</p>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Verified Skills</span>
            <Cpu className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {user.skills.filter(s => s.verified).length} <span className="text-xs font-normal text-slate-500">/ {user.skills.length}</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Based on your profile</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access Feature Matrix */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>ConnectED Core Modules</span>
              <span className="text-xs text-slate-500 font-medium">Explore your modules</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/doubts"
                className="glass-card p-5 space-y-2 group hover:border-blue-400 hover:shadow-md block transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold border border-blue-200">
                    Anonymous Hub
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  Anonymous Doubt Hub & Clustering
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ask doubts via text or code in Indian languages. Smart peer routing connects you based on experience.
                </p>
              </Link>

              <Link
                to="/projects"
                className="glass-card p-5 space-y-2 group hover:border-indigo-400 hover:shadow-md block transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
                    Cross-College
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  Project Hub & AI Team Matcher
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Find teammates across IITs, NITs & COEP using skill-complementarity matching and Compatibility Scores.
                </p>
              </Link>

              <Link
                to="/knowledge"
                className="glass-card p-5 space-y-2 group hover:border-emerald-400 hover:shadow-md block transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                    National Repo
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                  Problem & Solution Knowledge Base
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover actual engineering problems encountered by student builders and verified technical fixes.
                </p>
              </Link>

              <Link
                to="/skill-graph"
                className="glass-card p-5 space-y-2 group hover:border-purple-400 hover:shadow-md block transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                    AI Verification
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                  AI Skill Graph & Career Roadmap
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track dynamic skill proficiency, level up with project proof, and follow structured career milestones.
                </p>
              </Link>
            </div>
          </div>

          {/* Featured Cross-College Project Match */}
          {projects.length > 0 ? (
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-slate-900 text-sm">Top Recommended Cross-College Project</h3>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full font-bold">
                  {projects[0].compatibilityScore ? `${projects[0].compatibilityScore}% AI Match` : 'Team match pending'}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-900">{projects[0].title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{projects[0].description}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500">Created by:</span>
                  <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border border-slate-200">
                    {projects[0].creatorName} ({projects[0].creatorCollege})
                  </span>
                  <span className="text-slate-500">• Missing Skills:</span>
                  {projects[0].missingSkills.map((sk, idx) => (
                    <span key={idx} className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>View Full Team Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 space-y-3 text-center">
              <FolderGit2 className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Start the First Cross-College Project</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Post an idea to automatically match with teammates across other universities using AI.
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Explore Project Hub
              </button>
            </div>
          )}
        </div>

        {/* Right Column (1 col wide) */}
        <div className="space-y-6">
          {/* Top Opportunities Widget */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Recommended Opportunities</span>
              </h3>
              <Link to="/opportunities" className="text-xs text-blue-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {opportunities.map(opp => (
                <div key={opp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {opp.type}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {opp.matchScore}% Match
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                  <p className="text-[11px] text-slate-500">{opp.organization} • {opp.stipendOrPrize}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Reputation & Badges Widget */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Your Community Badges</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-3 py-1 rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
