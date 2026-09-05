import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { Sparkles, Globe, Award, UserCog, Menu, LogOut, Sun, Moon } from 'lucide-react';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'raj', label: 'राजस्थानी (Rajasthani)' },
  { code: 'bho', label: 'भोजपुरी (Bhojpuri)' },
  { code: 'mai', label: 'मैथिली (Maithili)' },
  { code: 'sd', label: 'سنڌي (Sindhi)' },
  { code: 'ks', label: 'कॉशुर (Kashmiri)' },
  { code: 'kok', label: 'कोंकणी (Konkani)' },
  { code: 'mni', label: 'মৈতৈ (Manipuri)' },
];

export const Navbar: React.FC = () => {
  const { user, language, setLanguage, theme, toggleTheme, setIsCopilotOpen, setIsMobileMenuOpen, setIsEditPortfolioOpen, logout } = useApp();
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 px-3 md:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-md shadow-blue-500/20 shrink-0">
            C
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                Connect<span className="text-blue-600">ED</span>
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border border-blue-200 font-bold hidden sm:inline-block">
                {t('nationalEcosystem')}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden lg:block">
              {t('tagline')}
            </p>
          </div>
        </div>

      {/* Center: AI Copilot Trigger */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs group cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
        <span>{t('aiCopilot')}</span>
        <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-md font-semibold">
          {t('whatNext')}
        </span>
      </button>

      {/* Right Controls: Language, Reputation, Profile & Logout */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        {/* Language selector */}
        <div className="relative flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-700">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as Language)}
            className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} className="bg-white text-slate-900">
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reputation */}
        <div className="hidden sm:flex items-center space-x-1 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>{user.reputationPoints} {t('pts')}</span>
        </div>

        {/* Edit Profile & Logout Buttons */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
          <button
            onClick={() => setIsEditPortfolioOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            title="Edit Portfolio & Profile"
          >
            <UserCog className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">{t('editProfile')}</span>
          </button>

          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover shadow-xs"
          />

          <button
            onClick={logout}
            className="text-slate-500 hover:text-rose-600 p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>
    </nav>
  );
};
