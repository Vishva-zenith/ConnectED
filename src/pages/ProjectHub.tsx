import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderGit2,
  Users,
  Plus,
  Building2,
  Sparkles,
  CheckCircle,
  Code,
  Boxes,
  Cpu,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const ProjectHub: React.FC = () => {
  const { user, projects, addProject, joinProjectRequest } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState<'Idea' | 'Prototype' | 'In Progress'>('Prototype');
  const [duration, setDuration] = useState('3 Months');
  const [reqSkills, setReqSkills] = useState('ESP32, ROS 2, Computer Vision, Flutter');
  const [missingSkills, setMissingSkills] = useState('ROS 2, Flutter');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addProject({
      title,
      problemStatement,
      description,
      stage,
      duration,
      requiredSkills: reqSkills.split(',').map(s => s.trim()),
      missingSkills: missingSkills.split(',').map(s => s.trim()),
      compatibilityScore: 88
    });

    setTitle('');
    setProblemStatement('');
    setDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FolderGit2 className="w-6 h-6 text-indigo-600" />
              <span>Cross-College Project Collaboration Hub</span>
            </h1>
            <span className="bg-indigo-100 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
              AI Team Matcher
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            Build cross-college teams based on complementary skills rather than identical skills.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Project Idea</span>
          </button>

        </div>
      </div>

      {/* Projects List or Clean Empty State */}
      {projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map(proj => {
            const isMember = proj.currentMembers.some(m => m.id === user.id);

            return (
              <div key={proj.id} className="glass-panel p-6 space-y-5 border-l-4 border-l-indigo-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-extrabold text-slate-900">{proj.title}</h2>
                      <span className="bg-indigo-500/20 text-indigo-700 font-bold text-[10px] px-2.5 py-0.5 rounded border border-indigo-500/30">
                        {proj.stage}
                      </span>
                      <span className="text-xs text-slate-600">Duration: {proj.duration}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 flex items-center space-x-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Initiated by <strong>{proj.creatorName}</strong> ({proj.creatorCollege})</span>
                    </p>
                  </div>

                  {proj.compatibilityScore && (
                    <div className="bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl text-right shrink-0">
                      <div className="text-[10px] uppercase font-bold text-slate-600">Team Compatibility</div>
                      <div className="text-sm font-black text-emerald-600">{proj.compatibilityScore}% AI Match</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Problem Statement
                    </span>
                    <p className="text-slate-700 leading-relaxed">{proj.problemStatement}</p>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Project Overview
                    </span>
                    <p className="text-slate-700 leading-relaxed">{proj.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-slate-600 font-semibold text-[11px]">Required Project Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.requiredSkills.map((sk, i) => (
                        <span key={i} className="bg-slate-800 text-slate-800 px-2.5 py-1 rounded-md text-xs font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-rose-600 font-semibold text-[11px]">Missing Skills Needed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.missingSkills.map((sk, i) => (
                        <span key={i} className="bg-rose-100 text-rose-700 border border-rose-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                          Need {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Cross-College Team ({proj.currentMembers.length} Members)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {proj.currentMembers.map(m => (
                      <div key={m.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center space-x-3 text-xs">
                        <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-800 truncate">{m.name}</p>
                          <p className="text-[10px] text-indigo-600 font-medium truncate">{m.role}</p>
                          <p className="text-[10px] text-slate-600 truncate">{m.college}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 text-slate-600">
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="hover:text-slate-900 flex items-center space-x-1">
                        <Code className="w-3.5 h-3.5" />
                        <span>Code Repo</span>
                      </a>
                    )}
                  </div>

                  {isMember ? (
                    <span className="bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>You are a Team Member</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => joinProjectRequest(proj.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
                    >
                      <span>Request to Join Team</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Production Empty State */
        <div className="glass-panel p-12 text-center space-y-4">
          <FolderGit2 className="w-12 h-12 text-indigo-500/50 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Cross-College Projects Posted Yet</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Be the first student to post a project idea and let AI recommend complementary teammates!
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/30"
            >
              Post Project Idea
            </button>
          </div>
        </div>
      )}

      {/* Modal for creating a new project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 w-full max-w-xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <span>Post Cross-College Project Idea</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-600 hover:text-slate-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous Solar Powered Agribot"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Problem Statement</label>
                <textarea
                  required
                  rows={2}
                  value={problemStatement}
                  onChange={e => setProblemStatement(e.target.value)}
                  placeholder="What real-world problem does this project solve?"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Technical details, architecture, goals..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Stage</label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                  >
                    <option value="Idea">Idea Phase</option>
                    <option value="Prototype">Prototype Phase</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Required Skills</label>
                <input
                  type="text"
                  value={reqSkills}
                  onChange={e => setReqSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Missing Skills Needed from Teammates</label>
                <input
                  type="text"
                  value={missingSkills}
                  onChange={e => setMissingSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 rounded-lg font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Publish Project Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
