import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ["backlog", "todo", "done"], default: "backlog" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  tags: [{ type: String }],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
  }],
});
export const Task = mongoose.model("Task", taskSchema);