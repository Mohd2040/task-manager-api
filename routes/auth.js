const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// GET /api/tasks - جلب جميع مهام المستخدم
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /api/tasks - إضافة مهمة جديدة
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, type, priority } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      type,
      priority
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id - تعديل مهمة موجودة
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, type, priority } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ error: "Not authorized" });

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.type = type ?? task.type;
    task.priority = priority ?? task.priority;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id - حذف مهمة
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ error: "Not authorized" });

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
