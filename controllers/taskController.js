const db = require("../models");
const utilities = require("../utils/common");
const {
  BLANK_NAME_ERROR,
  TASK_ERROR,
  TASK_CREATION_SUCCESS,
  TASK_UPDATION_SUCCESS,
  TASK_DELETION_SUCCESS,
} = require("../utils/constant");

const getAllTasks = (req, res) => {
  const taskRef = db.ref("tasks");
  taskRef
    .orderByChild("userId")
    .equalTo(req.user.id)
    .on("value", async (snapshot) => {
      const tasks = utilities.transformResponse(snapshot.val());
      tasks.sort((x, y) => {
        return y.createdAt - x.createdAt;
      });
      return utilities._200Response(res, {
        tasks: tasks
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
      const tasks = utilities.transformResponse(snapshot.val());
      tasks.sort((x, y) => {
        return y.createdAt - x.createdAt;
      });
      return utilities._200Response(res, {
        tasks: tasks
      });
    });
};

const createTask = async (req, res) => {
  const taskRef = db.ref("tasks");

  const data = {
    name: req.body.name,
    userId: req.user.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  if (req.body.name === "") {
    return utilities._400Response(res, {
      error: BLANK_NAME_ERROR,
    });
  }
  const task = await taskRef.push(data, (err) => {
    if (err) {
      return utilities._400Response(res, {
        error: err,
        msg: TASK_ERROR,
      });
    }
  });
  task.once("value", (snapshot) => {
    return utilities._200Response(res, {
      task: { ...snapshot.val(), id: snapshot.key },
      msg: TASK_CREATION_SUCCESS,
    });
  });
};

const updateTask = async (req, res) => {
  const taskRef = db.ref(`tasks/${req.query.id}`);
  const body = { ...req.body, updatedAt: Date.now() };
  await taskRef.update(body, (err) => {
    if (err) {
      return utilities._400Response(res, {
        error: err,
        msg: TASK_ERROR,
      });
    }
  });
  taskRef.once("value", (snapshot) => {
    if (snapshot.val) {
      return utilities._200Response(res, {
        task: { ...snapshot.val(), id: snapshot.key },
        msg: TASK_UPDATION_SUCCESS,
      });
    } else {
      return utilities._400Response(res, {
        error: TASK_ERROR,
      });
    }
  });
};

const deleteTask = (req, res) => {
  const taskRef = db.ref(`tasks/${req.query.id}`);
  taskRef
    .remove()
    .then(() => {
      return utilities._200Response(res, {
        msg: TASK_DELETION_SUCCESS,
      });
    })
    .catch((error) => {
      console.log("Error deleting data:", error);
      return utilities._400Response(res, {
        error: error,
        msg: TASK_ERROR,
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
