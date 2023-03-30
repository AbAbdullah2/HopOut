import express from 'express';
import MessageDao from '../data/ChatDao.js';
import UserDao from '../data/UserDao.js';

const router = express.Router();
export const chatDao = new ChatDao();
export const userDao = new UserDao();

router.post('/message', async (req, res, next) => {
  try {
    const { chatId, senderId, receiverId, message } = req.body;

    chat = chatDao.createMessage({ chatId, sender: senderId, receiver: receiverId, message })

    res.json({
      status: 200,
      message: `Successfully sent message!`,
      data: chat,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/getAllMessages/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const messages = await messageDao.read(sender);
      const messages = await messageDao.read(reciever);

      res.json({
        status: 200,
        message: `Successfully retrieved the following event!`,
        data: event,
      });
    } catch (err) {
      next(err);
    }
  });

router.get('/getMessage/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventDao.read(id);

    res.json({
      status: 200,
      message: `Successfully retrieved the following event!`,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/events', async (req, res, next) => {
  try {
    const {
      name,
      start,
      end,
      address,
      city,
      state,
      zip,
      description,
      visibility,
      organizer,
      capacity,
      categories,
      coverId,
      thumbnailId,
    } = req.body;
    const event = await eventDao.create({
      name,
      start,
      end,
      address,
      city,
      state,
      zip,
      description,
      visibility,
      organizer,
      capacity,
      categories,
      coverId,
      thumbnailId,
    });
    
    const user = await userDao.read(organizer.toString());
    let newOrganizing = user.organizing;
    newOrganizing.push(event.id);
    await userDao.update({
      id: user.id,
      organizing: newOrganizing,
    });

    return res.status(201).json({
      status: 201,
      message: `Successfully created the following event!`,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/events/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      start,
      end,
      address,
      city,
      state,
      zip,
      description,
      visibility,
      categories,
      capacity,
      attendees,
      invitees,
      coverId, 
      thumbnailId
    } = req.body;
    // call read, get capacity if original capity is undefined
    const eventBefore = await eventDao.read(id);
    const readCapacity = eventBefore.capacity;
    let updatedCapacity = capacity || readCapacity;
    const event = await eventDao.update({
      id,
      name,
      start,
      end,
      address,
      city,
      state,
      zip,
      description,
      visibility,
      categories,
      capacity: updatedCapacity,
      attendees,
      invitees,
      coverId, 
      thumbnailId
    });

    res.json({
      status: 200,
      message: `Successfully updated the following event!`,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventDao.delete(id);

    res.json({
      status: 200,
      message: `Successfully deleted the following event!`,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/events', async (req, res, next) => {
  try {
    const events = await eventDao.deleteAll();

    res.json({
      status: 200,
      message: `Successfully deleted ${events.deletedCount} events!`
    });
  } catch (err) {
    next(err);
  }
});

export default router;