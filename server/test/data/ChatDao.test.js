import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import ChatDao from "../../src/data/ChatDao.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import UserDao from "../../src/data/UserDao.js";
import mongoose from "mongoose";

dotenv.config();

const chatDao = new ChatDao();
const userDao = new UserDao();

describe("Test ChatDao", () => {
    const numChats = 5
    let chat, user1, user2, user3, text, chatId;
    

    beforeAll(async () => {
        db.connect(process.env.TEST_DB);
        await chatDao.deleteAll();
        await userDao.deleteAll()
        user1 = await userDao.create({name: "test", email: "te12@jhu.com", password: "1234567"});
        user2 = await userDao.create({name: "test2", email: "te123@jhu.com", password: "1234567"});
        user3 = await userDao.create({name: "test3", email: "te1234@jhu.com", password: "1234567"});

    });

    beforeEach(async () => {
      await chatDao.deleteAll();
    });

    it("test createChat()", async () => {
      const chat = await chatDao.createChat({ person1: user1.id, person2: user2.id });
      expect(chat.id).toBeDefined();
      expect(chat.users[0].toString()).toBe(user1.id);
      expect(chat.users[1].toString()).toBe(user2.id);
    });

    describe("test createChat() throws error", async () => {
      it("empty person1", async () => {
        try {
          await chatDao.createChat({ person1: "", person2: user2.id });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("null person1", async () => {
        try {
          await chatDao.createChat({ person1: null, person2: user2.id });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("undefined person1", async () => {
        try {
          await chatDao.createChat({ person1: undefined, person2: user2.id });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid person1", async () => {
        try {
          await chatDao.createChat({ person1: mongoose.Types.ObjectId(), person2: user2.id });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("empty person2", async () => {
        try {
          await chatDao.createChat({ person1: user1.id, person2: "" });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("null person2", async () => {
        try {
          await chatDao.createChat({ person1: user1.id, person2: null });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("undefined person2", async () => {
        try {
          await chatDao.createChat({ person1: user1.id, person2: undefined });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid person2", async () => {
        try {
          await chatDao.createChat({ person1: user1.id, person2: mongoose.Types.ObjectId() });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("chat already exists", async () => {
        try {
          await chatDao.createChat({ person1: user1.id, person2: user2.id });
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
    });

    it("test createMessage()", async () => {
      text = "hi how are you";
      chat = await chatDao.createChat({ person1: user1.id, person2: user2.id });
      chatId = chat._id
      const formMessage = await chatDao.createMessage({chatId: chat._id, sender: user1.id, receiver: user2.id, message: text})
      expect(formMessage.messages[0].id).toBeDefined();
      expect(formMessage.messages[0].sender.toString()).toBe(user1.id);
      expect(formMessage.messages[0].receiver.toString()).toBe(user2.id);
      expect(formMessage.messages[0].message).toBe(text);
    });
    describe("test createMessage() throws error", async () => {
      it("empty chatId", async () => {
        try {
          await chatDao.createChat({chatId: "", sender: user1.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("null chatId", async () => {
        try {
          await chatDao.createChat({chatId: null, sender: user1.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("undefined chatId", async () => {
        try {
          await chatDao.createChat({chatId: undefined, sender: user1.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid chatId", async () => {
        try {
          await chatDao.createChat({chatId: '1', sender: user1.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid chat", async () => {
        try {
          await chatDao.createChat({chatId: mongoose.Types.ObjectId(), sender: user1.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("empty sender", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: "", receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("null sender", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: null, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("undefined sender", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: undefined, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid sender: invalid id", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: '1', receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid sender: invalid user", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: mongoose.Types.ObjectId(), receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid sender: user not in chat", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user3.id, receiver: user2.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("empty receiver", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: "", message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("null receiver", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: null, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("undefined receiver", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: undefined, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid receiver: invalid id", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: '1', message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid receiver: invalid user", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: mongoose.Types.ObjectId(), message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
      it("invalid receiver: user not in chat", async () => {
        try {
          await chatDao.createChat({chatId: chatId, sender: user1.id, receiver: user3.id, message: text});
        } catch (err) {
          expect(err.status).toBe(400);
          expect(err.message).toBe('Invalid ID!')
        }
      });
    });
});