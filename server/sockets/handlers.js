const events = require('./events');
const jwt = require('jsonwebtoken');

const onlineUsers = new Map();

const setupSocketHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
      } catch {
        // proceed without userId for unauthenticated connections
      }
    }
    next();
  });

  io.on(events.CONNECTION, (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    if (socket.userId) {
      onlineUsers.set(socket.userId, socket.id);
      io.emit(events.USER_ONLINE, { userId: socket.userId });
      io.emit(events.PRESENCE_UPDATE, { online: Array.from(onlineUsers.keys()) });
    }

    socket.on(events.JOIN_PROJECT, (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`${socket.id} joined project room: ${projectId}`);
    });

    socket.on(events.LEAVE_PROJECT, (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on(events.PROJECT_MESSAGE, (data) => {
      const { projectId, message } = data;
      if (projectId && message) {
        io.to(`project:${projectId}`).emit(events.PROJECT_MESSAGE, {
          ...message,
          senderId: socket.userId,
          timestamp: new Date(),
        });
      }
    });

    socket.on(events.NEW_ACTIVITY, (activity) => {
      io.emit(events.NEW_ACTIVITY, activity);
    });

    socket.on(events.PULSE_UPDATE, (data) => {
      io.emit(events.PULSE_UPDATE, data);
    });

    socket.on(events.DISCONNECT, () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit(events.USER_OFFLINE, { userId: socket.userId });
        io.emit(events.PRESENCE_UPDATE, { online: Array.from(onlineUsers.keys()) });
      }
    });
  });
};

const sendNotification = (io, userId, notification) => {
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(events.NOTIFICATION, notification);
  }
};

const broadcastActivity = (io, activity) => {
  io.emit(events.NEW_ACTIVITY, activity);
};

module.exports = { setupSocketHandlers, sendNotification, broadcastActivity, onlineUsers };
