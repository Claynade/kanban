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
          </div>
          <div>
            <div>
              Assigned To:{" "}
              {task.assignedTo.map((user) => (
                <span key={user._id} className="mr-2">
                  {user._id}
                </span>
              ))}
            </div>
            <div>Status: {task.status}</div>
            <div>Priority: {task.priority}</div>
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
