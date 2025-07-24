const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const {
  getUserTasks,
  addTask,
  updateTask,
  deleteTask,
  getSubtasks,
  updateSubtasks,
} = require("../services/taskService");

// GET /tasks

//@desc Get all tasks for the authenticated user
//@route GET /api/tasks
//@access Private
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const tasks = await getUserTasks(userId);
  if (!tasks) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }

  res.status(StatusCodes.OK).json(tasks);
});

// POST /tasks
//@desc Create a new task for the authenticated user
//@route POST /api/tasks
//@access Private
const createTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subject, lastDate, status, subtasks } = req.body;

  if (!subject || !lastDate) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Subject and last date are required");
  }

  const newTask = await addTask(userId, {
    subject,
    lastDate,
    status,
    subtasks,
  });
  if (!newTask) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }

  res.status(StatusCodes.CREATED).json(newTask);
});

// PUT /tasks/:taskId
//@desc Update a task by taskId for the authenticated user
//@route PUT /api/tasks/:taskId
//@access Private
const editTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const updates = req.body;

  const updatedTask = await updateTask(userId, taskId, updates);
  if (!updatedTask) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Task not found or already deleted");
  }

  res.status(StatusCodes.OK).json(updatedTask);
});

// DELETE /tasks/:taskId
//@desc Soft delete a task by taskId for the authenticated user
//@route DELETE /api/tasks/:taskId
//@access Private
const removeTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const deletedTask = await deleteTask(userId, taskId);
  if (!deletedTask) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("Task not found or already deleted");
  }

  res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
});

// GET /tasks/:taskId/subtasks
//@desc Get all subtasks for a specific task
//@route GET /api/tasks/:taskId/subtasks
//@access Private
const getSubtasksController = async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware sets req.user
    const { taskId } = req.params;

    const subtasks = await getSubtasks(userId, taskId);
    if (!subtasks) return res.status(404).json({ message: "Task not found" });

    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /tasks/:taskId/subtasks
//@desc Update subtasks for a specific task
//@route PUT /api/tasks/:taskId/subtasks
//@access Private
const updateSubtasksController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const newSubtasks = req.body.subtasks;

    const updatedSubtasks = await updateSubtasks(userId, taskId, newSubtasks);
    if (!updatedSubtasks)
      return res.status(404).json({ message: "Task not found" });

    res.json(updatedSubtasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  editTask,
  removeTask,
  getSubtasksController,
  updateSubtasksController,
};
