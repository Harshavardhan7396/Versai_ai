import React, { useEffect, useRef, useState } from 'react';
import { HlsBackground } from '../background/HlsBackground';

export interface AuthenticatedEnvironmentProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
  className?: string;
  showHlsVideo?: boolean;
}

/**
 * AuthenticatedEnvironment Component
 * 
 * Enforces World 2: The Vesper.ai Transportation Command Center
 * 
 * Features:
 * - Strict auth gate: Only renders when isAuthenticated is true
 * - Dark-violet, 3D space environment with multi-layer depth:
 *   1. Deep black / dark-violet cosmic space (#04020a, #080314, #0b041a)
 *   2. Slowly rotating cosmic particles and star dust
 *   3. Atmospheric purple & electric-violet volumetric fog
 *   4. Abstract black-hole energy core with rotating accretion disc, cyan photon ring & orbiting light trails
 *   5. Glowing digital transportation network corridors & moving transit pulses/vehicles
 *   6. Glassmorphism UI contrast grading ensuring all dashboard content remains ultra-crisp
 */
export const AuthenticatedEnvironment: React.FC<AuthenticatedEnvironmentProps> = ({
  isAuthenticated,
  children,
  className = '',
  showHlsVideo = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [motionReduced, setMotionReduced] = useState(false);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setMotionReduced(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setMotionReduced(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // 3D Space Canvas animation with Black Hole Core & Transit Grid
  useEffect(() => {
    if (!isAuthenticated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // --- COSMIC PARTICLES (LAYER 2 & 4) ---
    const particleCount = width < 768 ? 45 : 100;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      size: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      opacity: Math.random() * 0.65 + 0.25,
      pulse: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.5 ? 'rgba(255, 255, 255,' : 'rgba(215, 225, 240,',
    }));

    // --- ABSTRACT BLACK HOLE ENERGY CORE (LAYER 7) ---
    let bhAngle = 0;
    const coreParticlesCount = width < 768 ? 25 : 55;
    const coreParticles = Array.from({ length: coreParticlesCount }, () => ({
      radius: Math.random() * 120 + 65,
      angle: Math.random() * Math.PI * 2,
      orbitSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.2 + 1,
      color: Math.random() > 0.4 ? '#ffffff' : '#d4d4d4',
      alpha: Math.random() * 0.75 + 0.25,
    }));

    // --- GLOWING DIGITAL TRANSPORTATION NETWORK (LAYER 5 & 6) ---
    const getNetworkNodes = () => {
      const cx = width * 0.5;
      const cy = height * 0.48;
      return [
        { id: 'joy_univ', label: 'CAMPUS CORRIDOR', x: cx - width * 0.26, y: cy - height * 0.16, color: '#ffffff' },
        { id: 'city_hub', label: 'CITY TRANSIT HUB', x: cx - width * 0.08, y: cy - height * 0.22, color: '#e5e5e5' },
        { id: 'regional', label: 'REGIONAL EXPRESS', x: cx + width * 0.14, y: cy - height * 0.18, color: '#d4d4d4' },
        { id: 'state_rt', label: 'STATE INTERCITY', x: cx + width * 0.32, y: cy - height * 0.06, color: '#e0e0e0' },
        { id: 'railways', label: 'HIGH-SPEED RAIL', x: cx - width * 0.04, y: cy + height * 0.15, color: '#ffffff' },
        { id: 'aeroterm', label: 'METRO TERMINAL', x: cx + width * 0.24, y: cy + height * 0.2, color: '#cccccc' },
      ];
    };

    let nodes = getNetworkNodes();

    const connections = [
      { from: 0, to: 1, type: 'campus' },
      { from: 1, to: 2, type: 'regional' },
      { from: 2, to: 3, type: 'state' },
      { from: 0, to: 4, type: 'shuttle' },
      { from: 1, to: 4, type: 'rail' },
      { from: 4, to: 5, type: 'rail' },
      { from: 3, to: 5, type: 'state' },
    ];

    const pulses = connections.map((conn, idx) => ({
      connection: conn,
      progress: (idx * 0.2) % 1,
      speed: 0.0025 + (idx % 3) * 0.0012,
      size: 3.5,
    }));

    // Moving futuristic transport vehicles along corridors
    const vehicles = [
      { id: 'v1', type: 'bus', progress: 0.15, speed: 0.0016, pathIndex: 0, color: '#ffffff' },
      { id: 'v2', type: 'bus', progress: 0.65, speed: 0.002, pathIndex: 1, color: '#e5e5e5' },
      { id: 'v3', type: 'train', progress: 0.35, speed: 0.003, pathIndex: 4, color: '#ffffff' },
      { id: 'v4', type: 'train', progress: 0.8, speed: 0.0035, pathIndex: 5, color: '#d4d4d4' },
    ];

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. LAYER 1: Deep obsidian black cosmic gradient (matching login page)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#000000');
      bgGrad.addColorStop(0.5, '#050505');
      bgGrad.addColorStop(1, '#000000');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. LAYER 3: Volumetric Atmospheric Cool-Silver & Starlight Fog
      const fogRadius1 = Math.max(width, height) * 0.45;
      const fog1 = ctx.createRadialGradient(
        width * 0.76,
        height * 0.22,
        40,
        width * 0.76,
        height * 0.22,
        fogRadius1
      );
      fog1.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      fog1.addColorStop(0.4, 'rgba(200, 215, 235, 0.025)');
      fog1.addColorStop(0.8, 'rgba(255, 255, 255, 0.01)');
      fog1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fog1;
      ctx.fillRect(0, 0, width, height);

      const fog2 = ctx.createRadialGradient(
        width * 0.22,
        height * 0.75,
        20,
        width * 0.22,
        height * 0.75,
        width * 0.42
      );
      fog2.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      fog2.addColorStop(0.5, 'rgba(200, 210, 230, 0.015)');
      fog2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fog2;
      ctx.fillRect(0, 0, width, height);

      // 3. LAYER 7: DISTANT ABSTRACT BLACK HOLE ENERGY CORE
      // Anchored gracefully in distant top-right depth so it never collides with UI cards
      const bhX = width * 0.8;
      const bhY = height * 0.2;
      const bhCoreRadius = Math.min(width, height) * 0.065;

      if (!motionReduced) {
        bhAngle += 0.003;
      }

      // Gravitational lensing soft silver glow
      const lensGrad = ctx.createRadialGradient(
        bhX,
        bhY,
        bhCoreRadius * 0.5,
        bhX,
        bhY,
        bhCoreRadius * 3.8
      );
      lensGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      lensGrad.addColorStop(0.3, 'rgba(200, 215, 240, 0.12)');
      lensGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.03)');
      lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhCoreRadius * 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Accretion Disc (Tilted Elliptical Ring)
      ctx.save();
      ctx.translate(bhX, bhY);
      ctx.rotate(bhAngle * 0.7 + 0.45);

      // Outer silver accretion ring
      ctx.beginPath();
      ctx.ellipse(0, 0, bhCoreRadius * 2.3, bhCoreRadius * 0.72, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Secondary glowing orbit ring
      ctx.beginPath();
      ctx.ellipse(0, 0, bhCoreRadius * 1.85, bhCoreRadius * 0.58, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 215, 235, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Inner brilliant white photon ring
      ctx.beginPath();
      ctx.ellipse(0, 0, bhCoreRadius * 1.45, bhCoreRadius * 0.46, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.stroke();

      ctx.restore();

      // Dark Event Horizon Central Core
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhCoreRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 15;
      ctx.fill();

      // Orbiting relativistic particles & light trails
      coreParticles.forEach((p) => {
        if (!motionReduced) {
          p.angle += p.orbitSpeed;
        }
        const px = bhX + Math.cos(p.angle) * p.radius * 0.95;
        const py = bhY + Math.sin(p.angle) * p.radius * 0.36;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. LAYER 2 & 4: SLOW-MOVING COSMIC PARTICLES & STARS
      particles.forEach((p) => {
        if (!motionReduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const alpha = Math.max(
          0.1,
          Math.min(0.9, p.opacity + Math.sin(time * 2 + p.x) * 0.2)
        );
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.hue} ${alpha})`;
        if (p.size > 1.4) {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 4;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      // 5. LAYER 5: GLOWING DIGITAL TRANSPORTATION NETWORK
      nodes = getNetworkNodes();

      // Corridors & Conduits
      connections.forEach((conn) => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        if (!from || !to) return;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle =
          conn.type === 'rail'
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(200, 210, 230, 0.22)';
        ctx.lineWidth = conn.type === 'rail' ? 2 : 1.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Railway dashed markings
        if (conn.type === 'rail') {
          ctx.save();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.stroke();
          ctx.restore();
        }
      });

      // Traveling Energy Pulses
      pulses.forEach((pulse) => {
        if (!motionReduced) {
          pulse.progress = (pulse.progress + pulse.speed) % 1;
        }
        const from = nodes[pulse.connection.from];
        const to = nodes[pulse.connection.to];
        if (!from || !to) return;

        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      // 6. LAYER 6: MOVING 3D FUTURISTIC TRANSPORT VEHICLES
      vehicles.forEach((veh) => {
        if (!motionReduced) {
          veh.progress = (veh.progress + veh.speed) % 1;
        }
        const conn = connections[veh.pathIndex];
        if (!conn) return;
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        if (!from || !to) return;

        const vx = from.x + (to.x - from.x) * veh.progress;
        const vy = from.y + (to.y - from.y) * veh.progress;
        const angle = Math.atan2(to.y - from.y, to.x - from.x);

        ctx.save();
        ctx.translate(vx, vy);
        ctx.rotate(angle);

        if (veh.type === 'train') {
          ctx.fillStyle = '#0a0a0a';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(-16, -5, 32, 10, 4);
          ctx.fill();
          ctx.stroke();

          // Front glow & rear taillight
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(10, -2, 5, 4);
          ctx.fillStyle = '#9ca3af';
          ctx.fillRect(-15, -2, 3, 4);
        } else {
          ctx.fillStyle = '#111111';
          ctx.strokeStyle = '#e5e5e5';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.roundRect(-12, -6, 24, 12, 3);
          ctx.fill();
          ctx.stroke();

          // Bus headlights & taillights
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(8, -4, 4, 3);
          ctx.fillRect(8, 1, 4, 3);
          ctx.fillStyle = '#9ca3af';
          ctx.fillRect(-12, -4, 2, 3);
          ctx.fillRect(-12, 1, 2, 3);
        }

        ctx.restore();
      });

      // Transportation Corridor Node Terminals
      nodes.forEach((node) => {
        const pulseRing = Math.sin(time * 3 + node.x) * 1.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7 + pulseRing, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (width > 960) {
          ctx.font = '9px "Inter", sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + 18);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [isAuthenticated, motionReduced]);

  // STRICT REQUIREMENT: Only displays when isAuthenticated is true
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`min-h-screen relative bg-[#000000] text-white overflow-x-hidden ${className}`}
      data-testid="authenticated-environment"
    >
      {/* Vesper Film Grain Texture (Identical to Login Page) */}
      <div className="vesper-grain" aria-hidden="true" />

      {/* Dynamic 3D Space Background Canvas (Layers 1 to 7) */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Optional Cinematic HLS Video Scrim Layer */}
        {showHlsVideo && (
          <div className="absolute inset-0 mix-blend-screen opacity-20 pointer-events-none">
            <HlsBackground overlayOpacity="bg-transparent" />
          </div>
        )}

        {/* Ambient CSS Volumetric Subtle Glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[130px] pointer-events-none" />

        {/* Soft Vignette Overlay ensuring crisp UI readability for cards, tables and maps */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#000000]/40 to-[#000000]/85 pointer-events-none" />
      </div>

      {/* Layer 8: Glassmorphism UI Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
