const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.route("/add_task").post(taskController.addTask);
router.route("/tasks").get(taskController.getAllTasks);
router.route("/tasks/:id").get(taskController.getTaskById);
router.route("/tasks/update").put(taskController.updateTaskById);
router.route("/tasks/user/:user_id").get(taskController.getTasksbyUser);

module.exports = router;
