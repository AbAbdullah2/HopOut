import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { eventDao } from "../../src/routes/events.js";
import { userDao } from "../../src/routes/users.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";

dotenv.config();
const endpoint = "/rsvp";
const request = new supertest(app);

describe(`Test ${endpoint}`, () => {
    let sid, sender, rid;
    let event, name, start, end, address, city, state, zip, description, visibility, capacity, organizer, categories;

    beforeAll(async () => {
        db.connect(process.env.TEST_DB);
        await userDao.deleteAll();
        await eventDao.deleteAll();
        sender = await userDao.create({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(6)
        });
        sid = sender.id;
        const receiver = await userDao.create({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(6)
        });
        rid = receiver.id;
    });

    beforeEach(async () => {
        await eventDao.deleteAll();
        name = faker.lorem.words(3);
        start = "2023-06-22T15:28:37.174Z";
        end = "2023-06-22T15:28:37.174Z";
        address = faker.address.streetAddress();
        city = faker.address.cityName();
        state = faker.address.countryCode();
        zip = faker.address.zipCode();
        description = faker.lorem.paragraph();
        visibility = "public";
        organizer = sid;
        capacity = 20;
        categories = ["Sports"];
        event = await eventDao.create({ name, start, end, address, city, state, zip, description, visibility, capacity, organizer, categories });
    });

    describe("PUT request", () => {
        describe("Send RSVP", () => {
            it("Respond 200", async () => {
                const senderId = rid;
                const eventId = event._id;
                const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                expect(response.status).toBe(200);
                const updatedEvent = await eventDao.read(eventId.toString())
                expect(updatedEvent.attendees).toContain(senderId);
                expect(response.body.data.attending).toContain(eventId.toString());
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const senderId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const senderId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const senderId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const senderId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const senderId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const senderId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const senderId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const senderId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const senderId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const senderId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Invalid event visibility", async () => {
                    const senderId = rid;
                    const eventName = "Hope";
                    const visibility = "private";
                    event = eventDao.create({ name: eventName, start, end, address, city, state, zip, description, visibility, capacity, organizer, categories })
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendRSVP`).send({ senderId, eventId });
                    expect(response.status).toBe(400);
                });
            });
        });

        describe("Send invite", () => {
            it("Respond 200", async () => {
                const inviteeId = rid;
                const eventId = event._id;
                const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                expect(response.status).toBe(200);
                const updatedSender = await userDao.read(inviteeId.toString())
                expect(updatedSender.invited).toContain(eventId);
                expect(response.body.data.invitees).toContain(inviteeId.toString());
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const inviteeId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const inviteeId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const inviteeId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const inviteeId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const inviteeId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const inviteeId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const inviteeId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const inviteeId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const inviteeId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const inviteeId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/sendInvite`).send({ inviteeId, eventId });
                    expect(response.status).toBe(404);
                });
            });
        });

        describe("Unsend invite", () => {
            it("Respond 200", async () => {
                const uninviteeId = rid;
                const eventId = event._id;
                console.log("event", event)
                const hello = await request.put(`${endpoint}/sendInvite`).send({ inviteeId: uninviteeId, eventId })
                console.log("sent invite!")
                console.log(hello.body)
                const updatedUninvitee1 = await userDao.read(uninviteeId.toString())
                console.log("updatedUnInvitee Before", updatedUninvitee1)
                const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                expect(response.status).toBe(200);
                const updatedUninvitee = await userDao.read(uninviteeId.toString())
                console.log("updatedUnInvitee After", updatedUninvitee)
                expect(updatedUninvitee.invited).not.toContain(eventId);
                expect(response.body.data.invitees).not.toContain(uninviteeId.toString());
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const uninviteeId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const uninviteeId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const uninviteeId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const uninviteeId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const uninviteeId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const uninviteeId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const uninviteeId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const uninviteeId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const uninviteeId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const uninviteeId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/unsendInvite`).send({ uninviteeId, eventId });
                    expect(response.status).toBe(404);
                });
            });
        });

        describe("Accept invite", () => {
            it("Respond 200", async () => {
                const acceptorId = rid;
                const eventId = event._id;
                await request.put(`${endpoint}/sendInvite`).send({ inviteeId: acceptorId, eventId })
                const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                expect(response.status).toBe(200);
                const updatedEvent = await eventDao.read(eventId.toString())
                expect(updatedEvent.attendees).toContain(acceptorId);
                expect(response.body.data.attending).toContain(eventId);
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const acceptorId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const acceptorId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const acceptorId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const acceptorId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const acceptorId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const acceptorId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const acceptorId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const acceptorId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const acceptorId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const acceptorId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/acceptInvite`).send({ acceptorId, eventId });
                    expect(response.status).toBe(404);
                });
            });
        });

        describe("Decline invite", () => {
            it("Respond 200", async () => {
                const declinerId = rid;
                const eventId = event._id;
                await request.put(`${endpoint}/sendInvite`).send({ inviteeId: declinerId, eventId })
                const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                expect(response.status).toBe(200);
                const updatedEvent = await eventDao.read(eventId.toString())
                expect(updatedEvent.invitees).toContain(eventId);
                expect(response.body.data.invited).not.toContain(eventId.toString());
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const declinerId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const declinerId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const declinerId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const declinerId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const declinerId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const declinerId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const declinerId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const declinerId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const declinerId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const declinerId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/declineInvite`).send({ declinerId, eventId });
                    expect(response.status).toBe(404);
                });
            });
        });

        describe("Remove RSVP", () => {
            it("Respond 200", async () => {
                const removerId = rid;
                const eventId = event._id;
                await request.put(`${endpoint}/sendRSVP`).send({ senderId: removerId, eventId })
                const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                expect(response.status).toBe(200);
                const updatedEvent = await eventDao.read(eventId.toString())
                expect(updatedEvent.attendees).not.toContain(removerId);
                expect(response.body.data.attending).not.toContain(eventId.toString());
            });
            describe("Respond 400", () => {
                it("Null sender", async () => {
                    const removerId = null;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Empty sender", async () => {
                    const removerId = "";
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined sender", async () => {
                    const removerId = undefined;
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Invalid sender", async () => {
                    const removerId = faker.lorem.word();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Valid senderId but does not match a user in our database", async () => {
                    const removerId = mongoose.Types.ObjectId();
                    const eventId = event._id;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(404);
                });

                it("Null event", async () => {
                    const removerId = rid;
                    const eventId = null;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Empty event", async () => {
                    const removerId = rid;
                    const eventId = "";
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });

                it("Undefined event", async () => {
                    const removerId = rid;
                    const eventId = undefined;
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Invalid event", async () => {
                    const removerId = rid;
                    const eventId = faker.lorem.word();
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(400);
                });
    
                it("Valid eventId but does not match an event in our database", async () => {
                    const removerId = rid;
                    const eventId = mongoose.Types.ObjectId();
                    const response = await request.put(`${endpoint}/removeRSVP`).send({ removerId, eventId });
                    expect(response.status).toBe(404);
                });
            });
        });
    });
    afterAll(async () => {
        await eventDao.deleteAll();
        await userDao.deleteAll();
    });
});
