# 🧩 Task Manager API

A simple, production-ready RESTful API for managing tasks, built with **Node.js**, **Express**, and **MongoDB**.  
It features complete **CI/CD automation** using **GitHub Actions** and **Heroku Docker deployments**.

> ✅ Ready for real-world use and deployment

---

## 📦 Features

- 🔧 REST API with full CRUD operations
- 🚀 Auto deployment with GitHub Actions
- 🐳 Containerized with Docker
- ☁️ Hosted on Heroku (via Heroku Container Registry)
- 🌐 MongoDB Atlas integration
- ⚙️ Environment variables support
- 🧪 Clean, modular code ready for testing and extension

---

## 🚀 Live Deployment

🔗 **URL:** `https://task-manager-api1-7676321afe5a.herokuapp.com/`
---

## 🛠️ Tech Stack

| Tool          | Purpose                             |
|---------------|-------------------------------------|
| Node.js       | Runtime environment                 |
| Express.js    | Web framework                       |
| MongoDB Atlas | Cloud database                      |
| Mongoose      | ODM for MongoDB                     |
| Docker        | Containerization                    |
| Heroku        | Hosting platform (using Docker)     |
| GitHub Actions| CI/CD pipeline                      |

---

## 🧪 API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | `/api/tasks`       | Get all tasks        |
| POST   | `/api/tasks`       | Create new task      |
| GET    | `/api/tasks/:id`   | Get task by ID       |
| PUT    | `/api/tasks/:id`   | Update task by ID    |
| DELETE | `/api/tasks/:id`   | Delete task by ID    |

---

## 🧰 Getting Started (Locally)

### 1. Clone the repo

```bash
git clone https://github.com/Mohd2040/task-manager-api.git
cd task-manager-api
