import { useState, useEffect, useRef } from "react";

const useOnScreen = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible] as const;
};

export default useOnScreen;
