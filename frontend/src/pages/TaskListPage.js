import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import EditTaskPage from "./EditTaskPage";
import styles from "./TaskListPage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    status: "Pending",
  });
  const [sortOption, setSortOption] = useState("dueDateAsc");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(sortTasks(data, sortOption, priorityFilter, searchQuery));
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [sortOption, priorityFilter, searchQuery]);

  const sortTasks = (tasks, sortBy, filterByPriority) => {
    let sortedTasks = [...tasks];

    if (filterByPriority !== "All") {
      sortedTasks = sortedTasks.filter(
        (task) => task.priority === filterByPriority
      );
    }
    if (searchQuery) {
      sortedTasks = sortedTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDeleteTask = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // Proceed if the user confirmed the deletion
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "The task has been deleted.",
            icon: "success",
            confirmButtonColor: "#4CAF50",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "There was an error deleting the task.",
            icon: "error",
            confirmButtonColor: "#c0392b",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error connecting to the server.",
          icon: "error",
          confirmButtonColor: "#c0392b",
        });
      }
    }
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Open the modal and set the task data to be edited
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask) => {
    setModalOpen(false);
    const updatedTaskData = { ...updatedTask };

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${updatedTaskData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTaskData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Handle task update logic here
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === data._id ? { ...task, ...data } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <Header title="My task list" />
      <div className={styles.taskListContainer}>
        <h2 className={styles.taskListHeading}>Task List</h2>
        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
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
          taskData={taskData}
          onChange={handleChange}
          id={selectedTask?._id}
        />
      </div>
      <Footer />
    </>
  );
};

export default TaskListPage;
