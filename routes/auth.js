// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

// ✅ تسجيل مستخدم جديد + أول مهمة
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstTask } = req.body;

    // تحقق من وجود المستخدم مسبقًا
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // إنشاء مستخدم جديد
    const user = new User({ username, email, password });
    await user.save();

    // ✅ إضافة أول مهمة إذا تم إرسالها
    if (firstTask && firstTask.title) {
      const task = new Task({
        user: user._id,
        title: firstTask.title,
        description: firstTask.description || "",
        type: firstTask.type || "personal",
        priority: firstTask.priority || "medium",
        status: "not_started",
      });
      await task.save();
    }

    res.status(201).json({ message: "Registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ تسجيل الدخول واسترجاع بيانات المستخدم والمهام
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // العثور على المستخدم
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // إنشاء التوكن
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ جلب المهام الخاصة بالمستخدم
    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      tasks,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
