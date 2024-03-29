import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import app from '../../src/index.js';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { eventDao } from '../../src/routes/events.js';
import { userDao } from '../../src/routes/users.js';
import * as db from '../../src/data/db.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const endpoint = '/events';
const request = new supertest(app);

describe(`Test ${endpoint}`, () => {
  const numEvents = 5;
  let events;
  let users;
  let uid;
  let uid2;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await userDao.deleteAll();
    await eventDao.deleteAll();
    const user = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    const user2 = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    uid = user.id;
    uid2 = user2.id;
  });

  beforeEach(async () => {
    await eventDao.deleteAll();
    await userDao.deleteAll();
    
    const user = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    uid = user.id;
    const user2 = await userDao.create({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });
    uid2 = user2.id;

    users = [];
    for (let index = 0; index < 4; index++) {
      const u = await userDao.create({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(6),
      });
      users.push(u.id);
    }

    events = [];
    for (let index = 0; index < numEvents; index++) {
      const name = faker.lorem.words(3);
      const start = '2023-06-22T15:28:37.174Z';
      const end = '2023-06-23T15:28:37.174Z';
      const locationName = faker.lorem.words(2);
      const address = faker.address.streetAddress();
      const city = faker.address.cityName();
      const state = faker.address.countryCode();
      const zip = faker.address.zipCode();
      const addressLine2 = faker.address.secondaryAddress();
      const description = faker.lorem.paragraph();
      const visibility = 'public';
      const organizer = uid;
      const capacity = 3;
      const categories = ['Sports'];
      const event = await eventDao.create({
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
      events.push(event);
    }
  });

  describe('GET request', () => {
    it('Respond 200', async () => {
      const response = await request.get(endpoint);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(numEvents);
    });

    it('Respond 200 searching for given name', async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.get(`${endpoint}?name=${event.name}`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('POST request', () => {
    it('Respond 201', async () => {
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
      const organizer = uid;
      const capacity = 20;
      const categories = ['Sports'];
      const response = await request.post(endpoint).send({
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
        organizer,
        capacity,
        categories,
      });
      expect(response.status).toBe(201);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.start).toBe(start);
      expect(response.body.data.end).toBe(end);
      expect(response.body.data.locationName).toBe(locationName);
      expect(response.body.data.location).toStrictEqual({
        address,
        city,
        state,
        zip,
      });
      expect(response.body.data.addressLine2).toBe(addressLine2);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.organizer).toBe(organizer);
      expect(response.body.data.capacity).toBe(capacity);
      expect(response.body.data.categories).toStrictEqual(categories);
    });

    describe('Respond 400', () => {
      it('Null name', async () => {
        const name = null;
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
        const organizer = uid;
        const categories = ['Sports'];
        const capacity = 20;
        const response = await request.post('/events', {
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
          organizer,
          capacity,
          categories,
        });
        expect(response.status).toBe(400);
      });

      it('Undefined name', async () => {
        const undefName = undefined;
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
        const organizer = uid;
        const capacity = 20;
        const categories = ['Sports'];
        const response = await request.post('/events').send({
          undefName,
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
          organizer,
          capacity,
          categories,
        });
        expect(response.status).toBe(400);
      });

      it('Empty name', async () => {
        const name = '';
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
        const organizer = uid;
        const capacity = 20;
        const categories = ['Sports'];
        const response = await request.post('/events').send({
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
          organizer,
          capacity,
          categories,
        });
        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET request given ID', () => {
    it('Respond 200 when searching for user', async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.get(`${endpoint}/${event.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(event.name);
    });

    it('Respond 400', async () => {
      const response = await request.get(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it('Respond 404', async () => {
      const response = await request.get(
        `${endpoint}/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe('PUT request', () => {
    it('Respond 200 when updating a user', async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const name = faker.name.fullName();
      const response = await request.put(`${endpoint}/${event.id}`).send({
        name,
      });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(name);
    });

    it('Respond 200 when updating reviews', async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const comment = faker.lorem.sentence();
      const rating = Math.floor(Math.random()*5) + 1;
      const reviewer = uid2;
      const review = {comment, rating, reviewer};
      const reviews = [review];
      const response = await request.put(`${endpoint}/${event.id}`).send({
        reviews,
      });
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.reviews[0].comment).toBe(comment);
      expect(response.body.data.reviews[0].rating).toBe(rating);
      expect(response.body.data.reviews[0].reviewer).toBe(reviewer);
    });

    describe('Respond 400', () => {
      it('Invalid ID', async () => {
        const response = await request.put(`${endpoint}/invalid}`);
        expect(response.status).toBe(400);
      });

      it('Invalid name', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const name = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          name,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid start', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const start = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          start,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid end', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const end = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          end,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid location name', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const locationName = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          locationName,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid address', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const address = faker.datatype.number();
        const response = await request.put(`${endpoint}/${event.id}`).send({
          address,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid city', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const city = faker.datatype.number();
        const response = await request.put(`${endpoint}/${event.id}`).send({
          city,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid state', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const state = faker.datatype.number();
        const response = await request.put(`${endpoint}/${event.id}`).send({
          state,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid zip', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const zip = faker.datatype.number();
        const response = await request.put(`${endpoint}/${event.id}`).send({
          zip,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid description', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const description = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          description,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid visibility', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const visibility = '';
        const response = await request.put(`${endpoint}/${event.id}`).send({
          visibility,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid capacity', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const capacity = faker.address.streetAddress();
        const response = await request.put(`${endpoint}/${event.id}`).send({
          capacity,
        });
        expect(response.status).toBe(400);
      });

      it('Negative capacity', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const capacity = -1 * faker.datatype.number({ min: 1 });
        const response = await request.put(`${endpoint}/${event.id}`).send({
          capacity,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid categories', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const categories = [''];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          categories,
        });
        expect(response.status).toBe(400);
      });

      it('Too many attendees', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const attendees = users;
        const response = await request.put(`${endpoint}/${event.id}`).send({
          attendees,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid attendee', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const attendees = [mongoose.Types.ObjectId()];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          attendees,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid invitee', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const invitees = [mongoose.Types.ObjectId()];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          invitees,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid reviewer id', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = mongoose.Types.ObjectId();
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid review comment', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = Math.random();
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Invalid review rating', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = faker.lorem.sentence();
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Undefined reviewer id', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = undefined;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Undefined review comment', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = undefined;
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Undefined review rating', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = undefined;
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Null reviewer id', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = null;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Null review comment', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = null;
        const rating = Math.floor(Math.random()*5) + 1;
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

      it('Null review rating', async () => {
        const index = Math.floor(Math.random() * numEvents);
        const event = events[index];
        const comment = faker.lorem.sentence();
        const rating = null;
        const reviewer = uid2;
        const review = {comment, rating, reviewer};
        const reviews = [review];
        const response = await request.put(`${endpoint}/${event.id}`).send({
          reviews,
        });
        expect(response.status).toBe(400);
      });

    });

    it('Respond 404', async () => {
      const response = await request.put(
        `${endpoint}/${mongoose.Types.ObjectId()}`
      );
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE request', () => {
    it('Respond 200 when deleting an event', async () => {
      const index = Math.floor(Math.random() * numEvents);
      const event = events[index];
      const response = await request.delete(`${endpoint}/${event.id}`);
      expect(response.status).toBe(200);
      expect(response.body.data._id).toBe(event.id);
      expect(response.body.data.name).toBe(event.name);
      expect(response.body.data.start).toBe(event.start);
      expect(response.body.data.end).toBe(event.end);
      expect(response.body.data.location).toEqual(event.location);
      expect(response.body.data.description).toBe(event.description);
      expect(response.body.data.organizer).toBe(`${event.organizer}`);
      expect(response.body.data.capacity).toBe(event.capacity);
      expect(response.body.data.categories).toStrictEqual(event.categories);
    });

    it('Respond 400', async () => {
      const response = await request.delete(`${endpoint}/invalid}`);
      expect(response.status).toBe(400);
    });

    it('Respond 404', async () => {
      const response = await request.delete(
        `${endpoint}/${mongoose.Types.ObjectId().toString()}`
      );
      expect(response.status).toBe(404);
    });
  });

  afterAll(async () => {
    await userDao.deleteAll();
    await eventDao.deleteAll();
  });
});
