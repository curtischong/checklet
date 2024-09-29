// src/components/LoadingBar.tsx

import React, { useEffect, useRef, useState } from "react";

type LoadingBarProps = {
  duration: number; // Duration in seconds
  onComplete?: () => void; // Optional callback when loading completes
};

const LoadingBar: React.FC<LoadingBarProps> = ({ duration, onComplete }) => {
  const [width, setWidth] = useState<number>(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  // Easing function: easeInOutCubic
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      setWidth(easedProgress * 100);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        cancelAnimationFrame(requestRef.current!);
        if (onComplete) onComplete();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [duration, onComplete]);

  return (
    <div className="w-full overflow-hidden rounded-full bg-gray-300 shadow-inner">
      <div
        className="animation-pulsate h-6 rounded-full bg-green-500 transition-none"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default LoadingBar;
