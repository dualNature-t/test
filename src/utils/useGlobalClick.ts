import { useEffect } from "react";

const useGlobalClick = (fn: () => void) => {
  useEffect(() => {
    window.addEventListener("click", fn, false);

    return () => {
      window.removeEventListener("click", fn, false);
    };
  }, []);
};

export default useGlobalClick;
