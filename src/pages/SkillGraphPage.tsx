import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Trash2, Plus, Sparkles } from 'lucide-react';
import { StudentSkill } from '../types';

const LEVEL_SCORES: Record<StudentSkill['level'], number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100
};

export const SkillGraphPage: React.FC = () => {
  const { user, addSkill, removeSkill } = useApp();
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState<StudentSkill['level']>('Beginner');
  const [projectCount, setProjectCount] = useState('0');

  const handleAddSkill = (event: React.FormEvent) => {
    event.preventDefault();
    if (!skillName.trim()) return;

    addSkill({
      name: skillName.trim(),
      category: skillCategory.trim() || 'Uncategorized',
      level: skillLevel,
      score: LEVEL_SCORES[skillLevel],
      verified: false,
      projectsCount: Math.max(0, Number.parseInt(projectCount, 10) || 0),
      challengesCount: 0
    });

    setSkillName('');
    setSkillCategory('');
    setSkillLevel('Beginner');
    setProjectCount('0');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-purple-600" />
            <span>Your Skill Graph</span>
          </h1>
          <p className="text-slate-600 text-xs mt-1">Add the skills and experience you want to track in your profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddSkill} className="glass-panel p-5 space-y-4 h-fit">
          <h2 className="font-bold text-slate-900 flex items-center gap-2"><Plus className="w-4 h-4 text-purple-600" /> Add a skill</h2>
          <input value={skillName} onChange={event => setSkillName(event.target.value)} placeholder="Skill name" required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500" />
          <input value={skillCategory} onChange={event => setSkillCategory(event.target.value)} placeholder="Category (optional)" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500" />
          <select value={skillLevel} onChange={event => setSkillLevel(event.target.value as StudentSkill['level'])} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Expert</option>
          </select>
          <input type="number" min="0" value={projectCount} onChange={event => setProjectCount(event.target.value)} placeholder="Projects or experience count" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add skill</button>
        </form>

        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Your skills</h2>
            <span className="text-xs text-slate-500">{user.skills.length} added</span>
          </div>
          {user.skills.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-purple-400/60 mx-auto" />
              <h3 className="font-bold text-slate-900">No skills added yet</h3>
              <p className="text-sm text-slate-600">Add your first skill to start building your personal graph.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.skills.map(skill => (
                <div key={skill.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="font-bold text-slate-900">{skill.name}</h3><p className="text-xs text-slate-500">{skill.category} · {skill.level}</p></div>
                    <button onClick={() => removeSkill(skill.name)} aria-label={`Remove ${skill.name}`} className="text-slate-500 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="h-2 rounded-full bg-white border border-slate-200 overflow-hidden"><div className="h-full rounded-full bg-purple-500" style={{ width: `${skill.score}%` }} /></div>
                  <p className="text-xs text-slate-600">Projects or experience: {skill.projectsCount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
