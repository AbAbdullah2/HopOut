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
  let user1, user2, chatId;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    userDao.deleteAll();
  });

  beforeEach(async () => {
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
  });

  describe('POST request', () => {
    describe('/chat', () => {
      it('Respond 201', async () => {
        const response = await request.post(`/chat`).send({ person1: user1, person2: user2});
        console.log("response", response.body)
        chatId = response.body.data._id
        
        expect(response.status).toBe(201);
        expect(response.body.data._id).toBeDefined();

      });

    })

    describe('/message', () => {
      it('Respond 201', async () => {
        const response = await request.put(`/message`).send({ chatId, user1, user2, message: "hello" });
        expect(response.status).toBe(201);
        console.log("response", response)
        expect(response.body.data.messages).toBeDefined();
      });
    });
  });

  describe('GET request', () => {
    describe('/getAllChats/:id', () => {
      it('Respond 200', async () => {
        const response = await request.get(`/getAllChats/${user1.id}`);
        console.log("res", response.body)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
      });

    })

    describe('/getChat/:chatId', () => {
      it('Respond 200', async () => {
        const senderId = requesterId;
        const response = await request
          .put(`${endpoint}/sendRequest`)
          .send({ senderId, receiverId });
        expect(response.status).toBe(200);
        expect(response.body.data._id).toBe(senderId);
        expect(response.body.data.sentFriends[0].user).toBe(receiverId);
        const receiver = await userDao.read(receiverId);
        expect(receiver.receivedFriends[0].user.toString()).toBe(senderId);
      });
    });
  });
});
