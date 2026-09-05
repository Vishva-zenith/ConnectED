import React, { useState } from 'react';
import { Mentor } from '../types';
import { Users, Star, Calendar, MessageSquare } from 'lucide-react';

export const MentorshipPage: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [mentors] = useState<Mentor[]>([]);

  const filteredMentors = selectedDomain === 'All'
    ? mentors
    : mentors.filter(m => m.domain.toLowerCase().includes(selectedDomain.toLowerCase()));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span>Mentor Discovery & Peer Skill Mentoring</span>
            </h1>
            <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
              Professors • Alumni • Skilled Peers
            </span>
          </div>
          <p className="text-slate-600 text-xs mt-1">
            Connect with verified professors, industry experts, or skilled peers who solved similar project bottlenecks.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-white border border-slate-200 p-2 rounded-xl">
          <span className="text-slate-600">Filter Domain:</span>
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="bg-slate-50 text-slate-800 rounded px-2 py-1 focus:outline-none"
          >
            <option value="All">All Domains</option>
            <option value="Robotics">Robotics & Mechatronics</option>
            <option value="Embedded">Embedded Systems</option>
            <option value="ROS">ROS 2 & Vision</option>
          </select>
        </div>
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-blue-500/50 mx-auto" />
          <h3 className="font-bold text-slate-900">No mentors available yet</h3>
          <p className="text-sm text-slate-600">Mentor profiles will appear here when they are added.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMentors.map(m => (
          <div key={m.id} className="glass-panel p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-blue-500/30" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                  <p className="text-[11px] text-blue-600 font-semibold">{m.role} • {m.organization}</p>
                  <div className="flex items-center space-x-1 text-amber-600 text-[11px] font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{m.rating}</span>
                    <span className="text-slate-500 font-normal">({m.experienceYears} yrs exp)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">{m.bio}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-600 font-semibold text-[11px]">Expertise:</span>
                <div className="flex flex-wrap gap-1">
                  {m.skills.map((sk, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="text-[10px] text-slate-600 flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>{m.availability}</span>
              </div>
              <button
                onClick={() => alert(`Request sent to ${m.name}! They will receive notification via ConnectED.`)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Request Mentorship Session</span>
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};
