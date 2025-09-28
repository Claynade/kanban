import { useState, useEffect } from "react";
import API from "../utils/api";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // If same year, show only day/month, otherwise show day/month/year
  return now.getFullYear() === year
    ? `${day}/${month}`
    : `${day}/${month}/${year}`;
};

/**
 * TaskMeta component displays user info, date, and comment count
 */
const TaskMeta = ({ createdBy, createdAt }) => {
  const formattedDate = formatDate(createdAt);
  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between">
        {/* User avatar and name */}
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <img
              src={createdBy?.profilePicture || "/placeholder.svg"}
              alt={createdBy?.name || "Avatar"}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            {createdBy?.name || "Unknown"}
          </span>
        </div>
        {/* Date and comments count */}
        <div className="flex items-center space-x-2 text-[var(--muted-foreground)]">
          <div className="flex items-center space-x-1">
            <span className="text-xs">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px]">💬</span>
            <span className="text-xs">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Constants for task tags and priority colors
const SAMPLE_TAGS = ["bug", "feature", "enhancement"];

const PRIORITY_COLORS = {
  Low: "bg-[var(--priority-low-bg)] text-[var(--priority-low-fg)] border-[var(--priority-low-border)]",
  Medium:
    "bg-[var(--priority-medium-bg)] text-[var(--priority-medium-fg)] border-[var(--priority-medium-border)]",
  High: "bg-[var(--priority-high-bg)] text-[var(--priority-high-fg)] border-[var(--priority-high-border)]",
};

/**
 * PriorityTag component displays the task priority level
 */
const PriorityTag = ({ priority }) => (
  <div className="flex text-xs items-center">
    <span
      className={`ml-1 px-2 py-1 rounded-full border ${PRIORITY_COLORS[priority]}`}
    >
      {priority}
    </span>
  </div>
);

/**
 * MoveButtons component displays task action buttons when a task is selected
 */
const MoveButtons = ({
  status,
  isSelected,
  markTodo,
  markInProgress,
  markComplete,
  deleteTask,
}) => {
  if (!isSelected) return null;

  // Define actions available for each status
  const actionsByStatus = {
    todo: [
      { label: "backlog", onClick: markInProgress },
      { label: "done", onClick: markComplete },
    ],
    backlog: [
      { label: "to-do", onClick: markTodo },
      { label: "done", onClick: markComplete },
    ],
    done: [
      { label: "to-do", onClick: markTodo },
      { label: "backlog", onClick: markInProgress },
    ],
  };

  const actions = actionsByStatus[status] || [];

  return (
    <div className="flex gap-1 p-2 rounded-lg bg-[var(--background)]">
      {actions.map(({ label, onClick }) => (
        <div
          key={label}
          className="flex-1 h-7 flex items-center justify-center text-xs text-[var(--forground)] border-[var(--border)] border rounded-md hover:bg-[var(--border)] hover:text-[var(--foreground)] cursor-pointer"
          onClick={onClick}
        >
          {label}
        </div>
      ))}
      <div
        className="h-7 w-7 flex items-center justify-center text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-[var(--destructive-foreground)] border border-[var(--border)] hover:border-0 rounded-md cursor-pointer"
        onClick={deleteTask}
        title="Delete Task"
      >
        <AiFillDelete className="h-4 w-4" />
      </div>
    </div>
  );
};

/**
 * Custom hook to fetch user data
 */
const useUsername = () => {
  const [username, setUsername] = useState("Loading...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/users/data`);
        setUsername(response.data.name || "Unknown User");
      } catch (error) {
        console.error("Error fetching user:", error);
        setUsername("Unknown User");
      }
    };

    fetchUser();
  }, []);

  return username;
};

/**
 * TaskCard component displays task details and actions
 */
const TaskCard = ({
  _id,
  handleClick,
  title,
  description,
  priority,
  createdBy,
  createdAt,
  cardSelected,
  status,
  markComplete,
  markTodo,
  markInProgress,
  deleteTask,
}) => {
  const isSelected = cardSelected === _id;
  const navigate = useNavigate();

  const openTaskThread = () => {
    if (!_id || _id === "temp") return;
    navigate(_id);
  };

  /**
   * TaskContent component displays the task title, description, and priority
   */
  const TaskContent = () => (
    <div className="pb-3">
      <div className="flex items-start justify-between">
        <h2 className="font-medium mb-2 text-sm text-[var(--foreground)] leading-tight line-clamp-2">
          {title}
        </h2>
        <PriorityTag priority={priority} />
      </div>
      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
        {description}
      </p>
    </div>
  );

  /**
   * TaskTags component displays tags associated with the task
   */
  const TaskTags = () => (
    <div className="flex flex-wrap gap-1 mb-3">
      {SAMPLE_TAGS.map((tag) => (
        <div
          key={tag}
          className="text-xs text-[var(--foreground)] bg-[var(--muted)] rounded-xl py-1 px-2"
        >
          {tag}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full min-w-70 cursor-pointer transition-all hover:shadow-lg bg-[var(--card)] backdrop-blur-sm rounded-lg">
      {/* Task card main content */}
      <div
        className={`w-full pt-5 pb-2 px-5 border-2 border-[var(--border)] rounded-lg ${
          isSelected ? "bg-[var(--secondary)]" : ""
        }`}
        onClick={handleClick}
        onDoubleClick={openTaskThread}
      >
        <TaskContent />

        <div className="pt-0">
          <TaskTags />
          <TaskMeta createdBy={createdBy} createdAt={createdAt} />
        </div>
      </div>

      {/* Action buttons shown only when task is selected */}
      <MoveButtons
        status={status}
        isSelected={isSelected}
        markTodo={markTodo}
        markInProgress={markInProgress}
        markComplete={markComplete}
        deleteTask={deleteTask}
      />
    </div>
  );
};

export default TaskCard;
