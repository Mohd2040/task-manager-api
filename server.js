require("dotenv").config(); // تحميل المتغيرات من ملف .env
const express = require("express"); // استيراد Express لإنشاء السيرفر
const mongoose = require("mongoose"); // استيراد Mongoose للتعامل مع MongoDB
const app = express(); // إنشاء تطبيق Express

const PORT = process.env.PORT || 5000; // تحديد المنفذ (من المتغيرات أو 5000 افتراضيًا)
const MONGO_URI = process.env.MONGO_URI; // قراءة رابط الاتصال من متغير البيئة

// ✅ تسجيل ما إذا كان الرابط موجودًا
console.log("🌐 ENV MONGO_URI:", MONGO_URI ? "✅ OK" : "❌ Missing");

// إعداد الوسطاء (middlewares)
app.use(express.static('public')); // ملفات ثابتة مثل HTML, CSS
app.use(express.json()); // تحليل البيانات المرسلة بـ JSON

// ✅ تعريف مسارات API بعد تحميل ملفات المسارات
//   هذه هي الإضافة المهمة، بحيث يتم تحميل مسارات المهام API من ملف خارجي 'routes/tasks.js'
app.use("/api/tasks", require("./routes/tasks"));

// ✅ الاتصال بـ MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");

  // ✅ بدء تشغيل السيرفر فقط بعد نجاح الاتصال
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error("❌ Failed to connect to MongoDB", err);
});
