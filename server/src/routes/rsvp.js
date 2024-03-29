import express from 'express';
import UserDao from '../data/UserDao.js';
import EventDao from '../data/EventDao.js';
import { hidePassword } from './users.js';
import ApiError from '../models/ApiError.js';
import nodemailer from "nodemailer";

const router = express.Router();
const userDao = new UserDao();
const eventDao = new EventDao();

let transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }
});

// for sending an rsvp to a public event
// may need to verify that an event is public - check w frontend
router.put(`/rsvp/sendRSVP`, async (req, res, next) => {
  try {
    const { senderId, eventId } = req.body;

    const sender = await userDao.read(senderId);
    const event = await eventDao.read(eventId);

    // currently can only rsvp to private event by accepting invite but may need to change
    if (event.visibility === "private") {
      throw new ApiError(400, "This event is private and requires an invitation!")
    }
  
    const eventAttendees = event.attendees;
    eventAttendees.push(senderId);
    const senderEvents = sender.attending;
    senderEvents.push(eventId);

    const updatedSender = await userDao.update({
      id: senderId,
      attending: senderEvents,
    });
    const updatedEvent = await eventDao.update({
      id: eventId,
      attendees: eventAttendees,
    });

    res.json({
      status: 200,
      message: `Successfully RSVP'd to ${updatedEvent.name}!`,
      data: hidePassword(updatedSender),
    });
  } catch (err) {
    next(err);
  }
});

// for sending an invitation about an event to a user
// need to make sure we can only send an invitation once
// prob just check if id already in invitees 
router.put(`/rsvp/sendInvite`, async (req, res, next) => {
  try {
    const { eventId, inviteeId } = req.body;

    const event = await eventDao.read(eventId);
    const invitee = await userDao.read(inviteeId);
    const eventInvitees = event.invitees;
    if (!eventInvitees.includes(inviteeId)) {
      eventInvitees.push(inviteeId);
    }
    const userInvited = invitee.invited;
    if (!userInvited.includes(eventId)) {
      userInvited.push(eventId);
    }
    const updatedEvent = await eventDao.update({
      id: eventId,
      invitees: eventInvitees,
    });
    const updatedUser = await userDao.update({
      id: inviteeId,
      invited: userInvited,
    });

    let mailOptions = {
      from: process.env.SMTP_USER,
      to: invitee.email,
      subject: 'You\'re invited to ' + event.name + '!',
      html: `Hi ${invitee.name}, <br/><br/> You've been invited to ${event.name}! <br/>
            Visit the <a href='${process.env.DEPLOYED_URL}'> notifications tab </a> to view and RSVP to the invitation. Hope to see you there!<br/><br/>
            The HopOut Team`
    };

    await transporter.sendMail(mailOptions);

    res.json({
      status: 200,
      message: `Successfully sent invite to ${updatedUser.name} for ${updatedEvent.name}!`,
      data: updatedEvent,
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/rsvp/unsendInvite`, async (req, res, next) => {
  try {
    const { eventId, uninviteeId } = req.body;

    const uninvitee = await userDao.read(uninviteeId);
    const event = await eventDao.read(eventId);

    let filteredInvited = uninvitee.invited.filter((e) => e.toString() !== eventId);
    let filteredAttending = uninvitee.attending.filter((e) => e.toString() !== eventId);
    let filteredInvitees = event.invitees.filter((e) => e.toString() !== uninviteeId);
    let filteredAttendees = event.attendees.filter((e) => e.toString() !== uninviteeId);

    const updatedUninvitee = await userDao.update({
      id: uninviteeId,
      invited: filteredInvited,
      attending: filteredAttending,
    });
    const updatedEvent = await eventDao.update({
      id: eventId,
      invitees: filteredInvitees,
      attendees: filteredAttendees,
    });

    res.json({
      status: 200,
      message: `Successfully uninvited ${updatedUninvitee.name} from ${updatedEvent.name}!`,
      data: updatedEvent,
    });
  } catch (err) {
    next(err);
  }
});

// user accepting invite
// invitees doesn't change unless we want to uninvite someone, 
// to keep record of ppl u wanted to invite
router.put(`/rsvp/acceptInvite`, async (req, res, next) => {
  try {
    const { acceptorId, eventId } = req.body;

    const acceptor = await userDao.read(acceptorId);
    const event = await eventDao.read(eventId);

    let filteredAcceptor = acceptor.invited.filter(
      (e) => e.toString() !== event.id
    );

    const acceptorEvents = acceptor.attending;
    acceptorEvents.push(eventId);
    const eventAttendees = event.attendees;
    eventAttendees.push(acceptorId);


    const updatedAcceptor = await userDao.update({
      id: acceptorId,
      invited: filteredAcceptor,
      attending: acceptorEvents,
    });
    const updatedEvent = await eventDao.update({
      id: eventId,
      attendees: eventAttendees,
    });

    res.json({
      status: 200,
      message: `Successfully accepted invite to ${updatedEvent.name}!`,
      data: hidePassword(updatedAcceptor),
    });
  } catch (err) {
    next(err);
  }
});

// do we want separate array for events we were invited to but declined to go to?
router.put(`/rsvp/declineInvite`, async (req, res, next) => {
  try {
    const { declinerId, eventId } = req.body;

    const decliner = await userDao.read(declinerId);
    const event = await eventDao.read(eventId);

    let filteredDecliner = decliner.invited.filter(
      (e) => e.toString() !== event.id
    );

    const updatedDecliner = await userDao.update({
      id: declinerId,
      invited: filteredDecliner,
    });


    res.json({
      status: 200,
      message: `Successfully declined invite to ${event.name}!`,
      data: hidePassword(updatedDecliner),
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/rsvp/removeRSVP`, async (req, res, next) => {
  try {
    const { removerId, eventId } = req.body;

    const remover = await userDao.read(removerId);
    const event = await eventDao.read(eventId);

    let filteredRemover = remover.attending.filter((e) => e.toString() !== eventId);
    let filteredEvent = event.attendees.filter((e) => e.toString() !== removerId);

    const updatedRemover = await userDao.update({
      id: removerId,
      attending: filteredRemover,
    });
    const updatedEvent = await eventDao.update({
      id: eventId,
      attendees: filteredEvent,
    });

    res.json({
      status: 200,
      message: `Successfully removed RSVP to ${updatedEvent.name}!`,
      data: hidePassword(updatedRemover),
    });
  } catch (err) {
    next(err);
  }
});

export default router;