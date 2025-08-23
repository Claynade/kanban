import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { customScrollbarCss } from "../utils/customScrollbarCss";
const Modal = ({
  onClose,
  newProjectName,
  setNewProjectName,
  newProjectDescription,
  setNewProjectDescription,
  handleCreateProject,
  isCreating,
  message,
}) => {
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleBackgroundClick}
    >
      <div className="flex flex-col justify-start bg-[var(--card)] text-[var(--card-foreground)] p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-2 rounded-lg shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Create a New Project
        </h2>
        <label className="block my-2" htmlFor="projectName">
          Project Name:
        </label>
        <input
          autoFocus
          required
          placeholder="Project Name"
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-purple-400 text-base"
          id="projectName"
        />
        <label className="block my-2" htmlFor="projectDescription">
          Description:
        </label>
        <textarea
          required
          placeholder="Project Description"
          value={newProjectDescription}
          rows="3"
          onChange={(e) => setNewProjectDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-purple-400 text-base"
          id="projectDescription"
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4">
          <button
            type="button"
            onClick={handleCreateProject}
            disabled={isCreating}
            className={`w-full sm:w-auto px-4 py-2 bg-[var(--purple-button)] text-[var(--purple-button-foreground)] rounded-md hover:bg-[var(--purple-button-hover)] ${
              isCreating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCreating ? "Creating..." : "Create Project"}
          </button>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--secondary)] text-[var(--muted-foreground)] rounded-md hover:bg-[var(--muted)]"
          >
            Cancel
          </button>
        </div>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>
    </div>
  );
};

const ProjectCard = ({ title, _id, deleteProject }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isActive = id === _id;
  const handleClick = () => {
    navigate(`/dashboard/project/${_id}`);
  };

  return (
    <div
      className={`flex flex-col justify-center cursor-pointer items-center rounded-lg mb-2 p-2 w-full text-center transition-all duration-200
        shadow-[0_4px_2px_rgba(0,0,0,0.1)]
        ${
          isActive
            ? "bg-[var(--purple-button-hover)] border-r-[3px] border-solid border-[var(--sidebar-border)]"
            : "hover:bg-[var(--sidebar-accent)]"
        }
      `}
      onClick={handleClick}
    >
      <div className="flex flex-row justify-between items-center w-full pl-3">
        <h2 className="text-md font-sans w-full text-left">{title}</h2>
        {isActive ? (
          <div
            className="group flex items-center justify-center w-[30px] h-[25px] cursor-pointer hover:bg-red-400 rounded-full"
            onClick={deleteProject}
          >
            <AiFillDelete className="scale-120 text-red-400 group-hover:text-gray-50" />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [addProjectMenu, setAddProjectMenu] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  // Swipe state
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchCurrentX, setTouchCurrentX] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Only enable swipe on mobile
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // Handle touch start
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchCurrentX(e.touches[0].clientX);
    setIsAnimating(false);
  };
  // Handle touch move
  const handleTouchMove = (e) => {
    if (!isMobile || touchStartX === null) return;
    setTouchCurrentX(e.touches[0].clientX);
  };
  // Handle touch end
  const handleTouchEnd = () => {
    if (!isMobile || touchStartX === null) return;
    const deltaX = touchCurrentX - touchStartX;
    if (deltaX < -60) {
      // Swiped left
      setIsAnimating(true);
      setTimeout(() => {
        setIsSidebarOpen(false);
        setIsAnimating(false);
      }, 250);
    }
    setTouchStartX(null);
    setTouchCurrentX(null);
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || isCreating) return;

    setIsCreating(true);
    setMessage("");
    try {
      const response = await API.post("/projects/", { name: newProjectName });

      if (!response.data || !response.data.newProject) {
        setMessage("Failed to create project");
        return;
      }
      navigate(`/dashboard/project/${response.data.newProject._id}`);
      fetchProjects();
      setMessage("Project created successfully");
      setNewProjectName("");
      setNewProjectDescription("");
      setAddProjectMenu(false);
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const closeModal = () => {
    setAddProjectMenu(false);
    setNewProjectName("");
    setNewProjectDescription("");
    setMessage("");
  };

  const fetchProjects = async () => {
    try {
      const response = await API.get("/users/projects");
      if (response.status === 200) {
        setProjects(response.data.projects);
      } else {
        console.error("Failed to fetch projects:", response);
        setMessage("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage("Error fetching projects");
    }
  };

  const deleteProject = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const response = await API.delete(`/projects/${id}`);
      if (response.status === 204) {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        setMessage("Project deleted successfully");
        navigate("/");
        fetchProjects();
      } else {
        console.error("Failed to delete project:", response);
        setMessage("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      setMessage("Error deleting project");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Calculate sidebar style for animation
  const sidebarStyle = isMobile
    ? {
        transform:
          touchStartX !== null && touchCurrentX !== null
            ? `translateX(${Math.min(0, touchCurrentX - touchStartX)}px)` // Only allow left movement
            : isAnimating
            ? "translateX(-100%)"
            : "translateX(0)",
        transition: isAnimating ? "transform 0.25s ease" : "none",
      }
    : {};

  return (
    <div
      className=" sm:w-full flex flex-col bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)] h-screen items-center shadow py-1"
      style={sidebarStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-[60px]  flex flex-row gap-4 items-center justify-center font-[Shantell_sans] text-[var(--sidebar-primary)] text-2xl font-bold">
        <img src="/icon.svg" className="h-10 mx-auto" alt="Logo" />
        kanban
      </div>

      <div className="w-full h-full flex flex-col items-center justify-between">
        <div className="w-full flex flex-col items-center justify-start">
          <h2 className="text-md font-sans w-full py-2 pl-7 border-t text-sm text-[var(--sidebar-muted)] font-medium border-[var(--border)]">
            Projects
          </h2>
          <div
            className={`flex flex-col p-2 w-full max-h-[530px] overflow-auto ${customScrollbarCss}`}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.name}
                _id={project.id}
                deleteProject={deleteProject}
              />
            ))}
          </div>
        </div>

        <div
          className="flex h-12 pb-3 w-12 bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] text-5xl rounded-full justify-center items-center hover:bg-red-400 hover:text-gray-50 cursor-pointer mt-4"
          onClick={() => {
            setAddProjectMenu(true);
            setMessage("");
            setNewProjectName("");
            setNewProjectDescription("");
          }}
        >
          +
        </div>
      </div>

      {addProjectMenu && (
        <Modal
          onClose={closeModal}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          newProjectDescription={newProjectDescription}
          setNewProjectDescription={setNewProjectDescription}
          handleCreateProject={handleCreateProject}
          isCreating={isCreating}
          message={message}
        />
      )}
    </div>
  );
};

export default Sidebar;
