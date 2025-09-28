import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  username: { type: String, required: true, unique: true, trim: true },
  profilePicture: { type: String, default: "" },
  projects: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
      name: { type: String, required: true },
    },
  ],
});
export const User = mongoose.model("User", userSchema);