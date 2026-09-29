import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, BookOpen, Calendar, ShieldCheck, CheckCircle } from 'lucide-react';
import { store, DEFAULT_STUDENT_USER, DEFAULT_ADMIN_USER } from '../../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  
  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('arun.k@joyuniversity.edu.in');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('Joy University');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1st Year');

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier) {
      setNotificationMsg('Please provide your Student ID or Email.');
      return;
    }

    if (loginIdentifier.includes('admin') || loginIdentifier.includes('ADM')) {
      store.setUser(DEFAULT_ADMIN_USER);
    } else {
      store.setUser({
        ...DEFAULT_STUDENT_USER,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@joyuniversity.edu.in`,
        studentId: loginIdentifier.includes('@') ? DEFAULT_STUDENT_USER.studentId : loginIdentifier,
      });
    }

    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !studentId) {
      setNotificationMsg('Please complete all required fields.');
      return;
    }

    store.setUser({
      id: `usr-${Date.now()}`,
      studentId: studentId.toUpperCase(),
      fullName,
      email,
      college,
      department,
      year,
      role: 'student',
      hasCompletedTutorial: false,
      preferredDestination: 'Nagercoil',
    });

    onClose();
  };

  const handleDemoStudent = () => {
    store.setUser(DEFAULT_STUDENT_USER);
    onClose();
  };

  const handleDemoAdmin = () => {
    store.setUser(DEFAULT_ADMIN_USER);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border border-purple-500/30 overflow-hidden shadow-2xl">
        {/* Glow ambient background inside modal */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Student Transit AI
            </span>
            <h2 className="text-2xl font-bold font-heading text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create Student Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Alert */}
        {notificationMsg && (
          <div className="mb-4 p-3 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-purple-400" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Quick Demo Switchers */}
        <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 relative z-10">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">
            Fast Preview Roles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoStudent}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-black/40 p-1 mb-6 border border-white/10 relative z-10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            LOGIN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SIGNUP
          </button>
        </div>

        {/* Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Student ID or College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="JU2024CS042 or student@joyuniversity.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black/40 border-white/20 text-purple-600 focus:ring-0"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => setNotificationMsg('Password recovery instructions sent to campus email.')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
            >
              LOGIN TO TRANSIT AI
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 relative z-10 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="JU2024..."
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@joyuniversity.edu.in"
                  className="w-full px-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                College / Institution
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="CSE, ECE, Mech..."
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Academic Year
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
            >
              CREATE ACCOUNT
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400 relative z-10">
          Supabase Auth Architecture Ready • Joy University Campus Logistics
        </div>
      </div>
    </div>
  );
};
