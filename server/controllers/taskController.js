const Task = require("../../database/model/task.model"); // Assuming Task model is in the models folder

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

module.exports = { addTask, getAllTasks, getTaskById };
