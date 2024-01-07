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
      locationName,
      address,
      city,
      state,
      zip,
      addressLine2,
      description,
      visibility,
      organizer,
      categories,
      capacity,
      attendees,
      invitees,
      coverId,
      thumbnailId,
    } = req.body;
    const event = await eventDao.create({
      name,
      start,
      end,
      locationName,
      address,
      city,
      state,
      zip,
      addressLine2,
      description,
      visibility,
      organizer,
      categories,
      capacity,
      attendees,
      invitees,
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
      locationName,
      location,
      addressLine2,
      description,
      visibility,
      organizer,
      categories,
      capacity,
      attendees,
      invitees,
      reviews,
      coverId, 
      thumbnailId
    } = req.body;
    // call read, get capacity if original capacity is undefined
    const eventBefore = await eventDao.read(id);
    const readCapacity = eventBefore.capacity;
    let updatedCapacity = capacity || readCapacity;
    // const location = { address, city, state, zip };
    const event = await eventDao.update({
      id,
      name,
      start,
      end,
      locationName,
      location,
      addressLine2,
      description,
      visibility,
      organizer, 
      categories,
      capacity: updatedCapacity,
      attendees,
      invitees,
      reviews,
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

    // Delete from invited users 
    for (const userId of event.invitees) {
      const user = await userDao.read(userId.toString);
      let invited = user.invited
      const index = invited.indexOf(id);
      if (index > -1) { // only splice array when item is found
        invited.splice(index, 1); // 2nd parameter means remove one item only
      }
      await userDao.update({...user._doc, id: user._doc._id.toString(), invited: invited});
    }

    // Delete from attending users 
    for (const userId of event.attendees) {
      const user = await userDao.read(userId.toString());
      let attending = user.attending
      const index = attending.indexOf(id);
      if (index > -1) { // only splice array when item is found
        attending.splice(index, 1); // 2nd parameter means remove one item only
      }
      await userDao.update({...user._doc, id: user._doc._id.toString(), attending: attending});
    }

    // Delete from host 
    const host = await userDao.read(event.organizer.toString());
    let organizing = host.organizing
    const index = organizing.indexOf(id);
    if (index > -1) { // only splice array when item is found
        organizing.splice(index, 1); // 2nd parameter means remove one item only
    }

    await userDao.update({...host._doc, id: host._doc._id.toString(), organizing: organizing});

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