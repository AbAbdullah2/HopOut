import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import EventDao from "../../src/data/EventDao.js";
import { faker } from "@faker-js/faker";
import Event from "../../src/models/Event.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import User from "../../src/models/User.js";
import UserDao from "../../src/data/UserDao.js";
import mongoose from "mongoose";

dotenv.config();

const eventDao = new EventDao();
const userDao = new UserDao();

describe("Test EventDao", () => {
    const numEvents = 5
    let events;

    beforeAll(async () => {
        db.connect(process.env.TEST_DB);
        await eventDao.deleteAll();
    });

    beforeEach(async () => {
      await eventDao.deleteAll();
      events = [];
    });

    it("test create()", async () => {
      const user = await userDao.create({name: "test", email: "testingtesting12@gmail.com", password: "1234567"});
      const name = faker.lorem.words(3);
      const start = "2023-06-30T15:45:26.193Z";//faker.date.future(1);
      const end = "2023-06-30T15:45:26.193Z";//faker.date.soon(1, start);
      const locationName = faker.lorem.words(2);
      const address = faker.address.streetAddress();
      const city = faker.address.cityName();
      const state = faker.address.countryCode();
      const zip = faker.address.zipCode(); 
      const addressLine2 = faker.address.secondaryAddress();
      const description = faker.lorem.paragraph();
      const visibility = "private";
      const organizer = user.id;
      const capacity = 20;
      const categories = ["Sports"];
      const _event = await eventDao.create({ name, start, end, locationName, address, city, state, zip, addressLine2, description, visibility, organizer, capacity, categories });
      
      const deletedUser = await userDao.delete(user.id);

      expect(_event.name).toBe(name);
      expect(_event.start).toBe(start);
      //expect(_event.location).toStrictEqual({address, city, state, zip});
      expect(_event.locationName).toBe(locationName);
      expect(_event.location.address).toBe(address);
      expect(_event.location.city).toBe(city);
      expect(_event.location.state).toBe(state);
      expect(_event.location.zip).toBe(zip);
      expect(_event.addressLine2).toBe(addressLine2);

      expect(_event.description).toBe(description);
      expect(_event.visibility).toBe(visibility);
      expect(_event.organizer.toString()).toBe(organizer);
      expect(_event.capacity).toBe(capacity);
      expect(_event.categories).toStrictEqual(categories);
      expect(_event.id).toBeDefined();



    });
    
    //   it("test create() without given visbility", async () => {
    //     const name = faker.lorem.words(3);
      // const start = faker.date.future(1);
      // const end = faker.date.soon(1, start);
      // const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
      // const description = faker.lorem.paragraph();
      // const organizer = mongoose.Types.ObjectId();
      // const categories = ["Sports"];
      // const _event = await eventDao.create({ name, start, end, location, description, organizer, categories });
      // expect(_event.name).toBe(name);
      // expect(_event.start).toBe(start);
      // expect(_event.location).toBe(location);
      // expect(_event.description).toBe(description);
      // expect(_event.visibility).toBe("private");
      // expect(_event.organizer).toBe(organizer);
      // expect(_event.categories).toStrictEqual(categories);
      // expect(_event.id).toBeDefined();
    //   });

    describe("test create() throws error", () => {
      it("empty name", async () => {
        try {
          const name = "";
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("null name", async () => {
        try {
          const name = null;
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("undefined name", async () => {
        try {
          const name = undefined;
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("invalid name", async () => {
        try {
          const name = faker.lorem.paragraph();
          const start = faker.date.future(1);
          const end = faker.date.soon(1, start);
          const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("empty start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "";
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = null;
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = undefined;
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("invalid start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.lorem.words(3);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("empty end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = "";
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = null;
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = undefined;
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.lorem.words(3);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = "";
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = null;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = undefined;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.lorem.words(3);
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = "";
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = null;
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = undefined;
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.date.soon(1, start);
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "";
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = null;
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = undefined;
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = faker.lorem.words(3);
            const organizer = mongoose.Types.ObjectId();
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = "";
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = null;
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = undefined;
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.date.future(1);
            const end = faker.date.soon(1, start);
            const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = faker.lorem.words(3);
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    });
});