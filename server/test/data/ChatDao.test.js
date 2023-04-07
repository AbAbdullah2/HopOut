import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import ChatDao from "../../src/data/ChatDao.js";
import { faker } from "@faker-js/faker";
import Chat from "../../src/models/Chat.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import User from "../../src/models/User.js";
import UserDao from "../../src/data/UserDao.js";
import mongoose from "mongoose";

dotenv.config();

const chatDao = new ChatDao();
const userDao = new UserDao();

describe("Test ChatDao", () => {
    const numChats = 5
    let chats, user1, user2;
    

    beforeAll(async () => {
        db.connect(process.env.TEST_DB);
        await chatDao.deleteAll();
        await userDao.deleteAll()
        user1 = await userDao.create({name: "test", email: "te12@jhu.com", password: "1234567"});
        user2 = await userDao.create({name: "test2", email: "te123@jhu.com", password: "1234567"});

    });

    beforeEach(async () => {
      await chatDao.deleteAll();
      chats = [];
    });

    it("test createChat()", async () => {
      const chat = await chatDao.createChat({ person1: user1.id, person2: user2.id });
      expect(chat.id).toBeDefined();
      expect(chat.users[0].toString()).toBe(user1.id);
      expect(chat.users[1].toString()).toBe(user2.id);
      
    });

    it("test createMessage()", async () => {
      const text = "hi how are you";
      const chat = await chatDao.createChat({ person1: user1.id, person2: user2.id });
      const formMessage = await chatDao.createMessage({chatId: chat._id, sender: user1.id, receiver: user2.id, message: text})
      expect(formMessage.messages[0].id).toBeDefined();
      expect(formMessage.messages[0].sender.toString()).toBe(user1.id);
      expect(formMessage.messages[0].receiver.toString()).toBe(user2.id);
      expect(formMessage.messages[0].message).toBe(text);
    });

    // it("test user2 is not in database", async () => {
    //   try {
    //     user2 = "642f32484ed78b03bc796f51"
    //     const curchat = await Chat.create({ users: [user1, user2] });
    //     console.log("curchat", curchat)
    //   } catch (err) {
    //     console.log("invalid user error", err)
    //     expect(err).toBeDefined();
    //   }
    // });

    // describe("test create() throws error", () => {
    //   it("empty name", async () => {
    //     try {
    //       const name = "";
    //       const start = faker.date.future(1);
    //       const end = faker.date.soon(1, start);
    //       const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //       const description = faker.lorem.paragraph();
    //       const visibility = "private";
    //       const organizer = mongoose.Types.ObjectId();
    //       const categories = ["Sports"];
    //       await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //     } catch (err) {
    //       expect(err.status).toBe(400);
    //     }
    //   });

    //   it("null name", async () => {
    //     try {
    //       const name = null;
    //       const start = faker.date.future(1);
    //       const end = faker.date.soon(1, start);
    //       const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //       const description = faker.lorem.paragraph();
    //       const visibility = "private";
    //       const organizer = mongoose.Types.ObjectId();
    //       const categories = ["Sports"];
    //       await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //     } catch (err) {
    //       expect(err.status).toBe(400);
    //     }
    //   });

    //   it("undefined name", async () => {
    //     try {
    //       const name = undefined;
    //       const start = faker.date.future(1);
    //       const end = faker.date.soon(1, start);
    //       const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //       const description = faker.lorem.paragraph();
    //       const visibility = "private";
    //       const organizer = mongoose.Types.ObjectId();
    //       const categories = ["Sports"];
    //       await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //     } catch (err) {
    //       expect(err.status).toBe(400);
    //     }
    //   });

    //   it("invalid name", async () => {
    //     try {
    //       const name = faker.lorem.paragraph();
    //       const start = faker.date.future(1);
    //       const end = faker.date.soon(1, start);
    //       const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //       const description = faker.lorem.paragraph();
    //       const visibility = "private";
    //       const organizer = mongoose.Types.ObjectId();
    //       const categories = ["Sports"];
    //       await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //     } catch (err) {
    //       expect(err.status).toBe(400);
    //     }
    //   });

    //   it("empty start", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = "";
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null start", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = null;
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined start", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = undefined;
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("invalid start", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.lorem.words(3);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("empty end", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = "";
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null end", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = null;
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined end", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = undefined;
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("invalid end", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.lorem.words(3);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("empty location", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = "";
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null location", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = null;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined location", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = undefined;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("invalid location", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.lorem.words(3);
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("empty description", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = "";
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null description", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = null;
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined description", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = undefined;
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("invalid description", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.date.soon(1, start);
    //         const visibility = "private";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("empty visibility", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "";
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null visibility", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = null;
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined visibility", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = undefined;
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("invalid visibility", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = faker.lorem.words(3);
    //         const organizer = mongoose.Types.ObjectId();
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("empty organizer", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = "";
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("null organizer", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = null;
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    
    //     it("undefined organizer", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = undefined;
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });

    //     it("invalid organizer", async () => {
    //       try {
    //         const name = faker.lorem.words(3);
    //         const start = faker.date.future(1);
    //         const end = faker.date.soon(1, start);
    //         const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
    //         const description = faker.lorem.paragraph();
    //         const visibility = "private";
    //         const organizer = faker.lorem.words(3);
    //         const categories = ["Sports"];
    //         await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
    //       } catch (err) {
    //         expect(err.status).toBe(400);
    //       }
    //     });
    // });
});