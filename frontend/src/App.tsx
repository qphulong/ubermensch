import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom'; // Import useNavigate for routing

function App() {
  const [data, setData] = useState<string>('');
  const navigate = useNavigate(); // Initialize navigate hook

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

  // Handler function for button click
  const handleButtonClick = () => {
    navigate('/first-post');
  };

  return (
    <div>
      <h1>{data || 'Loading...'}</h1>
      <button onClick={handleButtonClick}>A</button>
      <Routes>
        <Route path="/first-post" element={<FirstPost />} />
      </Routes>
    </div>
  );
}

function FirstPost() {
  return <h1>First Post Page</h1>;
}

export default App;