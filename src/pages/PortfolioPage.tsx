import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Award,
  CheckCircle,
  ExternalLink,
  Code,
  Trophy,
  UserCog,
  Globe,
  Github,
  Linkedin,
  Plus,
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { user, projects, problemsSolutions, setIsEditPortfolioOpen } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <span>Student Mini-Repository & Portfolio</span>
            </h1>
            <span className="bg-emerald-100 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
              Verified Evidence Profile
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            Demonstrate actual projects, verified code, hardware schematics, and community contributions instead of resume claims.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditPortfolioOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 shrink-0"
          >
            <UserCog className="w-4 h-4" />
            <span>Edit Profile & Portfolio</span>
          </button>

        </div>
      </div>

      {/* User Header Profile Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg shrink-0"
            />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h2>
              <p className="text-xs sm:text-sm text-slate-700">
                {user.college} • {user.branch} ({user.year})
              </p>
              <p className="text-xs text-blue-600 font-semibold mt-1">Target Goal: {user.careerGoal}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center w-full md:w-auto justify-around">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Reputation</span>
              <span className="text-xl font-black text-amber-600">{user.reputationPoints} PTS</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Verified Skills</span>
              <span className="text-xl font-black text-emerald-600">
                {user.skills.filter(s => s.verified).length}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-200">
            "{user.bio}"
          </p>
        )}

        {/* Social Links Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-50 hover:bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors font-medium"
            >
              <Github className="w-3.5 h-3.5 text-slate-900" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
          {user.linkedinUrl && (
            <a
              href={user.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-50 hover:bg-white border border-slate-200 text-blue-600 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors font-medium"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
          {user.websiteUrl && (
            <a
              href={user.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-50 hover:bg-white border border-slate-200 text-emerald-600 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors font-medium"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Personal Website</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          )}
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects & Solutions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Added Portfolio Projects */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <span>Personal Project Repositories</span>
              </h3>
              <button
                onClick={() => setIsEditPortfolioOpen(true)}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </div>

            {user.customProjects && user.customProjects.length > 0 ? (
              <div className="space-y-4">
                {user.customProjects.map((cp) => (
                  <div key={cp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{cp.title}</h4>
                      <span className="bg-indigo-100 text-indigo-700 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {cp.role}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{cp.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {cp.skillsUsed.map((sk, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {cp.repoUrl && (
                      <div className="pt-2 border-t border-slate-900">
                        <a
                          href={cp.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-[11px] font-semibold inline-flex items-center space-x-1"
                        >
                          <span>View Source Code / CAD Files</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-2">
                <Code className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-600">No custom project repositories added yet.</p>
                <button
                  onClick={() => setIsEditPortfolioOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                >
                  Add Your First Project
                </button>
              </div>
            )}
          </div>

          {/* Cross-College Flagship Projects */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>Cross-College Flagship Contributions ({projects.length})</span>
            </h3>

            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                    <span className="bg-emerald-100 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[10px]">
                      Verified Evidence
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.requiredSkills.map((sk, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Skills & Community Badges */}
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Verified Skill Graph ({user.skills.length})</span>
              </h3>
              <button
                onClick={() => setIsEditPortfolioOpen(true)}
                className="text-xs text-blue-600 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {user.skills.map((sk, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{sk.name}</span>
                    <span className="text-[10px] text-slate-600 block">{sk.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 font-bold text-xs">{sk.score}/100</span>
                    <span className="text-[10px] text-slate-600 block">{sk.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Community Badges & Honors</span>
            </h3>
            <div className="space-y-2">
              {user.badges.map((b, i) => (
                <div key={i} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center space-x-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
