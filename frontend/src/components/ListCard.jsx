import React, { useState, useMemo } from "react";
import TaskCard from "../components/TaskCard";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { customScrollbarCss } from "../utils/customScrollbarCss";

const statusColors = {
  todo: "bg-yellow-300",
  backlog: "bg-blue-400",
  done: "bg-green-500",
};

const ListCardHeader = ({ type, status, count, handleAddTask }) => (
  <div className="px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <div className="text-sm font-medium text-[var(--foreground)] flex items-center">
          {type}
        </div>
        <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-full">
          {count}
        </span>
      </div>
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

const ListCard = ({
  type,
  status,
  tasks,
  cardSelected,
  setCardSelected,
  setAddTaskMenu,
  setDefaultStatus,
  fetchProject,
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === status),
    [tasks, status]
  );
  const selectedTask = useMemo(
    () => filteredTasks.find((task) => task._id === cardSelected),
    [filteredTasks, cardSelected]
  );

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
  const markComplete = () => updateTask({ status: "done" });
  const markTodo = () => updateTask({ status: "todo" });
  const markInProgress = () => updateTask({ status: "backlog" });
  const deleteTask = () => updateTask({ delete: true });

  const handleClick = (taskId) => setCardSelected(taskId);
  const handleAddTask = () => {
    setDefaultStatus(status);
    setAddTaskMenu(true);
  };
  return (
    <div className="flex flex-col bg-[var(--card)] w-80 min-w-80 h-[560px] rounded-lg shadow text-[var(--card-foreground)]">
      <ListCardHeader
        type={type}
        status={status}
        count={filteredTasks.length}
        handleAddTask={handleAddTask}
      />
      <div
        className={`flex flex-col w-full space-y-3 px-3 items-center justify-start h-full overflow-y-auto overflow-x-hidden ${customScrollbarCss}`}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              _id={task._id}
              handleClick={() => handleClick(task._id)}
              title={task.title}
              description={task.description}
              createdBy={task.createdBy}
              cardSelected={cardSelected}
              status={task.status}
              markComplete={markComplete}
              markTodo={markTodo}
              markInProgress={markInProgress}
              deleteTask={deleteTask}
              loading={loading}
              error={error}
            />
          ))
        ) : (
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
        )}
        {error && <div className="text-[var(--destructive)] mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ListCard;
