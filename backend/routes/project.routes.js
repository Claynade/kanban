import express from "express";
import {
  getProject,
  createProject,
  updateProject,
  deleteProject,
  generateShareableLink,
  addAuthorizedUser,
  removeAuthorizedUser,
  makeAdmin,
  removeAdmin,
} from "../controllers/project.controller.js";

const router = express.Router();

router.get("/:id", getProject);
router.post("/create/", createProject);
router.put("/update/:id", updateProject);
router.delete("/delete/:id", deleteProject);
router.post("/:id/share", generateShareableLink);
router.post("/:id/add-user", addAuthorizedUser);
router.post("/:id/remove-user", removeAuthorizedUser);
router.post("/:id/make-admin", makeAdmin);
router.post("/:id/remove-admin", removeAdmin);

export default router;
