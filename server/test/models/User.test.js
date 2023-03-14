import { describe, beforeAll, afterAll, expect, it } from "vitest";
import User from "../../src/models/User.js"
import { faker } from "@faker-js/faker";
import * as db from "../../src/data/db.js";
import * as dotenv from "dotenv";

dotenv.config();

describe("Test User Schema & Model", () => {
  beforeAll(async () => {
    db.connect(process.env.TEST_DB);
    await User.deleteMany({});
  });

  it("test create User", async () => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const user = await User.create({ name, email, password });
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.id).toBeDefined();
    expect(user.password).toBe(password);
  });

  describe("test name is required", () => {
    it("test name is null", async () => {
      try {
        const name = null;
        const password = faker.internet.password();
        const email = faker.internet.email();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is undefined", async () => {
      try {
        const name = undefined;
        const password = faker.internet.password();
        const email = faker.internet.email();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test name is empty", async () => {
      try {
        const name = "";
        const password = faker.internet.password();
        const email = faker.internet.email();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test email is required", () => {
    it("test email is null", async () => {
      try {
        const name = faker.name.fullName();
        const email = null;
        const password = faker.internet.password();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is undefined", async () => {
      try {
        const name = faker.name.fullName();
        const email = undefined;
        const password = faker.internet.password();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is empty", async () => {
      try {
        const name = faker.name.fullName();
        const email = "";
        const password = faker.internet.password();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is invalid", async () => {
      try {
        const name = faker.name.fullName();
        const email = faker.lorem.sentence();
        const password = faker.internet.password();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test email is not unique", async () => {
      try {
        let name = faker.name.fullName();
        const email = faker.internet.email();
        const password = faker.internet.password();
        await User.create({ name, email, password });

        name = faker.name.fullName();
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  describe("test password is required", () => {
    it("test password is null", async () => {
      try {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = null;
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test password is undefined", async () => {
      try {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = undefined;
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });

    it("test password is empty", async () => {
      try {
        const name = faker.name.fullName();
        const email = faker.internet.email();
        const password = "";
        await User.create({ name, email, password });
      } catch (err) {
        expect(err).toBeDefined();
      }
    });
  });

  
  afterAll(async () => {
    await User.deleteMany({});
  });
});
