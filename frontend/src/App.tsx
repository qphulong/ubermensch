import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('https://your-backend-url.onrender.com/')
      .then(res => res.json())
      .then(data => setData(data.message));
  }, []);

  return <h1>{data || 'Loading...'}</h1>;
}

export default App;
