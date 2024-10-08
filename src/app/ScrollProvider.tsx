"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// Define the shape of the context
interface ScrollContextType {
  scrollPositionRef: React.MutableRefObject<number>;
}

// Create the context with a default value
const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

// ScrollProvider component
export const ScrollProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const scrollPositionRef = useRef<number>(0);

  const handleScroll = () => {
    scrollPositionRef.current = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollPositionRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

// Custom hook to use the scroll context
export const useScroll = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};
