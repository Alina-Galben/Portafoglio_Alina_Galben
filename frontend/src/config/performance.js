// Configurazione per ottimizzazioni performance
export const PERFORMANCE_CONFIG = {
  // Configurazione cache SWR
  swrConfig: {
    refreshInterval: 60000,
    dedupingInterval: 5000,
    revalidateOnFocus: false, // Disabilita su mobile per performance
    revalidateOnReconnect: true,
    errorRetryCount: 2,
    errorRetryInterval: 5000,
  },

  // Configurazione animazioni per device
  animationConfig: {
    mobile: {
      duration: 0.2,
      ease: "easeOut",
      staggerDelay: 0.05
    },
    desktop: {
      duration: 0.6,
      ease: "easeOut", 
      staggerDelay: 0.1
    }
  },

  // Configurazione immagini
  imageConfig: {
    mobile: {
      loading: 'lazy',
      quality: 70,
      maxWidth: 800,
      priority: false
    },
    desktop: {
      loading: 'lazy',
      quality: 80,
      maxWidth: 1200,
      priority: false
    }
  },

  // Debounce timing
  debounce: {
    search: 300,
    resize: 150,
    scroll: 50
  }
};

// Funzione per rilevare connessione lenta
export const isSlowConnection = () => {
  // @ts-ignore
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    const slowTypes = ['slow-2g', '2g'];
    return slowTypes.includes(connection.effectiveType) || connection.downlink < 0.5;
  }
  return false;
};

// Funzione per preload critico
export const preloadCriticalResources = () => {
  // Preload font critico
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/fonts/Inter-var.woff2';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = '';
  document.head.appendChild(link);
};

export default PERFORMANCE_CONFIG;