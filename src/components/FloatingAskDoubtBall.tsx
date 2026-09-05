import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';

export const FloatingAskDoubtBall: React.FC = () => {
  const { setIsAskDoubtModalOpen } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Floating Hover Label / Tooltip */}
      <div
        className={`mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-blue-400/40 text-white text-xs font-semibold shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none flex items-center space-x-2 ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-4 scale-95 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:scale-100'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-100 font-medium">Ask Doubt</span>
        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
          AI Help
        </span>
      </div>

      {/* Main Hover Ball */}
      <button
        onClick={() => setIsAskDoubtModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/60 focus:outline-none cursor-pointer"
          aria-label="Ask Doubt with AI Help"
          title="Ask Doubt with AI Help"
      >
        {/* Radar wave pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></span>

        {/* Icon */}
        <div className="relative flex items-center justify-center">
          <MessageCircleQuestion className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:rotate-12 duration-300" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1.5 animate-bounce" />
        </div>
      </button>
    </div>
  );
};
