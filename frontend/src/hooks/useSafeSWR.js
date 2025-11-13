import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useDeviceOptimization from './useDeviceOptimization';

/**
 * Hook SWR sicuro per mobile con gestione errori migliorata
 */
export function useSafeSWR(key, fetcher, options = {}) {
  const { isMobile } = useDeviceOptimization();
  const [fallbackActive, setFallbackActive] = useState(false);
  
  const {
    enableOnMobile = true,
    fallbackData = null,
    retryOnMobile = false
  } = options;

  // Disabilita fetch se mobile e non abilitato
  const shouldFetch = !isMobile || enableOnMobile;
  const shouldRetry = !isMobile || retryOnMobile;

  const swrResult = useSWR(
    shouldFetch && key ? key : null,
    fetcher,
    {
      fallbackData,
      refreshInterval: isMobile ? 0 : 60000, // Nessun refresh automatico su mobile
      revalidateOnFocus: !isMobile,
      revalidateOnReconnect: shouldRetry,
      dedupingInterval: isMobile ? 10000 : 5000, // Dedupe più lungo su mobile
      errorRetryCount: shouldRetry ? 3 : 1,
      errorRetryInterval: isMobile ? 2000 : 1000,
      suspense: false, // Importante: disabilita suspense per evitare blocchi
      onError: (error) => {
        console.warn(`SWR Error for ${key}:`, error);
        if (fallbackData && !fallbackActive) {
          setFallbackActive(true);
        }
      },
      onSuccess: (data) => {
        if (data && fallbackActive) {
          setFallbackActive(false);
        }
      }
    }
  );

  // Gestione fallback attivato
  useEffect(() => {
    if (fallbackActive && fallbackData) {
      console.info(`Using fallback data for ${key}`);
    }
  }, [fallbackActive, fallbackData, key]);

  return {
    ...swrResult,
    data: fallbackActive ? fallbackData : swrResult.data,
    isLoadingFallback: fallbackActive,
    isMobile,
    hasErrors: !!swrResult.error
  };
}

export default useSafeSWR;