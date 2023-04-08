import { describe, beforeAll, expect, it, beforeEach } from "vitest";
import Chat from "../../src/models/Chat.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import UserDao from "../../src/data/UserDao.js";

dotenv.config();

const userDao = new UserDao();
let user1, user2, chat;

describe("Test Message Schema & Chat Schema & Model", () => {
  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await Chat.deleteMany({});
    
  });

  beforeEach(async () => {
    await userDao.deleteAll();
    user1 = await userDao.create({name: "test", email: "testingtesting12@jhu.com", password: "1234567"});
    user2 = await userDao.create({name: "test2", email: "testingtesting123@jhu.com", password: "1234567"});
  })

  it("test create chat", async () => {
    chat = await Chat.create({ users: [user1, user2] });
    expect(chat.id).toBeDefined();
    expect(chat.users[0]).toBe(user1);
    expect(chat.users[1]).toBe(user2);
  });

  describe("test users are required", () => {
    it("test user1 is null", async () => {
      try {
        user1 = null;
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test user1 is undefined", async () => {
      try {
        user1 = undefined;
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test user1 is empty", async () => {
      try {
        user1 = "";
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test user2 is null", async () => {
      try {
        user2 = null;
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test user2 is undefined", async () => {
      try {
        user2 = undefined;
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test user2 is empty", async () => {
      try {
        user2 = "";
        await Chat.create({ users: [user1, user2] });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

  });

  it("test create message", async () => {
    const message = "how are you";
    const sendMessage = {
      sender: user1,
      receiver: user2,
      message: message,
    };

    chat.messages.push(sendMessage);
    chat.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  describe("test sender is required", () => {
    it("test sender is null", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: null,
          receiver: user2,
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test sender is undefined", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: undefined,
          receiver: user2,
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test sender is empty", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: "",
          receiver: user2,
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test receiver is required", () => {
    it("test receiver is null", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: user1,
          receiver: null,
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test receiver is undefined", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: user1,
          receiver: undefined,
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test receiver is empty", async () => {
      try {
        const message = "how are you";
        console.log("sender", user1)
        const sendMessage = {
          sender: user1,
          receiver: "",
          message: message,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test message is required", () => {
    it("test message is null", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: user1,
          receiver: user2,
          message: null,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test message is undefined", async () => {
      try {
        const message = "how are you";
        const sendMessage = {
          sender: user1,
          receiver: user2,
          message: undefined,
        };

        chat.messages.push(sendMessage);
        chat.save(function (err) {
        if (err) {
          console.log(err)
        }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
