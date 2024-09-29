import React, { useEffect, useRef, useState } from "react";

type LoadingBarProps = {
  duration: number; // Duration in seconds
  onComplete?: () => void; // Optional callback when loading completes
};

type Step = {
  targetWidth: number; // in percentage
  duration: number; // in milliseconds
};

/**
 * Generates a sequence of steps for the loading bar.
 * Ensures that targetWidth never decreases.
 *
 * @param totalDuration - Total duration in seconds
 * @param totalSteps - Total number of steps
 * @param pauseSteps - Number of steps that are pauses
 * @returns An array of steps
 */
const generateSteps = (
  totalDuration: number,
  totalSteps: number,
  pauseSteps: number,
): Step[] => {
  const steps: Step[] = [];
  const progressSteps = totalSteps - pauseSteps;

  const progressPerStep = 100 / progressSteps;
  const pauseDuration = 200; // 200ms per pause
  const totalPauseDuration = pauseSteps * pauseDuration;
  const progressDuration =
    (totalDuration * 1000 - totalPauseDuration) / progressSteps;

  let currentWidth = 0;
  let stepsSinceLastPause = 0;
  const stepsPerPause = Math.floor(progressSteps / pauseSteps) || 1; // Prevent division by zero

  for (let i = 0; i < totalSteps; i++) {
    if (
      pauseSteps > 0 &&
      stepsSinceLastPause >= stepsPerPause &&
      pauseSteps > 0
    ) {
      // Insert a pause step
      steps.push({
        targetWidth: currentWidth,
        duration: pauseDuration,
      });
      stepsSinceLastPause = 0;
      pauseSteps--;
    } else {
      // Insert a progress step
      currentWidth += progressPerStep;
      currentWidth = Math.min(currentWidth, 100); // Ensure it doesn't exceed 100%
      steps.push({
        targetWidth: currentWidth,
        duration: progressDuration,
      });
      stepsSinceLastPause++;
    }
  }

  return steps;
};

const LoadingBar: React.FC<LoadingBarProps> = ({ duration, onComplete }) => {
  const [width, setWidth] = useState<number>(0);
  const [transitionDuration, setTransitionDuration] = useState<string>("0ms");
  const isMounted = useRef<boolean>(true);
  const widthRef = useRef<number>(0); // Ref to track current width

  useEffect(() => {
    isMounted.current = true;

    const totalSteps = 20; // Total number of steps
    const pauseSteps = 4; // Number of pause steps
    const steps = generateSteps(duration, totalSteps, pauseSteps);

    const runSteps = async () => {
      for (const step of steps) {
        if (!isMounted.current) break;

        if (step.targetWidth > widthRef.current) {
          // Progress step
          setTransitionDuration(`${step.duration}ms`);
          widthRef.current = step.targetWidth; // Update ref first
          setWidth(step.targetWidth);
        } else {
          // Pause step
          setTransitionDuration("0ms");
          setWidth(step.targetWidth); // Remains the same
          // No need to update ref as width remains the same
        }

        await new Promise((resolve) => setTimeout(resolve, step.duration));
      }

      if (isMounted.current && onComplete) {
        onComplete();
      }
    };

    runSteps();

    // Cleanup on unmount
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onComplete]);

  return (
    <div className="relative w-full overflow-hidden rounded-full bg-gray-300 shadow-inner">
      <div
        className="animation-pulsate h-6 rounded-full bg-green-500"
        style={{
          width: `${width}%`,
          transition: `width ${transitionDuration} ease`,
        }}
      ></div>
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full transform text-sm text-gray-700">
        {Math.round(width)}%
      </span>
    </div>
  );
};

export default LoadingBar;
