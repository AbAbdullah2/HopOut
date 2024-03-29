import express from 'express';
import ChatDao from '../data/ChatDao.js';
import UserDao from '../data/UserDao.js';
import ApiError from '../models/ApiError.js';

const router = express.Router();
export const chatDao = new ChatDao();
export const userDao = new UserDao();

router.post('/chat', async (req, res, next) => {
  try {
    const { person1, person2 } = req.body;

    const chat = await chatDao.createChat({ person1, person2 });

    res.status(201).json({
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

    const chat = await chatDao.createMessage({
      chatId,
      sender: senderId,
      receiver: receiverId,
      message,
    });
    res.status(201).json({
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
    const chats = await chatDao.readAllChats(id);

    res.json({
      status: 200,
      message: `Successfully retrieved all of user's chats!`,
      data: chats,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/getChat/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      throw new ApiError(400, "No chatId")
    }
    const chat = await chatDao.readChat(chatId);

    res.json({
      status: 200,
      message: `Successfully retrieved chat!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/deleteChat/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      throw new ApiError(400, "No chatId")
    }
    
    
    //verify that user deleting chat is in the chat

    const chat = await chatDao.deleteChat(chatId);

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
