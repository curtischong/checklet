import React, { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  duration: number; // Duration in seconds
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration }) => {
  const [progress, setProgress] = useState(0); // Progress from 0 to 1
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }
    const elapsed = (currentTime - startTimeRef.current) / 1000; // Convert to seconds

    if (elapsed < duration) {
      // Calculate progress using square root function
      const newProgress = Math.sqrt(elapsed / duration);
      setProgress(newProgress);

      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(1); // Ensure it completes
    }
  };

  useEffect(() => {
    // Start the animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when duration changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]); // Re-run if duration changes

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-300">
      <div
        className="h-full bg-green-500"
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
