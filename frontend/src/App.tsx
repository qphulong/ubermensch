import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    // Access the environment variable with the correct VITE_ prefix
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Ensure the environment variable exists before making the request
    if (backendUrl) {
      fetch(`${backendUrl}/`)
        .then((res) => res.json())
        .then((data) => setData(data.message))
        .catch((error) => console.error('Error fetching data:', error));
    } else {
      console.error('Backend URL is not defined in the environment variables.');
    }
  }, []);

  useEffect(() => {
    console.log(import.meta.env);  // Logs all environment variables available
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log('Backend URL:', backendUrl);
  }, []);
  

  return <h1>{data || 'Loading...'}</h1>;
}

export default App;
