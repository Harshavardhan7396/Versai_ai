import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, User, Compass } from 'lucide-react';
import { HeroVideoBackground } from '../background/HeroVideoBackground';

interface LandingThemeLayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (route: string) => void;
  title?: string;
  subtitle?: string;
}

export const LandingThemeLayout: React.FC<LandingThemeLayoutProps> = ({
  children,
  activePath,
  onNavigate,
  title,
  subtitle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Force black background on document and body
    document.documentElement.style.background = '#000000';
    document.body.style.background = '#000000';
    document.body.style.color = '#ffffff';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 901) setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <div className="vesper-auth-root">
      <style>{`
        .vesper-auth-root {
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          overflow-x: hidden;
        }

        .font-display {
          font-family: "Instrument Serif", "Times New Roman", Times, serif;
          font-style: italic;
        }

        /* 1. Grain overlay at z-index: 100 */
        .vesper-grain {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.038'/%3E%3C/svg%3E");
          opacity: 0.55;
        }

        /* 2. Hero photo video background + scrim */
        .vesper-hero-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .vesper-hero-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.85;
          display: block;
        }
        .vesper-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0, 0, 0, 0.85) 100%);
        }

        /* 3. Liquid-metal Nav Pills */
        .vesper-nav-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 16px;
          border-radius: 7px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(198, 198, 198, 0.45);
          background: linear-gradient(105deg, #050505 0%, #222222 48%, #3e3e3e 100%);
          color: #d8d8d8;
          font-size: 13.5px;
          font-weight: 400;
          letter-spacing: -0.01em;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease;
        }
        .vesper-nav-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.16) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }
        .vesper-nav-pill:hover::before {
          transform: translateX(120%);
        }
        .vesper-nav-pill:hover {
          border-color: rgba(235, 235, 235, 0.9);
          background: linear-gradient(105deg, #111111 0%, #3a3a3a 45%, #6a6a6a 100%);
          color: #ffffff;
          box-shadow: 0 0 18px rgba(200, 210, 230, 0.18);
        }
        .vesper-nav-pill.active {
          border-color: rgba(255, 255, 255, 0.95);
          background: linear-gradient(105deg, #1a1a1a 0%, #3a3a3a 50%, #5a5a5a 100%);
          color: #ffffff;
          box-shadow: 0 0 14px rgba(255, 255, 255, 0.15);
        }

        /* 4. Solid & Ghost Buttons in Vesper liquid-glass language */
        .vesper-btn-solid {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 18px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          background: linear-gradient(180deg, #ffffff 0%, #e7e7e7 48%, #cfcfcf 100%);
          color: #111111;
          border: 1px solid #ffffff;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .vesper-btn-solid::after {
          position: absolute;
          inset: 0;
          content: '';
          background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 48%, transparent 76%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
          z-index: 1;
        }
        .vesper-btn-solid:hover::after {
          transform: translateX(130%);
        }
        .vesper-btn-solid:hover {
          background: linear-gradient(180deg, #ffffff 0%, #f3f6ff 42%, #d5def2 100%);
          border-color: #f2f6ff;
          box-shadow: inset 0 1px 0 #ffffff, 0 0 22px rgba(186, 208, 255, 0.35), 0 8px 18px rgba(255, 255, 255, 0.12);
        }

        .vesper-btn-ghost {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 16px;
          border-radius: 6px;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.5) 48%, rgba(160, 175, 200, 0.06));
          color: #ffffff;
          border: 1px solid rgba(198, 198, 198, 0.45);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .vesper-btn-ghost:hover {
          background: linear-gradient(135deg, rgba(210, 225, 255, 0.16), rgba(0, 0, 0, 0.4) 48%, rgba(180, 195, 220, 0.14));
          border-color: rgba(220, 230, 255, 0.75);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 20px rgba(170, 200, 255, 0.22);
        }

        /* 5. Liquid-metal input styling */
        .vesper-input {
          background: rgba(10, 10, 10, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #ffffff;
          border-radius: 8px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .vesper-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.65);
          background: rgba(18, 18, 18, 0.95);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.12);
        }

        /* 6. Liquid-glass card container */
        .vesper-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(12, 12, 12, 0.85) 50%, rgba(0, 0, 0, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        /* 7. Burger button for mobile */
        .vesper-burger {
          display: none;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(8, 8, 8, 0.65);
          cursor: pointer;
        }
        .vesper-burger-bar {
          width: 16px;
          height: 1.5px;
          background: #ffffff;
          border-radius: 1px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        body.menu-open .vesper-burger-bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        body.menu-open .vesper-burger-bar:nth-child(2) {
          opacity: 0;
        }
        body.menu-open .vesper-burger-bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        @media (max-width: 900px) {
          .vesper-desktop-nav {
            display: none !important;
          }
          .vesper-burger {
            display: grid !important;
          }
          .vesper-mobile-menu {
            display: flex;
            flex-direction: column;
            position: fixed;
            inset: 0;
            z-index: 90;
            background: rgba(5, 5, 5, 0.92);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            padding: 96px 24px 32px;
            gap: 12px;
          }
        }
      `}</style>

      {/* Layer 1: Grain at z-index 100 */}
      <div className="vesper-grain" aria-hidden="true" />

      {/* Layer 2: Hero photo video background */}
      <div className="vesper-hero-bg">
        <video
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Layer 3: Unauthenticated Vesper Header */}
      <header className="relative z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2.5 text-left group cursor-pointer"
          aria-label="Student Transit AI Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
              </g>
            </svg>
          </div>
          <span className="font-semibold text-[15.5px] tracking-tight text-white">
            Student Transit<span className="text-gray-400 font-normal">.ai</span>
          </span>
        </button>

        {/* Center: Liquid-metal Navigation Pills */}
        <nav className="vesper-desktop-nav flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className={`vesper-nav-pill ${activePath === '/' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className={`vesper-nav-pill ${activePath === '/login' ? 'active' : ''}`}
          >
            Student Login
          </button>
          <button
            onClick={() => onNavigate('/signup')}
            className={`vesper-nav-pill ${activePath === '/signup' ? 'active' : ''}`}
          >
            Create Account
          </button>
          <button
            onClick={() => onNavigate('/admin/login')}
            className={`vesper-nav-pill ${activePath === '/admin/login' ? 'active' : ''}`}
          >
            Admin Portal
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          {activePath === '/login' ? (
            <button
              onClick={() => onNavigate('/signup')}
              className="vesper-btn-solid text-xs"
            >
              Sign Up Free
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/login')}
              className="vesper-btn-solid text-xs"
            >
              Sign In
            </button>
          )}

          {/* Mobile burger toggle */}
          <button
            type="button"
            className="vesper-burger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="flex flex-col items-center justify-center gap-[5px] w-4 h-4">
              <span className="vesper-burger-bar" />
              <span className="vesper-burger-bar" />
              <span className="vesper-burger-bar" />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="vesper-mobile-menu">
          <button
            onClick={() => {
              onNavigate('/');
              setIsMenuOpen(false);
            }}
            className={`vesper-nav-pill w-full h-12 text-base ${activePath === '/' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              onNavigate('/login');
              setIsMenuOpen(false);
            }}
            className={`vesper-nav-pill w-full h-12 text-base ${activePath === '/login' ? 'active' : ''}`}
          >
            Student Login
          </button>
          <button
            onClick={() => {
              onNavigate('/signup');
              setIsMenuOpen(false);
            }}
            className={`vesper-nav-pill w-full h-12 text-base ${activePath === '/signup' ? 'active' : ''}`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              onNavigate('/admin/login');
              setIsMenuOpen(false);
            }}
            className={`vesper-nav-pill w-full h-12 text-base ${activePath === '/admin/login' ? 'active' : ''}`}
          >
            Admin Portal
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        {children}
      </main>

      {/* Footer Minimal Stats/Copyright */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Joy University Operational Transit Infrastructure</span>
        </div>
        <p>© 2026 Student Transit AI • Verified Timetable System</p>
      </footer>
    </div>
  );
};
