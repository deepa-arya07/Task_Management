import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ title, onLogout }) => {
  const navigate = useNavigate();

  const onNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const onNavigateToHome = () => {
    navigate("/");
  };

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>{title}</h1>

      <div className={styles.headerButtons}>
        {/* Home button */}
        <button className={styles.headerButton} onClick={onNavigateToHome}>
          Home
        </button>

        {/* Go to Dashboard button */}
        <button className={styles.headerButton} onClick={onNavigateToDashboard}>
          Go to Dashboard
        </button>

        {/* Logout button */}
        <button className={styles.headerButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
