import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import CommentDao from '../../src/data/CommentDao.js';
import EventDao from '../../src/data/EventDao.js';
import * as db from '../../src/data/db.js';
import * as dotenv from 'dotenv';
import UserDao from '../../src/data/UserDao.js';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import app from '../../src/index.js';
import supertest from 'supertest';

dotenv.config();
const request = new supertest(app);

const commentDao = new CommentDao();
const userDao = new UserDao();
const eventDao = new EventDao();

describe('Test CommentDao', () => {
  const numChats = 5;
  let commentSection, user1, text, commentSectionId;
  let name,
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
    capacity,
    organizer,
    categories;
  let sid, sender, rid, event1;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await commentDao.deleteAll();
    await userDao.deleteAll();
    user1 = await userDao.create({
      name: 'test',
      email: 'te12@jhu.com',
      password: '1234567',
    });
  });

  beforeEach(async () => {
    await commentDao.deleteAll();
    name = faker.lorem.words(3);
    start = '2023-06-22T15:28:37.174Z';
    end = '2023-06-22T15:28:37.174Z';
    locationName = faker.lorem.words(2);
    address = faker.address.streetAddress();
    city = faker.address.cityName();
    state = faker.address.countryCode();
    zip = faker.address.zipCode();
    addressLine2 = faker.address.secondaryAddress();
    description = faker.lorem.paragraph();
    visibility = 'public';
    organizer = user1.id;
    capacity = 20;
    categories = ['Sports'];
    event1 = await eventDao.create({
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
      capacity,
      organizer,
      categories,
    });
  });

  it('test createCommentSection()', async () => {
    commentSection = await commentDao.createCommentSection({
      eventId: event1._id.toString(),
    });
    expect(commentSection.id).toBeDefined();
    expect(commentSection.event.id.toString()).toBe(event1._id.toString());
  });

  describe('test createCommentSection() throws error', async () => {
    it('empty event', async () => {
      try {
        await commentDao.createCommentSection({ event: '' });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('null event', async () => {
      try {
        await commentDao.createCommentSection({ event: null });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('undefined event', async () => {
      try {
        await commentDao.createCommentSection({ event: undefined });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('invalid event', async () => {
      try {
        await commentDao.createCommentSection({
          event: mongoose.Types.ObjectId(),
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
  });

  it('test createComment()', async () => {
    text = 'hi how are you';
    commentSection = await commentDao.createCommentSection({
      eventId: event1._id.toString(),
    });
    commentSectionId = commentSection._id;

    const response = await request
      .put('/rsvp/sendRSVP')
      .send({ senderId: user1._id, eventId: event1._id });

    expect(response.status).toBe(200);
    const updatedEvent = await eventDao.read(event1._id.toString());
    expect(updatedEvent.attendees).toContain(user1._id.toString());
    expect(response.body.data.attending).toContain(event1._id.toString());

    const eventId = event1._id;
    sender = user1._id;

    const formMessage = await commentDao.createComment({
      eventId,
      commentSectionId,
      sender,
      message: text,
    });
    expect(formMessage.comments[0].id).toBeDefined();
    expect(formMessage.comments[0].sender.toString()).toBe(
      user1._id.toString()
    );
    expect(formMessage.comments[0].message).toBe(text);
  });
  describe('test createComment() throws error', async () => {
    // test commenter not attending event
    it('empty eventId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId: '',
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid EventId!');
      }
    });
    it('null eventId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId: null,
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid EventId!');
      }
    });
    it('invalid eventId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;
        
        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId: undefined,
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid EventId!');
      }
    });
    it('invalid eventId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;
        
        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId: '1',
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid EventId!');
      }
    });
    it('invalid eventId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId: mongoose.Types.ObjectId(),
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Event does not exist!');
      }
    });
    it('empty senderId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const eventId = event1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender: '',
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('null senderId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const eventId = event1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender: null,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('invalid senderId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const eventId = event1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender: undefined,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('invalid senderId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const eventId = event1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender: '1',
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid ID!');
      }
    });
    it('invalid senderId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const eventId = event1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender: mongoose.Types.ObjectId(),
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid Sender!');
      }
    });
    it('empty commentSectionId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId: '',
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid commentSectionId!');
      }
    });
    it('null commentSectionId', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;
        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId: null,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid commentSectionId!');
      }
    });
    it('invalid commentSectionId', async () => {
      try {
        text = 'hi how are you';

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId: undefined,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid commentSectionId!');
      }
    });
    it('invalid commentSectionId', async () => {
      try {
        text = 'hi how are you';

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId: '1',
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Invalid commentSectionId!');
      }
    });
    it('invalid commentSectionId', async () => {
      try {
        text = 'hi how are you';

        const response = await request
          .put('/rsvp/sendRSVP')
          .send({ senderId: user1._id, eventId: event1._id });

        expect(response.status).toBe(200);
        const updatedEvent = await eventDao.read(event1._id.toString());
        expect(updatedEvent.attendees).toContain(user1._id.toString());
        expect(response.body.data.attending).toContain(event1._id.toString());

        const eventId = event1._id;
        sender = user1._id;

        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId: mongoose.Types.ObjectId(),
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Comment section does not exist!');
      }
    });
    it('commenter does not attend event', async () => {
      try {
        text = 'hi how are you';
        commentSection = await commentDao.createCommentSection({
          eventId: event1._id.toString(),
        });
        commentSectionId = commentSection._id;
  
        const eventId = event1._id;
        sender = user1._id;
    
        const formMessage = await commentDao.createComment({
          eventId,
          commentSectionId,
          sender,
          message: text,
        });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.message).toBe('Commenter not attending event!');
      }
    });
  });
});
