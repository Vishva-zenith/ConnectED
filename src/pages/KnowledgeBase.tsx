import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpenCheck,
  Plus,
  ThumbsUp,
  Tag,
  AlertCircle,
  CheckCircle2,
  Search,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { user, problemsSolutions, addProblemSolution, upvoteSolution } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [projectTitle, setProjectTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [possibleCause, setPossibleCause] = useState('');
  const [solution, setSolution] = useState('');
  const [tags, setTags] = useState('Hardware, Sensors');

  const filteredSolutions = problemsSolutions.filter(
    ps =>
      ps.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ps.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ps.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !solution.trim()) return;

    addProblemSolution({
      projectId: `proj-${Date.now()}`,
      projectTitle: projectTitle || 'Student Project',
      problem,
      possibleCause,
      solution,
      tags: tags.split(',').map(t => t.trim())
    });

    setProjectTitle('');
    setProblem('');
    setPossibleCause('');
    setSolution('');
    setShowAddModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <BookOpenCheck className="w-6 h-6 text-emerald-600" />
              <span>Project Problem & Solution Knowledge Base</span>
            </h1>
            <span className="bg-emerald-100 text-emerald-600 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
              National Knowledge Base
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            Structured technical knowledge base built from actual problems faced & solved by engineering students across India.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Share Technical Solution</span>
          </button>

        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search technical problems, causes, solutions or tags (e.g. 'YOLOv8', 'PID', 'IR Sensors')..."
          className="w-full bg-white border border-slate-200 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Solutions Cards or Empty State */}
      {filteredSolutions.length > 0 ? (
        <div className="space-y-4">
          {filteredSolutions.map(ps => (
            <div key={ps.id} className="glass-panel p-5 space-y-4 border-l-4 border-l-emerald-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600">Project Context</span>
                  <h3 className="text-sm font-bold text-slate-800">{ps.projectTitle}</h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-600">Documented by:</span>
                  <span className="font-semibold text-slate-800">{ps.authorName}</span>
                  <span className="bg-slate-800 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    {ps.authorCollege}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Problem Faced</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">{ps.problem}</p>
                </div>

                <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Root Cause Analysis</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">{ps.possibleCause}</p>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Solution</span>
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">{ps.solution}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {ps.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                      <Tag className="w-2.5 h-2.5 text-slate-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => upvoteSolution(ps.id)}
                  className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{ps.upvotes} Helpful Votes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Production Empty State */
        <div className="glass-panel p-12 text-center space-y-4">
          <BookOpenCheck className="w-12 h-12 text-emerald-500/50 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Technical Solutions Documented Yet</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Share a technical bug you encountered in a project and the verified solution that fixed it!
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/30"
            >
              Share Solution (+40 PTS)
            </button>
          </div>
        </div>
      )}

      {/* Modal for adding new solution */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 w-full max-w-xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <BookOpenCheck className="w-5 h-5 text-emerald-600" />
                <span>Share Engineering Technical Solution</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-600 hover:text-slate-900">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. Solar Tracking Agribot"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Problem Encountered</label>
                <textarea
                  required
                  rows={2}
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="e.g. Line follower oscillating around line under sunlight"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Root Cause / Why it happened</label>
                <textarea
                  rows={2}
                  value={possibleCause}
                  onChange={e => setPossibleCause(e.target.value)}
                  placeholder="e.g. Ambient ambient infrared noise saturating raw analog phototransistors"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Verified Technical Solution</label>
                <textarea
                  required
                  rows={3}
                  value={solution}
                  onChange={e => setSolution(e.target.value)}
                  placeholder="Exact fix, parameter tweaks, circuit change or code snippet..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. ESP32, IR Sensors, PyTorch"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-900 rounded-lg font-semibold shadow-lg shadow-emerald-600/30"
                >
                  Publish Solution (+40 PTS)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
