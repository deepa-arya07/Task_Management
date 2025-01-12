import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import styles from "./AddTaskPage.module.css";

const AddTaskPage = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title: taskName,
      description: taskDescription,
      priority: taskPriority,
      dueDate,
      status: "Pending", // Default status is "Pending"
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const task = await response.json();
        Swal.fire({
          title: "Task Added!",
          text: "Your task has been successfully added.",
          icon: "success",
          confirmButtonColor: "#9b4dca",
          confirmButtonText: "Go to Dashboard",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/task-list");
          }
        });
      } else {
        throw new Error("Error adding task");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the task. Please try again.",
        icon: "error",
        confirmButtonColor: "#c0392b",
      });
    }
  };

  return (
    <>
      <Header title="Add a New Task" />
      <div className={styles.addTaskContainer}>
        <main className={styles.addTaskMain}>
          <h2>Create a New Task</h2>
          <form onSubmit={handleFormSubmit} className={styles.taskForm}>
            <div className={styles.formGroup}>
              <label htmlFor="taskName">Task Name:</label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                className={styles.taskInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="taskDescription">Task Description:</label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                required
                className={styles.taskTextarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="taskPriority">Priority:</label>
              <select
                id="taskPriority"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className={styles.taskSelect}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className={styles.taskInput}
              />
            </div>

            <Button text="Add Task" type="submit" />
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddTaskPage;
