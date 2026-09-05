import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Lock, Mail, Building2, BookOpen, GraduationCap, User } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signup, loginAsDemoStudent } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1st Year');
  const [careerGoal, setCareerGoal] = useState('Software Engineer & AI Developer');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (isSignUp) {
        if (!name.trim() || !college.trim()) {
          setError('Name and College are required for registration.');
          return;
        }
        await signup({ name, email, password, college, branch, year, careerGoal });
      } else {
        await login(email, password);
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <header className="flex items-center justify-between max-w-7xl w-full mx-auto z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-slate-900 shadow-md shadow-blue-500/20">
            C
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Connect<span className="text-blue-600">ED</span>
            </span>
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-200 font-bold ml-2">
              National Student Ecosystem
            </span>
          </div>
        </div>

        <button
          onClick={loginAsDemoStudent}
          className="text-xs bg-white hover:bg-slate-50 border border-slate-300 text-blue-700 px-4 py-2 rounded-xl font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Client Demo Preview</span>
        </button>
      </header>

      {/* Center Auth Container */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-white p-6 sm:p-8 space-y-6 border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/60">
          {/* Title & Slogan */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isSignUp ? 'Create Student Account' : 'Welcome Back to ConnectED'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Ask doubts anonymously, build cross-college project teams, prove skills & unlock opportunities.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                !isSignUp ? 'bg-blue-600 text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                isSignUp ? 'bg-blue-600 text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
            >
              Register Account
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Your name"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">College / University</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                      placeholder="e.g. COEP Technological University"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Branch / Major</label>
                    <input
                      type="text"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Academic Year</label>
                    <select
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 font-medium"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Career Goal</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={careerGoal}
                      onChange={e => setCareerGoal(e.target.value)}
                      placeholder="e.g. Robotics & Embedded AI Architect"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-blue-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Student / College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@college.edu.in"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold py-3 rounded-xl text-xs sm:text-sm transition-all duration-150 shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isSignUp ? 'Complete Registration & Sign In' : 'Sign In to ConnectED'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Client Demo Action */}
          <div className="pt-3 border-t border-slate-200 text-center space-y-2">
            <p className="text-[11px] text-slate-500 font-medium">Testing for client presentation?</p>
            <button
              onClick={loginAsDemoStudent}
              className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open Demo Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Slogan */}
      <footer className="text-center text-xs text-slate-500 max-w-7xl w-full mx-auto z-10 pt-4 border-t border-slate-200">
        <p>No student should be limited by the boundaries of their classroom, college, confidence, or network.</p>
      </footer>
    </div>
  );
};
