import { useEffect } from "react";

const useConsoleLog = <T>(label: string, value: T) => {
  useEffect(() => {
    console.log(`Debugging => ${label}:`, value);
  }, [value, label]);
};

export default useConsoleLog;
