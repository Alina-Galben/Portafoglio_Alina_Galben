import React from 'react';
import useDeviceOptimization from '../hooks/useDeviceOptimization';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const { isMobile } = useDeviceOptimization();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4 ${
      isMobile ? 'text-center' : ''
    }`}>
      <div className={`max-w-md ${isMobile ? 'mx-auto' : ''}`}>
        {/* Icon di errore */}
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Oops! Qualcosa è andato storto
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isMobile ? 
            'La pagina non si è caricata correttamente. Prova a ricaricare.' :
            'Si è verificato un errore durante il caricamento della pagina.'
          }
        </p>
        
        {error && process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Dettagli errore</summary>
            <pre className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        
        <div className={`space-y-3 ${isMobile ? '' : 'flex gap-3 space-y-0'}`}>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition-colors"
          >
            Ricarica Pagina
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;