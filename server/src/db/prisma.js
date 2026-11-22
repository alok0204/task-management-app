import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/taskflow-db.json');

let prisma = null;
let isPostgresConnected = false;

// Initialize Prisma Client if DATABASE_URL is defined
if (process.env.DATABASE_URL) {
  try {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });

    prisma.$connect()
      .then(() => {
        isPostgresConnected = true;
        console.log('✓ Successfully connected to PostgreSQL via Prisma ORM.');
      })
      .catch((err) => {
        console.warn('! PostgreSQL connection unreachable or pending. Using persistent file-backed database:', err.message);
        isPostgresConnected = false;
      });
  } catch (err) {
    console.warn('! PrismaClient initialization warning:', err.message);
  }
} else {
  console.info('ℹ DATABASE_URL not set; using persistent local database storage.');
}

// Ensure data directory and persistent file exist
function getStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = { users: [], tasks: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{"users":[],"tasks":[]}');
  } catch (err) {
    console.error('Error reading persistent data store:', err);
    return { users: [], tasks: [] };
  }
}

function saveStore(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving to persistent data store:', err);
  }
}

export const db = {
  isPostgres() {
    return isPostgresConnected && prisma !== null;
  },

  getPrisma() {
    return prisma;
  },

  // USER OPERATIONS
  async findUserByEmail(email) {
    if (this.isPostgres()) {
      try {
        return await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
      } catch (err) {
        console.warn('Prisma query error (findUserByEmail), using persistent store:', err.message);
      }
    }
    const store = getStore();
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (this.isPostgres()) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            theme: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        return user;
      } catch (err) {
        console.warn('Prisma query error (findUserById), using persistent store:', err.message);
      }
    }
    const store = getStore();
    const user = store.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async createUser({ name, email, passwordHash, theme = 'dark' }) {
    if (this.isPostgres()) {
      try {
        return await prisma.user.create({
          data: {
            name,
            email: email.toLowerCase(),
            passwordHash,
            theme,
          },
        });
      } catch (err) {
        console.warn('Prisma create user error, saving to persistent store:', err.message);
      }
    }
    const store = getStore();
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      theme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    return newUser;
  },

  async updateUser(id, updateData) {
    const safeData = {};
    if (updateData.name) safeData.name = updateData.name;
    if (updateData.theme) safeData.theme = updateData.theme;
    safeData.updatedAt = new Date();

    if (this.isPostgres()) {
      try {
        return await prisma.user.update({
          where: { id },
          data: safeData,
          select: {
            id: true,
            name: true,
            email: true,
            theme: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      } catch (err) {
        console.warn('Prisma update user error, using persistent store:', err.message);
      }
    }
    const store = getStore();
    const index = store.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    store.users[index] = {
      ...store.users[index],
      ...safeData,
      updatedAt: new Date().toISOString(),
    };
    saveStore(store);
    const { passwordHash, ...safeUser } = store.users[index];
    return safeUser;
  },

  // TASK OPERATIONS (Scoped to specific userId)
  async getTasks(userId, { status, priority, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = {}) {
    if (this.isPostgres()) {
      try {
        const where = { userId };
        if (status && status !== 'All') where.status = status;
        if (priority && priority !== 'All') where.priority = priority;
        if (category && category !== 'All') where.category = category;
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        const orderBy = {};
        orderBy[sortBy] = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

        return await prisma.task.findMany({
          where,
          orderBy,
        });
      } catch (err) {
        console.warn('Prisma getTasks error, fallback to persistent store:', err.message);
      }
    }

    const store = getStore();
    let tasks = store.tasks.filter((t) => t.userId === userId);

    if (status && status !== 'All') {
      tasks = tasks.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (priority && priority !== 'All') {
      tasks = tasks.filter((t) => t.priority.toLowerCase() === priority.toLowerCase());
    }
    if (category && category !== 'All') {
      tasks = tasks.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    tasks.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'dueDate') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder.toLowerCase() === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.toLowerCase() === 'asc' ? 1 : -1;
      return 0;
    });

    return tasks;
  },

  async getTaskById(taskId, userId) {
    if (this.isPostgres()) {
      try {
        return await prisma.task.findFirst({
          where: { id: taskId, userId },
        });
      } catch (err) {
        console.warn('Prisma getTaskById error, fallback:', err.message);
      }
    }
    const store = getStore();
    return store.tasks.find((t) => t.id === taskId && t.userId === userId) || null;
  },

  async createTask({ title, description, status = 'Pending', priority = 'Medium', category = 'Work', dueDate, userId }) {
    const formattedDueDate = dueDate ? new Date(dueDate) : null;

    if (this.isPostgres()) {
      try {
        return await prisma.task.create({
          data: {
            title,
            description: description || null,
            status,
            priority,
            category,
            dueDate: formattedDueDate,
            userId,
          },
        });
      } catch (err) {
        console.warn('Prisma createTask error, fallback to persistent store:', err.message);
      }
    }

    const store = getStore();
    const newTask = {
      id: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title,
      description: description || '',
      status,
      priority,
      category,
      dueDate: formattedDueDate ? formattedDueDate.toISOString() : null,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.tasks.push(newTask);
    saveStore(store);
    return newTask;
  },

  async updateTask(taskId, userId, updateData) {
    const formattedData = { ...updateData };
    if ('dueDate' in formattedData) {
      formattedData.dueDate = formattedData.dueDate ? new Date(formattedData.dueDate) : null;
    }
    formattedData.updatedAt = new Date();

    if (this.isPostgres()) {
      try {
        // Enforce user ownership
        const existing = await prisma.task.findFirst({ where: { id: taskId, userId } });
        if (!existing) return null;

        return await prisma.task.update({
          where: { id: taskId },
          data: formattedData,
        });
      } catch (err) {
        console.warn('Prisma updateTask error, fallback:', err.message);
      }
    }

    const store = getStore();
    const index = store.tasks.findIndex((t) => t.id === taskId && t.userId === userId);
    if (index === -1) return null;

    store.tasks[index] = {
      ...store.tasks[index],
      ...formattedData,
      dueDate: formattedData.dueDate ? new Date(formattedData.dueDate).toISOString() : store.tasks[index].dueDate,
      updatedAt: new Date().toISOString(),
    };
    saveStore(store);
    return store.tasks[index];
  },

  async updateTaskStatus(taskId, userId, status) {
    return this.updateTask(taskId, userId, { status });
  },

  async deleteTask(taskId, userId) {
    if (this.isPostgres()) {
      try {
        const existing = await prisma.task.findFirst({ where: { id: taskId, userId } });
        if (!existing) return null;

        return await prisma.task.delete({
          where: { id: taskId },
        });
      } catch (err) {
        console.warn('Prisma deleteTask error, fallback:', err.message);
      }
    }

    const store = getStore();
    const index = store.tasks.findIndex((t) => t.id === taskId && t.userId === userId);
    if (index === -1) return null;

    const [deleted] = store.tasks.splice(index, 1);
    saveStore(store);
    return deleted;
  },

  // STATS & INSIGHTS (Computed from actual data for the user)
  async getUserStats(userId) {
    const tasks = await this.getTasks(userId);
    const now = new Date();

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;

    const overdue = tasks.filter((t) => {
      if (t.status === 'Completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < now;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown
    const priorityCounts = {
      High: tasks.filter((t) => t.priority === 'High').length,
      Medium: tasks.filter((t) => t.priority === 'Medium').length,
      Low: tasks.filter((t) => t.priority === 'Low').length,
    };

    // Category breakdown
    const categoryCounts = {};
    tasks.forEach((t) => {
      const cat = t.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Recent activity / trend (tasks completed or created in last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const createdCount = tasks.filter((t) => t.createdAt && t.createdAt.toString().startsWith(dateStr)).length;
      const completedCount = tasks.filter(
        (t) => t.status === 'Completed' && t.updatedAt && t.updatedAt.toString().startsWith(dateStr)
      ).length;

      last7Days.push({
        date: dateStr,
        day: dayLabel,
        created: createdCount,
        completed: completedCount,
      });
    }

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate,
      priorityCounts,
      categoryCounts,
      activityTrends: last7Days,
    };
  },
};

export default prisma;
