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
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60px]">
      <div
        className="h-[40px] p-1 text-lg text-center font-bold font-[Shantell_sans] text-white w-[260px] rounded-lg bg-purple-600"
        onClick={() => setAddTaskMenu(true)}
      >
        Add a task
      </div>
      {addTaskMenu && (
        <AddTaskModel
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

  const boardRef = useRef(null);
  const handleBackgroundClick = (e) => {
    if (boardRef.current && e.target === boardRef.current) {
      setCardSelected(null);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  return (
    <div className="project-background flex flex-row gap-3 justify-evenly bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex flex-row gap-3 flex-grow justify-center">
        <ListCard
          type="Backlog"
          status="backlog"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          setAddTaskMenu={setAddTaskMenu}
          setDefaultStatus={setDefaultStatus}
          fetchProject={fetchProject}
        />
        <ListCard
          type="To-Do"
          status="todo"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          setAddTaskMenu={setAddTaskMenu}
          setDefaultStatus={setDefaultStatus}
          fetchProject={fetchProject}
        />
        <ListCard
          type="Done"
          status="done"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          setAddTaskMenu={setAddTaskMenu}
          setDefaultStatus={setDefaultStatus}
          fetchProject={fetchProject}
        />
      </div>

      <div className="flex flex-col gap-4 justify-start items-center h-[500px] w-[300px]">
        <div className="flex flex-col items-center bg-[var(--card)] text-[var(--foreground)] rounded-lg">
          <div className=" text-sm font-medium py-2 ">Notes</div>
          <textarea
            className={`text-sm w-[295px] h-[180px] p-3 border-t rounded-b-lg border-[var(--border)] focus:outline-none focus:bg-[var(--muted)] ${customScrollbarCss} focus:[&::-webkit-scrollbar-thumb]:bg-[var(--secondary)]`}
          ></textarea>{" "}
          {/* it isnt unique for different projects. Todo: make it unique */}
        </div>

        <div className="flex flex-col gap-1 p-2 justify-start items-center grow border-2 border-[var(--border)] shadow-md">
          <div className="font-bold text-lg text-[var(--foreground)] f border-b-3 border-[var(--border)] w-full text-center">
            Logs
          </div>
          <div className="font-bold text-lg w-[275px] h-[140px]"></div>
        </div>

        <AddTask
          addTaskMenu={addTaskMenu}
          setAddTaskMenu={setAddTaskMenu}
          fetchProject={fetchProject}
          defaultStatus={defaultStatus}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
