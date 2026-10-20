import { useCallback, useEffect, useRef } from "react";

export const useDeferredOpen = (setOpen: (open: boolean) => void) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const setOpenRef = useRef(setOpen);

  useEffect(() => {
    setOpenRef.current = setOpen;
  });

  useEffect(() => () => clearTimeout(timer.current), []);

  return useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenRef.current(true));
  }, []);
};
