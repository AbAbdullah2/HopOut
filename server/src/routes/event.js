import express from 'express';
import EventDao from '../data/EventDao.js';

const router = express.Router();
const eventDao = new EventDao();

router.get('/events', async (req, res, next) => {
  try {
    const events = await eventDao.readAll();
    res.json({
      status: 200,
      message: `Successfully retrieved ${events.length} events!`,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventDao.read(id);

    if (!event) {
      throw new ApiError(404, "Resource not found!");
    }

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
    const { name, start, end, location, description, visibility, organizer, categories } = req.body;
    const event = eventDao.create({ name, start, end, location, description, visibility, organizer, categories });

    return res.json({
      status: 200,
      message: `Successfully created the following event!`,
      data: event
    });
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.put(`/events/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, start, end, location, description, visibility, categories, attendees, invitees } = req.body;
    const event = await eventDao.update({ id, name, start, end, location, description, visibility, categories, attendees, invitees });
    res.json({
      status: 200,
      message: `Successfully updated the following event!`,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/events/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await eventDao.delete(id);

    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully deleted the following event!`,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

export default router;