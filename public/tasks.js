const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "/login.html";
}

document.getElementById("username").innerText = user.username;
document.getElementById("email").innerText = user.email;

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// ✅ تحميل المهام
function loadTasks() {
  fetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((tasks) => {
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong style="cursor:pointer;" onclick="showDetails('${task._id}')">
            ${task.completed ? `<s>${task.title}</s>` : task.title}
          </strong>
          - <em>${task.priority}</em>
          <div style="float:right;">
            <button onclick="markComplete('${task._id}', ${task.completed})">✅</button>
            <button onclick="editTask('${task._id}')">✏️</button>
            <button onclick="deleteTask('${task._id}')">🗑️</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    })
    .catch(() => {
      alert("❌ Failed to load tasks.");
    });
}

loadTasks();

// ✅ إضافة مهمة جديدة
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = this.title.value.trim();
  const description = this.description.value.trim();
  const type = this.type.value.trim();
  const priority = this.priority.value.trim();

  if (!title || !description || !type || !priority) {
    return alert("❌ Please fill all fields.");
  }

  fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, type, priority }),
  })
    .then((res) => res.json())
    .then(() => {
      taskForm.reset();
      loadTasks();
    })
    .catch(() => {
      alert("❌ Failed to add task.");
    });
});

// ✅ حذف مهمة
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(() => loadTasks())
    .catch(() => alert("❌ Failed to delete task."));
}

// ✅ تعديل مهمة
function editTask(id) {
  const title = prompt("Enter new title:");
  const description = prompt("Enter new description:");
  const type = prompt("Enter new type (personal/work):");
  const priority = prompt("Enter new priority (low/normal/high):");

  if (!title || !description || !type || !priority) {
    return alert("❌ All fields are required.");
  }

  fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, type, priority }),
  })
    .then((res) => res.json())
    .then(() => loadTasks())
    .catch(() => alert("❌ Failed to edit task."));
}

// ✅ عرض تفاصيل المهمة
function showDetails(id) {
  fetch(`/api/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((task) => {
      alert(
        `📝 ${task.title}\n📄 ${task.description}\n🔢 Type: ${task.type}\n🚦 Priority: ${task.priority}\n✅ Completed: ${task.completed ? "Yes" : "No"}`
      );
    })
    .catch(() => alert("❌ Failed to load details."));
}

// ✅ تغيير حالة الاكتمال
function markComplete(id, currentStatus) {
  fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completed: !currentStatus }),
  })
    .then((res) => res.json())
    .then(() => loadTasks())
    .catch(() => alert("❌ Failed to update task."));
}

// ✅ تسجيل الخروج
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});
