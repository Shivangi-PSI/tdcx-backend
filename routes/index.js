const router = require("express").Router();
var db = require("../models");

router.get("/", function (req, res) {
  res.send("Wiki home page");
});

router.post("/tasks", function (req, res) {
  var taskRef = db.ref("tasks");
 
  var obj = { name: "Test1", completed: false };
  taskRef.push(obj, (err) => {
    if (err) {
      res.status(300).json({ msg: "Something went wrong", error: err });
    } else {
      res.status(200).json({ msg: "user created sucessfully" });
    }
  });
});

module.exports = router;
