import React from 'react';
import { HlsBackground } from '../background/HlsBackground';

interface BlackHoleCanvasProps {
  interactive?: boolean;
  intensity?: 'high' | 'subtle';
  className?: string;
}

export const BlackHoleCanvas: React.FC<BlackHoleCanvasProps> = ({
  className = '',
}) => {
  return <HlsBackground className={className} />;
};
