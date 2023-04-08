import app from './src/index.js';
import * as db from './src/data/db.js';
import { Server } from 'socket.io';
import { createServer } from 'http';

//db.connect(process.env.TEST_DB)
db.connect(process.env.DB);
const PORT = process.env.PORT || 6002;

// const httpServer = createServer();
const server = app.listen(PORT, () => {
  console.log(`HopOut API at http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: '*/',
    credentials: true,
  },
});
global.onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieved', data.message);
    }
  });
});

//global.onlineUsers = new Map();
