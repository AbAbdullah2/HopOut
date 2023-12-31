import express from 'express';
import eventUrls from './routes/events.js';
import userUrls from './routes/users.js';
import friendUrls from './routes/friends.js';
import rsvpUrls from './routes/rsvp.js';
import chatUrls from './routes/chat.js';
import commentUrls from './routes/comment.js';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
  console.log(`${req.method} ${req.path} called...`);
  res.send('Welcome to the HopOut API!');
});

app.use(eventUrls);
app.use(userUrls);
app.use(friendUrls);
app.use(rsvpUrls);
app.use(chatUrls);
app.use(commentUrls);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    const code = err.status || 500;
    res.status(code).json({
      status: code,
      message: err.message || `Internal Server Error!`,
    });
  }
  next();
});

export default app;
