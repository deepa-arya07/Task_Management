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

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Handle task edit
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setModalOpen(false);
    console.log(updatedTask);
  };

  // Handle task data changes
  const handleTaskChange = (field, value) => {
    setSelectedTask((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <>
      <Header title="Your List" />
      <div className={styles.taskListContainer}>
        <h2>Task List</h2>

        {/* Render tasks in a list */}
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

        {/* Edit Task Modal */}
        <EditTaskPage
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleUpdateTask}
          taskData={selectedTask || {}}
          onChange={handleTaskChange}
        />
      </div>
      <Footer />
    </>
  );
};

export default TaskListPage;
