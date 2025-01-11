import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ existingTask, onTaskSubmit }) => {
  const [task, setTask] = useState(
    existingTask || {
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium",
      status: "Pending",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingTask) {
        // Update Task
        await axios.put(
          `http://localhost:5000/api/tasks/${existingTask._id}`,
          task
        );
      } else {
        // Create Task
        await axios.post("http://localhost:5000/api/tasks", task);
      }
      onTaskSubmit();
    } catch (err) {
      console.error("Error saving task:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={task.title}
        placeholder="Task Title"
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        value={task.description}
        placeholder="Task Description"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        required
      />
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">{existingTask ? "Update" : "Create"} Task</button>
    </form>
  );
};

export default TaskForm;
