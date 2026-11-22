# TaskFlow — Modern Productivity & Task Management Web Application

> **Thiranex Web Development Internship — Task 2**  
> **Developer:** Alok Kumar Vishwas  
> **Degree & Institution:** B.Tech, 2nd Year — Computer Science and Engineering, GL Bajaj Institute of Technology & Management, Greater Noida  
> **GitHub:** [@alok0204](https://github.com/alok0204) • **Repository:** [task-management-app](https://github.com/alok0204/task-management-app)  
> **LinkedIn:** [Alok Kumar Vishwas](https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/) • **Email:** [alokvishwas786@gmail.com](mailto:alokvishwas786@gmail.com)

---

## 🌟 Executive Summary

**TaskFlow** is an enterprise-grade, high-performance task and productivity management web application developed from scratch to satisfy all mandatory and preferred criteria of **Thiranex Task 2**. Inspired by modern productivity suites such as Linear and Notion, TaskFlow delivers an ultra-clean SaaS user experience with real-time WebSocket state synchronization, secure JWT-based multi-user authentication, persistent relational data architecture via **PostgreSQL** and **Prisma ORM**, interactive Kanban board drag-and-drop workflow, comprehensive date scheduling, and automated productivity metrics.

---

## 🚀 Key Features

### 1. Robust Authentication & User Isolation
- **Registration & Login**: Secure credential authentication with input sanitization and error handling.
- **Bcrypt Password Hashing**: Industrial standard salt rounds protecting all user credentials.
- **JWT Session Tokens**: Secure HttpOnly cookies and Bearer header token validation.
- **Strict Data Isolation**: Backend queries enforce user ownership checks at the database level (`userId` scoping) so no user can access, query, or modify another user's tasks.
- **Protected Routes**: Client-side navigation guards preventing unauthenticated access to the dashboard.

### 2. Comprehensive Task CRUD Engine
- **Task Attributes**: ID, Title, Description, Status (`Pending`, `In Progress`, `Completed`), Priority (`Low`, `Medium`, `High`), Category (`Work`, `Study`, `Personal`, `Other`), Due Date, Creation Date, Updated Date, and User ID.
- **Dynamic Search & Filtering**: Instant multi-condition query engine filtering by text keywords, status, priority, and category.
- **Customizable Sorting**: Sort tasks by Creation Date, Due Date, Priority level, or Title in Ascending/Descending orders.
- **Quick Status Toggle**: Mark tasks completed with instantaneous visual celebration (confetti effect) and auto-reopen.
- **Safety Confirmations**: Dedicated delete confirmation modal with destructive warnings.
- **Overdue Task Highlighting**: Automatic detection and distinct visual warnings for missed deadlines.

### 3. Multiple Interactive Task Views
- **List View**: Dense, searchable master task table with quick actions, status chips, priority labels, and deadline indicators.
- **Kanban Board**: Drag-and-drop workflow columns (`Pending`, `In Progress`, `Completed`) with immediate database persistence and hover move shortcuts.
- **Calendar View**: Full monthly schedule visualization with day-level agenda inspection, task badges, and date-specific task creation.

### 4. Real-time Live Synchronization (WebSockets)
- Powered by **Socket.IO** with authenticated socket handshake and room isolation (`user:${userId}`).
- Real-time events: `task:created`, `task:updated`, `task:status_changed`, and `task:deleted`.
- Instantaneous synchronization across multiple browser tabs and devices without page reloads.

### 5. In-Depth Productivity Analytics & Insights
- Real database-computed statistics: Total Tasks, Completed, In Progress, Pending, and Overdue tasks.
- Completion percentage gauge with dynamic progress visualization.
- Status distribution breakdown with proportional metric bars.
- Priority distribution analysis (High, Medium, Low).
- 7-Day productivity trend chart mapping task creation versus completion velocity.

### 6. User Settings & Adaptive Appearance
- User profile overview with editable display name.
- Dual theme engine: Sophisticated dark navy / slate palette and crisp modern light mode with instant local persistence.
- Session termination with one-click secure logout.

---

## 🛠 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, React Router 6, Lucide React, Date-fns, Canvas-Confetti |
| **Backend** | Node.js (v24), Express.js 4, Socket.IO 4, CORS, Cookie-Parser, Express-Rate-Limit |
| **Database & ORM** | PostgreSQL, Prisma ORM 5.22, Persistent Relational Engine |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies |
| **Deployment Ready** | Vercel (Frontend), Render / Railway (Backend), Neon / Render PostgreSQL (Database) |

---

## 📁 Monorepo Project Structure

```text
task-management-app/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Static assets & SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Input, Modal, ConfirmModal, Badge, Skeletons, EmptyState
│   │   │   ├── layout/         # Sidebar, Navbar, Mobile Navigation Drawer
│   │   │   ├── tasks/          # TaskCard, TaskModal, TaskFilters
│   │   │   ├── kanban/         # KanbanBoard, Column drops, Drag & Drop
│   │   │   ├── calendar/       # CalendarView, Month grid, Day Agenda
│   │   │   └── analytics/      # AnalyticsCharts, Trends, Status & Priority Breakdown
│   │   ├── context/            # AuthContext, TaskContext, ThemeContext
│   │   ├── hooks/              # Custom hooks for state and themes
│   │   ├── layouts/            # DashboardLayout shell with global modals
│   │   ├── pages/              # Login, Register, Dashboard, MyTasks, BoardView, Calendar, Analytics, Settings
│   │   ├── services/           # Fetch API client, Auth service, Task service, Socket.IO client
│   │   ├── styles/             # Tailwind directives & CSS variables
│   │   ├── utils/              # Date formatters, Overdue checkers, Status helpers
│   │   ├── App.jsx             # Route definitions & Authentication guards
│   │   └── main.jsx            # Application root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Backend REST API & Real-time Server
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL schema with User & Task models
│   │   └── seed.js             # Initial database seed script
│   ├── src/
│   │   ├── controllers/        # authController, taskController, statsController
│   │   ├── db/                 # Prisma client, PostgreSQL connection, Persistent fallback engine
│   │   ├── middleware/         # authMiddleware, errorHandler, rateLimiter
│   │   ├── routes/             # authRoutes, taskRoutes, statsRoutes, healthRoutes
│   │   ├── services/           # socketService (room-isolated real-time broadcasts)
│   │   ├── utils/              # jwt, passwordHash, responseHelper
│   │   ├── validators/         # authValidator, taskValidator
│   │   └── index.js            # Express server & Socket.IO initialization
│   ├── .env.example
│   └── package.json
├── .gitignore
├── .env.example
├── render.yaml                 # Infrastructure as Code blueprint for Render
├── vercel.json                 # SPA routing configuration for Vercel
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🗄 Database Schema (Prisma ORM)

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  theme        String   @default("dark")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks        Task[]

  @@map("users")
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      String    @default("Pending") // Pending, In Progress, Completed
  priority    String    @default("Medium")  // Low, Medium, High
  category    String    @default("Work")    // Work, Study, Personal, Other
  dueDate     DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([status])
  @@index([priority])
  @@index([category])
  @@index([dueDate])
  @@map("tasks")
}
```

---

## 📡 Backend REST API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account (name, email, password, confirmPassword) | No (Rate Limited) |
| `POST` | `/api/auth/login` | Authenticate with credentials and receive JWT session token | No (Rate Limited) |
| `POST` | `/api/auth/logout` | Terminate session and clear authentication cookie | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile details | Yes (Bearer / Cookie) |
| `PUT` | `/api/auth/profile` | Update user display name and theme preferences | Yes (Bearer / Cookie) |

### Task Management Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Retrieve user tasks with optional search, status, priority, and category filters | Yes |
| `GET` | `/api/tasks/:id` | Retrieve single task by ID (strictly verifies user ownership) | Yes |
| `POST` | `/api/tasks` | Create a new task (broadcasts real-time WebSocket update) | Yes |
| `PUT` | `/api/tasks/:id` | Update task details (title, description, status, priority, category, dueDate) | Yes |
| `PATCH` | `/api/tasks/:id/status` | Fast update of task status (e.g. from Kanban drag-and-drop or checkbox) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task from database (broadcasts real-time WebSocket deletion) | Yes |

### Metrics & System Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Real-time computed analytics: completion rate, priority and category counts, 7-day trends | Yes |
| `GET` | `/api/health` | System health check, database status, and server uptime | No |

---

## ⚙ Local Development Setup

### 1. Prerequisites
- Node.js (v18.0 or newer recommended; tested on Node.js v24)
- npm or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/alok0204/task-management-app.git
cd task-management-app
```

### 3. Server Configuration & Startup
```bash
cd server
npm install
npx prisma generate

# Create environment configuration
cp .env.example .env

# Start backend server (runs on port 5000)
npm run dev
```

### 4. Client Configuration & Startup
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Demo Credentials (Pre-seeded for evaluation)
- **Email:** `alokvishwas786@gmail.com`
- **Password:** `Password123!`
*(Or click the one-click **"Use Demo Credentials"** button on the Login page).*

---

## ☁ Production Deployment Guide

### Database (Neon / Render PostgreSQL)
1. Create a free managed PostgreSQL instance on [Neon](https://neon.tech) or [Render](https://render.com).
2. Copy the connection string into `DATABASE_URL`.
3. Run `npx prisma db push` to synchronize models and indexes.

### Backend (Render)
1. Connect this GitHub repository to Render as a Web Service.
2. Root directory: `server`.
3. Build command: `npm install && npx prisma generate`.
4. Start command: `node src/index.js`.
5. Set environment variables: `NODE_ENV=production`, `PORT=10000`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`.

### Frontend (Vercel)
1. Import repository into [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Root directory: `client`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`.

---

## 👨‍💻 Developer & Internship Information

- **Intern:** Alok Kumar Vishwas
- **College:** GL Bajaj Institute of Technology & Management, Greater Noida
- **Degree:** B.Tech in Computer Science and Engineering (2nd Year)
- **Internship Program:** Thiranex
- **Assigned Task:** Task 2 — Complete Task Management Application
- **Task Status:** Completed, fully tested, documented, and verified.
