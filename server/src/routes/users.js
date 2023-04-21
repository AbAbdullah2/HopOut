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
    const user = await userDao.read(id);

    // Delete from friended users 
    for (const friendReq of user.friends) {
      const friend = await userDao.read(friendReq.user.toString());
      let friends = friend.friends
      friends = friends.filter(f => f.user != id);
      await userDao.update({...friend._doc, id: friend._doc._id.toString(), friends: friends});
    }

    // Delete from recievedFriends users 
    for (const senderReq of user.receivedFriends) {
      const sender = await userDao.read(senderReq.user.toString());
      let sent = sender.sentFriends
      sent = sent.filter(s => s.user != id);
      await userDao.update({...sender._doc, id: sender._doc._id.toString(), sentFriends: sent});
    }

    // Delete from sentFriends users 
    for (const receiverReq of user.sentFriends) {
      const receiver = await userDao.read(receiverReq.user.toString());
      let received = receiver.receivedFriends
      received = received.filter(r => r.user != id);
      await userDao.update({...receiver._doc, id: receiver._doc._id.toString(), receievedFriends: received});
    }

    // Delete from invited events 
    for (const eventId of user.invited) {
      const event = await eventDao.read(eventId.toString);
      let invitees = event.invitees
      const index = invitees.indexOf(id);
      if (index > -1) { // only splice array when item is found
        invited.splice(index, 1); // 2nd parameter means remove one item only
      }
      await eventDao.update({...event._doc, id: event._doc._id.toString(), invitees: invitees});
    }

    // Delete from attending events 
    for (const eventId of user.attending) {
      const event = await eventDao.read(eventId.toString());
      let attendees = event.attendees
      const index = attendees.indexOf(id);
      if (index > -1) { // only splice array when item is found
        attendees.splice(index, 1); // 2nd parameter means remove one item only
      }
      await eventDao.update({...event._doc, id: event._doc._id.toString(), attendees: attendees});
    }

    // Delete hosted events 
    for (const eventId of user.organizing) {
      const event = await eventDao.delete(eventId.toString());

      // Delete from invited users 
      for (const userId of event.invitees) {
        const u = await userDao.read(userId.toString);
        let invited = u.invited
        const index = invited.indexOf(id);
        if (index > -1) { // only splice array when item is found
          invited.splice(index, 1); // 2nd parameter means remove one item only
        }
        await userDao.update({...u._doc, id: u._doc._id.toString(), invited: invited});
      }
  
      // Delete from attending users 
      for (const userId of event.attendees) {
        const u = await userDao.read(userId.toString());
        let attending = u.attending
        const index = attending.indexOf(id);
        if (index > -1) { // only splice array when item is found
          attending.splice(index, 1); // 2nd parameter means remove one item only
        }
        await userDao.update({...u._doc, id: u._doc._id.toString(), attending: attending});
      }
    }

    const delUser = await userDao.delete(id);

    return res.json({
      status: 200,
      message: `Successfully deleted the following user!`,
      data: hidePassword(delUser),
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
