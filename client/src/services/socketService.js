import { io } from 'socket.io-client';
import { getAuthToken } from './api';

let socket = null;

export const connectSocket = () => {
  const token = getAuthToken();
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('⚡ Socket.IO connected for live updates');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket.IO disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
