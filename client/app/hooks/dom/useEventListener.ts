import { useEffect, useRef } from "react";

function useEventListener<K extends keyof WindowEventMap>(
  eventType: K,
  callback: (event: WindowEventMap[K]) => void,
  element: HTMLElement | Window | Document = window
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!element) return;

    const eventListener = (event: Event) =>
      callbackRef.current(event as WindowEventMap[K]);

    element.addEventListener(eventType, eventListener);
    return () => element.removeEventListener(eventType, eventListener);
  }, [eventType, element]);
}

export default useEventListener;
