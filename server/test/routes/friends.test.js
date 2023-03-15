import { describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import app from "../../src/index.js";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import { userDao } from "../../src/routes/users.js";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const endpoint = "/friends";
const request = new supertest(app);

describe(`Test ${endpoint}`, () => {

    let requesterId;
    let receiverId;
    let requester;
    let receiver;

    beforeAll(async () => {
      db.connect(process.env.TEST_DB);
      await userDao.deleteAll();
    });
  
    beforeEach(async () => {
        requester = await userDao.create({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(6)
          });
        receiver = await userDao.create({
            name: faker.name.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(6)
        });
        requesterId = requester.id;
        receiverId = receiver.id;
    });

    describe("send a friend request", () => {
        it("Respond 200: friend request sent successfully", async () => {
            const senderId = requesterId;
            const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(senderId);
            expect(response.body.data.sentFriends[0].user).toBe(receiverId);
            const receiver = await userDao.read(receiverId);
            expect(receiver.receivedFriends[0].user.toString()).toBe(senderId);
        });
    
        /*it("sender sends a friend request to receiver twice", async () => {
            const senderId = requesterId;
            const response = await request.put(`${endpoint}/sendRequest}`).send({senderId, receiverId});
            const response2 = await request.put(`${endpoint}/sendRequest}`).send({senderId, receiverId});
            expect(response2.status).toBe();

        });*/
        /*it("receiver sends a friend request to sender after sender's initial request", async () => {
            let senderId = requesterId;
            const response = await request.put(`${endpoint}/sendRequest}`).send({senderId, receiverId});
            senderId = receiverId;
            receiverId = requesterId;
            const response2 = await request.put(`${endpoint}/sendRequest}`).send({senderId, receiverId});
            expect(response2.status).toBe();

        });*/

        describe("Respond 400", () => {
            it("requester is invalid id", async () => {
                const senderId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
                expect(response.status).toBe(400);
    
            });

            it("receiver is invalid id", async () => {
                const senderId = requesterId;
                receiverId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
                expect(response.status).toBe(400);
    
            });
        });

        describe("Respond 404", () => {
            it("requester id valid but not in database", async () => {
                const senderId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
                expect(response.status).toBe(404);
    
            });
            it("receiver id valid but not in database", async () => {
                const senderId = requesterId;
                receiverId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
                expect(response.status).toBe(404);
    
            });
        });

    });
    
    describe("unsend a friend request", () => {
        it("Respond 200 (friend request unsent sucessfully)", async () => {
            // const senderId = requesterId;
            // const response = await request.put(`${endpoint}/sendRequest`).send({senderId, receiverId});
            // expect(response.status).toBe(200);
            // expect(response.body.data._id).toBe(senderId);
            // expect(response.body.data.sentFriends[0].user).toBe(receiverId);
            // const receiver = await userDao.read(receiverId);
            // expect(receiver.receivedFriends[0].user.toString()).toBe(senderId);
            await request.put(`${endpoint}/sendRequest`).send({senderId: requesterId, receiverId});
            const response = await request.put(`${endpoint}/removeRequest`).send({
                otherId: receiverId,
                removerId: requesterId
            });
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(requesterId);
            expect(response.body.data.sentFriends.length).toBe(0);
            const receiver = await userDao.read(receiverId);
            expect(receiver.receivedFriends.length).toBe(0);        
        });

        /*it("friend request was never sent originally", async () => {
            const response = await request.put(`${endpoint}/removeRequest}`).send({
                otherId: receiverId,
                removerId: requesterId
            });
            expect(response.status).toBe();       
        });*/

        describe("Respond 400", () => {
            it("requester is invalid id", async () => {
                requesterId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/removeRequest`).send({
                    otherId: receiverId,
                    removerId: requesterId
                });                
                expect(response.status).toBe(400);
    
            });

            it("receiver is invalid id", async () => {
                receiverId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/removeRequest`).send({
                    otherId: receiverId,
                    removerId: requesterId
                });                 
                expect(response.status).toBe(400);
    
            });
        });

        describe("Respond 404", () => {
            it("requester id valid but not in database", async () => {
                requesterId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/removeRequest`).send({
                    otherId: receiverId,
                    removerId: requesterId
                }); 
                expect(response.status).toBe(404);
            });

            it("receiver id valid but not in database", async () => {
                receiverId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/removeRequest`).send({
                    otherId: receiverId,
                    removerId: requesterId
                }); 
                expect(response.status).toBe(404);
            });
        });
    
    });

    describe("accept a friend request", () => {
        it("Respond 200 (friend request accepted sucessfully)", async () => {
            await request.put(`${endpoint}/sendRequest`).send({senderId: requesterId, receiverId});
            const response = await request.put(`${endpoint}/acceptRequest`).send({
                acceptorId: receiverId,
                requesterId
            });
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(receiverId);

            const requester = await request.get(`users/${requesterId}`);

            //both acceptor and requester are in each others friends
            expect(response.body.data.friends[0]).toBe(requesterId);
            expect(requester.body.data.friends[0]).toBe(receiverId);

            //acceptor not in requester's sent friends
            expect(requester.body.data.sentFriends.length).toBe(0);
            //requester not in acceptor's received friends 
            expect(response.body.data.receivedFriends.length).toBe(0);

        });
        
        /*it("friend request was never sent originally", async () => {
            const response = await request.put(`${endpoint}/acceptRequest}`).send({
                acceptorId: receiverId,
                requesterId
            });
            expect(response.status).toBe();
        });*/

        /*it("friend request sent and sender tries to accept the request", async () => {
                const response = await request.put(`${endpoint}/acceptRequest}`).send({
                acceptorId: requesterId,
                requesterId: receiverId
            });
            expect(response.status).toBe();
        });*/

        describe("Respond 400", () => {
            it("requester is invalid id", async () => {
                requesterId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/acceptRequest`).send({
                    acceptorId: receiverId,
                    requesterId
                });               
                expect(response.status).toBe(400);
    
            });

            it("receiver is invalid id", async () => {
                receiverId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/acceptRequest`).send({
                    acceptorId: receiverId,
                    requesterId
                });               
                expect(response.status).toBe(400);
    
            });
        });

        describe("Respond 404", () => {
            it("requester id valid but not in database", async () => {
                requesterId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/acceptRequest`).send({
                    acceptorId: receiverId,
                    requesterId
                });
                expect(response.status).toBe(404);
            });

            it("receiver id valid but not in database", async () => {
                receiverId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/acceptRequest`).send({
                    acceptorId: receiverId,
                    requesterId
                });
                expect(response.status).toBe(404);
            });
        });
    
    });

    describe("decline a friend request", () => {
        it("Respond 200 (friend request declined sucessfully)", async () => {
            await request.put(`${endpoint}/sendRequest`).send({senderId: requesterId, receiverId});
            const response = await request.put(`${endpoint}/declineRequest`).send({
                declinerId: receiverId,
                requesterId
            });
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(receiverId);

            const requester = await request.get(`users/${requesterId}`);

            //decliner not in requester's sent friends
            expect(requester.body.data.sentFriends.length).toBe(0);
            //requester not in decliner's received friends 
            expect(response.body.data.receivedFriends.length).toBe(0);
        });
        
        /*it("friend request was never sent originally", async () => {
            const response = await request.put(`${endpoint}/declineRequest}`).send({
                declinerId: receiverId,
                requesterId
            });
            expect(response.status).toBe();
        });*/

        describe("Respond 400", () => {
            it("requester is invalid id", async () => {
                requesterId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/declineRequest`).send({
                    declinerId: receiverId,
                    requesterId
                });              
                expect(response.status).toBe(400);
    
            });

            it("receiver is invalid id", async () => {
                receiverId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/declineRequest`).send({
                    declinerId: receiverId,
                    requesterId
                });              
                expect(response.status).toBe(400);
    
            });
        });

        describe("Respond 404", () => {
            it("requester id valid but not in database", async () => {
                requesterId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/declineRequest`).send({
                    declinerId: receiverId,
                    requesterId
                });
                expect(response.status).toBe(404);
            });

            it("receiver id valid but not in database", async () => {
                receiverId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/declineRequest`).send({
                    declinerId: receiverId,
                    requesterId
                });
                expect(response.status).toBe(404);
            });
        });
    
    });

    describe("unfriend a current friend", () => {
        it("Respond 200 (unfriended a friend sucessfully)", async () => {
            await request.put(`${endpoint}/sendRequest`).send({senderId: requesterId, receiverId});
            await request.put(`${endpoint}/acceptRequest`).send({
                acceptorId: receiverId,
                requesterId
            });
            const response = await request.put(`${endpoint}/removeFriend`).send({
                removerId: receiverId,
                friendId: requesterId
            });
            expect(response.status).toBe(200);
            expect(response.body.data._id).toBe(receiverId);

            const requester = await request.get(`users/${requesterId}`);

            //both acceptor and requester are not in each others friends
            expect(response.body.data.friends.length).toBe(0);
            expect(requester.body.data.friends.length).toBe(0);
        });
        
        /*it("not friends originally (no friend request sent or accepted)) ", async () => {
            const response = await request.put(`${endpoint}/removeFriend}`).send({
                removerId: receiverId,
                friendId: requesterId
            });
            expect(response.status).toBe();
        });*/
        /*it("not friends originally (friend request sent but not yet accepted)) ", async () => {
            await request.put(`${endpoint}/sendRequest}`).send({senderId: requesterId, receiverId});
            const response = await request.put(`${endpoint}/removeFriend}`).send({
                removerId: receiverId,
                friendId: requesterId
            });
            expect(response.status).toBe();
        });*/

        describe("Respond 400", () => {
            it("requester is invalid id", async () => {
                requesterId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/removeFriend`).send({
                    removerId: receiverId,
                    friendId: requesterId
                });              
                expect(response.status).toBe(400);
    
            });

            it("receiver is invalid id", async () => {
                receiverId = faker.lorem.sentence();
                const response = await request.put(`${endpoint}/removeFriend`).send({
                    removerId: receiverId,
                    friendId: requesterId
                });             
                expect(response.status).toBe(400);
    
            });
        });

        describe("Respond 404", () => {
            it("requester id valid but not in database", async () => {
                requesterId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/removeFriend`).send({
                    removerId: receiverId,
                    friendId: requesterId
                });
                expect(response.status).toBe(404);
            });

            it("receiver id valid but not in database", async () => {
                receiverId = mongoose.Types.ObjectId().toString();
                const response = await request.put(`${endpoint}/removeFriend`).send({
                    removerId: receiverId,
                    friendId: requesterId
                });
                expect(response.status).toBe(404);
            });
        });
    
    });

    afterAll(async () => {
        await userDao.deleteAll();
    });
});