# 🚀 Drag and Drop Kanban Board

A highly interactive and responsive **Kanban Board Application** built with **React + TypeScript**, featuring real-time drag-and-drop for tasks and columns, with automatic local data persistence. Easily manage tasks across **To Do, In Progress, and Done** stages with an intuitive UI.

---

## ✨ Features

### ✅ **Real-time Drag & Drop**
- Powered by **react-dnd** for smooth drag interactions  
- Move Tasks **within the same column** or **across columns**
- Rearrange entire **columns horizontally**

### 📌 **Task Management**
- Add new tasks to any column  
- Click a task to open a **Task Modal** where you can:
  - Edit title, description, priority, due date
  - Delete task permanently

### 💾 **Local Persistence**
- Everything (tasks, columns, layout) is saved to **Local Storage** using Zustand persist
- Your board is **restored automatically on refresh**
- No backend or database required

### 📱 **Fully Responsive**
- Mobile and Desktop friendly layout  
- Smooth usability across devices  

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|-------------|-----------|
| **Frontend** | React (Hooks, Functional Components) | Core UI Framework |
| **State Management** | Zustand | Lightweight global store for tasks, columns, and board structure |
| **Drag & Drop** | React DND (HTML5 backend) | Enables column + task drag-and-drop logic |
| **Language** | TypeScript | Type safety and better dev experience |
| **Styling** | SCSS | Modular and clean component-scoped styling |
| **Persistence** | Local Storage | Saves board state in browser |

---

## 💾 Data Persistence (Local Storage)

This project auto-saves your board using **Local Storage**, with no cloud or external setup needed.

- **No Signup or API Keys Needed**
- **Instant Save on every change**
- Data is **browser-specific**
- Clearing browser storage resets to default demo board

> Switching devices or browsers will not retain your data.

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone <repository-url> 
```

### 2. Install Dependencies
```bash
cd projectforge-kanban-board
npm install
# or
yarn install
```

### 3. Start the Development Server
```bash
npm run dev
# or
yarn dev
```
The application will be available at:
```bash
http://localhost:5173
```
