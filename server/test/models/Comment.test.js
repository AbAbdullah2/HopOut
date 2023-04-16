import { describe, beforeAll, expect, it, beforeEach } from 'vitest';
import CommentSection from '../../src/models/Comment.js';
import * as db from '../../src/data/db.js';
import * as dotenv from 'dotenv';
import UserDao from '../../src/data/UserDao.js';
import EventDao from '../../src/data/EventDao.js';
import { faker } from '@faker-js/faker';

dotenv.config();

const userDao = new UserDao();
const eventDao = new EventDao();

let user1, commentSection;

describe('Test Comment Schema & CommentSection Schema & Model', () => {
  let event,
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
    categories;
  let sid, sender, rid, event1;

  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await CommentSection.deleteMany({});
  });

  beforeEach(async () => {
    await userDao.deleteAll();
    user1 = await userDao.create({
      name: 'test',
      email: 'testingtesting123@jhu.com',
      password: '1234567',
    });

    name = faker.lorem.words(3);
    start = '2023-06-22T15:28:37.174Z';
    end = '2023-06-22T15:28:37.174Z';
    locationName = faker.lorem.words(2);
    address = faker.address.streetAddress();
    city = faker.address.cityName();
    state = faker.address.countryCode();
    zip = faker.address.zipCode();
    addressLine2 = faker.address.secondaryAddress();
    description = faker.lorem.paragraph();
    visibility = 'public';
    organizer = user1.id;
    capacity = 20;
    categories = ['Sports'];
    event1 = await eventDao.create({
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
  });

  it('test create comment section', async () => {
    commentSection = await CommentSection.create({ event: event1 });
    expect(commentSection.id).toBeDefined();
    expect(commentSection.event).toBe(event1);
  });

  describe('test eventId is required', () => {
    it('test event1 is null', async () => {
      try {
        event1 = null;
        await CommentSection.create({ event: event1 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test event1 is undefined', async () => {
      try {
        event1 = undefined;
        await CommentSection.create({ event: event1 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test event1 is empty', async () => {
      try {
        event1 = '';
        await CommentSection.create({ event: event1 });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  it('test create comment', async () => {
    const message = 'how are you';
    const sendComment = {
      eventId: event1,
      commentSectionId: commentSection.id,
      sender: user1,
      message: message,
    };

    commentSection.comments.push(sendComment);
    commentSection.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  describe('test eventid is required', () => {
    it('test event1 is null', async () => {
      try {
        event1 = null;
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test event1 is undefined', async () => {
      try {
        event1 = undefined;
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test event1 is empty', async () => {
      try {
        event1 = '';
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('test commentSectionId is required', () => {
    it('test commentSectionId is null', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: null,
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test commentSectionId is undefined', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: undefined,
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test commentSectionId is empty', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: '',
          sender: user1,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('test sender is required', () => {
    it('test sender is null', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: null,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test sender is undefined', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: undefined,
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test sender is empty', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: '',
          message: message,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe('test message is required', () => {
    it('test message is null', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: user1,
          message: null,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it('test message is undefined', async () => {
      try {
        const message = 'how are you';
        const sendComment = {
          eventId: event1,
          commentSectionId: commentSection.id,
          sender: user1,
          message: undefined,
        };

        commentSection.comments.push(sendComment);
        commentSection.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });
});
