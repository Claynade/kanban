import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { customScrollbarCss } from "../utils/customScrollbarCss";

const AddTaskModel = ({ setAddTaskMenu, fetchProject, defaultStatus }) => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: defaultStatus,
  });

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
    setMessage("");
    setError(null);
    try {
      const response = await API.post(`/tasks/${id}`, newTask, {});
      if (response.status === 201) {
        console.log("Task added successfully :", response.data);
        await fetchProject();
      } else {
        console.error("Failed to add task :", response);
      }
    } catch (err) {
      setError(err.message || "Error adding task");
      console.error("Error adding task :", err);
    } finally {
      setAddTaskMenu(false);
      setIsCreating(false);
      setNewTask({
        title: "",
        description: "",
        status: "backlog",
      });
    }
  };

  return (
    <div
      className="modal-layout h-screen w-screen absolute top-0 left-0 flex flex-col items-center justify-center bg-black/55 z-50"
      onClick={handleClose}
    >
      <div className="bg-[var(--card)] text-[var(--foreground)] p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl text-[var(--secondary-foreground)] font-bold mb-4">
          Add New Task
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            name="title"
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)]"
            value={newTask.title}
            onChange={handleChange}
          />
          <textarea
            placeholder="Task Description"
            name="description"
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)]"
            rows="4"
            value={newTask.description}
            onChange={handleChange}
          ></textarea>
          <select
            name="status"
            className="w-full px-4 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] bg-[var(--card)] text-[var(--foreground)]"
            value={newTask.status}
            onChange={handleChange}
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To-Do</option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isCreating}
              onClick={handleSubmit}
              className="px-4 py-2 bg-[var(--purple-button)] text-[var(--purple-button-foreground)] rounded-md hover:bg-[var(--purple-button-hover)] "
            >
              Add Task
            </button>
            <button
              type="button"
              disabled={isCreating}
              className="px-4 py-2 bg-[var(--secondary)] text-[var(--muted-foreground)] rounded-md hover:bg-[var(--muted)]"
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
