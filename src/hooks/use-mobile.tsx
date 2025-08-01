
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Ensure this code only runs on the client
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const onChange = () => {
      // Directly check window.innerWidth inside the event handler
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    onChange(); // Call once to set the initial state

    // Add listener
    mql.addEventListener("change", onChange);

    // Cleanup listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Return undefined during SSR or before client-side check completes
  return isMobile;
}
