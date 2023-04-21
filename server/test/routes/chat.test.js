import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import app from '../../src/index.js';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import * as db from '../../src/data/db.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import ChatDao from '../../src/data/ChatDao.js';
import UserDao from '../../src/data/UserDao.js';

dotenv.config();
const chatDao = new ChatDao();
const userDao = new UserDao();
const request = new supertest(app);

describe(`Test chat routes`, () => {
  let user1, user2, user3, chatId;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    userDao.deleteAll();
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
  });

  describe('POST request', () => {
    describe('/chat', () => {
      it('Respond 201', async () => {
        const response = await request.post(`/chat`).send({ person1: user1._id, person2: user2._id});
        chatId = response.body.data._id
        expect(response.status).toBe(201);
        expect(response.body.data.users).toContain(user1._id.toString())
        expect(response.body.data.users).toContain(user2._id.toString())
        expect(response.body.data._id).toBeDefined();

      });
      describe('Respond 400', () => {
        it('Empty person1', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: "", person2: user2._id});
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null person1', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: null, person2: user2._id});
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined person1', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: undefined, person2: user2._id});
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid person1', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: mongoose.Types.ObjectId(), person2: user2._id});
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chatter!')
            expect(err.status).toBe(400)
          }
        });
        it('Empty person2', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: user1._id, person2: ""});            
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null person2', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: user1._id, person2: null});
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined person2', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: user1._id, person2: undefined});
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid person2', async () => {
          try {
            const response = await request.post(`/chat`).send({ person1: user1._id, person2: mongoose.Types.ObjectId()});
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chatter!')
            expect(err.status).toBe(400)
          }
        });
        
      });

    })

    describe('/message', () => {
      it('Respond 201', async () => {
        const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: user2._id, message: "h" });
        expect(response.status).toBe(201);
        expect(response.body.data.messages).toBeDefined();
        expect(response.body.data.users).toContain(user1._id.toString())
        expect(response.body.data.users).toContain(user2._id.toString())
      });
      describe('Respond 400', () => {
        it('Empty chatId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: "", senderId: user1._id, receiverId: user2._id, message: "e" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null chatId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: null, senderId: user1._id, receiverId: user2._id, message: "l" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined chatId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: undefined, senderId: user1._id, receiverId: user2._id, message: "o" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid chatId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: '1', senderId: user1._id, receiverId: user2._id, message: "w" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid chat: chat doesn\'t exist', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: mongoose.Types.ObjectId(), senderId: user1._id, receiverId: user2._id, message: "r" });
          }
          catch (err) {
            expect(err.message).toBe('Chat does not exist!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid chat: chat doesn\'t contain both users', async () => {
          try {
            const tempChat = await request.post(`/chat`).send({ person1: user1._id, person2: user3._id});
            const response = await request.post(`/message`).send({ chatId: tempChat._id, senderId: user1._id, receiverId: user2._id, message: "l" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chat Users!')
            expect(err.status).toBe(400)
          }
        });
        it('Empty sender', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: "", receiverId: user2._id, message: "d" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
        });
        it('Null sender', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: null, receiverId: user2._id, message: "u" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined sender', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: undefined, receiverId: user2._id, message: "x" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Sender!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid sender: user doesn\'t exist', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: mongoose.Types.ObjectId(), receiverId: user2._id, message: "y" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chatter!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid senderId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: '1', receiverId: user2._id, message: "z" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid sender: user not in chat', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user3._id, receiverId: user2._id, message: "a" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chat Users!')
            expect(err.status).toBe(400)
          }
        });
        it('Empty receiver', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: "", message: "b" });            
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Null receiver', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: null, message: "c" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined receiver', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: undefined, message: "f" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid receiverId', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: '1', message: "g" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid receiver: user doesn\'t exist', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: mongoose.Types.ObjectId(), message: "i" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Receiver!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid receiver: user not in chat', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: user3._id, message: "j" });
          }
          catch (err) {
            expect(err.message).toBe('Invalid Chat Users!')
            expect(err.status).toBe(400)
          }
        });
        it('Null message', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: user2._id, message: null});
          }
          catch (err) {
            expect(err.message).toBe('Invalid Message!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined message', async () => {
          try {
            const response = await request.post(`/message`).send({ chatId: chatId, senderId: user1._id, receiverId: user2._id, message: undefined});
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
    describe('/getAllChats/:id', () => {
      it('Respond 200', async () => {
        const response = await request.get(`/getAllChats/${user1.id}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].users).toContain(user1._id.toString())
        expect(response.body.data[0].users).toContain(user2._id.toString())
      });

      describe('Respond 400', () => {
        // it('Empty userId', async () => {
        //   try {
        //     await request.get(`/getAllChats/${""}`);
        //   }
        //   catch (err) {
        //     expect(err.message).toBe('Invalid ID!')
        //     expect(err.status).toBe(400)
        //   }
        // });
        it('Null userId', async () => {
          try {
            await request.get(`/getAllChats/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined userId', async () => {
          try {
            await request.get(`/getAllChats/${undefined}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid user: user doesn\'t exist', async () => {
          try {
            await request.get(`/getAllChats/${mongoose.Types.ObjectId()}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid User!')
            expect(err.status).toBe(400)
          }
        });
        it('Invalid user: user doesn\'t have any chats', async () => {
          try {
            await request.get(`/getAllChats/${user3._id}`);
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
      });
    });

    describe('/getChat/:chatId', () => {
      it('Respond 200', async () => {
        const response = await request.get(`/getChat/${chatId}`);
        expect(response.status).toBe(200);
        expect(response.body.data.messages.length).toBe(1)
        expect(response.body.data.users).toContain(user1._id.toString())
        expect(response.body.data.users).toContain(user2._id.toString())
      });
      describe('Respond 400', () => {
        it('Empty chatId', async () => {
          try {
            const response = await request.get(`/getChat/${""}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null chatId', async () => {
          try {
            const response = await request.get(`/getChat/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined chatId', async () => {
          try {
            const response = await request.get(`/getChat/${undefined}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid chatId', async () => {
          try {
            const response = await request.get(`/getChat/${mongoose.Types.ObjectId()}`);
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
      });
    });    
  });
  describe('DELETE request', () => {
    describe('/deleteChat/:chatId', () => {
      describe('Respond 400', () => {
        it('Empty chatId', async () => {
          try {
            const chat = await request.delete(`/deleteChat/`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Null chatId', async () => {
          try {
            await request.delete(`/deleteChat/${null}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
        });
        it('Undefined chatId', async () => {
          try {
            await request.delete(`/deleteChat/${undefined}`);
          }
          catch (err) {
            expect(err.message).toBe('Invalid ID!')
            expect(err.status).toBe(400)
          }
  
        });
        it('Invalid chat: chat doesn\'t exist', async () => {
          try {
            await request.delete(`/deleteChat/${mongoose.Types.ObjectId()}`);
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
        it('Invalid chat: user not in chat', async () => {
          try {
            await request.get(`/deleteChat/${chatId}`);
          }
          catch (err) {
            expect(err.message).toBe('Resource not found!')
            expect(err.status).toBe(404)
          }
        });
      });
      it('Respond 200', async () => {
        const response = await request.delete(`/deleteChat/${chatId}`);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.users).toContain(user1._id.toString())
        expect(response.body.data.users).toContain(user2._id.toString())
      });
    });
  });
});
