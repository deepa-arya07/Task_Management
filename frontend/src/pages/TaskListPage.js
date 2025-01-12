import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import EditTaskPage from "./EditTaskPage";
import styles from "./TaskListPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sortOption, setSortOption] = useState("dueDateAsc"); // Default sort: Ascending by Due Date
  const [priorityFilter, setPriorityFilter] = useState("All"); // Default filter for priority

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(sortTasks(data, sortOption, priorityFilter));
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [sortOption, priorityFilter]); // Re-fetch and sort tasks when the sorting or filtering changes

  const sortTasks = (tasks, sortBy, filterByPriority) => {
    let sortedTasks = [...tasks];

    if (filterByPriority !== "All") {
      sortedTasks = sortedTasks.filter(
        (task) => task.priority === filterByPriority
      );
    }

    if (sortBy === "dueDateAsc") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "dueDateDesc") {
      sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    if (sortBy === "today") {
      const today = new Date().toISOString().split("T")[0];
      sortedTasks = sortedTasks.filter(
        (task) => task.dueDate.split("T")[0] === today
      );
      return sortedTasks;
    }

    return sortedTasks;
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setModalOpen(false);
    console.log(updatedTask);
  };

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
          alert("Task deleted successfully!");
        } else {
          console.error("Error deleting task");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Header title="My task list" />
      <div className={styles.taskListContainer}>
        <h2 className={styles.taskListHeading}>Task List</h2>
        <div className={styles.sortAndFilterContainer}>
          <label htmlFor="sortBy" className={styles.sortLabel}>
            Sort By Due Date:
          </label>
          <select
            id="sortBy"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="dueDateAsc">Sort in Asc</option>
            <option value="dueDateDesc">Sort in Desc</option>
            <option value="today">Today</option>
          </select>

          <label
            htmlFor="priorityFilter"
            className={styles.priorityFilterLabel}
          >
            Filter by Priority:
          </label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.prioritySelect}
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task._id} className={styles.taskCard}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>

              <div className={styles.taskActions}>
                <Button text="Edit Task" onClick={() => handleEditTask(task)} />
                <Button
                  text="Delete Task"
                  onClick={() => handleDeleteTask(task._id)}
                />
              </div>
            </div>
          ))}
        </div>

        <EditTaskPage
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleUpdateTask}
          taskData={selectedTask || {}}
          onChange={() => {}}
        />
      </div>
      <Footer />
    </>
  );
};

export default TaskListPage;
