import { expect, test } from "vitest";
import User from "../../../backend/models/User.js";
import {faker} from "@faker-js/faker";
import * as db from "../../../backend/index.js";
import * as dotenv from "dotenv";

test("test constructor", async () => {
  const name = faker.name.fullName();
  const username = faker.internet.userName();
  const email = faker.internet.email();
  console.log(email);
  const password = faker.internet.password(8);
  const user = await User.create({ name, username, email, password })
  expect(user.name).toBe(name);
  expect(user.username).toBe(username);
  expect(user.email).toBe(email);
  expect(user.id).toBeDefined();
  expect(user.password).toBe(password);
});

test("two plus two is four", () => {
    expect(2 + 2).toBe(4);
  });