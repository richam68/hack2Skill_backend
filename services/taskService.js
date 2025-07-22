const USERMODEL = require("../models/userModel");
const moment = require("moment");

// Get all non-deleted tasks with non-deleted subtasks
const getUserTasks = async (userId) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  const filteredTasks = user.tasks
    .filter((task) => !task.isDeleted)
    .map((task) => ({
      ...task.toObject(),
      subtasks: task.subtasks.filter((sub) => !sub.isDeleted),
    }));

  return filteredTasks;
};

// Add a new task
const addTask = async (userId, taskData) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  // Convert lastDate string into valid Date object using moment
  const formattedDate = moment(taskData.lastDate, "DD/MM/YYYY", true);
  if (!formattedDate.isValid()) {
    throw new Error("Invalid date format. Use DD/MM/YYYY");
  }

  const newTask = {
    subject: taskData.subject,
    lastDate: formattedDate.toDate(),
    status: taskData.status || "pending",
    isDeleted: false,
    subtasks: [],
  };

  user.tasks.push(newTask);
  await user.save();

  //   return newTask;
  return user.tasks[user.tasks.length - 1];
};

// Update task by taskId
const updateTask = async (userId, taskId, updates) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  const task = user.tasks.id(taskId);
  if (!task || task.isDeleted) return null;

  if (updates.subject) task.subject = updates.subject;

  if (updates.lastDate) {
    const formattedDate = moment(updates.lastDate, "DD/MM/YYYY", true);
    if (!formattedDate.isValid()) {
      throw new Error("Invalid date format. Use DD/MM/YYYY");
    }
    task.lastDate = formattedDate.toDate();
  }

  if (updates.status) task.status = updates.status;

  await user.save();
  return task;
};

// Soft delete a task
const deleteTask = async (userId, taskId) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  const task = user.tasks.id(taskId);
  if (!task || task.isDeleted) return null;

  task.isDeleted = true;
  await user.save();

  return task;
};

// Get all non-deleted subtasks for a task
const getSubtasks = async (userId, taskId) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  const task = user.tasks.id(taskId);
  if (!task || task.isDeleted) return null;

  return task.subtasks.filter((sub) => !sub.isDeleted);
};

// Replace non-deleted subtasks (preserve deleted ones)
const updateSubtasks = async (userId, taskId, newSubtasks) => {
  const user = await USERMODEL.findById(userId);
  if (!user) return null;

  const task = user.tasks.id(taskId);
  if (!task || task.isDeleted) return null;

  // Preserve deleted subtasks
  const deletedSubtasks = task.subtasks.filter((s) => s.isDeleted);

  // Add new subtasks (without isDeleted flag)
  const formattedNewSubtasks = newSubtasks.map((s) => ({
    title: s.title,
    status: s.status || "pending",
    isDeleted: false,
  }));

  task.subtasks = [...formattedNewSubtasks, ...deletedSubtasks];

  await user.save();
  return task.subtasks;
};

module.exports = {
  getUserTasks,
  addTask,
  updateTask,
  deleteTask,

  //subtask related functions
  getSubtasks,
  updateSubtasks,
};
