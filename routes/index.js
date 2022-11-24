const router = require("express").Router();
const { createTask, updateTask, deleteTask, getAllTasks, getSearchTasks } = require("../controllers/taskController");
const { loginUser, getUser } = require("../controllers/userController");

var db = require("../models");
const { verifyToken } = require("../utils/common");

router.get("/", function (req, res) {
  res.send("Wiki home page");
});

router.post("/login", loginUser)

// router.use(verifyToken)
router.get("/current-user", verifyToken, getUser)
router.get("/tasks",verifyToken, getAllTasks);
router.post("/tasks",verifyToken, createTask);
router.patch("/tasks",verifyToken, updateTask);
router.delete("/tasks",verifyToken, deleteTask);
router.get("/search",verifyToken, getSearchTasks);

module.exports = router;
