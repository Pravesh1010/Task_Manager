const Task = require("../../database/model/task.model"); // Assuming Task model is in the models folder
const mongoose = require("mongoose");

// Controller to add a new task
const addTask = async (req, res) => {
  const {
    task_name,
    task_description,
    assigned_to,
    priority_level,
    due_date,
    status,
  } = req.body;

  // Validate required fields
  if (
    !task_name ||
    !task_description ||
    !assigned_to ||
    !priority_level ||
    !due_date
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required except status." });
  }

  try {
    // Create a new task
    const newTask = new Task({
      task_name,
      task_description,
      assigned_to,
      priority_level,
      due_date,
      status, // Optional, defaults to 'Pending'
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Respond with the created task
    res.status(201).json({
      message: "Task created successfully.",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

// const getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find(); // Fetch all tasks
//     res.status(200).json({
//       message: "Tasks retrieved successfully.",
//       tasks,
//     });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error. Please try again later." });
//   }
// };
const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate the assigned_to field with user details
    const tasks = await Task.find().populate({
      path: "assigned_to", // The field to populate
      select: "username", // Only include the name field from the User collection
    });

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};
const getTasksbyUser = async (req, res) => {
  try {
    const { user_id } = req.params; // Assuming the user_id is sent as a route parameter

    console.log("Received user_id:", user_id);

    // Validate the user_id as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({
        message: "Invalid user ID format. It should be a 24-character hexadecimal string.",
      });
    }

    // Fetch tasks assigned to the specified user_id
    const tasks = await Task.find({
      assigned_to: new mongoose.Types.ObjectId(user_id),
    }).populate({
      path: "assigned_to", // Field to populate
      select: "username", // Include only the username field
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found for the specified user.",
      });
    }

    // Calculate counts based on status
    const taskCounts = tasks.reduce(
      (counts, task) => {
        if (task.status === "Completed") {
          counts.completed++;
        } else if (task.status === "In Progress") {
          counts.inProgress++;
        } else if (task.status === "Pending") {
          counts.pending++;
        }
        return counts;
      },
      { completed: 0, inProgress: 0, pending: 0 } // Initial counts
    );

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      taskCounts, // Include the counts
      tasks, // Include the full list of tasks
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};


const getTaskById = async (req, res) => {
  const { id } = req.params; // Extract task ID from request parameters

  try {
    const task = await Task.findById(id); // Fetch the task by ID

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task retrieved successfully.",
      task,
    });
  } catch (error) {
    console.error("Error fetching task by ID:", error);

    // Check if the error is due to invalid ID format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

const updateTaskById = async (req, res) => {
  console.log("req.body", req.body);
  const updateData = req.body; // Extract task data from request body

  try {
    // // Validate if the ID is a valid MongoDB ObjectId
    // if (!updateData.id.match(/^[0-9a-fA-F]{24}$/)) {
    //   return res.status(400).json({ message: "Invalid task ID format." });
    // }

    // Validate if the update data is provided
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: "No update data provided." });
    }

    // Update the task by ID
    const updatedTask = await Task.findByIdAndUpdate(
      updateData.id,
      updateData,
      { new: true, writeConcern: { w: "majority" } },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validation on update
      }
    );

    // Check if the task exists
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Return success response
    return res.status(200).json({
      message: "Task updated successfully.",
      updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);

    // Handle server errors
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = { updateTaskById };

module.exports = {
  addTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  getTasksbyUser,
};
