import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { customScrollbarCss } from "../utils/customScrollbarCss";

/**
 * Custom hook to manage task creation
 */
const useTaskCreation = (
  setTasks,
  setAddTaskMenu,
  fetchProject,
  defaultStatus
) => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "Low",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "backlog",
      priority: "Low",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    // Create a temporary ID for optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticTask = {
      ...newTask,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    // Add task optimistically
    setTasks((prev) => [...prev, optimisticTask]);
    setAddTaskMenu(false);

    try {
      // Make API call to actually create the task
      const response = await API.post(`/tasks/${id}`, newTask, {});

      if (response.status === 201) {
        // Replace optimistic task with real one
        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? response.data : t))
        );
        await fetchProject();
      }
    } catch (err) {
      // Remove optimistic task on error
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(err.message || "Error adding task");
    } finally {
      setIsCreating(false);
      resetForm();
    }
  };

  return {
    newTask,
    isCreating,
    message,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

/**
 * AddTaskModel component provides a modal for creating new tasks
 */
const AddTaskModel = ({
  setTasks,
  setAddTaskMenu,
  fetchProject,
  defaultStatus,
}) => {
  const { newTask, isCreating, message, error, handleChange, handleSubmit } =
    useTaskCreation(setTasks, setAddTaskMenu, fetchProject, defaultStatus);

  // Close modal when clicking outside
  const handleClose = (e) => {
    if (e.target.classList.contains("modal-layout")) {
      setAddTaskMenu(false);
    }
  };

  /**
   * FormInput component for text input fields
   */
  const FormInput = ({ type = "text", name, placeholder, value, onChange }) => (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)] text-base"
      value={value}
      onChange={onChange}
    />
  );

  /**
   * FormTextarea component for multiline text input
   */
  const FormTextarea = ({ name, placeholder, value, onChange, rows = "3" }) => (
    <textarea
      placeholder={placeholder}
      name={name}
      className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] text-[var(--foreground)] text-base"
      rows={rows}
      value={value}
      onChange={onChange}
    />
  );

  /**
   * FormSelect component for dropdown selection
   */
  const FormSelect = ({ name, value, onChange, options }) => (
    <select
      name={name}
      className="w-full px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--ring)] focus:border-[var(--ring)] bg-[var(--card)] text-[var(--foreground)] text-base"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  // Status and priority options for select fields
  const statusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To-Do" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

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
          {/* Task title input */}
          <FormInput
            name="title"
            placeholder="Task Title"
            value={newTask.title}
            onChange={handleChange}
          />

          {/* Task description textarea */}
          <FormTextarea
            name="description"
            placeholder="Task Description"
            value={newTask.description}
            onChange={handleChange}
          />

          {/* Task status select */}
          <FormSelect
            name="status"
            value={newTask.status}
            onChange={handleChange}
            options={statusOptions}
          />

          {/* Task priority select */}
          <FormSelect
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            options={priorityOptions}
          />

          {/* Form action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--purple-button)] text-[var(--purple-button-foreground)] rounded-md hover:bg-[var(--purple-button-hover)]"
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

          {/* Status messages */}
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddTaskModel;
