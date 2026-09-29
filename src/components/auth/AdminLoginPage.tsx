import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/auth';
import { LandingThemeLayout } from '../layout/LandingThemeLayout';

interface AdminLoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@joyuniversity.edu.in');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.loginAdmin(email, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(result.error || 'Administrator verification failed.');
      }
    }, 400);
  };

  const handleDemoAdminQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.loginAsDemo('admin', rememberMe);
      setIsLoading(false);
      onLoginSuccess();
    }, 300);
  };

  return (
    <LandingThemeLayout activePath="/admin/login" onNavigate={onNavigate}>
      <div className="w-full max-w-md">
        {/* Admin Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md mb-2 shadow-lg shadow-black/40">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-normal text-gray-200">
              Campus Transport Dispatch & Operations Console
            </span>
          </div>
        </div>

        {/* Admin Card */}
        <div className="vesper-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
                Administrator <span className="font-display italic text-[#e6e6e6]">Portal</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Restricted to authorized Joy University transport management and dispatch staff.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Staff Email / Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@joyuniversity.edu.in"
                    className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Operations Password
                </label>
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

              {/* Session checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-black/60 border-white/20 text-white focus:ring-white/30 cursor-pointer"
                  />
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                    Maintain secure session
                  </span>
                </label>
                <span className="text-[11px] text-gray-500">256-Bit Encrypted</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="vesper-btn-solid w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>AUTHENTICATE AS ADMIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Admin Demo Login */}
            <div className="mt-5 pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleDemoAdminQuickLogin}
                className="vesper-btn-ghost w-full h-10 text-xs font-medium flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>1-Click Admin Demo Login</span>
              </button>
            </div>

            {/* Switch to student login */}
            <div className="mt-5 text-center text-xs text-gray-400">
              <span>Are you a student? </span>
              <button
                onClick={() => onNavigate('/login')}
                className="font-medium text-white hover:underline underline-offset-4 ml-1"
              >
                Switch to Student Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </LandingThemeLayout>
  );
};
