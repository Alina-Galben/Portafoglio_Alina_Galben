import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useDeviceOptimization from './useDeviceOptimization';

export function useSafeSWR(key, fetcher, options = {}) {
  const { isMobile } = useDeviceOptimization();
  const [fallbackActive, setFallbackActive] = useState(false);
  
  const {
    enableOnMobile = true,
    fallbackData = null,
    retryOnMobile = false
  } = options;

  const shouldFetch = !isMobile || enableOnMobile;
  const shouldRetry = !isMobile || retryOnMobile;

  const swrResult = useSWR(
    shouldFetch && key ? key : null,
    fetcher,
    {
      fallbackData,
      refreshInterval: isMobile ? 0 : 60000,
      revalidateOnFocus: !isMobile,
      revalidateOnReconnect: shouldRetry,
      dedupingInterval: isMobile ? 10000 : 5000,
      errorRetryCount: shouldRetry ? 3 : 1,
      errorRetryInterval: isMobile ? 2000 : 1000,
      suspense: false,
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