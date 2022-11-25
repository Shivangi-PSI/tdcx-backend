const db = require("../models");
const utilities = require("../utils/common");

const getAllTasks = (req, res) => {
  const taskRef = db.ref("tasks");
  taskRef
    .orderByChild("userId")
    .equalTo(req.user.id)
    .on("value", async (snapshot) => {
      const tasks = snapshot.val();
      return utilities._200Response(res, {
        tasks: tasks,
        msg: "all tasks of a user",
      });
    });
};

const getSearchTasks = (req, res) => {
  const taskRef = db.ref("tasks");
  taskRef
    .orderByChild("name")
    .startAt(req.query.name)
    .endAt(req.query.name + "\uf8ff")
    .on("value", async (snapshot) => {
      const tasks = snapshot.val();
			console.log(tasks)
      return utilities._200Response(res, {
        tasks: tasks,
        msg: "all tasks of a user",
      });
    });
};

const createTask = async (req, res) => {
  const taskRef = db.ref("tasks");

  const data = { name: req.body.name, userId: req.user.id };
  if(req.body.name === ''){
    return utilities._400Response(res, {
      error: "Name can't be blank",
      msg: "Something went wrong",
    });
  }
  const task = await taskRef.push(data, (err) => {
    if (err) {
      return utilities._400Response(res, {
        error: err,
        msg: "Something went wrong",
      });
    }
  });
  task.once("value", (snapshot) => {
    return utilities._200Response(res, {
      task: {[snapshot.key]: snapshot.val()},
      msg: "task is created",
    });
  });
};

const updateTask = async (req, res) => {
  const taskRef = db.ref(`tasks/${req.query.id}`);
  await taskRef.update(req.body, (err) => {
    if (err) {
      return utilities._400Response(res, {
        error: err,
        msg: "Something went wrong",
      });
    }
  });
  taskRef.once("value", (snapshot) => {
    return utilities._200Response(res, {
			task: {[snapshot.key]: snapshot.val()},
      msg: "task is updated",
    });
  });
};

const deleteTask = (req, res) => {
  const taskRef = db.ref(`tasks/${req.query.id}`);
  taskRef
    .remove()
    .then(() => {
      return utilities._200Response(res, {
        msg: "task is deleted",
      });
    })
    .catch((error) => {
      console.log("Error deleting data:", error);
      return utilities._400Response(res, {
        error: error,
        msg: "Something went wrong",
      });
    });
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getSearchTasks,
};
