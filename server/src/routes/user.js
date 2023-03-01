import express from 'express';
import { hashPassword, verifyPassword } from "../util/password.js";
import UserDao from '../data/UserDao.js';

const router = express.Router();
const userDao = new UserDao();

router.get('/users', async (req, res, next) => {
  try {
    const { name } = req.query;
    const users = await userDao.readAll({ name });
    users.forEach((u) => u["password"] = null);
    return res.json({
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
    user["password"] = null;

    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return res.json({
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
        status: 201,
        message: `Successfully registered the following user!`,
        data: savedUser,
      });;
    }
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.findOne({ email: email.toLowerCase() });
    user["password"] = null;

    if (!user) {
      return res.json({
        message: 'Invalid credentials. Please try again.',
        status: 409,
      });
    }

    if (user && verifyPassword(password, user.password)) {
      return res.json({
        status: 201,
        message: `Successfully logged in the following user!`,
        data: user,
      });
    }
    return res.json({
      message: 'Invalid credentials. Please try again.',
      status: 400,
    });
  } catch (err) {
    return res.status(500).send('Something went wrong. Please try again.');
  }
});

router.put(`/users/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;
    const user = await userDao.update({ id, name, password });
    user["password"] = null;
    res.json({
      status: 200,
      message: `Successfully updated the following user!`,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.delete(id);
    user["password"] = null;

    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return res.json({
      status: 200,
      message: `Successfully deleted the following user!`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
