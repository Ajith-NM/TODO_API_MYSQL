import { Tasks } from "../models/taskmodel.js";
import {
  CreateATask,
  DeleteTask,
  GetAllTasks,
  UpdateTaskStatus,
} from "../services/taskService.js";

// @  get all tasks
// @ /task/home
export const getHome = async (req, res) => {
  try {
    let response;
    const allTasks = await GetAllTasks(req.userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (allTasks.length === 0) {
      response = "please create a new task";
    } else {
      response = allTasks;
    }
    res.status(200).json({ tasks: response });
  } catch (error) {
    res.json({ error: error });
  }
};

// @  create a new task
// @ /task/create
export const postCreate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;
    let response;
    const newTask = await CreateATask(title, description, "pending", userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (newTask === "failed") {
      response = "failed to create new task";
    } else {
      response = "new task added";
    }

    res.status(200).json({
      response: response,
    });
  } catch (error) {
    res.json({ error: error });
  }
};

// @  gupdate status of the task
// @ /task/statusUpdate
export const statusUpdate = async (req, res) => {
  try {
    const status = req.body.status;
    const id = req.query.id;
    const userId = req.userId;
    let response;
    const statusUpdate = await UpdateTaskStatus(status, id, userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (statusUpdate == "failed") {
      response = "failed to update status";
    } else {
      response = "task updated";
    }
    res.status(200).json({
      response: response,
    });
  } catch (error) {
    res.json({ error: error });
  }
};

// @  delete the completed task
// @ /task/deleteTask
export const deleteATask = async (req, res) => {
  try {
    const id = req.query.id;
    const userId = req.userId;

    let response;
    const taskDelete = await DeleteTask(id, userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (taskDelete == "failed") {
      response = "failed to delete task";
    } else {
      response = "task deleted";
    }
    res.status(200).json({
      response: response,
    });
  } catch (error) {
    res.json({ error: error });
  }
};
