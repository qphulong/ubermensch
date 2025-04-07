//src/pages/FirstPage/index.tsx
// src/pages/FirstPage/index.tsx

import React from "react";
import { Link } from "react-router-dom";  // Assuming you're using react-router for navigation

const FirstPage: React.FC = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome to the First Page!</h1>
      <p>This is the first page of your web application.</p>
      <p>
        Explore more by navigating through the pages.
      </p>
      <div>
        <Link to="/about" style={{ textDecoration: "none", color: "#007bff" }}>
          Go to About Page
        </Link>
      </div>
    </div>
  );
};

export default FirstPage;
