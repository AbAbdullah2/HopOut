import User from "../models/User.js";
import Event from "../models/Event.js"
import { hashPassword, verifyPassword } from "../util/password.js";
import mongoose from "mongoose";
import ApiError from "../models/ApiError.js";
import { z } from "zod";

const validObjectId = z
  .string()
  .refine((id) => mongoose.isValidObjectId(id), "Invalid ID!");
const validName = z.string().min(1, "Missing name attribute!");
const validEmail = z.string().email("Invalid Email!");
const validPassword = z
  .string()
  .min(6, "Password should be at least 6 characters.");

class UserDao {

  // return the created user
  async create({ name, email, password }) {
    
    //check name is valid
    let result = validName.safeParse(name);
    if (!result.success) {
      throw new ApiError(400, "Invalid Name!");
    }

    //check email is undefined
    if (!email) {
      throw new ApiError(400, "Undefined Email!");
    }
    
    //check if user already exists
    result = await User.exists({ email: email.toLowerCase() });
    if (result) {
        throw new ApiError(400, 'this email is already in use. please try a different one.');
    }

    //check email is valid
    result = validEmail.safeParse(email);
    if (!result.success) {
      throw new ApiError(400, "Invalid Email!");
    }

    //check password is valid
    result = validPassword.safeParse(password);
    if (!result.success) {
      throw new ApiError(400, "Password should be at least 6 characters.");
    }
    password = hashPassword(password);

    //create user
    const user = await User.create({ name, email, password });
    return user;

  }

  // return all users
  async readAll({ name }) {
    const filter = {};
    if (name) {
      filter.name = name;
    }
 
    const users = await User.find(filter);
    return users;
  }
 

  async readByEmail(email) {
    //find user
    const user = await User.findOne({email});
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  // return the user with the given ID
  // throws ApiError if id is invalid or resource does not exist in our database
  async read(id) {

    //validate id 
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    //find user
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  // update a user given its ID
  // return the updated user
  // throws ApiError if id is invalid or resource does not exist in our database
  async update({ id, name, password, organizing, attending, invited }) {

    //validate id
    let result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    //validate name
    if (name !== undefined) {
      result = validName.safeParse(name);
      if (!result.success) {
        throw new ApiError(400, "Invalid Name!");
      }
    }

    //validate password
    if (password !== undefined) {
      result = validPassword.safeParse(password);
      if (!result.success) {
        throw new ApiError(400, "Invalid Password!");
      }

      password = hashPassword(password);
    }

    // validate events organizing
    if (organizing !== undefined) {
      for (const event of organizing) {
        const e = await Event.findById(event);
        if (!e) {
          throw new ApiError(400, "User is organizing invalid event!");
        }
      }
    }

    // validate events attending
    if (attending !== undefined) {
      for (const event of attending) {
        const e = await Event.findById(event);
        if (!e) {
          throw new ApiError(400, "User is attending invalid event!");
        }
      }
    }

    // validate events invited
    if (invited !== undefined) {
      for (const event of invited) {
        const e = await Event.findById(event);
        if (!e) {
          throw new ApiError(400, "User is invited to invalid event!");
        }
      }
    }

    //update user
    const user = await User.findByIdAndUpdate(
      id,
      { name, password, organizing, attending, invited },
      { new: true }
    );
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  // delete a user given its ID
  // return the user 
  // throws ApiError if id is invalid or resource does not exist
  async delete(id) {

    //validate id 
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, "Invalid ID!");
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  async deleteAll() {
    const users = await User.deleteMany({});
    return users;
  }
}

export default UserDao;
