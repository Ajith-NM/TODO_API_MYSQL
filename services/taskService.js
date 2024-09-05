import { Tasks } from "../models/taskmodel.js";

// get all tasks
export const GetAllTasks = async (id) => {
  return new Promise((resolve, reject) => {
    Tasks.findAll({ where: { user_Id: id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("failed");
      });
  });
};

//get task
export const GetTask = async (id) => {
  return new Promise((resolve, reject) => {
    Tasks.findOne({ where: { task_Id: id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("failed");
      });
  });
};

//ceate a new task
export const CreateATask = async (title, desc, status, id) => {
  return new Promise((resolve, reject) => {
    Tasks.create({
      title: title,
      description: desc,
      status: status,
      user_Id: id,
    })
      .then((data) => {
        resolve(data.dataValues);
      })
      .catch(() => {
        reject(false);
      });
  });
};

//update task status
export const UpdateTaskStatus = async (status, id, user_Id) => {
  return new Promise((resolve, reject) => {
    Tasks.update(
      { status: status },
      { where: { task_Id: id, user_Id: user_Id } }
    )
      .then((data) => {
        if (data[0]) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject(false);
      });
  });
};

//delete unwanted tasks
export const DeleteTask = async (id, user_Id) => {
  return new Promise((resolve, reject) => {
    Tasks.destroy({ where: { task_Id: id, user_Id: user_Id } })
      .then((data) => {
        if (data) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(false);
      });
  });
};
