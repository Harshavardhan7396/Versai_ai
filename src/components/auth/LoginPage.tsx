import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle
} from 'lucide-react';
import { authService } from '../../services/auth';
import { INSTITUTION_INFO } from '../../data/seedData';
import { LandingThemeLayout } from '../layout/LandingThemeLayout';

interface LoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: (isAdmin?: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('arun.k@joyuniversity.edu.in');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.login(identifier, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        const currentUser = authService.getCurrentUser();
        onLoginSuccess(currentUser?.role === 'admin');
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 450);
  };

  const handleDemoStudentLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      authService.loginAsDemo('student', rememberMe);
      setIsLoading(false);
      onLoginSuccess(false);
    }, 300);
  };

  const handleDemoAdminLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      authService.loginAsDemo('admin', rememberMe);
      setIsLoading(false);
      onLoginSuccess(true);
    }, 300);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.loginAsDemo('student', rememberMe);
      setIsLoading(false);
      onLoginSuccess(false);
    }, 600);
  };

  return (
    <LandingThemeLayout activePath="/login" onNavigate={onNavigate}>
      <div className="w-full max-w-md">
        {/* Vesper-style Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md mb-2 shadow-lg shadow-black/40">
            <svg
              className="w-3.5 h-3.5 text-white animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
            </svg>
            <span className="text-xs font-normal text-gray-200">
              Operational Transit Access • Joy University
            </span>
          </div>
        </div>

        {/* Central Vesper Liquid-Glass Card */}
        <div className="vesper-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            {/* Card Header with Instrument Serif typography */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2 leading-tight">
                Welcome back to <span className="font-display italic text-[#e6e6e6]">Transit AI</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Authenticate to access real-time university schedules and corridor telemetry.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                </div>
                <button 
                  onClick={() => setErrorMessage(null)} 
                  className="text-red-400 hover:text-red-200 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student ID / Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Student ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="JU2024CS042 or name@joyuniversity.edu.in"
                    className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] text-gray-400 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="vesper-input w-full pl-10 pr-11 py-2.5 text-sm placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-black/60 border-white/20 text-white focus:ring-white/30 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                    Remember this device
                  </span>
                </label>
                <span className="text-[11px] text-gray-500">Transit Pass Linked</span>
              </div>

              {/* Submit Button in Vesper Solid Style */}
              <button
                type="submit"
                disabled={isLoading}
                className="vesper-btn-solid w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0c0c0c] px-3 text-gray-400 font-medium">
                  Instant Demo Access
                </span>
              </div>
            </div>

            {/* Quick 1-Click Demo Buttons with Liquid-Metal / Ghost styling */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={handleDemoStudentLogin}
                className="vesper-btn-ghost h-10 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-gray-300" />
                <span>Student Demo</span>
              </button>

              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="vesper-btn-ghost h-10 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
                <span>Admin Demo</span>
              </button>
            </div>

            {/* Google Workspace Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="vesper-btn-ghost w-full h-10 text-xs font-medium flex items-center justify-center gap-2.5 mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.4 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.98 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.6 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                />
              </svg>
              <span>Continue with Joy University Google ID</span>
            </button>

            {/* Bottom Sign up redirect */}
            <div className="mt-5 text-center text-xs text-gray-400">
              <span>Don't have an account? </span>
              <button
                onClick={() => onNavigate('/signup')}
                className="font-medium text-white hover:underline underline-offset-4 ml-1"
              >
                Create Account
              </button>
            </div>

            {/* Admin Portal discrete link */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <button
                onClick={() => onNavigate('/admin/login')}
                className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Campus Transport Administrator Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="vesper-card w-full max-w-md p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Reset Account Password</h3>
                <p className="text-xs text-gray-400">Joy University Student Services</p>
              </div>
            </div>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              Student passwords are tied to the Joy University Campus Directory. If you have forgotten your password:
            </p>
            <div className="space-y-2 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300">
              <p>• Contact Transport Desk: <strong className="text-white">{INSTITUTION_INFO.contacts[0]}</strong></p>
              <p>• Or use the instant <strong className="text-white">1-Click Student Demo Login</strong>.</p>
            </div>
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="vesper-btn-solid w-full text-xs font-semibold"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </LandingThemeLayout>
  );
};
