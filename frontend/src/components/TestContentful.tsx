import React, { useState, useEffect } from 'react';

const TestContentful: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test diretto usando fetch invece del SDK
        const spaceId = 'mavgsj5oj6sw';
        const accessToken = 'pgWGrl4fYiOq1oUmcNeQQZ_vrngY9zBnO9HBOOq9bOk';
        
        const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=project&access_token=${accessToken}`;
        
        console.log('🔍 Testing Contentful with URL:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
          setStatus(`✅ Success! Found ${data.items.length} projects`);
          setProjects(data.items);
          console.log('✅ Contentful data:', data);
        } else {
          setError(`❌ API Error: ${data.message || 'Unknown error'}`);
          console.error('❌ Contentful error:', data);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`❌ Connection failed: ${errorMsg}`);
        console.error('❌ Fetch error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contentful Connection Test</h1>
      
      <div className="mb-4">
        <p className="text-lg">{status}</p>
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>

      {projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Projects Found:</h2>
          <ul className="list-disc pl-6">
            {projects.map((project) => (
              <li key={project.sys.id} className="mb-2">
                <strong>{project.fields.title || 'No title'}</strong>
                <br />
                <small>Fields: {Object.keys(project.fields).join(', ')}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestContentful;