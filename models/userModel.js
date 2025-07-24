const mongoose = require("mongoose");
const validator = require("validator");

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
      trim: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]+$/.test(value); // allows only letters and spaces
        },
        message: "Username should contain only alphabets and spaces",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long."],
      // validate: {
      //   validator: function (value) {
      //     if (!/[a-zA-Z]/.test(value)) {
      //       throw new Error("Password must contain at least one letter");
      //     }
      //     if (!/\d/.test(value)) {
      //       throw new Error("Password must contain at least one number");
      //     }
      //     return true;
      //   },
      //   message: "Password validation failed",
      // },
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
