import { Tasks } from "../models/taskmodel.js";
import {
  CreateATask,
  DeleteTask,
  GetAllTasks,
  GetTask,
  UpdateTaskStatus,
} from "../services/taskService.js";

// @  get all tasks
// @ /task/home
export const getHome = async (req, res) => {
  try {
    const allTasks = await GetAllTasks(req.userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (allTasks.length === 0) {
      return res
        .status(400)
        .json({ status: false, response: "please create a new task" });
    } else {
      return res.status(200).json({ status: true, response: allTasks });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "something went wrong" });
  }
};

// @  get a task
// @ /task/getTask/:id
export const getTask = async (req, res) => {
  try {
    const id = req.params.id;
    const Task = await GetTask(id)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (Task) {
      return res.status(200).json({ status: true, response: Task });
    } else {
      return res
        .status(400)
        .json({ status: false, response: "please create a new task" });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "something went wrong" });
  }
};

// @  create a new task
// @ /task/create
export const postCreate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    const newTask = await CreateATask(title, description, "pending", userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (newTask) {
      return res.status(200).json({ status: true, response: newTask });
    } else {
      res
        .status(400)
        .json({ status: false, response: "failed to create new task" });
    }
  } catch (error) {
    res.status(400).json({ status: false, response: "something went wrong" });
  }
};

// @  update status of the task
// @ /task/statusUpdate
export const statusUpdate = async (req, res) => {
  try {
    const status = req.body.status;
    const id = req.query.id;
    const userId = req.userId;
    const statusUpdate = await UpdateTaskStatus(status, id, userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (statusUpdate) {
      return res
        .status(200)
        .json({ status: true, response: "task status updated" });
    } else {
      return res
        .status(400)
        .json({ status: false, response: "failed to update status" });
    }
  } catch (error) {
    res.status(401).json({ status: false, response: "something went wrong" });
  }
};

// @  delete the completed task
// @ /task/deleteTask
export const deleteATask = async (req, res) => {
  try {
    const id = req.query.id;
    const userId = req.userId;

    const taskDelete = await DeleteTask(id, userId)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("error=", err);
      });

    if (taskDelete) {
      return res.status(200).json({ status: true, response: "task deleted" });
    } else {
      return res
        .status(400)
        .json({ status: false, response: "failed to delete task" });
    }
  } catch (error) {
    res.status(401).json({ status: false, response: "something went wrong" });
  }
};
