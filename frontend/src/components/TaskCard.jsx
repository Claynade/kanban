import { useState, useEffect } from "react";
import API from "../utils/api";
import { AiFillDelete } from "react-icons/ai";

const TaskMeta = ({ username }) => {
  return (
    <div className="rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            {username}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[var(--muted-foreground)]">
          <div className="flex items-center space-x-1">
            <span className="text-xs">Jul 25</span>
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

const TaskCard = ({
  _id,
  handleClick,
  title,
  description,
  createdBy,
  cardSelected,
  status,
  markComplete,
  markTodo,
  markInProgress,
  deleteTask,
}) => {
  const tags = ["bug", "feature", "enhancement"];
  const [username, setUsername] = useState("Loading...");
  const isSelected = cardSelected === _id;

  const MoveButtons = () => {
    if (!isSelected) return null;
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

  const PriorityTag = () => {
    const priorityColors = {
      low: "bg-[var(--priority-low-bg)] text-[var(--priority-low-fg)] border-[var(--priority-low-border)] dark:bg-[var(--priority-low-bg)] dark:text-[var(--priority-low-fg)] dark:border-[var(--priority-low-border)]",
      medium:
        "bg-[var(--priority-medium-bg)] text-[var(--priority-medium-fg)] border-[var(--priority-medium-border)] dark:bg-[var(--priority-medium-bg)] dark:text-[var(--priority-medium-fg)] dark:border-[var(--priority-medium-border)]",
      high: "bg-[var(--priority-high-bg)] text-[var(--priority-high-fg)] border-[var(--priority-high-border)] dark:bg-[var(--priority-high-bg)] dark:text-[var(--priority-high-fg)] dark:border-[var(--priority-high-border)] ",
    };
    const priorities = ["low", "medium", "high"];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];
    return (
      <div className="flex text-xs items-center">
        <span className=" text-gray-500"></span>
        <span
          className={`ml-1 px-2 py-1 rounded-full border ${priorityColors[randomPriority]}`}
        >
          {randomPriority.charAt(0).toUpperCase() + randomPriority.slice(1)}
        </span>
      </div>
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/users/u/${createdBy}`);
        setUsername(response.data.username || "Unknown User");
      } catch (error) {
        console.error("Error fetching user:", error);
        setUsername("Unknown User");
      }
    };
    fetchUser();
  }, []);

  return (
    <div
      className={`w-full min-w-70 cursor-pointer transition-all hover:shadow-lg bg-[var(--card)] backdrop-blur-sm  rounded-lg `}
    >
      <div
        className={`w-full pt-5 pb-2 px-5 border-2 border-[var(--border)] rounded-lg ${
          isSelected ? " bg-[var(--secondary)]" : ""
        }`}
        onClick={handleClick}
      >
        <div className="pb-3">
          <div className="flex items-start justify-between">
            <h2 className="font-medium mb-2 text-sm text-[var(--foreground)] leading-tight">
              {title}
            </h2>
            <PriorityTag />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
            {description}
          </p>
        </div>
        <div className="pt-0">
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className={`text-xs text-[var(--foreground)] bg-[var(--muted)] rounded-xl py-1 px-2 `}
              >
                {tag}
              </div>
            ))}
          </div>
          <TaskMeta username={username} />
        </div>
      </div>
      {isSelected && <MoveButtons />}
    </div>
  );
};

export default TaskCard;
