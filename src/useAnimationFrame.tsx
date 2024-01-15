import { useEffect, useRef } from "react";

export const useAnimationFrame = (callback: (time: number) => void) => {
  // Use useRef for mutable variables that you want to persist
  // without triggering a re-render on their change.
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the animation frame.
  useEffect(() => {
    const loop = (time: number) => {
      frameRef.current = requestAnimationFrame(loop);
      const cb = callbackRef.current;
      cb(time);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current ?? 0);
  }, []);
};
