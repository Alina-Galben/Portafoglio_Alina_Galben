import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

interface RouteError {
  statusText?: string;
  message?: string;
  status?: number;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {error?.status === 404 ? 'Pagina non trovata' : 'Oops! Qualcosa è andato storto'}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {error?.statusText || error?.message || 'Si è verificato un errore imprevisto.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Torna alla Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;