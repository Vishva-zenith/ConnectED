import React, { useState } from 'react';
import { Sparkles, Bot, AlertTriangle, CheckCircle, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { analyzeProjectWithAI, AISolveResult } from '../api/ai';

export const ProjectAdvisorPage: React.FC = () => {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AISolveResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;

    setIsAnalyzing(true);
    setError('');
    try {
      setAnalysisResult(await analyzeProjectWithAI(ideaTitle, ideaDescription));
    } catch (analysisError) {
      setError(analysisError instanceof Error ? analysisError.message : 'Project analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>AI Project Advisor & Feasibility Evaluator</span>
          </h1>
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
            Gemini Architecture Analyzer
          </span>
        </div>
        <p className="text-slate-600 text-xs mt-1">
          Enter a raw project idea. AI analyzes required technologies, potential bugs, feasibility, team requirements, and hackathon matches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input Form */}
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Submit Your Project Idea</span>
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Project Concept / Title</label>
              <input
                type="text"
                required
                value={ideaTitle}
                onChange={e => setIdeaTitle(e.target.value)}
                placeholder="e.g. Solar-powered Drone for Wildlife Forest Fire Detection"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Detailed Problem & Technical Plan</label>
              <textarea
                required
                rows={5}
                value={ideaDescription}
                onChange={e => setIdeaDescription(e.target.value)}
                placeholder="Describe what hardware, sensors, cameras, or cloud APIs you plan to use..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 text-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-900 font-semibold py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              {isAnalyzing ? (
                <span>AI Analyzing Technical Feasibility...</span>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Run AI Project Feasibility Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Analysis Output */}
        <div>
          {error ? <div className="glass-panel p-8 text-center text-rose-700">{error}</div> : analysisResult ? (
            <div className="glass-panel p-6 space-y-5 animate-in fade-in duration-300 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-extrabold text-slate-900 text-base">Backend AI Project Feasibility Report</span>
                <span className="bg-emerald-100 text-emerald-600 text-xs px-2.5 py-0.5 rounded font-bold border border-emerald-200">{analysisResult.source}</span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[32rem] overflow-y-auto">{analysisResult.answer.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '')}</div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-600 space-y-3">
              <Bot className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No project analysis generated yet.</p>
              <p className="text-xs">Fill out your project idea on the left and click "Run AI Project Feasibility Analysis".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
