import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

const useDeepCompareEffect = (
  callback: () => void,
  dependencies: unknown[]
) => {
  const prevDependenciesRef = useRef<unknown[]>(dependencies);

  useEffect(() => {
    if (!isEqual(prevDependenciesRef.current, dependencies)) {
      prevDependenciesRef.current = dependencies;
      callback();
    }
  }, [dependencies, callback]);
};

export default useDeepCompareEffect;
