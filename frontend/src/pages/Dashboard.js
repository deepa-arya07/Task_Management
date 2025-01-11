import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const Dashboard = () => {
  return (
    <div className="container">
      <Header title="Dashboard" />
      <main>
        <div className="flex flex-column">
          <div className="flex flex-center">
            <h2>Your Tasks</h2>
            <Button text="Add New Task" />
          </div>
          <div className="grid grid-3">
            <div className="card">
              <h3>Task 1</h3>
              <p>Priority: High</p>
              <Button text="Edit" className="btn btn-secondary" />
            </div>
            <div className="card">
              <h3>Task 2</h3>
              <p>Priority: Medium</p>
              <Button text="Edit" className="btn btn-secondary" />
            </div>
            <div className="card">
              <h3>Task 3</h3>
              <p>Priority: Low</p>
              <Button text="Edit" className="btn btn-secondary" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
