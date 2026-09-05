import React from 'react';
import { Trophy, Filter } from 'lucide-react';

export const OpportunityHub: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <span>AI-Powered Opportunity Hub & Skill Matcher</span>
          </h1>
          <span className="bg-amber-500/10 text-amber-700 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/20 font-semibold">
            Opportunities
          </span>
        </div>
        <p className="text-slate-600 text-xs mt-1">
          Opportunities will appear here when they are connected to ConnectED.
        </p>
        <div className="flex items-center gap-2 mt-4 w-fit bg-white border border-slate-200 rounded-xl px-3 py-2 opacity-60">
          <Filter className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-600">All categories</span>
        </div>
      </div>

      <div className="glass-panel p-12 text-center space-y-3">
        <Trophy className="w-12 h-12 text-amber-500/50 mx-auto" />
        <h3 className="font-bold text-slate-900">No opportunities available yet</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Opportunities will be shown here once a live opportunity source is connected.
        </p>
      </div>
    </div>
  );
};
