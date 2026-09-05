import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  X,
  LayoutDashboard,
  HelpCircle,
  FolderGit2,
  BookOpenCheck,
  Cpu,
  Milestone,
  Briefcase,
  Users,
  Sparkles,
  Trophy,
  Network,
  LogOut
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const MobileDrawer: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, doubts, projects, setIsCopilotOpen, logout } = useApp();
  const { t } = useTranslation();

  if (!isMobileMenuOpen) return null;

  const navItems = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/doubts', label: t('doubtHub'), icon: HelpCircle, badge: doubts.length.toString() },
    { to: '/projects', label: t('projects'), icon: FolderGit2, badge: projects.length.toString() },
    { to: '/knowledge', label: t('knowledge'), icon: BookOpenCheck },
    { to: '/skill-graph', label: t('skills'), icon: Cpu },
    { to: '/roadmap', label: t('roadmap'), icon: Milestone },
    { to: '/portfolio', label: t('portfolio'), icon: Briefcase },
    { to: '/mentors', label: t('mentors'), icon: Users },
    { to: '/advisor', label: t('advisor'), icon: Sparkles },
    { to: '/opportunities', label: t('opportunities'), icon: Trophy },
    { to: '/peers', label: t('connect'), icon: Network },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs md:hidden flex justify-start">
      <div className="bg-white border-r border-slate-200 w-72 h-full flex flex-col justify-between p-4 animate-in slide-in-from-left duration-200 shadow-2xl">
        <div className="space-y-4 overflow-y-auto">
          {/* Top header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-sm">
                C
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Connect<span className="text-blue-600">ED</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-500 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer trigger */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCopilotOpen(true);
            }}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Student Copilot</span>
          </button>
          <button
            onClick={logout}
            className="w-full py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
