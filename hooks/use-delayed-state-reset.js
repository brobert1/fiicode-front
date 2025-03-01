import { useEffect } from "react";

const useDelayedStateReset = (condition, delay, resetFn) => {
  useEffect(() => {
    if (condition) {
      const timer = setTimeout(() => resetFn(false), delay);
      return () => clearTimeout(timer);
    }
  }, [condition, delay, resetFn]);
};

export default useDelayedStateReset;
