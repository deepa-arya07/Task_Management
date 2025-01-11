import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const HomePage = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleNavigation = () => {
    navigate("/dashboard"); // Navigate to the dashboard route
  };

  return (
    <div className="container">
      <Header title="Task Management App" />
      <main>
        <h2>Welcome to the Task Management App</h2>
        <Button text="Go to Dashboard" onClick={handleNavigation} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
