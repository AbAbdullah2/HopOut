import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { userDao } from "../../src/routes/users.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import EventDao from "../../src/data/EventDao.js";

dotenv.config();
const endpoint = "/users";
const request = new supertest(app);
const eventDao = new EventDao();

describe(`Test ${endpoint}`, () => {
  const numUsers = 5;
  let users;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await userDao.deleteAll();
  });

  beforeEach(async () => {
    await userDao.deleteAll();
    const u = await userDao.readAll({});
    users = [];
    
    for (let index = 0; index < numUsers; index++) {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password(6);
      const user = await userDao.create({ name, email, password });
      users.push(user);
    }
  });

  describe("GET request", () => {
    it("Respond 200", async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(numUsers);
    });

    it("Respond 200 searching for given name", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const response = await request.get(`${endpoint}?name=${user.name}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

  });

  describe("POST request", () => {
    it("Respond 201", async () => {
      const name = faker.name.fullName();
      const email = faker.internet.email();
      const password = faker.internet.password(6);
      const response = await request.post("/register").send({
        name,
        email,
        password,
      });
      expect(response.status).toBe(201);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.email).toBe(email.toLowerCase());
      expect(response.body.data.password).toBeUndefined();
    });

    describe("Respond 400", () => {
      it("Null name", async () => {
        const name = null;
        const email = faker.internet.email();
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Undefined name", async () => {
        const name = undefined;
        const email = faker.internet.email();
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Empty name", async () => {
        const name = "";
        const email = faker.internet.email();
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Null email", async () => {
        const name = faker.name.fullName();
        const email = null;
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Undefined email", async () => {
        const name = faker.name.fullName();
        const email = undefined;
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Empty email", async () => {
        const name = faker.name.fullName();
        const email = "";
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Invalid email", async () => {
        const name = faker.name.fullName();
        const email = faker.lorem.sentence();
        const password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Duplicate email", async () => {
        let name = faker.name.fullName();
        const email = faker.internet.email();
        let password = faker.internet.password(6);
        await request.post("/register").send({
          name,
          email,
          password,
        });

        name = faker.name.fullName();
        password = faker.internet.password(6);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Null password", async () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = null;
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Undefined password", async () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = undefined;
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Empty password", async () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = "";
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });

      it("Short password", async () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password(5);
        const response = await request.post("/register").send({
          name,
          email,
          password,
        });
        expect(response.status).toBe(400);
      });
    });
  });

  describe("GET request given ID", () => {
    it("Respond 200 when searching for user", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const response = await request.get(`${endpoint}/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it("Respond 200 searching for a users hosted events", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const name = faker.lorem.words(3);
      const start = '2023-06-22T15:28:37.174Z';
      const end = '2023-06-22T15:28:37.174Z';
      const locationName = faker.lorem.words(2);
      const address = faker.address.streetAddress();
      const city = faker.address.cityName();
      const state = faker.address.countryCode();
      const zip = faker.address.zipCode();
      const addressLine2 = faker.address.secondaryAddress();
      const description = faker.lorem.paragraph();
      const visibility = 'private';
      const organizer = user.id;
      const capacity = 3;
      const categories = ['Sports'];
      const event = await request.post(`/events`).send({
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
      const response = await request.get(`${endpoint}/hostedEvents/${user.id}`);
      expect(response.status).toBe(200);
      console.log(response.body)
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("Respond 200 searching for a users private events", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const name = faker.lorem.words(3);
      const start = '2023-06-22T15:28:37.174Z';
      const end = '2023-06-22T15:28:37.174Z';
      const locationName = faker.lorem.words(2);
      const address = faker.address.streetAddress();
      const city = faker.address.cityName();
      const state = faker.address.countryCode();
      const zip = faker.address.zipCode();
      const addressLine2 = faker.address.secondaryAddress();
      const description = faker.lorem.paragraph();
      const visibility = 'private';
      const organizer = user.id;
      const capacity = 3;
      const categories = ['Sports'];
      const event = await request.post(`/events`).send({
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
      const response = await request.get(`${endpoint}/privateEvents/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data[0].visibility).toBe('private');
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("Respond 400", async () => {
      const response = await request.get(`${endpoint}/invalid`);
      expect(response.status).toBe(400);
    });

    it("Respond 404", async () => {
      const response = await request.get(`${endpoint}/${mongoose.Types.ObjectId().toString()}`);
      expect(response.status).toBe(404);
    });
  });

  describe("PUT request", () => {
    it("Respond 200 when updating a user", async () => {
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const name = faker.name.fullName();
      const password = faker.internet.password(6);
      const response = await request
        .put(`${endpoint}/${user.id}`)
        .send({
          name,
          password,
        });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined();
    });

    describe("Respond 400", () => {
      it("Invalid ID", async () => {
        const response = await request.put(`${endpoint}/invalid}`);
        expect(response.status).toBe(400);
      });

      it("Invalid name", async () => {
        const index = Math.floor(Math.random() * numUsers);
        const user = users[index];
        const name = "";
        const password = faker.internet.password(6);
        const response = await request
          .put(`${endpoint}/${user.id}`)
          .send({
            name,
            password,
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
      const index = Math.floor(Math.random() * numUsers);
      const user = users[index];
      const response = await request.delete(`${endpoint}/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(user.id);
      expect(response.body.data.name).toBe(user.name);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.organizing.length).toBe(0);
      expect(response.body.data.friends.length).toBe(0);
      expect(response.body.data.sentFriends.length).toBe(0);
      expect(response.body.data.receivedFriends.length).toBe(0);
      expect(response.body.data.attending.length).toBe(0);
      expect(response.body.data.invited.length).toBe(0);
      expect(response.body.data.password).toBeUndefined();
    });

    it("Respond 200 when deleting all users", async () => {
      const response = await request.delete(`${endpoint}`);
      expect(response.status).toBe(200);
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
    await userDao.deleteAll();
  });
});