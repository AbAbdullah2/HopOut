import express from 'express';
import ChatDao from '../data/ChatDao.js';
import UserDao from '../data/UserDao.js';

const router = express.Router();
export const chatDao = new ChatDao();
export const userDao = new UserDao();

router.post('/chat', async (req, res, next) => {
  try {
    const { person1, person2 } = req.body;

    chat = chatDao.createChat({ person1, person2 });

    res.json({
      status: 201,
      message: `Successfully created chat!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/message', async (req, res, next) => {
  try {
    const { chatId, senderId, receiverId, message } = req.body;

    chat = chatDao.createMessage({
      chatId,
      sender: senderId,
      receiver: receiverId,
      message,
    });

    res.json({
      status: 201,
      message: `Successfully sent message!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/getAllChats/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const chats = await chatDao.readAllChats({ id });

    res.json({
      status: 200,
      message: `Successfully retrieved all of user's chats!`,
      data: chats,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/getChat/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await chatDao.readChat({ id });

    res.json({
      status: 200,
      message: `Successfully retrieved chat!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/deleteChat/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const chat = await chatDao.deleteChat({ id });

    res.json({
      status: 200,
      message: `Successfully deleted chat!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
