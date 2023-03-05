import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { eventDao } from "../../../src/routes/events.js";
import { userDao } from "../../../src/routes/users.js";
import * as db from "../../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const endpoint = "/events";
const request = new supertest(app);

describe(`Test ${endpoint}`, () => {
  const numEvents = 5;
  let events;
  let uid;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await userDao.deleteAll();
    await eventDao.deleteAll();
    const user = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6)
    });
    console.log(user);
    uid = user.id;
  });

  beforeEach(async () => {
    await eventDao.deleteAll();
    events = [];
    
    for (let index = 0; index < numEvents; index++) {
      const name = faker.lorem.words(3);
      const start = "2023-06-22T15:28:37.174Z";
      const end = "2023-06-22T15:28:37.174Z";
      const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
      const description = faker.lorem.paragraph();
      const visibility = "private";
      const organizer = uid;
      const categories = ["Sports"];
      const event = await eventDao.create({ name, start, end, location, description, visibility, organizer, categories });
      events.push(event);
    }
    console.log(events);
  });

  describe("GET request", () => {
    it("Respond 200", async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(numEvents);
    });

    it("Respond 200 searching for given name", async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.get(`${endpoint}?name=${event.name}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("POST request", () => {
    it("Respond 201", async () => {
      const name = faker.lorem.words(3);
      const start = "2023-06-22T15:28:37.174Z";
      const end = "2023-06-22T15:28:37.174Z";
      const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
      const description = faker.lorem.paragraph();
      const visibility = "private";
      const organizer = uid;
      const categories = ["Sports"];
      const response = await request.post(endpoint).send({
        name, start, end, location, description, visibility, organizer, categories
      });
      expect(response.status).toBe(201);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.start).toBe(start);
      expect(response.body.data.end).toBe(end);
      expect(response.body.data.location).toBe(location);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.organizer).toBe(organizer);
      expect(response.body.data.categories).toStrictEqual(categories);
    });

    describe("Respond 400", () => {
      it("Null name", async () => {
        const name = null;
        const start = "2023-06-22T15:28:37.174Z";
        const end = "2023-06-22T15:28:37.174Z";
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = uid;
        const categories = ["Sports"];
        const response = await request.post("/register").send({
          name, start, end, location, description, visibility, organizer, categories
        });
        expect(response.status).toBe(400);
      });

      it("Undefined name", async () => {
        const name = undefined;
        const start = "2023-06-22T15:28:37.174Z";
        const end = "2023-06-22T15:28:37.174Z";
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = uid;
        const categories = ["Sports"];
        const response = await request.post("/register").send({
          name, start, end, location, description, visibility, organizer, categories
        });
        expect(response.status).toBe(400);
      });

      it("Empty name", async () => {
        const name = "";
        const start = "2023-06-22T15:28:37.174Z";
        const end = "2023-06-22T15:28:37.174Z";
        const location = faker.address.streetAddress() + faker.address.cityName() + faker.address.countryCode() ;
        const description = faker.lorem.paragraph();
        const visibility = "private";
        const organizer = uid;
        const categories = ["Sports"];
        const response = await request.post("/register").send({
          name, start, end, location, description, visibility, organizer, categories
        });
        expect(response.status).toBe(400);
      });
    });
  });

  describe("GET request given ID", () => {
    it("Respond 200 when searching for user", async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.get(`${endpoint}/${event.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(event.name);
    });

    it("Respond 400", async () => {
      const response = await request.get(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.get(`${endpoint}/${mongoose.Types.ObjectId().toString()}`);
      expect(response.status).toBe(404);
    });
  });

  describe("PUT request", () => {
    it("Respond 200 when updating a user", async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const name = faker.name.fullName();
      const response = await request
        .put(`${endpoint}/${event.id}`)
        .send({
          name
        });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(name);
    });

    describe("Respond 400", () => {
      it("Invalid ID", async () => {
        const response = await request.put(`${endpoint}/invalid}`);
        expect(response.status).toBe(400);
      });

      it("Invalid name", async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const name = "";
        const response = await request
          .put(`${endpoint}/${event.id}`)
          .send({
            name
          });
        expect(response.status).toBe(400);
      });
    });

    it("Respond 404", async () => {
      const response = await request.put(`${endpoint}/${mongoose.Types.ObjectId().toString()}`);
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE request", () => {
    it("Respond 200 when deleting a user", async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.delete(`${endpoint}/${event.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(event.name);
      expect(response.body.data.start).toBe(event.start);
      expect(response.body.data.end).toBe(event.end);
      expect(response.body.data.location).toBe(event.location);
      expect(response.body.data.description).toBe(event.description);
      expect(response.body.data.organizer).toBe(`${event.organizer}`);
      expect(response.body.data.categories).toStrictEqual(event.categories);
    });

    it("Respond 400", async () => {
      const response = await request.delete(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.delete(`${endpoint}/${mongoose.Types.ObjectId().toString()}`);
      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await eventDao.deleteAll();
  });
});