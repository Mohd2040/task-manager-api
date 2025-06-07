const apiUrl = "https://your-heroku-app.herokuapp.com/api/tasks"; // غيّر هذا للرابط الصحيح عندك

const taskForm = document.getElementById("task-form");
const tasksList = document.getElementById("tasks-list");

// تحميل المهام وعرضها
async function loadTasks() {
  try {
    const res = await fetch(apiUrl);
    const tasks = await res.json();

    tasksList.innerHTML = ""; // مسح القائمة قبل العرض

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="task-title">${task.title}</span> 
        (<span>${task.priority}</span>) - 
        <span class="task-desc">${task.description}</span>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      `;
      tasksList.appendChild(li);
    });
  } catch (err) {
    alert("Failed to load tasks.");
    console.error(err);
  }
}

// إضافة مهمة جديدة
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    priority: document.getElementById("priority").value,
  };

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (!res.ok) throw new Error("Failed to add task.");

    // تنظيف الحقول
    taskForm.reset();
    loadTasks(); // إعادة تحميل المهام
  } catch (err) {
    alert(err.message);
  }
});

// حذف مهمة
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task.");

    loadTasks(); // تحديث القائمة بعد الحذف
  } catch (err) {
    alert(err.message);
  }
}

// تحميل المهام عند فتح الصفحة
loadTasks();
