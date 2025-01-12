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

// Registering required chart elements
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
  const [selectedPriority, setSelectedPriority] = useState("All");

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

  // Filter tasks by selected priority
  const filteredTasks = tasks.filter((task) => {
    if (selectedPriority === "All") return true;
    return task.priority === selectedPriority;
  });

  // Data for Task Distribution (Bar chart)
  const taskDistributionData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Task Distribution by Priority",
        data: [
          filteredTasks.filter((task) => task.priority === "Low").length,
          filteredTasks.filter((task) => task.priority === "Medium").length,
          filteredTasks.filter((task) => task.priority === "High").length,
        ],
        backgroundColor: ["#8e44ad", "#2980b9", "#e74c3c"],
        borderColor: ["#8e44ad", "#2980b9", "#e74c3c"],
        borderWidth: 1,
      },
    ],
  };

  // Filter for Upcoming Deadlines - exclude completed tasks
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

  // Function to add custom tile class for highlighting tasks with deadlines
  const tileClassName = ({ date, view }) => {
    const isTaskDueOnThisDate = calendarEvents.some((event) =>
      moment(event.date).isSame(date, "day")
    );
    return isTaskDueOnThisDate ? "highlight-task" : null;
  };

  // Optionally, display the task title on the calendar tile
  const tileContent = ({ date, view }) => {
    const task = calendarEvents.find((event) =>
      moment(event.date).isSame(date, "day")
    );
    return task ? <span className={styles.taskTitle}>{task.title}</span> : null;
  };
  // Function to calculate the completion rate over time
  const getCompletionRateData = () => {
    const allDates = [];
    const dateSet = new Set();
    tasks.forEach((task) => {
      const date = moment(task.dueDate).format("MMM Do YY");
      dateSet.add(date);
    });
    allDates.push(...dateSet);

    // Sort dates in ascending order
    const sortedDates = allDates.sort(
      (a, b) => moment(a, "MMM Do YY") - moment(b, "MMM Do YY")
    );

    const completionPercentages = sortedDates.map((date) => {
      const totalTasksForDate = tasks.filter(
        (task) => moment(task.dueDate).format("MMM Do YY") === date
      ).length;
      const completedTasksForDate = tasks.filter(
        (task) =>
          task.status === "Completed" &&
          moment(task.dueDate).format("MMM Do YY") === date
      ).length;

      const completionPercentage = totalTasksForDate
        ? (completedTasksForDate / totalTasksForDate) * 100
        : 0;
      return completionPercentage;
    });

    return { labels: sortedDates, completionPercentages };
  };

  const { labels, completionPercentages } = getCompletionRateData();

  // Data for Completion Rate (Line graph)
  const completionRateData = {
    labels: labels, // X-axis labels: Task due dates
    datasets: [
      {
        label: "Completed Tasks (%)",
        data: completionPercentages,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header title="Task Management Dashboard" />
      <div className={styles.mainLayout}>
        <div className={styles.graphsContainer}>
          {/* Priority Filter Buttons */}
          <div className={styles.priorityFilter}>
            <button
              className={styles.filterButton}
              onClick={() => setSelectedPriority("Low")}
            >
              Low Priority
            </button>
            <button
              className={styles.filterButton}
              onClick={() => setSelectedPriority("Medium")}
            >
              Medium Priority
            </button>
            <button
              className={styles.filterButton}
              onClick={() => setSelectedPriority("High")}
            >
              High Priority
            </button>
            <button
              className={styles.filterButton}
              onClick={() => setSelectedPriority("All")}
            >
              All Tasks
            </button>
          </div>

          {/* Task Distribution Bar Chart */}
          <div className={styles.chartContainer}>
            <h3>Task Distribution by Priority</h3>
            <div className={styles.chart}>
              <Bar data={taskDistributionData} />
            </div>
          </div>

          {/* Completion Rate Line Chart */}
          <div className={styles.chartContainer}>
            <h3>Completion Rate Over Time</h3>
            <div className={styles.chart}>
              <Line data={completionRateData} />
            </div>
          </div>
        </div>

        {/* Sidebar for Upcoming Tasks and Calendar */}
        <div className={styles.sidebar}>
          {/* Upcoming Deadlines List */}
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
