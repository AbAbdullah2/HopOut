import app from './src/index.js';
import * as db from './src/data/db.js';
import { Server } from 'socket.io';

//db.connect(process.env.TEST_DB)
db.connect(process.env.DB);
const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, () => {
  console.log(`HopOut API at http://localhost:${PORT}/`);
});

const io = new Server(server, {
  cors: {
    origin: `http://localhost:${PORT}/`,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    console.log("USER ADDED")
    onlineUsers.set(userId, socket.id);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
        console.log("RECEIEVED MESG")

      socket.to(sendUserSocket).emit('msg-recieved', data.message);
    }
  });
});
