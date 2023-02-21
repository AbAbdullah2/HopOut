import User from "../models/User";
import mongoose from "mongoose";
import ApiError from "../models/ApiError.js";
const bcrypt = require('bcryptjs');

class UserDAO {

  // return the created user
  async create({ email, name, password }) {
    const user = await User.exists({ email: email.toLowerCase() });

    if (user) {
        throw new ApiError(400, 'this email is already in use. please try a different one.');
    }
  }

  // return all users
  async readAll() {
    const users = await User.find();
    return users;
  }

  // return the user with the given ID
  // return undefined if no user exists with the given ID  
  async read(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  // update a user given its ID
  // return the updated user
  // return undefined if no user exists with the given ID
  async update({ id, name, email, password }) {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }

  // delete a user given its ID
  // return the user bookmark 
  // return undefined if no user exists with the given ID
  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, "Resource not found!");
    }

    return user;
  }
}

export default UserDAO;
