import { beforeAll, beforeEach, describe, expect, it, afterAll } from "vitest";
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
    let user;

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
      const start = "2023-06-29T15:45:26.193Z";
      const end = "2023-06-30T15:45:26.193Z";
      const locationName = faker.lorem.words(2);
      const address = faker.address.streetAddress();
      const city = faker.address.cityName();
      const state = faker.address.countryCode();
      const zip = faker.address.zipCode();
      const addressLine2 = faker.address.secondaryAddress();
      const description = faker.lorem.paragraph();
      const visibility = "private";
      const organizer = user.id;
      const capacity = faker.datatype.number({ min: 1 });
      const categories = ["Sports"];
      const _event = await eventDao.create({ name, start, end, locationName, address, city, state, zip, addressLine2, description, visibility, organizer, capacity, categories });
      
      await userDao.delete(user.id);

      expect(_event.name).toBe(name);
      expect(_event.start).toBe(start);
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

    describe("test create() throws error", () => {
      it("empty name", async () => {
        try {
          const name = "";
          const start = "2023-06-29T15:45:26.193Z";
          const end = "2023-06-30T15:45:26.193Z";
          const address = faker.address.streetAddress();
          const city = faker.address.cityName();
          const state = faker.address.countryCode();
          const zip = faker.address.zipCode();
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const capacity = faker.datatype.number({ min: 1 });
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("null name", async () => {
        try {
          const name = null;
          const start = "2023-06-29T15:45:26.193Z";
          const end = "2023-06-30T15:45:26.193Z";
          const address = faker.address.streetAddress();
          const city = faker.address.cityName();
          const state = faker.address.countryCode();
          const zip = faker.address.zipCode();
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const capacity = faker.datatype.number({ min: 1 });
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("undefined name", async () => {
        try {
          const name = undefined;
          const start = "2023-06-29T15:45:26.193Z";
          const end = "2023-06-30T15:45:26.193Z";
          const address = faker.address.streetAddress();
          const city = faker.address.cityName();
          const state = faker.address.countryCode();
          const zip = faker.address.zipCode();
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const capacity = faker.datatype.number({ min: 1 });
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("invalid name", async () => {
        try {
          const name = faker.lorem.paragraph();
          const start = "2023-06-29T15:45:26.193Z";
          const end = "2023-06-30T15:45:26.193Z";
          const address = faker.address.streetAddress();
          const city = faker.address.cityName();
          const state = faker.address.countryCode();
          const zip = faker.address.zipCode();
          const description = faker.lorem.paragraph();
          const visibility = "private";
          const organizer = mongoose.Types.ObjectId();
          const capacity = faker.datatype.number({ min: 1 });
          const categories = ["Sports"];
          await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
        } catch (err) {
          expect(err.status).toBe(400);
        }
      });

      it("empty start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = null;
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = undefined;
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("invalid start", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = faker.lorem.words(3);
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("empty end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = null;
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = undefined;
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid end", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = faker.lorem.words(3);
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid location", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = "";
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = null;
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = undefined;
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid description", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.date.soon(1, start);
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = null;
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = undefined;
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid visibility", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = faker.lorem.words(3);
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = "";
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("null organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = null;
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    
        it("undefined organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = undefined;
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid organizer", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = faker.lorem.words(3);
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty address", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = "";
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("null address", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = null;
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("undefined address", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = undefined;
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid address", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.date.soon(1, start);
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty city", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = "";
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("null city", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = null;
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("undefined city", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = undefined;
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid city", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.date.soon(1, start);
            const state = faker.address.countryCode();
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty state", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = "";
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("null state", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = null;
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("undefined state", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = undefined;
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid state", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.date.soon(1, start);
            const zip = faker.address.zipCode();
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("empty zip", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = "";
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("null zip", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = null;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("undefined zip", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = undefined;
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });

        it("invalid zip", async () => {
          try {
            const name = faker.lorem.words(3);
            const start = "2023-06-29T15:45:26.193Z";
            const end = "2023-06-30T15:45:26.193Z";
            const address = faker.address.streetAddress();
            const city = faker.address.cityName();
            const state = faker.address.countryCode();
            const zip = faker.date.soon(1, start);
            const description = faker.lorem.paragraph();
            const visibility = "private";
            const organizer = mongoose.Types.ObjectId();
            const capacity = faker.datatype.number({ min: 1 });
            const categories = ["Sports"];
            await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, organizer, capacity, categories });
          } catch (err) {
            expect(err.status).toBe(400);
          }
        });
    });
    
    afterAll(async () => {
      await eventDao.deleteAll();
      await userDao.deleteAll();
    })
});