const API = "/api/tasks";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "/login.html";
}

document.getElementById("username").textContent = user.username;
document.getElementById("email").textContent = user.email;
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");

// Fetch tasks
async function loadTasks() {
  try {
    const res = await fetch(API, { headers });
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(createTaskElement);
  } catch (err) {
    taskList.innerHTML = "<p class='text-danger'>❌ Failed to load tasks</p>";
  }
}

// Render single task
function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = `task-item ${task.completed ? "completed" : ""}`;

  div.innerHTML = `
    <h5>${task.title}</h5>
    <p class="task-details">
      <strong>Type:</strong> ${task.type} |
      <strong>Priority:</strong> ${task.priority}
    </p>
    <p>${task.description}</p>
    <div class="task-actions">
      <button class="btn btn-success btn-sm" onclick="markComplete('${task._id}', ${task.completed})">
        ${task.completed ? "✅ Completed" : "✔️ Mark Complete"}
      </button>
      <button class="btn btn-primary btn-sm" onclick="editTask('${task._id}')">✏️ Edit</button>
      <button class="btn btn-danger btn-sm" onclick="deleteTask('${task._id}')">🗑️ Delete</button>
    </div>
  `;

  taskList.appendChild(div);
}

// Add new task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(taskForm);
  const data = Object.fromEntries(formData.entries());
  try {
    const res = await fetch(API, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Add failed");
    taskForm.reset();
    loadTasks();
  } catch (err) {
    alert("❌ Failed to add task");
  }
});

// Delete task
async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers,
    });
    loadTasks();
  } catch {
    alert("❌ Failed to delete task");
  }
}

// Edit task
async function editTask(id) {
  try {
    const res = await fetch(`${API}/${id}`, { headers });
    const task = await res.json();
    const newTitle = prompt("Edit title", task.title);
    const newDescription = prompt("Edit description", task.description);
    const newType = prompt("Edit type", task.type);
    const newPriority = prompt("Edit priority", task.priority);

    if (!newTitle || !newDescription || !newType || !newPriority) return;

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        type: newType,
        priority: newPriority,
      }),
    });

    loadTasks();
  } catch (err) {
    alert("❌ Failed to edit task");
  }
}

// Mark task as complete/incomplete
async function markComplete(id, isCompleted) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ completed: !isCompleted }),
    });
    loadTasks();
  } catch (err) {
    alert("❌ Failed to update task");
  }
}

// Load tasks on page load
loadTasks();
