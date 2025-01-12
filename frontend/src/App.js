import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddTaskPage from "./pages/AddTaskPage";
import TaskListPage from "./pages/TaskListPage";
import AnalyticalDashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<AnalyticalDashboard />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/task-list" element={<TaskListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
