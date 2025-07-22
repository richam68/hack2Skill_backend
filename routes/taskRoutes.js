const express = require("express");
const {
  createTask,
  getTasks,
  editTask,
  removeTask,
  getSubtasksController,
  updateSubtasksController,
} = require("../controllers/taskController");

const validateTokenHandler = require("../middlewares/validateToken");
const router = express.Router();

// Apply token validation middleware to all routes in this router
router.use(validateTokenHandler);

// Route to create a new task
router.route("/").post(createTask).get(getTasks);
router.route("/:taskId").put(editTask).delete(removeTask);

// Route to get all subtasks for a specific task
router
  .route("/:taskId/subtasks")
  .get(getSubtasksController)
  .put(updateSubtasksController);

module.exports = router;
