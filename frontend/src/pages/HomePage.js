import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();
  // Navigate to the task list page
  const handleDashboardNavigation = () => {
    navigate("/task-list");
  };

  // Navigate to the Add Task page
  const handleAddTaskNavigation = () => {
    navigate("/add-task");
  };

  return (
    <div className={styles.homeContainer}>
      <Header title="Task Management App" />

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Manage Your Tasks with Ease</h1>
          <p className={styles.heroDescription}>
            Stay organized and on top of your work with our intuitive task
            management app.
          </p>

          <div className={styles.heroButtons}>
            <Button text="Add New Task" onClick={handleAddTaskNavigation} />
            <Button
              text="View your tasks"
              onClick={handleDashboardNavigation}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
