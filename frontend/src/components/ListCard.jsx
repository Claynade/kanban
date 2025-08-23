import React, { useState, useMemo } from "react";
import TaskCard from "./TaskCard";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { customScrollbarCss } from "../utils/customScrollbarCss";

// Constants
const STATUS_COLORS = {
  todo: "bg-yellow-300",
  backlog: "bg-blue-400",
  done: "bg-green-500",
};

/**
 * ListCardHeader component displays the header of a list card with type, status indicator,
 * count of tasks, and an add task button
 */
const ListCardHeader = ({ type, status, count, handleAddTask }) => (
  <div className="px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Status color indicator */}
        <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`} />

        {/* List type label */}
        <div className="text-sm font-medium text-[var(--foreground)] flex items-center">
          {type}
        </div>

        {/* Task count badge */}
        <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-full">
          {count}
        </span>
      </div>

      {/* Add task button */}
      <div className="w-6 h-6 pb-1 flex justify-center items-center rounded hover:text-[var(--primary-foreground)] hover:bg-[var(--primary)]">
        <button
          onClick={handleAddTask}
          title="Add Task"
          className="w-full h-full flex justify-center items-center text-lg"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

/**
 * Custom hook to manage task operations within a list
 */
const useTaskOperations = (
  tasks,
  status,
  cardSelected,
  setCardSelected,
  setAddTaskMenu,
  setDefaultStatus,
  fetchProject
) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter tasks based on status
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  // Find the currently selected task
  const selectedTask = useMemo(
    () => filteredTasks.find((task) => task._id === cardSelected),
    [filteredTasks, cardSelected]
  );

  /**
   * Update task status or delete a task
   */
  const updateTask = async (updates) => {
    if (!selectedTask) {
      console.error("Task not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (updates.delete) {
        if (!window.confirm("Are you sure you want to delete this task?"))
          return;
        response = await API.delete(`/tasks/${id}/${selectedTask._id}`);
      } else {
        response = await API.put(`/tasks/${id}/${selectedTask._id}`, updates);
      }

      if (response.status === 200) {
        setCardSelected(null);
        fetchProject();
      } else {
        setError("Failed to update task");
        console.error("Failed to update task:", response);
      }
    } catch (err) {
      setError(err.message || "Error updating task");
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  // Task operation handlers
  const taskOperations = {
    markComplete: () => updateTask({ status: "done" }),
    markTodo: () => updateTask({ status: "todo" }),
    markInProgress: () => updateTask({ status: "backlog" }),
    deleteTask: () => updateTask({ delete: true }),
    handleClick: (taskId) => setCardSelected(taskId),
    handleAddTask: () => {
      setDefaultStatus(status);
      setAddTaskMenu(true);
    },
  };

  return {
    filteredTasks,
    loading,
    error,
    ...taskOperations,
  };
};

/**
 * ListCard component displays a column of tasks with a specific status
 */
const ListCard = ({
  type,
  status,
  tasks,
  cardSelected,
  setCardSelected,
  setAddTaskMenu,
  setDefaultStatus,
  fetchProject,
  className,
}) => {
  const {
    filteredTasks,
    loading,
    error,
    markComplete,
    markTodo,
    markInProgress,
    deleteTask,
    handleClick,
    handleAddTask,
  } = useTaskOperations(
    tasks,
    status,
    cardSelected,
    setCardSelected,
    setAddTaskMenu,
    setDefaultStatus,
    fetchProject
  );
  /**
   * Empty state component when no tasks are present
   */
  const EmptyState = () => (
    <div>
      <div className="text-sm text-[var(--muted-foreground)] mt-4 text-center">
        No tasks here.
      </div>
      <div>
        <button
          onClick={() => setAddTaskMenu(true)}
          className="mt-2 px-4 py-2 hover:bg-[var(--primary)] text-[var(--muted-foreground)] hover:text-[var(--primary-foreground)] text-sm text-center rounded-md"
        >
          + Add first task
        </button>
      </div>
    </div>
  );

  /**
   * Task list component
   */
  const TaskList = () => (
    <>
      {filteredTasks.map((task) => (
        <TaskCard
          key={task._id}
          _id={task._id}
          handleClick={() => handleClick(task._id)}
          title={task.title}
          description={task.description}
          priority={task.priority}
          createdBy={task.createdBy}
          createdAt={task.createdAt}
          cardSelected={cardSelected}
          status={task.status}
          markComplete={markComplete}
          markTodo={markTodo}
          markInProgress={markInProgress}
          deleteTask={deleteTask}
          loading={loading}
          error={error}
        />
      ))}
    </>
  );

  return (
    <div
      className={`flex flex-col p-2 bg-[var(--card)] h-full min-h-[560px] md:h-[560px] 2xl:h-full rounded-lg shadow text-[var(--card-foreground)] ${
        className || "min-w-[220px] max-w-[350px]"
      }`}
    >
      {/* List header with title, count and add button */}
      <ListCardHeader
        type={type}
        status={status}
        count={filteredTasks.length}
        handleAddTask={handleAddTask}
      />

      {/* Task container */}
      <div
        className={`flex flex-col w-full space-y-3 px-3 items-center justify-start h-full overflow-y-auto overflow-x-hidden ${customScrollbarCss}`}
      >
        {filteredTasks.length > 0 ? <TaskList /> : <EmptyState />}
        {error && <div className="text-[var(--destructive)] mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ListCard;
