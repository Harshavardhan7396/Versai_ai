import React, { useEffect, useRef } from 'react';

interface VesperPostLoginBackgroundProps {
  className?: string;
}

export const VesperPostLoginBackground: React.FC<VesperPostLoginBackgroundProps> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Check prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- LAYER 2 & 4: STARS & SLOW PARTICLES ---
    const starCount = window.innerWidth < 768 ? 40 : 90;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // --- LAYER 5: GLOWING TRANSPORTATION NETWORK NODES & CONDUITS ---
    // College -> City -> Region -> State -> Railway -> Destination
    const getNodes = () => {
      const cx = width * 0.5;
      const cy = height * 0.45;
      return [
        { id: 'college', label: 'COLLEGE (JOY UNIV)', x: cx - width * 0.28, y: cy - height * 0.15, color: '#a855f7' },
        { id: 'city', label: 'CITY (NAGERCOIL)', x: cx - width * 0.1, y: cy - height * 0.22, color: '#38bdf8' },
        { id: 'region', label: 'REGION (VALLIOOR)', x: cx + width * 0.12, y: cy - height * 0.18, color: '#6366f1' },
        { id: 'state', label: 'STATE EXPRESS (TN)', x: cx + width * 0.3, y: cy - height * 0.08, color: '#10b981' },
        { id: 'railway', label: 'RAILWAY (NCJ/CAPE)', x: cx - width * 0.05, y: cy + height * 0.12, color: '#06b6d4' },
        { id: 'dest', label: 'DESTINATIONS', x: cx + width * 0.22, y: cy + height * 0.18, color: '#ec4899' },
      ];
    };

    let nodes = getNodes();

    // Route connections
    const connections = [
      { from: 0, to: 1, type: 'bus' },
      { from: 1, to: 2, type: 'bus' },
      { from: 2, to: 3, type: 'state' },
      { from: 0, to: 4, type: 'shuttle' },
      { from: 1, to: 4, type: 'shuttle' },
      { from: 4, to: 5, type: 'train' },
      { from: 3, to: 5, type: 'state' },
    ];

    // Pulses traveling along routes
    const pulses = connections.map((conn, idx) => ({
      connection: conn,
      progress: (idx * 0.18) % 1,
      speed: 0.003 + (idx % 3) * 0.0015,
      size: 3 + (idx % 2),
    }));

    // --- LAYER 6: 3D-STYLE FUTURISTIC MOVING VEHICLES ---
    const vehicles = [
      {
        id: 'bus-1',
        type: 'bus',
        label: 'BUS 15 EXP',
        pathIndex: 0,
        progress: 0.1,
        speed: 0.0018,
        color: '#a855f7',
      },
      {
        id: 'bus-2',
        type: 'bus',
        label: 'BUS 38K',
        pathIndex: 1,
        progress: 0.6,
        speed: 0.0022,
        color: '#6366f1',
      },
      {
        id: 'train-1',
        type: 'train',
        label: 'CAPE EXP',
        pathIndex: 5,
        progress: 0.35,
        speed: 0.0035,
        color: '#38bdf8',
      },
      {
        id: 'shuttle-1',
        type: 'shuttle',
        label: 'CAMPUS SHUTTLE',
        pathIndex: 3,
        progress: 0.8,
        speed: 0.002,
        color: '#ec4899',
      },
    ];

    // --- LAYER 7: DISTANT BLACK-HOLE ENERGY CORE ---
    let blackHoleAngle = 0;
    const coreParticles = Array.from({ length: 45 }, () => ({
      dist: Math.random() * 110 + 60,
      angle: Math.random() * Math.PI * 2,
      speed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? '#a855f7' : '#38bdf8',
      alpha: Math.random() * 0.7 + 0.3,
    }));

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: Deep black/dark-violet environment ---
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#04020a');
      bgGrad.addColorStop(0.4, '#080314');
      bgGrad.addColorStop(0.75, '#0b041a');
      bgGrad.addColorStop(1, '#030107');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 3: Purple atmospheric volumetric fog ---
      const fog1 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.25,
        20,
        width * 0.75,
        height * 0.25,
        width * 0.55
      );
      fog1.addColorStop(0, 'rgba(147, 51, 234, 0.16)');
      fog1.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      fog1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fog1;
      ctx.fillRect(0, 0, width, height);

      const fog2 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.7,
        10,
        width * 0.2,
        height * 0.7,
        width * 0.45
      );
      fog2.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
      fog2.addColorStop(0.6, 'rgba(56, 189, 248, 0.05)');
      fog2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fog2;
      ctx.fillRect(0, 0, width, height);

      // --- LAYER 7: DISTANT BLACK-HOLE ENERGY CORE (Placed in distant top-right depth) ---
      const bhX = width * 0.78;
      const bhY = height * 0.22;
      const bhRadius = Math.min(width, height) * 0.075;

      if (!prefersReducedMotion) {
        blackHoleAngle += 0.003;
      }

      // Gravitational lensing soft glow
      const lensGlow = ctx.createRadialGradient(bhX, bhY, bhRadius * 0.6, bhX, bhY, bhRadius * 3.5);
      lensGlow.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
      lensGlow.addColorStop(0.35, 'rgba(99, 102, 241, 0.18)');
      lensGlow.addColorStop(0.7, 'rgba(56, 189, 248, 0.06)');
      lensGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lensGlow;
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Accretion Ring (Tilted ellipse)
      ctx.save();
      ctx.translate(bhX, bhY);
      ctx.rotate(blackHoleAngle * 0.8 + 0.4);

      // Outer violet accretion ring
      ctx.beginPath();
      ctx.ellipse(0, 0, bhRadius * 2.2, bhRadius * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Inner electric-blue photon ring
      ctx.beginPath();
      ctx.ellipse(0, 0, bhRadius * 1.5, bhRadius * 0.48, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.stroke();

      ctx.restore();

      // Dark Event Horizon Central Core
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#010003';
      ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Orbiting energy particles around core
      coreParticles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.angle += p.speed;
        }
        const px = bhX + Math.cos(p.angle) * p.dist * 0.9;
        const py = bhY + Math.sin(p.angle) * p.dist * 0.35;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // --- LAYER 2 & 4: STARS & COSMIC PARTICLES ---
      stars.forEach((star) => {
        if (!prefersReducedMotion) {
          star.x += star.speedX;
          star.y += star.speedY;
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;
        }

        const opacity = star.opacity + Math.sin(time * 2 + star.pulseOffset) * 0.2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 220, 255, ${Math.max(0.1, Math.min(0.9, opacity))})`;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = star.size > 1.2 ? 4 : 0;
        ctx.fill();
      });

      // Recalculate nodes on scale
      nodes = getNodes();

      // --- LAYER 5: GLOWING TRANSPORTATION NETWORK ---
      // Draw route conduit lines
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        if (!fromNode || !toNode) return;

        // Base line glow
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle =
          conn.type === 'train'
            ? 'rgba(56, 189, 248, 0.25)'
            : conn.type === 'state'
            ? 'rgba(16, 185, 129, 0.22)'
            : 'rgba(168, 85, 247, 0.28)';
        ctx.lineWidth = conn.type === 'train' ? 2.5 : 1.8;
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Dashed railway ties if train route
        if (conn.type === 'train') {
          ctx.save();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.stroke();
          ctx.restore();
        }
      });

      // Draw moving pulses along routes
      pulses.forEach((pulse) => {
        if (!prefersReducedMotion) {
          pulse.progress = (pulse.progress + pulse.speed) % 1;
        }
        const fromNode = nodes[pulse.connection.from];
        const toNode = nodes[pulse.connection.to];
        if (!fromNode || !toNode) return;

        const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = pulse.connection.type === 'train' ? '#38bdf8' : '#c084fc';
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      // --- LAYER 6: MOVING 3D FUTURISTIC TRANSPORT VEHICLES ---
      vehicles.forEach((veh) => {
        if (!prefersReducedMotion) {
          veh.progress = (veh.progress + veh.speed) % 1;
        }
        const conn = connections[veh.pathIndex];
        if (!conn) return;
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        if (!fromNode || !toNode) return;

        const vx = fromNode.x + (toNode.x - fromNode.x) * veh.progress;
        const vy = fromNode.y + (toNode.y - fromNode.y) * veh.progress;
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);

        ctx.save();
        ctx.translate(vx, vy);
        ctx.rotate(angle);

        if (veh.type === 'train') {
          // Futuristic bullet train shape
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(-16, -5, 32, 10, 4);
          ctx.fill();
          ctx.stroke();

          // Train light streak
          ctx.fillStyle = '#e0f2fe';
          ctx.fillRect(10, -2, 5, 4);
          // Red taillight
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-15, -2, 3, 4);
        } else {
          // Futuristic electric bus/shuttle shape
          ctx.fillStyle = '#1e1b4b';
          ctx.strokeStyle = veh.color;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = veh.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(-12, -6, 24, 12, 3);
          ctx.fill();
          ctx.stroke();

          // Headlights
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(8, -4, 4, 3);
          ctx.fillRect(8, 1, 4, 3);
          // Taillights
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(-12, -4, 2, 3);
          ctx.fillRect(-12, 1, 2, 3);
        }

        ctx.restore();
      });

      // Draw Transportation Network Nodes
      nodes.forEach((node) => {
        // Outer pulsing ring
        const ringPulse = Math.sin(time * 3 + node.x) * 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Node center core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label pill (hidden on small viewports for cleanliness)
        if (width > 900) {
          ctx.font = '9px "Space Grotesk", sans-serif';
          ctx.fillStyle = 'rgba(216, 180, 254, 0.75)';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + 20);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#04020a] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Soft Vignette Overlay ensuring UI contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#04020a]/35 to-[#04020a]/85 pointer-events-none" />
    </div>
  );
};
