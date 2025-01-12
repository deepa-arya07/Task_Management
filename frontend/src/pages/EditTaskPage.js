import React from "react";
import Swal from "sweetalert2"; // Import SweetAlert
import styles from "./EditTaskPage.module.css"; // Import the module CSS for styling

const EditTaskPage = ({
  isOpen,
  onClose,
  onSubmit,
  taskData,
  onChange,
  id,
}) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = { ...taskData };

    try {
      // Send the PUT request to the backend to update the task
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        const data = await response.json();
        // Show success alert
        Swal.fire({
          title: "Task Updated!",
          text: "Your task has been successfully updated.",
          icon: "success",
          confirmButtonColor: "#9b4dca", // Custom button color
          confirmButtonText: "Okay",
        }).then(() => {
          onSubmit(data); // Call the onSubmit callback to handle further actions
          onClose(); // Close the modal after updating
        });
      } else {
        // Show error alert if something goes wrong
        Swal.fire({
          title: "Error!",
          text: "There was an error updating the task.",
          icon: "error",
          confirmButtonColor: "#c0392b", // Red button color for error
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "There was an error connecting to the server.",
        icon: "error",
        confirmButtonColor: "#c0392b",
      });
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Task</h2>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              value={taskData.description}
              onChange={(e) => onChange("description", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Priority:</label>
            <select
              value={taskData.priority}
              onChange={(e) => onChange("priority", e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Due Date:</label>
            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) => onChange("dueDate", e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Status:</label>
            <select
              value={taskData.status}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className={styles.modalButtons}>
            <button type="submit">Update Task</button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskPage;
