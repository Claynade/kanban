import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import { useEffect, useRef } from "react";
import ListCard from "../components/ListCard";
import AddTaskModel from "../components/AddTaskModel";
import { customScrollbarCss } from "../utils/customScrollbarCss";

const AddTask = ({
  addTaskMenu,
  setAddTaskMenu,
  fetchProject,
  defaultStatus,
  setTasks,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60px]">
      <div
        className="hidden md:block h-[40px] p-1 text-lg text-center font-bold text-white w-[260px] rounded-lg bg-purple-600"
        onClick={() => setAddTaskMenu(true)}
      >
        Add a task
      </div>
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

const ghostTask = {
  title: "Could not fetch task",
  description: "Ghost task",
  status: "backlog",
  projectId: 404,
  createdBy: 404,
  assignedTo: 404,
};
const ProjectPage = () => {
  const { id } = useParams();
  const [addTaskMenu, setAddTaskMenu] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [defaultStatus, setDefaultStatus] = useState("backlog");
  const [cardSelected, setCardSelected] = useState(0);

  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${id}`);
      const projectData = response.data;
      if (!projectData) {
        setMessage("Failed to load project");
        console.error("Project data not found in response:", response.data);
        return;
      }
      const taskResponses = await Promise.all(
        projectData.tasks.map((task) =>
          API.get(`/tasks/${id}/${task}`)
            .then((res) => res.data)
            .catch((err) => {
              console.error("Failed to fetch task:", task._id, err);
              return ghostTask;
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
    if (id) {
      fetchProject();
    }
  }, [id]);

  const [activeTab, setActiveTab] = useState("backlog");
  const tabList = [
    { label: "Backlog", status: "backlog" },
    { label: "To-Do", status: "todo" },
    { label: "Done", status: "done" },
  ];

  return (
    <div className="project-background flex flex-col md:flex-row gap-3 justify-evenly overflow-y-auto overflow-x md:overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="md:hidden flex flex-row justify-center gap-2 py-2">
        {tabList.map((tab) => (
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

      <div className="flex flex-row gap-3 flex-grow justify-center">
        <div className="w-full md:w-auto flex justify-center">
          <div className="md:hidden">
            {tabList.map((tab) =>
              activeTab === tab.status ? (
                <ListCard
                  key={tab.status}
                  type={tab.label}
                  status={tab.status}
                  tasks={tasks}
                  cardSelected={cardSelected}
                  setCardSelected={setCardSelected}
                  setAddTaskMenu={setAddTaskMenu}
                  setDefaultStatus={setDefaultStatus}
                  fetchProject={fetchProject}
                />
              ) : null
            )}
          </div>
          <div className="hidden md:flex flex-row gap-3">
            {tabList.map((tab) => (
              <ListCard
                key={tab.status}
                type={tab.label}
                status={tab.status}
                tasks={tasks}
                cardSelected={cardSelected}
                setCardSelected={setCardSelected}
                setAddTaskMenu={setAddTaskMenu}
                setDefaultStatus={setDefaultStatus}
                fetchProject={fetchProject}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full sm:w-[350px] md:w-[300px] lg:w-[320px] xl:w-[350px] min-w-[220px] max-w-full md:max-w-[350px] items-center md:items-stretch justify-start md:justify-start">
        {/* Notes: only on large screens */}
        <div className="hidden lg:flex flex-col bg-[var(--card)] text-[var(--foreground)] rounded-lg w-full">
          <div className="text-sm font-medium py-2 px-4">Notes</div>
          <textarea
            className={`text-sm w-full h-[120px] p-3 border-t rounded-b-lg border-[var(--border)] focus:outline-none focus:bg-[var(--muted)] ${customScrollbarCss} focus:[&::-webkit-scrollbar-thumb]:bg-[var(--secondary)]`}
          ></textarea>
        </div>

        {/* Logs: always visible, responsive */}
        <div className="flex flex-col gap-1 p-2 items-center w-full border-2 border-[var(--border)] shadow-md min-h-[120px]">
          <div className="font-bold text-lg text-[var(--foreground)] border-b-3 border-[var(--border)] w-full text-center">
            Logs
          </div>
          <div className="font-bold text-lg w-full h-[80px]"></div>
        </div>

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
};

export default ProjectPage;
