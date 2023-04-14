import mongoose from 'mongoose';
import ApiError from '../models/ApiError.js';
import { z } from 'zod';
import CommentSection from '../models/Comment.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

const validObjectId = z
  .string()
  .refine((id) => mongoose.isValidObjectId(id), 'Invalid ID!');
const validString = z.string().min(1, 'Missing attribute!');

class CommentSectionDao {

  // return the created chat
  async createCommentSection({ eventId }) {
    let result;
    //check event is valid
    result = validObjectId.safeParse(eventId);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check person1 is valid
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(400, 'Invalid Event!');
    }

    const commentSection = await CommentSection.create({ event });
    return commentSection;
  }

  // return the created comment
  async createComment({ eventId, commentSectionId, sender, message }) {
    //check message is valid
    let result = validString.safeParse(comment);
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

    //check eventId is valid
    result = validObjectId.safeParse(eventId.toString());
    if (!result.success) {
      console.log(result.error)
      throw new ApiError(400, 'Invalid EventId!');
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(400, 'Event does not exist!')
    }

    result = validObjectId.safeParse(commentSectionId.toString());
    if (!result.success) {
      console.log(result.error)
      throw new ApiError(400, 'Invalid commentSectionId!');
    }

    const commentSection = await CommentSection.findById(commentSectionId);
    if (!event) {
      throw new ApiError(400, 'Comment section does not exist!')
    }
    
    // if (!(([0].toString() === (sender) || chat.users[1].toString() === (sender)) && (chat.users[0].toString() === (receiver) || chat.users[1].toString() === (receiver)))) {
    //   throw new ApiError(400, 'Invalid Chat Users!');
    // }

    const sendComment = {
      sender: sender,
      message: message,
    };
    // const updatedChat = await Chat.findByIdAndUpdate(chatId, {
    //   messages: chat.messages[0].push({ sender, receiver, message }),
    // });
    commentSection.comments.push(sendComment);
    commentSection.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
    return commentSection;
  }

  // return a specific chat between two users
  // throws ApiError if id is invalid or resource does not exist in our database
  async readChat(eventId) {
    //validate person1
    const result = validObjectId.safeParse(id);
    if (!result.success) {
      throw new ApiError(400, 'Invalid ID!');
    }

    //find chat
    const commentSection = await CommentSection.findById(id);
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
