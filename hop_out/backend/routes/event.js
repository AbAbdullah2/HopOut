import express from 'express';
import EventDao from '../data/EventDao.js';

const router = express.Router();
const eventDao = new EventDao();

router.get('/events', async (req, res, next) => {
  try {
    const { name } = req.query;
    const users = await eventDao.readAll({ name });
    res.json({
      status: 200,
      message: `Successfully retrieved ${users.length} users!`,
      data: users,
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

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const user = await eventDao.exists({ email: email.toLowerCase() });

    if (user) {
      return res.json({
        msg: 'This email is already in use. Please try a different one.',
        status: 409,
      });
    } else {
      const encryptedPassword = hashPassword(password);
      const savedUser = await eventDao.create({
        email: email.toLowerCase(),
        name,
        password: encryptedPassword,
      });

      return res.json({
        userDetails: {
          email: savedUser.email,
          username: savedUser.username,
          id: savedUser._id,
        },
        status: 200,
      });
    }
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await eventDao.delete(id);

    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully deleted the following user!`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;