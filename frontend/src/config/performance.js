export const PERFORMANCE_CONFIG = {
  swr: {
    refreshInterval: 60_000,
    dedupingInterval: 5_000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 2,
    errorRetryInterval: 5_000,
  },
  animation: {
    mobile: { duration: 0.2, ease: "easeOut", stagger: 0.05 },
    desktop: { duration: 0.6, ease: "easeOut", stagger: 0.1 }
  },
  images: {
    mobile: { loading: 'lazy', quality: 70, maxWidth: 800 },
    desktop: { loading: 'lazy', quality: 80, maxWidth: 1200 }
  },
  debounce: { search: 300, resize: 150, scroll: 50 }
};

export const isSlowConnection = () => {
  const conn = navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection;
  return conn ? (['slow-2g', '2g'].includes(conn.effectiveType) || conn.downlink < 0.5) : false;
};

export const preloadCriticalResources = () => {
  const link = document.createElement('link');
  Object.assign(link, {
    rel: 'preload',
    href: '/fonts/Inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: ''
  });
  document.head.appendChild(link);
};

export default PERFORMANCE_CONFIG;