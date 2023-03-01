import express from 'express';
import { hashPassword, verifyPassword } from "../util/password.js";
import UserDao from '../data/UserDao.js';

const router = express.Router();
const userDao = new UserDao();

router.get('/users', async (req, res, next) => {
  try {
    const { name } = req.query;
    const users = await userDao.readAll({ name });
    res.json({
      status: 200,
      message: `Successfully retrieved ${users.length} users!`,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.read(id);

    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    res.json({
      status: 200,
      message: `Successfully retrieved the following user!`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const user = await userDao.exists({ email: email.toLowerCase() });

    if (user) {
      return res.json({
        msg: 'This email is already in use. Please try a different one.',
        status: 409,
      });
    } else {
      const encryptedPassword = hashPassword(password);
      const savedUser = await UserDao.create({
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

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.json({
        msg: 'Invalid credentials. Please try again.',
        status: 409,
      });
    }

    if (user && verifyPassword(password, user.password)) {
      return res.json({
        userDetails: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        status: 200,
      });
    }
    return res.json({
      msg: 'Invalid credentials. Please try again.',
      status: 400,
    });
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.delete(id);

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
