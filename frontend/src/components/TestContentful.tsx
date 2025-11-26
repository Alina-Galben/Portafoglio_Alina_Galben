import { useState, useEffect } from 'react';

const CONFIG = {
  SPACE_ID: 'mavgsj5oj6sw',
  TOKEN: 'pgWGrl4fYiOq1oUmcNeQQZ_vrngY9zBnO9HBOOq9bOk',
  ENDPOINT: 'https://cdn.contentful.com'
};

const TestContentful = () => {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const url = `${CONFIG.ENDPOINT}/spaces/${CONFIG.SPACE_ID}/entries?content_type=project&access_token=${CONFIG.TOKEN}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const { items } = await res.json();
        setData(items);
        setStatus('success');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setErrorMessage(err instanceof Error ? err.message : 'Network failure');
        setStatus('error');
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return <div className="p-8 text-gray-500 animate-pulse">Establishing connection to Contentful...</div>;
  }

  if (status === 'error') {
    return (
      <div className="p-8">
        <h1 className="text-red-600 font-bold text-xl mb-2">Connection Failed</h1>
        <pre className="bg-red-50 p-4 rounded text-red-800 font-mono text-sm">{errorMessage}</pre>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contentful Diagnostic</h1>
          <p className="text-gray-500 text-sm mt-1">Space ID: {CONFIG.SPACE_ID}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {data.length} Entries Found
        </span>
      </header>

      <div className="grid gap-4">
        {data.map(({ sys, fields }) => (
          <div key={sys.id} className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{fields.title ?? 'Untitled'}</h3>
              <span className="text-xs font-mono text-gray-400">{sys.id}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(fields).map(key => (
                <span key={key} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200 font-mono">
                  {key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestContentful;