import React, { useRef, useEffect } from 'react';

interface HeroVideoBackgroundProps {
  className?: string;
  videoUrl?: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  className = '',
  videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser until user gesture
      });
    }
  }, []);

  return (
    <div className={`hero-photo ${className}`} aria-hidden="true">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};
