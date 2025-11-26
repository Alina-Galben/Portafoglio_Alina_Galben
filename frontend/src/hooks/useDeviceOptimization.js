import { useState, useEffect, useRef } from 'react';

const getIsMobileValue = () => {
  if (typeof window === 'undefined') return false;
  const width = document.documentElement.clientWidth || window.innerWidth;
  return width <= 1024;
};

export const useDeviceOptimization = () => {
  const [isMobile, setIsMobile] = useState(() => getIsMobileValue());
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const resizeTimerRef = useRef(null);

  useEffect(() => {
    const initialMobile = getIsMobileValue();
    setIsMobile(initialMobile);

    const checkConnection = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowTypes = ['slow-2g', '2g', '3g'];
        return slowTypes.includes(connection.effectiveType) || connection.downlink < 1;
      }
      return false;
    };

    const checkReducedMotion = () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const slowConn = checkConnection();
    const reducedMotion = checkReducedMotion();

    setIsSlowConnection(slowConn);
    setShouldReduceAnimations(initialMobile || slowConn || reducedMotion);

    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        const newIsMobile = getIsMobileValue();
        setIsMobile(newIsMobile);
      }, 600);
    };

    const handleConnectionChange = () => {
      setIsSlowConnection(checkConnection());
    };

    window.addEventListener('resize', handleResize);
    navigator.connection?.addEventListener('change', handleConnectionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      navigator.connection?.removeEventListener('change', handleConnectionChange);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  return {
    isMobile,
    isSlowConnection,
    shouldReduceAnimations,
    animationConfig: {
      initial: shouldReduceAnimations ? {} : { opacity: 0, y: 20 },
      animate: shouldReduceAnimations ? {} : { opacity: 1, y: 0 },
      transition: shouldReduceAnimations 
        ? { duration: 0 } 
        : { duration: isMobile ? 0.3 : 0.6 }
    },
    imageConfig: {
      loading: 'lazy',
      decoding: 'async',
      fetchPriority: isMobile ? 'low' : 'auto'
    }
  };
};

export default useDeviceOptimization;