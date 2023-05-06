import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import app from '../../src/index.js';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import * as db from '../../src/data/db.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userDao } from '../../src/routes/users.js';
import { eventDao } from '../../src/routes/events.js';
import { commentDao } from '../../src/routes/comment.js';

dotenv.config();
const request = new supertest(app);

describe(`Test comment routes`, () => {
    let user1, user2, user3, event, commentSectionId, commentId, eventId;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    //await userDao.deleteAll();
    await eventDao.deleteAll();
    user1 = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    user2 = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    user3 = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    event = await eventDao.create({ 
        name: faker.lorem.words(3), 
        start: "2023-06-22T15:28:37.174Z", 
        end: "2023-06-22T15:28:37.174Z", 
        locationName: faker.lorem.words(2), 
        address: faker.address.streetAddress(), 
        city: faker.address.cityName(), 
        state: faker.address.countryCode(), 
        zip: faker.address.zipCode(), 
        addressLine2: faker.address.secondaryAddress(), 
        description: faker.lorem.paragraph(), 
        visibility: "public", 
        capacity: 20, 
        organizer: user1._id.toString(), 
        categories: ["Sports"]
    });
    eventId = event._id
    console.log("EVENT ID", eventId)
    await request.put(`/rsvp/sendRSVP`).send({ senderId: user2._id, eventId: event._id })
    event = await eventDao.read(eventId.toString())
  });

  describe('POST request', () => {
    describe(`/commentSection/:eventId`, () => {
      it('Respond 201', async () => {
        const response = await request.post(`/commentSection/${event._id}`);
        commentSectionId = response.body.data._id;
        expect(response.status).toBe(201);
        expect(response.body.data.event._id).toBe(event._id.toString())
        expect(commentSectionId).toBeDefined();

      });
      describe('Respond 400', () => {
        it('Empty eventId', async () => {
          try {
            await request.post(`/commentSection/`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null eventId', async () => {
          try {
            await request.post(`/commentSection/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined eventId', async () => {
          try {
            await request.post(`/commentSection/${undefined}`);          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid person1', async () => {
          try {
            await request.post(`/commentSection/hello`);          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
      });
    })

    describe('/comment/:commentSectionId', () => {
      it('Respond 201', async () => {
        const response = await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
        console.log("RESPONSE", response.body)
        expect(response.status).toBe(201);
        expect(response.body.data.comments).toBeDefined();
        commentId = response.body.data.comments[0]._id;
        expect(response.body.data.event).toBe(event._id.toString());
      });
      describe('Respond 400', () => {
        it('Empty commentSectionId', async () => {
          try {
            await request.post(`/comment/${""}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
        }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null commentSectionId', async () => {
          try {
            await request.post(`/comment/${null}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined commentSectionId', async () => {
          try {
            await request.post(`/comment/${undefined}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid commentSectionId', async () => {
          try {
            await request.post(`/comment/${"12"}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid comment section: comment section doesn\'t exist', async () => {
          try {
            await request.post(`/comment/${mongoose.Types.ObjectId()}`).send({ eventId: event._id, sender: user1._id, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Comment section does not exist!')
            expect(err.status).toBe(400)
          }
        });
        it('Empty sender', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: "", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
        });
        it('Null sender', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: null, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined sender', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: undefined, message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid sender: user doesn\'t exist', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: mongoose.Types.ObjectId(), message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid User!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid senderId', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid sender: user not attending event', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chat Users!')
            expect(err.status).toBe(400)
          }
        });
        it('Empty event', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: "", sender: "123", message: "Party starting 10 min early!" });            
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Null event', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: null, sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined event', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: undefined, sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid eventId', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: "event._id", sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid event: event doesn\'t exist', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: mongoose.Types.ObjectId(), sender: "123", message: "Party starting 10 min early!" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Null message', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: "123", message: null });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Message!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined message', async () => {
          try {
            await request.post(`/comment/${commentSectionId}`).send({ eventId: event._id, sender: "123", message: undefined });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Message!')
            expect(err.status).toBe(400)
          }
        });
      });
    });
  });

  describe('GET request', () => {
    describe('/getAllComments/:eventId', () => {
      it('Respond 200', async () => {
        const response = await request.get(`/getAllComments/${event._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].comments.length).toBe(1);
        expect(response.body.data[0].comments[0]._id).toBe(commentId);
      });

      describe('Respond 400', () => {
        it('Empty eventId', async () => {
          try {
            await request.get(`/getAllComments/`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null eventId', async () => {
          try {
            await request.get(`/getAllComments/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined eventId', async () => {
          try {
            await request.get(`/getAllComments/${undefined}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid event: event doesn\'t exist', async () => {
          try {
            await request.get(`/getAllComments/${mongoose.Types.ObjectId()}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid Event!')
            expect(err.status).toBe(400)
          }
        });
      });
    });   
  });

  describe('DELETE request', () => {
    describe('/deleteComment/:commentSectionId', () => {
      describe('Respond 400', () => {
        it('Empty commentSectionId', async () => {
          try {
            console.log("trying to delete with empty chatid")
            const resp = await request.delete(`/deleteComment/`).send({ senderId: user1._id, commentId: commentId });
            console.log("delete empty", resp.body)
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
            expect(commentId).toBeDefined();
          }
        });
        it('Null commentSectionId', async () => {
          try {
            await request.delete(`/deleteComment/${null}`).send({ senderId: user1._id, commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined commentSectionId', async () => {
          try {
            await request.delete(`/deleteComment/${undefined}`).send({ senderId: user1._id, commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid commentSection: commentSection doesn\'t exist', async () => {
          try {
            await request.delete(`/deleteComment/${mongoose.Types.ObjectId()}`).send({senderId: user1._id, commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
        it('Empty senderId', async () => {
          try {
            console.log("trying to delete with empty chatid")
            const chat = await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: "", commentId: commentId });
            console.log("delete empty", chat.body)
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null senderId', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: null, commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined senderId', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: undefined, commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid sender: user doesn\'t exist', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}}`).send({ senderId: mongoose.Types.ObjectId(), commentId: commentId });
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
        it('Empty commentId', async () => {
          try {
            console.log("trying to delete with empty chatid")
            const chat = await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: user1._id, commentId: "" });
            console.log("delete empty", chat.body)
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null commentId', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: user1._id, commentId: "" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined commentId', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}}`).send({ senderId: user1._id, commentId: undefined });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid comment: comment doesn\'t exist', async () => {
          try {
            await request.delete(`/deleteComment/${commentSectionId}`).send({data : { senderId: user1._id, commentId: mongoose.Types.ObjectId() }});
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
      });
      it('Respond 200', async () => {
        const response = await request.delete(`/deleteComment/${commentSectionId}`).send({ senderId: user1._id, commentId: commentId });
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
      });
    });
  
    describe('/deleteCommentSection/:eventId', () => {
      describe('Respond 400', () => {
        it('Empty eventId', async () => {
          try {
            console.log("trying to delete with empty chatid")
            const chat = await request.delete(`/deleteCommentSection/`);
            console.log("delete empty", chat.body)
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null eventId', async () => {
          try {
            await request.delete(`/deleteCommentSection/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined eventId', async () => {
          try {
            await request.delete(`/deleteCommentSection/${undefined}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid event: event doesn\'t exist', async () => {
          try {
            await request.delete(`/deleteCommentSection/${mongoose.Types.ObjectId()}`);
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
      });
      it('Respond 200', async () => {
        const response = await request.delete(`/deleteCommentSection/${event._id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.event).toBe(event._id.toString());
      });
    });
  });

  afterAll(async () => {
    commentDao.deleteAll();
    userDao.deleteAll();
    eventDao.deleteAll();
  })
});
