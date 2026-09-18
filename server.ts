import { createServer } from 'node:http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  const rooms = new Map<string, Set<string>>();

  io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, user }) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId)?.add(socket.id);

      // Notify others in room
      socket.to(roomId).emit('user-joined', { ...user, socketId: socket.id });

      // Send existing participants to the joiner
      const existingMembers = Array.from(rooms.get(roomId) || [])
        .filter((id) => id !== socket.id);
      socket.emit('room-members', existingMembers);
    });

    socket.on('signal-offer', ({ targetSocketId, sdp }) => {
      io.to(targetSocketId).emit('signal-offer', {
        senderSocketId: socket.id,
        sdp,
      });
    });

    socket.on('signal-answer', ({ targetSocketId, sdp }) => {
      io.to(targetSocketId).emit('signal-answer', {
        senderSocketId: socket.id,
        sdp,
      });
    });

    socket.on('signal-ice', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('signal-ice', {
        senderSocketId: socket.id,
        candidate,
      });
    });

    socket.on('disconnecting', () => {
      for (const roomId of socket.rooms) {
        if (rooms.has(roomId)) {
          rooms.get(roomId)?.delete(socket.id);
          if (rooms.get(roomId)?.size === 0) {
            rooms.delete(roomId);
          }
          socket.to(roomId).emit('user-left', { socketId: socket.id });
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
