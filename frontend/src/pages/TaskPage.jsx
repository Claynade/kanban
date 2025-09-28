import React, { use } from "react";
import API from "../utils/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";

const mockComments = [
  {
    _id: "1",
    content: "Great article!",
    createdAt: new Date().toISOString(),
    author: { username: "Alice", role: "admin" },
    replies: [
      {
        _id: "1-1",
        content: "Thanks!",
        createdAt: new Date().toISOString(),
        author: { username: "Bob", role: "user" },
      },
    ],
  },
];

const TaskPage = () => {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);

  const handleAddComment = (content) => {
    console.log("New Comment:", content);
  };

  const handleAddReply = (parentId, content) => {
    console.log(`Reply to ${parentId}:`, content);
  };
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await API.get(`/tasks/${id}/${taskId}`);
        if (response.status !== 200) {
          console.error("Failed to fetch task:", response);
          return;
        }
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, []);
  return (
    <div>
      {task ? (
        <div className="flex flex-row gap-4 p-4">
          <div className="flex flex-col gap-2">
            <div>{task.title}</div>
            <div>{task.createdAt}</div>
            <div>Description: {task.description}</div>
            <CommentSection
              comments={mockComments}
              canComment={true}
              handleAddComment={handleAddComment}
              handleAddReply={handleAddReply}
            />
            <div>
              Assigned To:{" "}
              {task.assignedTo && task.assignedTo.length > 0 ? (
                task.assignedTo.map((user) => (
                  <span
                    key={user.id?._id || user._id}
                    className="mr-2 flex items-center gap-1"
                  >
                    <img
                      src={user.id?.profilePicture || "/placeholder.svg"}
                      alt={user.id?.name || "Avatar"}
                      className="w-5 h-5 rounded-full inline-block"
                    />
                    {user.id?.name || user.name || "Unknown"}
                  </span>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
            <div>Status: {task.status}</div>
            <div>Priority: {task.priority}</div>
            <div>
              Created By: {task.createdBy ? task.createdBy.name : "Unknown"}
            </div>
            <div>
              Created By: {task.createdBy ? task.createdBy.username : "Unknown"}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
};

export default TaskPage;
