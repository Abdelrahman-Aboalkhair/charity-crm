import { useEffect, useRef } from "react";

const useDebugInformation = <T>(componentName: string, props: T) => {
  const previousProps = useRef(props);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    console.log(`[${componentName}] Render #${renderCount.current}`);
    console.log("Previous Props:", previousProps.current);
    console.log("Current Props:", props);

    previousProps.current = props;
  }, [props, componentName]);
};

export default useDebugInformation;
