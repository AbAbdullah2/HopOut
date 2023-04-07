import mongoose from 'mongoose';
import ApiError from '../models/ApiError.js';
import { z } from 'zod';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

const validObjectId = z
  .string()
  .refine((id) => mongoose.isValidObjectId(id), 'Invalid ID!');
const validString = z.string().min(1, 'Missing attribute!');

class ChatDao {
  // check if chat already exits between users
  // sort users by id

  // return the created chat
  async createChat({ person1, person2 }) {
    let result;
    //check person1 ID is valid
    result = validObjectId.safeParse(person1);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check person1 is valid
    const per1 = await User.findById(person1);
    if (!per1) {
      throw new ApiError(400, 'Invalid Chatter!');
    }

    //check person2 ID is valid
    result = validObjectId.safeParse(person2);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check person2 is valid
    const per2 = await User.findById(person2);
    if (!per2) {
      throw new ApiError(400, 'Invalid Chatter!');
    }

    // const users = [];

    // if (person2 < person1) {
    //   users = [person2, person1]
    // } else {
    //   users = [person1, person2]
    // }

    const chatExists = await Chat.find({
      users: {
        $all: [person1, person2],
      },
    });

    if (chatExists[0]) {
      throw new ApiError(400, 'Chat already exists between users!');
    }

    //create chat
    const chat = await Chat.create({ users: [person1, person2] });
    return chat;
  }

  // return the created message
  async createMessage({ chatId, sender, receiver, message }) {
    //check message is valid
    let result = validString.safeParse(message);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Message!');
    }

    //check sender ID is valid
    result = validObjectId.safeParse(sender);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check sender is valid
    const send = await User.findById(sender);
    if (!send) {
      throw new ApiError(400, 'Invalid Sender!');
    }

    //check receiver ID is valid
    result = validObjectId.safeParse(receiver);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check receiver is valid
    const rec = await User.findById(receiver);
    if (!rec) {
      throw new ApiError(400, 'Invalid Receiver!');
    }

    //check chatId is valid
    result = validObjectId.safeParse(chatId.toString());
    if (!result.success) {
      console.log(result.error)
      throw new ApiError(400, 'Invalid ChatId!');
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(400, 'Chat does not exist!')
    }
    
    if (!((chat.users[0].toString() === (sender) || chat.users[1].toString() === (sender)) && (chat.users[0].toString() === (receiver) || chat.users[1].toString() === (receiver)))) {
      throw new ApiError(400, 'Invalid Chat Users!');
    }

    const sendMessage = {
      sender: sender,
      receiver: receiver,
      message: message,
    };
    // const updatedChat = await Chat.findByIdAndUpdate(chatId, {
    //   messages: chat.messages[0].push({ sender, receiver, message }),
    // });
    chat.messages.push(sendMessage);
    chat.save(function (err) {
      if (err) {
        console.log(err);
      }
    });

    return chat;
  }

  // return all chats for user
  async readAllChats(id) {
    //validate id
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check user is valid
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(400, 'Invalid User!');
    }

    const chats = await Chat.find({
      users: {
        $all: [id],
      },
    });

    if (!chats) {
      throw new ApiError(404, 'Resource not found!');
    }

    return chats;
  }

  // return a specific chat between two users
  // throws ApiError if id is invalid or resource does not exist in our database
  async readChat(id) {
    //validate person1
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //find chat
    const chat = await Chat.findById(id);
    if (!chat) {
      throw new ApiError(404, 'Resource not found!');
    }

    return chat;
  }

  async deleteChat(id) {
    //validate id
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    let chat = await Chat.findByIdAndDelete(id)
    // = await Chat.findByIdAndDelete(id);
    if (!chat) {
      throw new ApiError(404, 'Resource not found!');
    }

    return chat;
  }

  // delete all messages
  async deleteAll() {
    const chats = await Chat.deleteMany();
    return chats;
  }
}

export default ChatDao;
