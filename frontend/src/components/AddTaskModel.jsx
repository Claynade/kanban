import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { customScrollbarCss } from "../utils/customScrollbarCss";

const AddTaskModel = ({
  setTasks,
  setAddTaskMenu,
  fetchProject,
  defaultStatus,
}) => {
  const { id } = useParams();
  const titleInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "Low",
  });

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleClose = (e) => {
    if (e.target.classList.contains("modal-layout")) {
      setAddTaskMenu(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    const tempId = `temp`;
    const optimisticTask = {
      ...newTask,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, optimisticTask]);
    setAddTaskMenu(false);
    setIsCreating(false);
    try {
      const response = await API.post(`/tasks/${id}`, newTask, {});
      if (response.status === 201) {
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? response.data : t))
        );
        await fetchProject();
      }
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(err.message || "Error adding task");
    } finally {
      setAddTaskMenu(false);
      setIsCreating(false);
      setNewTask({
        title: "",
        description: "",
        status: "backlog",
        priority: "Low",
      });
    }
  };

  return (
    <div
      className="modal-layout fixed inset-0 flex items-center justify-center bg-black/55 z-50"
      onClick={handleClose}
    >
      <div className="bg-[var(--card)] text-[var(--foreground)] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md mx-2">
        <h2 className="text-xl sm:text-2xl text-[var(--secondary-foreground)] font-bold mb-4 text-center">
          Add New Task
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Task Title"
            name="title"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)] text-base"
            value={newTask.title}
            onChange={handleChange}
          />
          <textarea
            placeholder="Task Description"
            name="description"
            className="w-full h- px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)] text-base"
            rows="3"
            value={newTask.description}
            onChange={handleChange}
          ></textarea>
          <select
            name="status"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] bg-[var(--card)] text-[var(--foreground)] text-base sm:text-sm"
            value={newTask.status}
            onChange={handleChange}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To-Do</option>
            <option value="done">Done</option>
          </select>
          <select
            name="priority"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] bg-[var(--card)] text-[var(--foreground)] text-base sm:text-sm"
            value={newTask.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--purple-button)] text-[var(--purple-button-foreground)] rounded-md hover:bg-[var(--purple-button-hover)] "
            >
              Add Task
            </button>
            <button
              type="button"
              disabled={isCreating}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--secondary)] text-[var(--muted-foreground)] rounded-md hover:bg-[var(--muted)]"
              onClick={() => setAddTaskMenu(false)}
            >
              Cancel
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddTaskModel;
