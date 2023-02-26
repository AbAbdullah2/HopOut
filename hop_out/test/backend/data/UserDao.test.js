import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import UserDao from "../../../backend/data/UserDao.js";
import { faker } from "@faker-js/faker";
import User from "../../../backend/models/User.js";
import * as db from "../../../backend/index.js";
import * as dotenv from "dotenv";
import { verifyPassword } from "../../../backend/util/password.js";
import mongoose from "mongoose";

dotenv.config();

const userDao = new UserDao();

describe("Test UserDao", () => {
    const numUsers = 5
    let users;

    beforeAll(async () => {
        db.connect(process.env.TEST_DB);
        await userDao.deleteAll();
    });

    beforeEach(async () => {
      await userDao.deleteAll();
      users = [];
    });

    it("test create()", async () => {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password(6);
        const _user = await userDao.create({ name, email, password });
        expect(_user.name).toBe(name);
        expect(_user.email).toBe(email);
        expect(verifyPassword(password, _user.password)).toBe(true);
        expect(_user.id).toBeDefined();
      });
    
    //   it("test create() without given role", async () => {
    //     const name = faker.name.fullName();
    //     const email = faker.internet.email();
    //     const password = faker.internet.password(6);
    //     const _user = await userDao.create({ name, email, password });
    //     expect(_user.name).toBe(name);
    //     expect(_user.email).toBe(email);
    //     expect(verifyPassword(password, _user.password)).toBe(true);
    //     expect(_user.id).toBeDefined();
    //   });

    describe("test create() throws error", () => {
        it("empty name", async () => {
            try {
              const name = "";
              const email = faker.internet.email();
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
        });

        it("null name", async () => {
            try {
              const name = null;
              const email = faker.internet.email();
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
        });

        it("undefined name", async () => {
            try {
              const name = undefined;
              const email = faker.internet.email();
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
        });

        it("empty email", async () => {
            try {
              const name = faker.name.fullName();
              const email = "";
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("null email", async () => {
            try {
              const name = faker.name.fullName();
              const email = null;
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("undefined email", async () => {
            try {
              const name = faker.name.fullName();
              const email = undefined;
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("invalid email", async () => {
            try {
              const name = faker.name.fullName();
              const email = faker.lorem.sentence();
              const password = faker.internet.password(6);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("test email is not unique", async () => {
            try {
              let name = faker.name.fullName();
              const email = faker.lorem.sentence();
              let password = faker.internet.password(6);
              await userDao.create({ name, email, password });
      
              name = faker.name.fullName();
              password = faker.internet.password(6);
              await User.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("empty password", async () => {
            try {
              const name = faker.name.fullName();
              const email = faker.internet.email();
              const password = "";
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("null password", async () => {
            try {
              const name = faker.name.fullName();
              const email = faker.internet.email();
              const password = null;
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("undefined password", async () => {
            try {
              const name = faker.name.fullName();
              const email = faker.internet.email();
              const password = undefined;
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });
      
          it("short password", async () => {
            try {
              const name = faker.name.fullName();
              const email = faker.internet.email();
              const password = faker.internet.password(5);
              await userDao.create({ name, email, password });
            } catch (err) {
              expect(err.status).toBe(400);
            }
          });

    });

});