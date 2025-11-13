import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook per gestire le connessioni Server-Sent Events (SSE)
 * Connette al backend per ricevere aggiornamenti in tempo reale
 */
export const useSSE = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);
  
  const {
    onOpen = () => {},
    onMessage = () => {},
    onError = () => {},
    onClose = () => {},
    autoReconnect = true,
    reconnectInterval = 3000,
  } = options;

  const connect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log(`🔌 Connecting to SSE: ${url}`);
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        console.log('✅ SSE Connected successfully');
        setIsConnected(true);
        setError(null);
        onOpen(event);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 SSE Message received:', data);
          setLastEvent({ data, timestamp: new Date() });
          onMessage(data, event);
          // eslint-disable-next-line no-unused-vars
        } catch (_parseError) {
          console.warn('⚠️ Failed to parse SSE message:', event.data);
          setLastEvent({ data: event.data, timestamp: new Date() });
          onMessage(event.data, event);
        }
      };

      eventSource.onerror = (event) => {
        console.error('❌ SSE Connection error:', event);
        setIsConnected(false);
        setError('Errore di connessione SSE');
        onError(event);

        if (autoReconnect) {
          console.log(`🔄 Attempting to reconnect in ${reconnectInterval}ms...`);
          setTimeout(() => {
            if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
              connect();
            }
          }, reconnectInterval);
        }
      };

      eventSource.onclose = (event) => {
        console.log('🔌 SSE Connection closed');
        setIsConnected(false);
        onClose(event);
      };

    } catch (error) {
      console.error('❌ Failed to create SSE connection:', error);
      setError('Impossibile stabilire la connessione SSE');
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      console.log('🔌 Disconnecting SSE...');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  const reconnect = () => {
    disconnect();
    setTimeout(connect, 100);
  };

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    isConnected,
    lastEvent,
    error,
    reconnect,
    disconnect,
  };
};

export default useSSE;