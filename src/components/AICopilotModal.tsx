import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_COPILOT_RECOMMENDATIONS } from '../data/mockData';
import { Sparkles, X, ArrowRight, Bot, Target, BookOpen, Users, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AICopilotModal: React.FC = () => {
  const { user, isCopilotOpen, setIsCopilotOpen } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; link?: string }[]>([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I am your AI Student Copilot. I have analyzed your target career goal (**${user.careerGoal}**), your verified skill graph, and open cross-college projects. How can I assist your growth today?`
    }
  ]);

  if (!isCopilotOpen) return null;

  const handleQuickQuestion = (promptText: string) => {
    setQuery(promptText);
    handleSend(promptText);
  };

  const handleSend = (userText?: string) => {
    const textToSend = userText || query;
    if (!textToSend.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setQuery('');

    // Simulate AI synthesis based on user's Skill Graph & Goal
    setTimeout(() => {
      let aiReply = '';
      let linkTarget = '/skill-graph';

      if (textToSend.toLowerCase().includes('what should i do next') || textToSend.toLowerCase().includes('next step')) {
        aiReply = `Based on your goal to become a **${user.careerGoal}**, review your current skill graph, active roadmap, and available projects to choose your next step.`;
        linkTarget = '/roadmap';
      } else if (textToSend.toLowerCase().includes('project') || textToSend.toLowerCase().includes('team')) {
        aiReply = `Review the Projects hub for current opportunities and look for teams whose required skills complement your profile.`;
        linkTarget = '/projects';
      } else if (textToSend.toLowerCase().includes('hackathon') || textToSend.toLowerCase().includes('opportunity')) {
        aiReply = `Open the Opportunities hub to review currently available hackathons, internships, scholarships, and other listings.`;
        linkTarget = '/opportunities';
      } else {
        aiReply = `I've recorded your query: "${textToSend}". Review your Skill Graph and Career Roadmap for relevant updates.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, link: linkTarget }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center space-x-2">
                <span>AI Student Copilot</span>
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                  Offline UI Assistant
                </span>
              </h3>
              <p className="text-xs text-blue-100">Contextualized for {user.name} ({user.college})</p>
            </div>
          </div>
          <button
            onClick={() => setIsCopilotOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Action Recommendations Bar */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended Next Actions for You</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {MOCK_COPILOT_RECOMMENDATIONS.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setIsCopilotOpen(false);
                    navigate(rec.linkTo);
                  }}
                  className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm p-3 rounded-xl cursor-pointer transition-all text-left space-y-1 group"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 line-clamp-1">
                    {rec.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{rec.description}</p>
                  <div className="text-[10px] text-blue-600 font-bold flex items-center space-x-1 pt-1">
                    <span>{rec.actionText}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Question Prompts */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleQuickQuestion('What should I do next?')}
              className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              🚀 "What should I do next?"
            </button>
            <button
              onClick={() => handleQuickQuestion('Find me a team for robotics')}
              className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              🤝 "Which team needs my ESP32 skill?"
            </button>
            <button
              onClick={() => handleQuickQuestion('What opportunities match my skills?')}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
            >
              🏆 "Show best hackathons for me"
            </button>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 pt-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                  {m.link && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setIsCopilotOpen(false);
                          navigate(m.link!);
                        }}
                        className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs"
                      >
                        <span>Open Target Module</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Copilot (e.g. 'How do I reach Level 4 in ROS 2?')..."
            className="flex-1 bg-white border border-slate-300 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={() => handleSend()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center space-x-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <span>Ask</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
