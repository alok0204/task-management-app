import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';

let io = null;

export const initializeSocket = (httpServer, allowedOrigins) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
    pingTimeout: 60000,
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication required for real-time synchronization'));
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return next(new Error('Invalid token for real-time sync'));
    }

    socket.userId = decoded.id;
    next();
  });

  io.on('connection', (socket) => {
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);
    console.log(`⚡ WebSocket client connected: ${socket.id} (User: ${socket.userId}) joined room ${userRoom}`);

    socket.on('disconnect', (reason) => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

// Event broadcasting scoped strictly to the specific user room
export const broadcastTaskCreated = (userId, task) => {
  if (io) {
    io.to(`user:${userId}`).emit('task:created', task);
  }
};

export const broadcastTaskUpdated = (userId, task) => {
  if (io) {
    io.to(`user:${userId}`).emit('task:updated', task);
  }
};

export const broadcastTaskStatusChanged = (userId, task) => {
  if (io) {
    io.to(`user:${userId}`).emit('task:status_changed', task);
  }
};

export const broadcastTaskDeleted = (userId, taskId) => {
  if (io) {
    io.to(`user:${userId}`).emit('task:deleted', { id: taskId });
  }
};
