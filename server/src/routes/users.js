import express from 'express';
import { verifyPassword } from "../util/password.js";
import UserDao from '../data/UserDao.js';
import EventDao from '../data/EventDao.js';
import nodemailer from "nodemailer";


const router = express.Router();
export const userDao = new UserDao();
export const eventDao = new EventDao();


export const hidePassword = (user) => {
  const { password, __v, ...rest } = user._doc;
  return rest;
};

let transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
});

router.get('/users', async (req, res, next) => {
  try {
    const { name } = req.query;
    const users = await userDao.readAll({ name });

    return res.json({
      status: 200,
      message: `Successfully retrieved ${users.length} users!`,
      data: users.map((user) => hidePassword(user)),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.read(id);

    return res.json({
      status: 200,
      message: `Successfully retrieved the following user!`,
      data: hidePassword(user),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users/privateEvents/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.read(id);
    let events = [];

    for (const eventId of user.invited) {
      const event = await eventDao.read(eventId.toString());
      if (event.visibility === 'private') {
        events.push(event);
      }
    }

    for (const eventId of user.organizing) {
      const event = await eventDao.read(eventId.toString());
      if (event.visibility === 'private') {
        events.push(event);
      }
    }

    return res.json({
      status: 200,
      message: `Successfully retrieved the user's private events!`,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users/hostedEvents/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.read(id);
    let events = [];
    for (const eventId of user.organizing) {
      const event = await eventDao.read(eventId.toString());
      events.push(event);
    }

    return res.json({
      status: 200,
      message: `Successfully retrieved the user's hosted events!`,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/users/attendedEvents/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.read(id);
    let events = [];
    for (const eventId of user.attending) {
      const event = await eventDao.read(eventId.toString());
      events.push(event);
    }

    return res.json({
      status: 200,
      message: `Successfully retrieved the user's attended events!`,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let { email, name, password } = req.body;
    if (email) {
      email = email.toLowerCase()
    }
    const savedUser = await userDao.create({
      email,
      name,
      password,
    });
    return res.status(201).json({
      status: 201,
      message: `Successfully registered the following user!`,
      data: hidePassword(savedUser),
    });

  } catch (err) {
    next(err);
  }
});

router.post('/verification', async (req, res, next) => {
  try {
    let { email, name } = req.body;

    const code = Math.floor(1000000 * Math.random()).toString().padStart(6, '0');

    let mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your JHU email for HopOut',
      html: `Hi ${name}, <br/><br/> Thank you for registering for HopOut! <br/>
            Here is your 6-digit verification code: <strong>${code}</strong><br/>
            Enter this code back on the sign up page to begin using the app.<br/><br/>
            Welcome to HopOut!<br/>
            The HopOut Team`
    };
    
    const info = await transporter.sendMail(mailOptions);
    return res.status(201).json({
      status: 201,
      message: `Successfully sent verification code to ${email}!`,
      data: {
        email: email,
        code: code,
      },
    });

  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userDao.readByEmail(email.toLowerCase());

    if (user && verifyPassword(password, user.password)) {
      return res.json({
        status: 201,
        message: `Successfully logged in the following user!`,
        data: hidePassword(user),
      });
    }
    return res.json({
      message: 'Invalid credentials. Please try again.',
      status: 400,
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/users/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, password, organizing, attending, invited } = req.body;
    const user = await userDao.update({ id, name, password, organizing, attending, invited });

    res.json({
      status: 200,
      message: `Successfully updated the following user!`,
      data: hidePassword(user),
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userDao.delete(id);

    return res.json({
      status: 200,
      message: `Successfully deleted the following user!`,
      data: hidePassword(user),
    });
  } catch (err) {
    next(err);
  }
});


router.delete('/users', async (req, res, next) => {
  try {
    const users = await userDao.deleteAll();

    res.json({
      status: 200,
      message: `Successfully deleted ${users.deletedCount} users!`
    });
  } catch (err) {
    next(err);
  }
});

export default router;
