import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Dashboard.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const AnalyticalDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Fetch task data
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setCompletedTasks(
          data.filter((task) => task.status === "Completed").length
        );
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Data for Task Distribution (Bar chart)
  const taskDistributionData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Task Distribution by Priority",
        data: [
          tasks.filter((task) => task.priority === "Low").length,
          tasks.filter((task) => task.priority === "Medium").length,
          tasks.filter((task) => task.priority === "High").length,
        ],
        backgroundColor: ["#8e44ad", "#2980b9", "#e74c3c"],
        borderColor: ["#8e44ad", "#2980b9", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Completion Rate (Line chart)
  const completionRateData = {
    labels: tasks.map((task) => moment(task.dueDate).format("MMM Do YY")),
    datasets: [
      {
        label: "Completed Tasks",
        data: tasks.map((task) => (task.status === "Completed" ? 1 : 0)),
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
      },
    ],
  };

  // Filter for Upcoming Deadlines - excluded completed tasks
  const upcomingTasks = tasks.filter((task) => {
    return (
      task.dueDate &&
      task.status !== "Completed" &&
      moment(task.dueDate).isAfter(moment())
    );
  });

  // Format the tasks into events for the calendar
  const calendarEvents = upcomingTasks.map((task) => ({
    date: moment(task.dueDate).toDate(),
    title: task.title,
  }));

  const tileClassName = ({ date, view }) => {
    const isTaskDueOnThisDate = calendarEvents.some((event) =>
      moment(event.date).isSame(date, "day")
    );
    return isTaskDueOnThisDate ? "highlight-task" : null;
  };

  const tileContent = ({ date, view }) => {
    const task = calendarEvents.find((event) =>
      moment(event.date).isSame(date, "day")
    );
    return task ? <span className={styles.taskTitle}>{task.title}</span> : null;
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header title="Task Management Dashboard" />
      <div className={styles.mainLayout}>
        <div className={styles.graphsContainer}>
          <div className={styles.chartContainer}>
            <h3>Task Distribution by Priority</h3>
            <div className={styles.chart}>
              <Bar data={taskDistributionData} />
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3>Completion Rate Over Time</h3>
            <div className={styles.chart}>
              <Line data={completionRateData} />
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.upcomingTasksContainer}>
            <h3>Upcoming Deadlines</h3>
            {upcomingTasks.length > 0 ? (
              <ul>
                {upcomingTasks.map((task) => (
                  <li key={task._id}>
                    <strong>{task.title}</strong> - Due:{" "}
                    {moment(task.dueDate).format("Do MMM YY")}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming deadlines.</p>
            )}
          </div>

          {/* Customized Calendar */}
          <div className={styles.calendarContainer}>
            <h3>Task Calendar</h3>
            <Calendar
              className="custom-calendar"
              tileClassName={tileClassName}
              tileContent={tileContent}
              minDate={new Date()}
              showNeighboringMonth={false}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnalyticalDashboard;
