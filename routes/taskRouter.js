import express from "express";
const taskRouter = express.Router();
import { body, query } from "express-validator";
import { validator } from "../middlewares/validator.js";
import { userAuthentication } from "../middlewares/auth.js";
import {
  deleteATask,
  getHome,
  getTask,
  postCreate,
  statusUpdate,
} from "../controllers/taskController.js";

taskRouter.get("/home", userAuthentication, getHome);

taskRouter.get(
  "/getTask/:id",
  query("id").not().isEmpty().withMessage("enter  id of the task"),
  userAuthentication,
  getTask
);

taskRouter.post(
  "/create",
  body("title").not().isEmpty().withMessage("enter title"),
  body("description").not().isEmpty().withMessage("enter a short description"),
  validator,
  userAuthentication,
  postCreate
);

taskRouter.put(
  "/statusUpdate",
  body("status").not().isEmpty().withMessage("enter the status"),
  query("id").not().isEmpty().withMessage("enter  id of the task"),
  validator,
  userAuthentication,
  statusUpdate
);

taskRouter.delete(
  "/deleteTask",
  query("id").not().isEmpty().withMessage("enter  id of the task"),
  validator,
  userAuthentication,
  deleteATask
);

export default taskRouter;
