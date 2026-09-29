import React, { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onGetStarted?: () => void;
  onExploreTransport?: () => void;
  onLoginClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreTransport,
  onLoginClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force black immediately
    document.documentElement.style.background = '#000000';
    document.body.style.background = '#000000';
    document.body.style.color = '#ffffff';

    const container = containerRef.current;
    if (!container) return;

    // 1. Each .appear element adds .is-in on its own animationend
    const appearEls = container.querySelectorAll('.appear, .hero-photo');
    appearEls.forEach((el) => {
      el.addEventListener(
        'animationend',
        () => {
          el.classList.add('is-in');
        },
        { once: true }
      );
    });

    // 2. JS fallback: after two rAFs, if getAnimations() has nothing running, force .is-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let hasRunningAnimation = false;
        appearEls.forEach((el) => {
          if (typeof el.getAnimations === 'function') {
            const anims = el.getAnimations();
            if (anims.some((a) => a.playState === 'running' || a.playState === 'finished')) {
              hasRunningAnimation = true;
            }
          }
        });

        if (!hasRunningAnimation) {
          appearEls.forEach((el) => el.classList.add('is-in'));
        }
      });
    });

    // 4. Escape closes menu
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 5. Resize to ≥901px closes menu
    const handleResize = () => {
      if (window.innerWidth >= 901) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update body.menu-open class
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

  const handleStartAction = (e: React.MouseEvent) => {
    if (onGetStarted) {
      e.preventDefault();
      onGetStarted();
    }
  };

  const handleDemoAction = (e: React.MouseEvent) => {
    if (onExploreTransport) {
      e.preventDefault();
      onExploreTransport();
    }
  };

  const handleNavClick = (tab: string) => {
    setIsMenuOpen(false);
    if (onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <div ref={containerRef} className="vesper-root">
      <style>{`
        /* Forced black and reset */
        html, body {
          background: #000000 !important;
          color: #ffffff;
        }
        html, body {
          background: #000000;
          background: var(--bg, #000000);
          color: #ffffff;
          color: var(--text, #ffffff);
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
          position: relative;
        }
        html {
          scroll-behavior: smooth;
        }
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        button {
          font-family: inherit;
        }

        /* Default Tokens (~1440px) */
        :root {
          --bg: #000000;
          --text: #ffffff;
          --muted: #9a9a9a;
          --stat: #d8d8d8;
          --border: rgba(255, 255, 255, 0.16);
          --border-soft: rgba(255, 255, 255, 0.12);

          --logo: 15.5px;
          --logo-mark: 22px;
          --nav: 14px;
          --nav-h: 40px;
          --btn: 13.5px;
          --btn-h: 40px;
          --hero-btn-h: 42px;
          --h1: 48px;
          --lede: 15.5px;
          --badge: 12.5px;
          --stat-size: 13.5px;
          --header-y: 22px;
          --header-x: 40px;
          --stats-x: 72px;
          --stats-y: 36px;
          --hero-gap: 85px;
          --copy-max: 860px;
          --lede-max: 470px;
        }

        .vesper-root {
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
        }

        /* 1. Grain at z-index: 100 */
        .grain {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.038'/%3E%3C/svg%3E");
          opacity: 0.55;
        }

        /* 2. Hero photo (video background) at 100% opacity no overlay + scrim */
        .hero-photo {
          position: fixed;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .hero-photo video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 1;
          display: block;
        }
        .hero-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.55) 100%);
        }

        /* 3. Page layout */
        .page {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: auto 1fr auto;
          min-height: 100vh;
          min-height: 100dvh;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        /* Header (3-column grid) */
        header.header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: var(--header-y) var(--header-x) 10px;
          z-index: 50;
          position: relative;
        }

        /* Left: Logo */
        a.logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          justify-self: start;
          font-size: var(--logo);
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #ffffff;
          cursor: pointer;
        }
        a.logo svg {
          width: var(--logo-mark);
          height: var(--logo-mark);
          flex-shrink: 0;
        }
        .logo-suffix {
          font-weight: 400;
          color: #ffffff;
        }

        /* Center: Nav - Liquid metal pills */
        #site-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-self: center;
        }
        .nav-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: var(--nav-h);
          padding: 0 18px;
          border-radius: 7px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(198, 198, 198, 0.55);
          background: linear-gradient(105deg, #050505 0%, #2a2a2a 48%, #4a4a4a 100%);
          color: #f3f3f3;
          font-size: var(--nav);
          font-weight: 400;
          letter-spacing: -0.01em;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .nav-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.16) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }
        .nav-pill:hover::before {
          transform: translateX(120%);
        }
        .nav-pill:hover {
          border-color: rgba(235, 235, 235, 0.9);
          background: linear-gradient(105deg, #111111 0%, #3a3a3a 45%, #6a6a6a 100%);
          box-shadow: 0 0 18px rgba(200, 210, 230, 0.18);
        }

        /* Right: Header CTA */
        .header-cta {
          justify-self: end;
        }

        /* Burger button */
        .burger {
          display: none;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: rgba(8, 8, 8, 0.55);
          z-index: 60;
          cursor: pointer;
          padding: 0;
          justify-self: end;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .burger:hover {
          border-color: rgba(255, 255, 255, 0.32);
          background: rgba(255, 255, 255, 0.05);
        }
        .burger-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 16px;
          height: 16px;
        }
        .burger-bar {
          width: 16px;
          height: 1.5px;
          background: #ffffff;
          border-radius: 1px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        body.menu-open .burger-bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        body.menu-open .burger-bar:nth-child(2) {
          opacity: 0;
        }
        body.menu-open .burger-bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Full-screen Menu Backdrop on phone */
        .menu-backdrop {
          display: none;
        }

        /* Buttons (shared liquid-glass language) */
        .btn {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: var(--btn-h);
          padding: 0 16px;
          border-radius: 6px;
          font-size: var(--btn);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease, filter 0.35s ease;
        }
        .btn::after {
          position: absolute;
          inset: 0;
          content: '';
          background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 48%, transparent 76%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
          z-index: 1;
        }
        .btn:hover::after {
          transform: translateX(130%);
        }

        /* Solid button */
        .btn-solid {
          background: linear-gradient(180deg, #ffffff 0%, #e7e7e7 48%, #cfcfcf 100%);
          color: #111111;
          border: 1px solid #ffffff;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }
        .btn-solid:hover {
          background: linear-gradient(180deg, #ffffff 0%, #f3f6ff 42%, #d5def2 100%);
          border-color: #f2f6ff;
          box-shadow: inset 0 1px 0 #ffffff, 0 0 22px rgba(186, 208, 255, 0.35), 0 8px 18px rgba(255, 255, 255, 0.12);
        }

        /* Hero solid hover glow is slightly stronger */
        .hero-actions .btn-solid:hover {
          box-shadow: inset 0 1px 0 #ffffff, 0 0 26px rgba(186, 208, 255, 0.4), 0 8px 18px rgba(255, 255, 255, 0.14);
        }

        /* Ghost button (header-level) */
        .btn-ghost {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.45) 50%, rgba(160, 175, 200, 0.08));
          color: #ffffff;
          border: 1px solid rgba(198, 198, 198, 0.45);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
        .btn-ghost:hover {
          background: linear-gradient(135deg, rgba(210, 225, 255, 0.18), rgba(0, 0, 0, 0.35) 48%, rgba(180, 195, 220, 0.16));
          border-color: rgba(220, 230, 255, 0.75);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 20px rgba(170, 200, 255, 0.22);
        }

        /* Hero Ghost (stronger frost) */
        .hero-actions .btn-ghost {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.5) 46%, rgba(150, 170, 200, 0.1));
          border: 1px solid rgba(198, 198, 198, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .hero-actions .btn-ghost:hover {
          box-shadow: 0 0 24px rgba(170, 200, 255, 0.28);
          border-color: rgba(220, 230, 255, 0.8);
        }

        .hero-actions .btn {
          height: var(--hero-btn-h);
          padding: 0 18px;
        }

        /* Hero (bottom-centered, NOT vertically centered) */
        main.hero {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 8px 24px var(--hero-gap);
          min-height: 0;
        }
        .hero-copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: var(--copy-max);
          width: 100%;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 9px 15px;
          border: 0;
          border-radius: 5px;
          background: linear-gradient(90deg, #7d7d7d 0%, #2a2a2a 52%, #0a0a0a 100%);
          color: #f2f2f2;
          font-size: var(--badge);
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .badge-star {
          width: 18px;
          height: 20px;
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.45));
          animation: in-star 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both;
        }

        /* H1 */
        .hero-h1 {
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: var(--h1);
          font-weight: 500;
          letter-spacing: -0.045em;
          line-height: 1.12;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .headline-line {
          display: block;
          overflow: hidden;
          padding: 0.06em 0.15em 0.14em;
        }
        .hero-h1 em {
          font-family: "Instrument Serif", "Times New Roman", Times, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.08em;
          letter-spacing: -0.03em;
          color: #9a9a9a;
          animation: in-em 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both;
        }

        /* Lede */
        .lede {
          max-width: var(--lede-max);
          margin-top: 18px;
          color: var(--muted);
          font-size: var(--lede);
          font-weight: 400;
          line-height: 1.55;
          letter-spacing: -0.015em;
        }

        /* Actions */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 26px;
        }

        /* Stats Footer */
        footer.stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 0 var(--stats-x) var(--stats-y);
          padding-bottom: max(var(--stats-y), env(safe-area-inset-bottom));
          color: var(--stat);
        }
        .stat {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-size: var(--stat-size);
          letter-spacing: -0.015em;
          white-space: nowrap;
        }
        .stat svg {
          color: #e8e8e8;
          flex-shrink: 0;
        }
        .stat-icon-wide {
          width: 38px;
          height: 21px;
        }

        /* ========================================================================= */
        /* ENTRANCE MOTION (EXACT)                                                   */
        /* ========================================================================= */
        .appear {
          opacity: 1;
          animation-duration: 1.05s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-delay: var(--d, 0.08s);
        }

        .appear--scale {
          animation-name: in-scale;
        }
        .appear--soft {
          animation-name: in-soft;
        }
        .appear--mask {
          animation-name: in-mask;
        }
        .appear--pop {
          animation-name: in-pop;
        }
        .appear--btn {
          animation-name: in-btn;
        }
        .appear--side {
          animation-name: in-side;
        }
        .appear--stat {
          animation-name: in-stat;
        }

        @keyframes in-scale {
          0% {
            opacity: 0;
            transform: scale(0.84);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes in-soft {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes in-mask {
          0% {
            opacity: 0;
            transform: translateY(40%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes in-pop {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          70% {
            opacity: 1;
            transform: scale(1.03);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes in-btn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.94);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes in-side {
          0% {
            opacity: 0;
            transform: translateX(22px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes in-stat {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes in-star {
          0% {
            transform: scale(0.2) rotate(-50deg);
          }
          65% {
            transform: scale(1.2) rotate(8deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes in-em {
          0% {
            opacity: 0.35;
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
          }
        }

        /* Resting .is-in state on animationend */
        .appear.is-in,
        .hero-photo.is-in {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
          filter: none !important;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            transition: none !important;
            animation: none !important;
          }
          .appear,
          .hero-photo,
          .hero h1 em,
          .badge-star {
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
            filter: none !important;
          }
        }

        /* ========================================================================= */
        /* RESPONSIVE BREAKPOINTS (COPY EXACT)                                       */
        /* ========================================================================= */

        /* ≥901px Desktop lock: single-viewport, no scroll */
        @media (min-width: 901px) {
          html, body {
            height: 100%;
            overflow: hidden;
          }
          .page {
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
          }
        }

        /* 901–1279px */
        @media (min-width: 901px) and (max-width: 1279px) {
          :root {
            --logo: 15px;
            --nav: 13px;
            --nav-h: 36px;
            --btn: 13px;
            --btn-h: 38px;
            --hero-btn-h: 40px;
            --h1: 42px;
            --lede: 15px;
            --badge: 12px;
            --stat-size: 12.5px;
            --header-y: 16px;
            --header-x: 28px;
            --stats-x: 36px;
            --stats-y: 28px;
            --hero-gap: 64px;
            --copy-max: 760px;
            --lede-max: 440px;
          }
          .nav-pill {
            padding: 0 14px;
          }
          .badge {
            margin-bottom: 16px;
          }
          .lede {
            margin-top: 14px;
          }
          .hero-actions {
            margin-top: 20px;
          }
        }

        /* 1280–1599px */
        @media (min-width: 1280px) and (max-width: 1599px) {
          :root {
            --h1: 54px;
            --lede: 16px;
            --header-x: 48px;
            --stats-x: 80px;
            --copy-max: 900px;
          }
        }

        /* ≥1600px */
        @media (min-width: 1600px) {
          :root {
            --logo: 17px;
            --logo-mark: 24px;
            --nav: 15px;
            --nav-h: 44px;
            --btn: 15px;
            --btn-h: 44px;
            --hero-btn-h: 48px;
            --h1: 64px;
            --lede: 18px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 28px;
            --header-x: 64px;
            --stats-x: 96px;
            --stats-y: 44px;
            --copy-max: 980px;
            --lede-max: 540px;
          }
          .nav-pill {
            padding: 0 20px;
          }
          .badge {
            margin-bottom: 26px;
          }
          .lede {
            margin-top: 22px;
          }
          .hero-actions {
            margin-top: 30px;
            gap: 12px;
          }
          .stat svg {
            width: 22px;
            height: 22px;
          }
          .stat-icon-wide {
            width: 45px;
            height: 24px;
          }
        }

        /* ≥1920px */
        @media (min-width: 1920px) {
          :root {
            --logo: 18px;
            --logo-mark: 26px;
            --nav: 16px;
            --nav-h: 48px;
            --btn: 16px;
            --btn-h: 48px;
            --hero-btn-h: 52px;
            --h1: 76px;
            --lede: 20px;
            --badge: 14.5px;
            --stat-size: 16px;
            --header-y: 32px;
            --header-x: 80px;
            --stats-x: 120px;
            --stats-y: 52px;
            --copy-max: 1120px;
            --lede-max: 620px;
          }
          #site-nav {
            gap: 10px;
          }
          .nav-pill {
            padding: 0 22px;
          }
          .btn {
            padding: 0 22px;
          }
          .badge {
            padding: 10px 15px;
          }
          .stat-icon-wide {
            width: 48px;
            height: 26px;
          }
        }

        /* ≥2560px */
        @media (min-width: 2560px) {
          :root {
            --h1: 88px;
            --lede: 22px;
            --header-x: 120px;
            --stats-x: 160px;
            --copy-max: 1280px;
            --lede-max: 680px;
          }
        }

        /* ≥901px and max-height 850px */
        @media (min-width: 901px) and (max-height: 850px) {
          :root {
            --header-y: 14px;
            --stats-y: 24px;
            --hero-gap: 48px;
            --h1: 40px;
          }
          .badge {
            margin-bottom: 12px;
          }
          .lede {
            margin-top: 12px;
          }
          .hero-actions {
            margin-top: 16px;
          }
        }

        /* ≥901px and max-height 720px */
        @media (min-width: 901px) and (max-height: 720px) {
          :root {
            --h1: 34px;
            --lede: 14px;
            --hero-gap: 32px;
            --stats-y: 18px;
            --nav-h: 30px;
            --btn-h: 34px;
            --hero-btn-h: 36px;
          }
          .badge {
            margin-bottom: 8px;
          }
        }

        /* ≤900px Phone */
        @media (max-width: 900px) {
          html, body {
            height: auto;
            overflow-y: auto;
          }
          .page {
            height: auto;
            min-height: 100vh;
            min-height: 100dvh;
            overflow: visible;
          }
          header.header {
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            padding: max(16px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) 10px max(18px, env(safe-area-inset-left));
          }
          a.logo,
          .header-cta,
          .burger {
            z-index: 80;
          }
          .burger {
            display: grid;
          }
          #site-nav {
            display: none;
          }

          /* Full-screen menu when open */
          .menu-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 40;
            background: rgba(8, 8, 8, 0.42);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.28s ease, visibility 0.28s ease;
          }
          body.menu-open .menu-backdrop {
            opacity: 1;
            visibility: visible;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }
          body.menu-open #site-nav {
            display: flex;
            flex-direction: column;
            position: fixed;
            inset: 0;
            z-index: 45;
            background: transparent;
            justify-content: flex-start;
            align-items: stretch;
            gap: 12px;
            padding: 96px 22px 32px;
            padding-top: max(96px, calc(env(safe-area-inset-top) + 88px));
          }
          body.menu-open .nav-pill {
            width: 100%;
            height: 56px;
            font-size: 19px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          body.menu-open {
            overflow: hidden;
          }

          main.hero {
            padding: 20px 20px 64px;
            align-items: flex-end;
          }
          .hero-copy {
            max-width: 100%;
          }
          .lede {
            max-width: 100%;
          }

          footer.stats {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            white-space: normal;
            padding: 0 20px 28px;
          }

          :root {
            --logo: 16px;
            --btn: 15px;
            --btn-h: 46px;
            --hero-btn-h: 48px;
            --h1: 36px;
            --lede: 16.5px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 16px;
            --header-x: 18px;
            --stats-x: 20px;
            --stats-y: 28px;
            --hero-gap: 36px;
          }
        }

        /* ≤560px */
        @media (max-width: 560px) {
          :root {
            --h1: 34px;
            --lede: 16px;
            --header-x: 16px;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* Layer 4: Grain at z-index 100 */}
      <div className="grain" aria-hidden="true" />

      {/* Layer 2: Hero photo (video background 100% opacity no overlay) */}
      <div className="hero-photo appear appear--soft" style={{ '--d': '0.04s' } as React.CSSProperties}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Layer 3: Page container (grid-template-rows: auto 1fr auto) */}
      <div className="page">
        {/* Mobile menu backdrop */}
        <div 
          className="menu-backdrop" 
          onClick={() => setIsMenuOpen(false)} 
          aria-hidden="true" 
        />

        {/* Header - 3-column grid */}
        <header className="header">
          {/* Left: Logo */}
          <a
            href="#top"
            className="logo appear appear--scale"
            style={{ '--d': '0.08s' } as React.CSSProperties}
            aria-label="Vesper.ai"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
              </g>
            </svg>
            <span>
              Vesper<span className="logo-suffix">.ai</span>
            </span>
          </a>

          {/* Center: Nav pills */}
          <nav id="site-nav" aria-label="Primary">
            <a
              href="#benefits"
              onClick={() => handleNavClick('benefits')}
              className="nav-pill appear appear--scale"
              style={{ '--d': '0.16s' } as React.CSSProperties}
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              onClick={() => handleNavClick('how-it-works')}
              className="nav-pill appear appear--soft"
              style={{ '--d': '0.28s' } as React.CSSProperties}
            >
              How It Works
            </a>
            <a
              href="#faqs"
              onClick={() => handleNavClick('faqs')}
              className="nav-pill appear appear--scale"
              style={{ '--d': '0.40s' } as React.CSSProperties}
            >
              FAQs
            </a>
            <a
              href="#pricing"
              onClick={() => handleNavClick('pricing')}
              className="nav-pill appear appear--soft"
              style={{ '--d': '0.52s' } as React.CSSProperties}
            >
              Pricing
            </a>
          </nav>

          {/* Right: Header CTA */}
          <a
            href="#start"
            onClick={handleStartAction}
            className="btn btn-solid header-cta appear appear--scale"
            style={{ '--d': '0.34s' } as React.CSSProperties}
          >
            Start for Free
          </a>

          {/* Mobile Burger button */}
          <button
            type="button"
            className="burger appear appear--scale"
            style={{ '--d': '0.34s' } as React.CSSProperties}
            aria-controls="site-nav"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="burger-box">
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </div>
          </button>
        </header>

        {/* Main Hero (bottom-centered, NOT vertically centered) */}
        <main className="hero" id="top">
          <div className="hero-copy">
            {/* Badge */}
            <div
              className="badge appear appear--pop"
              style={{ '--d': '0.22s' } as React.CSSProperties}
            >
              <svg
                className="badge-star"
                width="18"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
              </svg>
              <span>Operational AI Infrastructure</span>
            </div>

            {/* H1 - Two masked lines */}
            <h1 className="hero-h1">
              <span className="headline-line">
                <span
                  className="appear appear--mask"
                  style={{ '--d': '0.42s', display: 'block' } as React.CSSProperties}
                >
                  Train <em>AI agents</em> on your
                </span>
              </span>
              <span className="headline-line">
                <span
                  className="appear appear--mask"
                  style={{ '--d': '0.62s', display: 'block' } as React.CSSProperties}
                >
                  workflows in minutes.
                </span>
              </span>
            </h1>

            {/* Lede */}
            <p
              className="lede appear appear--soft"
              style={{ '--d': '0.82s', animationDuration: '1.25s' } as React.CSSProperties}
            >
              Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business.
            </p>

            {/* Action buttons */}
            <div className="hero-actions">
              <a
                href="#start"
                onClick={handleStartAction}
                className="btn btn-solid appear appear--btn"
                style={{ '--d': '0.96s' } as React.CSSProperties}
              >
                Start for Free
              </a>
              <a
                href="#demo"
                onClick={handleDemoAction}
                className="btn btn-ghost appear appear--side"
                style={{ '--d': '1.10s' } as React.CSSProperties}
              >
                See it in action
              </a>
            </div>
          </div>
        </main>

        {/* Stats footer - exactly 3 stats */}
        <footer className="stats">
          {/* Stat 1: Dual-pill / workflow icon */}
          <div
            className="stat appear appear--stat"
            style={{ '--d': '1.12s' } as React.CSSProperties}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="pillGrad1" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#3a3a3a" stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id="pillGrad2" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.62" />
                </linearGradient>
              </defs>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pillGrad1)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pillGrad2)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
            </svg>
            <span>4.2M+ workflows automated</span>
          </div>

          {/* Stat 2: Download tile */}
          <div
            className="stat appear appear--stat"
            style={{ '--d': '1.28s' } as React.CSSProperties}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path d="M12 7.1v7.4" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" />
              <path d="M8.15 12.35L12 16.2l3.85-3.85" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>92% reduction in manual operations</span>
          </div>

          {/* Stat 3: Three avatars */}
          <div
            className="stat appear appear--stat"
            style={{ '--d': '1.44s' } as React.CSSProperties}
          >
            <svg className="stat-icon-wide" width="38" height="21" viewBox="0 0 40 22" fill="none">
              {/* Avatar 1: Dark with face, ears & eyes */}
              <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
              <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
              <path d="M7.4 6.8L9.2 4.2L10.1 6.8" fill="#2b2b2b" />
              <path d="M13 6.8L11.2 4.2L10.3 6.8" fill="#2b2b2b" />
              <circle cx="8.9" cy="11.8" r="0.7" fill="#1a1a1a" />
              <circle cx="11.5" cy="11.8" r="0.7" fill="#1a1a1a" />

              {/* Avatar 2: White with black eyes, nose, smile */}
              <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
              <circle cx="17.2" cy="9.8" r="1.7" fill="#111111" />
              <circle cx="23.2" cy="9.8" r="1.7" fill="#111111" />
              <ellipse cx="20.2" cy="12.4" rx="1.6" ry="1.1" fill="#111111" />
              <path d="M18.2 14.2c.6 1.2 3.4 1.2 4 0" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" fill="none" />

              {/* Avatar 3: Orange with white 'e' */}
              <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
              <text
                x="30.2"
                y="15.1"
                fontFamily="'Inter', sans-serif"
                fontWeight="700"
                fontSize="12.5"
                fill="#ffffff"
                textAnchor="middle"
              >
                e
              </text>
            </svg>
            <span>180+ operational teams onboarded</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
