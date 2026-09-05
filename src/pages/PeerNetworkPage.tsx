import React, { useState } from 'react';
import { Network, Search, MessageSquare } from 'lucide-react';

const students: never[] = [];

export const PeerNetworkPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Network className="w-6 h-6 text-blue-600" />
            <span>Cross-College Peer Discovery Network</span>
          </h1>
          <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
            National Student Directory
          </span>
        </div>
        <p className="text-slate-600 text-xs mt-1">
          Discover students across colleges by skills, career goals, project experience, or willingness to teach.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search peers by skill, college, or domain..."
          className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Peers List */}
      {filteredStudents.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Network className="w-12 h-12 text-blue-500/50 mx-auto" />
          <h3 className="font-bold text-slate-900">No peers available yet</h3>
          <p className="text-sm text-slate-600">Student profiles will appear here when they join ConnectED.</p>
        </div>
      ) : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div key={student.id} className="glass-panel p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-blue-500/30" />
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{student.name}</h3>
                  <p className="text-[11px] text-blue-600 font-semibold truncate">{student.college}</p>
                  <p className="text-[10px] text-slate-600 truncate">{student.branch} ({student.year})</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">{student.bio}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-600 font-semibold text-[11px]">Verified Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {student.skills.map((sk, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-amber-600">{student.reputation} PTS</span>
              <button
                onClick={() => alert(`Connection request sent to ${student.name}!`)}
                className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Connect & Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};
