import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import AddTaskPage from "./pages/AddTaskPage";
import TaskListPage from "./pages/TaskListPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-task" element={<AddTaskPage />} />
        <Route path="/task-list" element={<TaskListPage />} />
      </Routes>
    </Router>
  );
};

export default App;
