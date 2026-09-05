import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  HelpCircle,
  Network,
  FolderGit2,
  BookOpenCheck,
  Cpu,
  Milestone,
  Briefcase,
  Users,
  Compass,
  Trophy,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

export const Sidebar: React.FC = () => {
  const { doubts, projects, setIsCopilotOpen, logout } = useApp();
  const { t } = useTranslation();

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
    <aside className="w-64 border-r border-slate-200 bg-white flex-col justify-between max-md:hidden md:flex shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {t('mainNavigation')}
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 shrink-0 text-blue-600" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 m-3 border-t border-slate-200 space-y-2">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl">
          <LogOut className="w-4 h-4" /> {t('signOut')}
        </button>
      </div>
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-2 text-center shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-xs">
          <Compass className="w-4 h-4" />
        </div>
        <p className="text-xs font-bold text-slate-900">{t('connect')}</p>
        <p className="text-[11px] text-slate-600 leading-snug">
          Build your student network as more members join ConnectED.
        </p>
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          {t('aiCopilot')}
        </button>
      </div>
    </aside>
  );
};
