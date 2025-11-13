import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router';
import './App.css';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 10001
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App
