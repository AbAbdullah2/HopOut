import express from 'express';
import EventDao from '../data/EventDao.js';
import UserDao from '../data/UserDao.js';

const router = express.Router();
export const eventDao = new EventDao();
export const userDao = new UserDao();

router.get('/events', async (req, res, next) => {
  try {
    const { name } = req.query;

    const events = await eventDao.readAll({ name });

    res.json({
      status: 200,
      message: `Successfully retrieved ${events.length} events!`,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/events/:id', async (req, res, next) => {
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
    console.log("USER", organizer)
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
    const updatedUser = await userDao.update({
      id: user.id,
      organizing: newOrganizing,
    });

    console.log(updatedUser)

    return res.status(201).json({
      status: 201,
      message: `Successfully created the following event!`,
      data: event,
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
      data: event,
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
      message: `Successfully deleted ${events.deletedCount} events!`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
