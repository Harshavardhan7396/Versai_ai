import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Building2, 
  GraduationCap
} from 'lucide-react';
import { authService } from '../../services/auth';
import { LandingThemeLayout } from '../layout/LandingThemeLayout';

interface SignupPageProps {
  onNavigate: (route: string) => void;
  onSignupSuccess: () => void;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Mechanical & Automobile Engineering',
  'Nursing & Allied Health Sciences',
  'School of Management & Business Studies',
  'Biotechnology & Life Sciences',
  'Civil & Environmental Engineering',
];

const YEARS = [
  '1st Year (Fresher)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Post-Graduate / Research',
];

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate, onSignupSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutofillSample = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFullName('Kavitha Rajendran');
    setStudentId(`JU2024AI${randomSuffix}`);
    setEmail(`kavitha.${randomSuffix}@joyuniversity.edu.in`);
    setDepartment('Artificial Intelligence & Data Science');
    setYear('2nd Year (Sophomore)');
    setPassword('student123');
    setConfirmPassword('student123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Please accept the campus transit guidelines to proceed.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authService.signup({
        fullName,
        studentId,
        email,
        password,
        college: 'Joy University',
        department,
        year,
      });

      if (!result.success) {
        setIsLoading(false);
        setErrorMessage(result.error || 'Failed to register account.');
        return;
      }

      // Automatically log the student in
      const loginRes = authService.login(email, password, true);
      setIsLoading(false);

      if (loginRes.success) {
        onSignupSuccess();
      } else {
        onNavigate('/login');
      }
    }, 500);
  };

  return (
    <LandingThemeLayout activePath="/signup" onNavigate={onNavigate}>
      <div className="w-full max-w-xl">
        {/* Header Badge */}
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
              Student Registration • Joy University Transit
            </span>
          </div>
        </div>

        {/* Registration Card */}
        <div className="vesper-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-1.5">
                  Register for <span className="font-display italic text-[#e6e6e6]">Transit AI</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  Create your campus transit account for timetable & live vehicle access.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutofillSample}
                className="vesper-btn-ghost self-start sm:self-auto h-9 text-xs font-medium flex items-center gap-1.5"
                title="Fills sample student details"
              >
                <Sparkles className="w-3.5 h-3.5 text-gray-300" />
                <span>Autofill Demo</span>
              </button>
            </div>

            {/* Error Message */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kavitha Rajendran"
                      className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Student ID */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    University Roll / Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. JU2024CS042"
                      className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Campus / Personal Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@joyuniversity.edu.in"
                    className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm text-white appearance-none bg-black/70 cursor-pointer"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-[#111111] text-white">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="vesper-input w-full px-4 py-2.5 text-sm text-white appearance-none bg-black/70 cursor-pointer"
                  >
                    {YEARS.map((yr) => (
                      <option key={yr} value={yr} className="bg-[#111111] text-white">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Password
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
                      placeholder="At least 6 chars"
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

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="vesper-input w-full pl-10 pr-4 py-2.5 text-sm placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-black/60 border-white/20 text-white focus:ring-white/30 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I agree to the Joy University Transit Code of Conduct and verified schedule terms.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="vesper-btn-solid w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>COMPLETE REGISTRATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link */}
            <div className="mt-6 text-center text-xs text-gray-400">
              <span>Already registered? </span>
              <button
                onClick={() => onNavigate('/login')}
                className="font-medium text-white hover:underline underline-offset-4 ml-1"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </LandingThemeLayout>
  );
};
