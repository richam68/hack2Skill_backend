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

  // Parse task lastDate
  const taskDate = moment(taskData.lastDate, "DD/MM/YYYY", true);
  if (!taskDate.isValid()) {
    throw new Error("Invalid task date format. Use DD/MM/YYYY");
  }

  // Parse each subtask's lastDate
  const formattedSubtasks = (taskData.subtasks || []).map((sub, index) => {
    const subtaskDate = moment(sub.lastDate, "DD/MM/YYYY", true);
    if (!subtaskDate.isValid()) {
      throw new Error(
        `Invalid date format for Subtask ${index + 1}: ${sub.lastDate}`
      );
    }

    return {
      subject: sub.subject,
      lastDate: subtaskDate.toDate(),
      status: sub.status || "pending",
      isDeleted: false,
    };
  });

  const newTask = {
    subject: taskData.subject,
    lastDate: taskDate.toDate(),
    status: taskData.status || "pending",
    isDeleted: false,
    subtasks: formattedSubtasks,
  };

  user.tasks.push(newTask);
  await user.save();

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

  const task = user.tasks.find(
    (t) =>
      t._id.toString() === taskId ||
      (t.task_id && t.task_id.toString() === taskId)
  );

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
  // Preserve previously soft-deleted subtasks
  const deletedSubtasks = task.subtasks.filter((s) => s.isDeleted);

  // Convert and validate new subtasks
  const formattedNewSubtasks = newSubtasks.map((s, index) => {
    const parsedDate = moment(s.lastDate, "DD/MM/YYYY", true);
    if (!parsedDate.isValid()) {
      throw new Error(`Invalid date at Subtask ${index + 1}: ${s.lastDate}`);
    }
    return {
      subject: s.subject,
      lastDate: parsedDate.toDate(),
      status: s.status || "pending",
      isDeleted: false,
    };
  });

  // Replace subtasks (soft-deleted preserved)
  task.subtasks = [...formattedNewSubtasks, ...deletedSubtasks];
  await user.save();

  return task.subtasks.filter((s) => !s.isDeleted); // return only active
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
