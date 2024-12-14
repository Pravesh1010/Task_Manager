const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
      trim: true,
    },
    task_description: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming `User` model exists
      required: true,
    },
    priority_level: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
