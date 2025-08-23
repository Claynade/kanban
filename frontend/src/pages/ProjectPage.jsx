import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../utils/api";
import ListCard from "../components/ListCard";
import AddTaskModel from "../components/AddTaskModel";
import { customScrollbarCss } from "../utils/customScrollbarCss";

// Constants
const TAB_LIST = [
  { label: "Backlog", status: "backlog" },
  { label: "To-Do", status: "todo" },
  { label: "Done", status: "done" },
];

// Reusable Components
const AddTaskButton = ({ onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`h-[40px] p-1 text-lg text-center font-bold text-white w-[260px] rounded-lg bg-purple-600 ${className}`}
  >
    Add a task
  </button>
);

const AddTask = ({
  addTaskMenu,
  setAddTaskMenu,
  fetchProject,
  defaultStatus,
  setTasks,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60px]">
      <AddTaskButton
        onClick={() => setAddTaskMenu(true)}
        className="hidden 2xl:block"
      />
      {addTaskMenu && (
        <AddTaskModel
          setTasks={setTasks}
          setAddTaskMenu={setAddTaskMenu}
          fetchProject={fetchProject}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );
};

const GHOST_TASK = {
  title: "Could not fetch task",
  description: "Ghost task",
  status: "backlog",
  projectId: 404,
  createdBy: 404,
  assignedTo: 404,
};

// Mobile tab selection component
const MobileTabs = ({ activeTab, setActiveTab }) => (
  <div className="md:hidden flex flex-row justify-center gap-2 py-2">
    {TAB_LIST.map((tab) => (
      <button
        key={tab.status}
        className={`px-4 py-2 rounded-lg font-bold ${
          activeTab === tab.status
            ? "bg-purple-600 text-white"
            : "bg-[var(--muted)] text-[var(--foreground)]"
        }`}
        onClick={() => setActiveTab(tab.status)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// Custom hook for project data
const useProjectData = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${projectId}`);
      const projectData = response.data;

      if (!projectData) {
        setMessage("Failed to load project");
        console.error("Project data not found in response:", response.data);
        return;
      }

      const taskResponses = await Promise.all(
        projectData.tasks.map((task) =>
          API.get(`/tasks/${projectId}/${task}`)
            .then((res) => res.data)
            .catch((err) => {
              console.error("Failed to fetch task:", task._id, err);
              return GHOST_TASK;
            })
        )
      );

      setTasks(taskResponses);
    } catch (err) {
      console.error("Error fetching project:", err);
      setMessage("Error loading project");
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { tasks, setTasks, message, fetchProject };
};

const ProjectPage = () => {
  const { id } = useParams();
  const [addTaskMenu, setAddTaskMenu] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("backlog");
  const [cardSelected, setCardSelected] = useState(0);
  const [activeTab, setActiveTab] = useState("backlog");

  // Use custom hook to manage project data
  const { tasks, setTasks, message, fetchProject } = useProjectData(id);

  // Extract common props to reduce repetition
  const commonProps = {
    tasks,
    cardSelected,
    setCardSelected,
    setAddTaskMenu,
    setDefaultStatus,
    fetchProject,
  };

  // Component for Mobile View
  const MobileView = () => (
    <div className="md:hidden pb-6 w-full flex flex-col items-center gap-4 flex-grow min-w-0">
      {TAB_LIST.map(
        (tab) =>
          activeTab === tab.status && (
            <div key={tab.status} className="flex justify-center w-full">
              <ListCard
                type={tab.label}
                status={tab.status}
                {...commonProps}
                className="max-w-[400px] w-full"
              />
            </div>
          )
      )}
      {addTaskMenu && (
        <AddTaskModel
          setTasks={setTasks}
          setAddTaskMenu={setAddTaskMenu}
          fetchProject={fetchProject}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );

  // Component for Medium Screen View
  const MdView = () => (
    <div className="hidden md:flex lg:hidden xl:hidden 2xl:hidden flex-row gap-6 w-full justify-center items-center">
      {TAB_LIST.map((tab) => (
        <ListCard
          key={tab.status}
          type={tab.label}
          status={tab.status}
          {...commonProps}
          className="flex-grow min-w-[180px] max-w-[400px]"
        />
      ))}
    </div>
  );

  // Component for Large/XL View
  const LgXlView = () => (
    <div className="hidden lg:flex xl:flex 2xl:hidden flex-row gap-8 w-full justify-center items-center">
      {TAB_LIST.map((tab) => (
        <ListCard
          key={tab.status}
          type={tab.label}
          status={tab.status}
          {...commonProps}
          className="flex-grow min-w-[220px] max-w-[400px]"
        />
      ))}
      {addTaskMenu && (
        <AddTaskModel
          setTasks={setTasks}
          setAddTaskMenu={setAddTaskMenu}
          fetchProject={fetchProject}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );

  // Component for Notes Panel
  const NotesPanel = () => (
    <div className="flex flex-col bg-[var(--card)] text-[var(--foreground)] rounded-lg w-full mb-2">
      <div className="text-sm font-medium py-2 px-4">Notes</div>
      <textarea
        className={`text-sm w-full h-[120px] p-3 border-t rounded-b-lg border-[var(--border)] focus:outline-none focus:bg-[var(--muted)] ${customScrollbarCss} focus:[&::-webkit-scrollbar-thumb]:bg-[var(--secondary)]`}
      ></textarea>
    </div>
  );

  // Component for Logs Panel
  const LogsPanel = () => (
    <div className="flex flex-col gap-1 p-2 items-center w-full border-2 border-[var(--border)] shadow-md min-h-[120px] mb-2">
      <div className="font-bold text-lg text-[var(--foreground)] border-b-3 border-[var(--border)] w-full text-center">
        Logs
      </div>
      <div className="font-bold text-lg w-full h-[80px]"></div>
    </div>
  );

  // Component for 2XL and Above View
  const TwoXlView = () => (
    <div className="hidden 2xl:flex pb-6 flex-row gap-4 w-full justify-center">
      <div className="flex flex-row gap-4 flex-grow max-w-6xl min-w-0 justify-center items-stretch">
        {TAB_LIST.map((tab) => (
          <ListCard
            key={tab.status}
            type={tab.label}
            status={tab.status}
            {...commonProps}
            className="flex-grow min-w-[220px] max-w-[350px]"
          />
        ))}
      </div>
      {/* Side panel*/}
      <div className="flex flex-col gap-4 w-[300px] min-w-[300px] max-w-[300px] flex-shrink-0 items-stretch justify-start">
        <NotesPanel />
        <LogsPanel />
        <div className="w-full flex justify-center">
          <AddTask
            addTaskMenu={addTaskMenu}
            setAddTaskMenu={setAddTaskMenu}
            fetchProject={fetchProject}
            defaultStatus={defaultStatus}
            setTasks={setTasks}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="project-background flex flex-col justify-start overflow-x md:overflow-hidden bg-[var(--background)] text-[var(--foreground)] h-full w-full">
      <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileView />
      <MdView />
      <LgXlView />
      <TwoXlView />
    </div>
  );
};

export default ProjectPage;
