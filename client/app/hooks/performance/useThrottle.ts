import { useState, useEffect } from "react";

const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setThrottledValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return throttledValue;
};

export default useThrottle;
