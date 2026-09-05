import React, { useState } from 'react';
import { Milestone, Sparkles } from 'lucide-react';
import { generateCareerRoadmap } from '../api/ai';

export const RoadmapPage: React.FC = () => {
  const [career, setCareer] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [roadmapAnswer, setRoadmapAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (event: React.FormEvent) => {
    event.preventDefault();
    const enteredCareer = career.trim();
    if (!enteredCareer || isGenerating) return;

    setSelectedCareer(enteredCareer);
    setRoadmapAnswer('');
    setError('');
    setIsGenerating(true);

    try {
      const result = await generateCareerRoadmap(enteredCareer);
      setRoadmapAnswer(result.answer);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Roadmap generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Milestone className="w-6 h-6 text-blue-600" />
            <span>AI Career Roadmap Generator</span>
          </h1>
          <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
            Goal-Driven Learning
          </span>
        </div>
        <p className="text-slate-600 text-xs mt-1">
          Enter any career to generate a profession-specific roadmap with ConnectED AI.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="glass-panel p-5 flex flex-col sm:flex-row gap-3">
        <input
          value={career}
          onChange={event => setCareer(event.target.value)}
          placeholder="Enter any career, for example Robotics Engineer"
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!career.trim() || isGenerating}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Generating your career roadmap...' : 'Generate Career Roadmap'}
        </button>
      </form>

      {error && <div role="alert" className="glass-panel p-4 text-sm text-rose-700">{error}</div>}

      <div className="glass-panel p-6 sm:p-8 space-y-4">
        {selectedCareer ? (
          <>
            <div className="border-b border-slate-200 pb-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Selected career</p>
              <h2 className="text-xl font-black text-slate-900">{selectedCareer}</h2>
            </div>
            {isGenerating && <p className="text-sm text-slate-600 animate-pulse">Generating your career-specific roadmap...</p>}
            {!isGenerating && roadmapAnswer && <div className="max-h-[36rem] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-700">{roadmapAnswer}</div>}
            {!isGenerating && !roadmapAnswer && !error && <p className="text-sm text-slate-600">Your roadmap will appear here after generation.</p>}
          </>
        ) : (
          <div className="p-8 text-center space-y-3">
            <Milestone className="w-12 h-12 text-blue-500/50 mx-auto" />
            <h3 className="font-bold text-slate-900">No career roadmap yet</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter any career above to generate a personalized roadmap.</p>
          </div>
        )}
      </div>
    </div>
  );
};
