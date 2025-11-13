import { useState, useEffect, useRef } from 'react';

// Funzione di utilità per verificare se è mobile (thread-safe)
const getIsMobileValue = () => {
  if (typeof window === 'undefined') return false;
  const width = document.documentElement.clientWidth || window.innerWidth;
  return width <= 1024;
};

// Hook per rilevare dispositivi mobile e ottimizzare performance
export const useDeviceOptimization = () => {
  // Initial state from sync check, not from userAgent
  const [isMobile, setIsMobile] = useState(() => getIsMobileValue());
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const resizeTimerRef = useRef(null);

  useEffect(() => {
    // Do initial check immediately to ensure correct state
    const initialMobile = getIsMobileValue();
    setIsMobile(initialMobile);

    // Detect slow connection
    const checkConnection = () => {
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const slowTypes = ['slow-2g', '2g', '3g'];
        return slowTypes.includes(connection.effectiveType) || connection.downlink < 1;
      }
      return false;
    };

    // Check for reduced motion preference
    const checkReducedMotion = () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // One-time checks
    const slowConn = checkConnection();
    const reducedMotion = checkReducedMotion();

    setIsSlowConnection(slowConn);
    setShouldReduceAnimations(initialMobile || slowConn || reducedMotion);

    // Listen for window resize with LONGER debouncing (600ms) for stability
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        const newIsMobile = getIsMobileValue();
        setIsMobile(newIsMobile);
      }, 600);
    };

    // Listen for connection changes
    const handleConnectionChange = () => {
      setIsSlowConnection(checkConnection());
    };

    window.addEventListener('resize', handleResize);
    // @ts-ignore
    navigator.connection?.addEventListener('change', handleConnectionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      // @ts-ignore
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
    // Configurazioni ottimizzate per mobile
    animationConfig: {
      initial: shouldReduceAnimations ? {} : { opacity: 0, y: 20 },
      animate: shouldReduceAnimations ? {} : { opacity: 1, y: 0 },
      transition: shouldReduceAnimations 
        ? { duration: 0 } 
        : { duration: isMobile ? 0.3 : 0.6 }
    },
    // Configurazioni per immagini
    imageConfig: {
      loading: 'lazy',
      decoding: 'async',
      fetchPriority: isMobile ? 'low' : 'auto'
    }
  };
};

export default useDeviceOptimization;