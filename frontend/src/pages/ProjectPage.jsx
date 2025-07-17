import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../utils/api";
import { useEffect, useRef } from "react";
import { AiFillDelete } from "react-icons/ai";

const customScrollbarCss =
  "overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300";

const testJSON = [
  {
    title: "Fix login redirect issue",
    description: "Users are not redirected to dashboard after login.",
    status: "backlog",
    projectId: 654039863,
    createdBy: 203008453,
    assignedTo: [203008453, 103402823],
  },
];

function randomColor() {
  const colors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
function randomRotation() {
  const rotations = [
    "-rotate-1",
    "-rotate-2",
    "rotate-0",
    "rotate-1",
    "rotate-2",
  ];
  return rotations[Math.floor(Math.random() * rotations.length)];
}

const List = ({
  type,
  status,
  tasks,
  cardSelected,
  setCardSelected,
  fetchProject,
}) => {
  const { id } = useParams();
  const filtered_tasks = tasks.filter(
    (task) =>
      /* task.projectId === id && */ task.status === status.toLowerCase()
  );
  const displayTransferButtons = filtered_tasks.some(
    (task) => task._id === cardSelected
  );
  const handleClick = (id) => {
    setCardSelected(id);
  };
  const deleteTask = async () => {
    const task = filtered_tasks.find((task) => task._id === cardSelected);
    if (!task) {
      console.error("Task not found for deletion");
      return;
    }
    try {
      const response = await API.delete(`/tasks/${id}/${task._id}`);
      if (response.status === 200) {
        setCardSelected(null);
        fetchProject();
      } else {
        console.error("Failed to delete task:", response);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const markComplete = async () => {
    // find the card with cardselected id
    const task = filtered_tasks.find((task) => task._id === cardSelected);
    if (!task) {
      console.error("Task not found for marking complete");
      return;
    }
    const response = await API.put(`/tasks/${id}/${task._id}`, {
      status: "done",
    });
    if (response.status === 200) {
      setCardSelected(null);
      fetchProject();
    } else {
      console.error("Failed to mark task as done:", response);
    }
  };
  const markTodo = async () => {
    const task = filtered_tasks.find((task) => task._id === cardSelected);
    if (!task) {
      console.error("Task not found for marking to-do");
      return;
    }
    const response = await API.put(`/tasks/${id}/${task._id}`, {
      status: "todo",
    });
    if (response.status === 200) {
      console.log("Task marked as to-do successfully");
      setCardSelected(null);
      fetchProject();
    } else {
      console.error("Failed to mark task as to-do:", response);
    }
  };
  const markInProgress = async () => {
    const task = filtered_tasks.find((task) => task._id === cardSelected);
    if (!task) {
      console.error("Task not found for marking in progress");
      return;
    }
    const response = await API.put(`/tasks/${id}/${task._id}`, {
      status: "backlog",
    });
    if (response.status === 200) {
      console.log("Task marked as in progress successfully");
      setCardSelected(null);
      fetchProject();
    } else {
      console.error("Failed to mark task as in progress:", response);
    }
  };
  return (
    <div className="flex">
      <div className="h-[540px] w-[312px] bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg shadow-lg shadow-gray-300">
        <div className="flex flex-col relative left-1 top-1 font-[Shantell_sans] bg-amber-50 w-[303px] h-[532px] items-center rounded-lg shadow text-black py-4 pl-4">
          <div className="flex justify-center h-[40px] w-full mb-1 border-b-3 border-gray-300 text-gray-700 text-center text-xl font-bold">
            {type}
          </div>
          <div
            className={`flex flex-col py-3 items-center justify-start h-full overflow-y-auto overflow-x-hidden ${customScrollbarCss}`}
          >
            {filtered_tasks.length > 0 &&
              filtered_tasks.map((task) => (
                <Card
                  key={task._id}
                  _id={task._id}
                  handleClick={() => handleClick(task._id)}
                  title={task.title}
                  description={task.description}
                  createdBy={task.createdBy}
                  cardSelected={cardSelected}
                />
              ))}
          </div>
        </div>
        {displayTransferButtons && (
          <div className="flex h-[35px] mt-4">
            {status == "todo" && (
              <div className="flex w-full">
                <div
                  className="bg-white pt-1 w-1/2 ml-4 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 rounded-l-lg text-center"
                  onClick={markInProgress}
                >
                  backlog
                </div>
                <div
                  className="bg-purple-600 pt-1 text-white w-1/2 border-2 border-purple-600 mr-1 hover:bg-purple-700 rounded-r-lg text-center"
                  onClick={markComplete}
                >
                  done
                </div>
                <div
                  className="h-full w-[45px] flex items-center justify-center rounded-full hover:bg-gray-300"
                  onClick={deleteTask}
                >
                  <AiFillDelete className="scale-150 text-gray-700" />
                </div>
              </div>
            )}
            {status == "backlog" && (
              <div className="flex w-full">
                <div
                  className="bg-white pt-1 w-1/2 ml-4 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 rounded-l-lg text-center"
                  onClick={markTodo}
                >
                  to-do
                </div>
                <div
                  className="bg-purple-600 pt-1 text-white w-1/2 border-2 border-purple-600 mr-1 hover:bg-purple-700 rounded-r-lg text-center"
                  onClick={markComplete}
                >
                  done
                </div>
                <div
                  className="h-full w-[45px] flex items-center justify-center rounded-full hover:bg-gray-300"
                  onClick={deleteTask}
                >
                  <AiFillDelete className="scale-150 text-gray-700" />
                </div>
              </div>
            )}
            {status == "done" && (
              <div className="flex w-full">
                <div
                  className="bg-white pt-1 w-1/2 ml-4 text-gray-600 border-2 border-gray-300 hover:bg-gray-200 rounded-l-lg text-center"
                  onClick={markTodo}
                >
                  to-do
                </div>
                <div
                  className="bg-purple-600 pt-1 text-white w-1/2 border-2 border-purple-600 mr-1 hover:bg-purple-700 rounded-r-lg text-center"
                  onClick={markInProgress}
                >
                  backlog
                </div>
                <div
                  className="h-full w-[45px] flex items-center justify-center rounded-full hover:bg-gray-300"
                  onClick={deleteTask}
                >
                  <AiFillDelete className="scale-150 text-gray-700" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({
  _id,
  handleClick,
  title,
  description,
  createdBy,
  cardSelected,
}) => {
  const [username, setUsername] = useState("Loading...");
  const randomColorClass = randomColor();
  const randomRotationClass = randomRotation();
  const isSelected = cardSelected === _id;
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const response = await API.get(`/users/u/${createdBy}`);
        if (response.status === 200) {
          setUsername(response.data.username);
        } else {
          console.error("Failed to fetch user:", response);
          setUsername(response.data.username || "Unknown User");
        }
      };
      fetchUser();
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);
  return (
    <div className="w-full max-h-[250px] mb-4 pr-4 " onClick={handleClick}>
      <div
        className={`${randomColorClass} ${randomRotationClass} ${
          isSelected ? "border-white border-4" : ""
        } h-full shadow p-5 rounded w-full`}
      >
        <h2 className="text-lg font-bold mb-2 text-gray-600">{title}</h2>
        <p className="text-gray-700">Decription: {description}</p>{" "}
        {/* TODO: set letters limit here */}
        <p className="text-gray-700">Created By: {username}</p>
      </div>
    </div>
  );
};

const AddTaskModel = ({ setAddTaskMenu, fetchProject }) => {
  const { id } = useParams();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "backlog",
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
    try {
      const response = await API.post(`/tasks/${id}`, newTask, {
        withCredentials: true,
      });
      if (response.status === 201) {
        console.log("Task added successfully :", response.data);
        await fetchProject();
      } else {
        console.error("Failed to add task :", response);
      }
    } catch (err) {
      console.error("Error adding task :", err);
    } finally {
      setAddTaskMenu(false);
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl text-gray-600 font-bold mb-4">Add New Task</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            name="title"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-purple-400"
            value={newTask.title}
            onChange={handleChange}
          />
          <textarea
            placeholder="Task Description"
            name="description"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-purple-400"
            rows="4"
            value={newTask.description}
            onChange={handleChange}
          ></textarea>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              onClick={handleSubmit}
            >
              Add Task
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              onClick={() => setAddTaskMenu(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTask = ({ addTaskMenu, setAddTaskMenu, fetchProject }) => {
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
          API.get(`/tasks/${id}/${task}`, { withCredentials: true })
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
    <div className="project-background flex flex-row gap-3 justify-evenly">
      <div className="flex flex-row gap-3 flex-grow justify-center">
        <List
          type="To-Do"
          status="todo"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          fetchProject={fetchProject}
        />
        <List
          type="Backlog"
          status="backlog"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          fetchProject={fetchProject}
        />
        <List
          type="Done"
          status="done"
          tasks={tasks}
          cardSelected={cardSelected}
          setCardSelected={setCardSelected}
          fetchProject={fetchProject}
        />
      </div>

      <div className="flex flex-col gap-4 justify-start items-center py-4 h-[500px] w-[300px]">
        <div className="flex flex-col items-center bg-gradient-to-br from-yellow-100 to-orange-100">
          <div className="font-bold text-lg pt-2 text-gray-600 font-[Shantell_sans]">
            Notes
          </div>
          <div className="font-bold text-lg bg-amber-50 w-[295px] h-[180px] font-[Shantell_sans] border-5 rounded-lg border-orange-100"></div>
        </div>
        <div className="flex flex-col gap-1 p-2 justify-start items-center grow border-2 border-box border-gray-200  shadow-md">
          <div className="font-bold text-lg text-gray-600 font-[Shantell_sans] border-b-3 border-gray-300 w-full text-center">
            Logs
          </div>
          <div className="font-bold text-lg bg-gray-50 w-[275px] h-[140px] font-[Shantell_sans]"></div>
        </div>
        <AddTask
          addTaskMenu={addTaskMenu}
          setAddTaskMenu={setAddTaskMenu}
          fetchProject={fetchProject}
        />
      </div>

      {/*       <div className='flex flex-col font-[Shantell_sans] bg-gradient-to-tl from-red-300 to-orange-300 w-[300px] h-[500px] items-center rounded-lg shadow text-black p-4'>
        <div className='flex justify-center h-[40px] w-full border-b-3 border-red-100 text-center text-xl font-bold'>
        completed
        </div>
        <Card id={id} />
        <Card id={id} />
        <Card id={id} />
        </div>
        */}
    </div>
  );
};

export default ProjectPage;
