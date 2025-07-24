const mongoose = require("mongoose");

// Subtask Schema
const subtaskSchema = new mongoose.Schema({
  subtask_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  subject: {
    type: String,
    required: [true, "Subtask subject is required"],
  },
  lastDate: {
    type: Date,
    required: [true, "Subtask deadline is required"],
  },
  status: {
    type: String,
    enum: ["pending", "In progress", "completed"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  subject: {
    type: String,
    required: [true, "Task subject is required"],
  },
  lastDate: {
    type: Date,
    required: [true, "Task deadline is required"],
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  subtasks: [subtaskSchema],
});

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
