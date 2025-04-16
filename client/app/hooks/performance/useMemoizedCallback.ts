import { useCallback, useRef } from "react";

const useMemoizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  dependencies: unknown[]
) => {
  const callbackRef = useRef(callback);

  useCallback(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  return useCallback(
    (...args: Parameters<T>) => callbackRef.current(...args),
    [callbackRef]
  );
};

export default useMemoizedCallback;
