import { useEffect, useRef } from "react";

const useTimeout = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const timer = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(timer);
  }, [delay]);
};

export default useTimeout;
