import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HlsBackgroundProps {
  className?: string;
  overlayOpacity?: string;
  showControls?: boolean;
}

export const HlsBackground: React.FC<HlsBackgroundProps> = ({
  className = '',
  overlayOpacity = 'bg-black/30',
  showControls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const HLS_SOURCE = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStreamLoaded(true);
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              setStreamError(true);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS support (Safari on iOS / macOS)
      video.src = HLS_SOURCE;
      video.addEventListener('loadedmetadata', () => {
        setStreamLoaded(true);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setStreamError(true);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[hsl(var(--bg))] ${className}`}
      aria-hidden="true"
    >
      {/* Background Video Element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover opacity-90 transition-opacity duration-700"
      />

      {/* Dark overlay: bg-black/20 or bg-black/30 */}
      <div className={`absolute inset-0 ${overlayOpacity} pointer-events-none`} />

      {/* Subtle halftone/grain effect for cinematic depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Bottom fade: h-48 bg-gradient-to-t from-bg to-transparent */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg))/80] to-transparent pointer-events-none" />

      {/* Top ambient fade for navbar clarity */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[hsl(var(--bg))/70] to-transparent pointer-events-none" />
    </div>
  );
};
