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
    let result;
    if (commentSectionId) {
      result = validObjectId.safeParse(commentSectionId.toString());
      if (!result.success) {
        throw new ApiError(400, 'Invalid commentSectionId!');
      }
    } else {
      throw new ApiError(400, 'Invalid commentSectionId!');
    }

    const commentSection = await CommentSection.findById(commentSectionId);
    console.log(commentSectionId, commentSection)
    if (!commentSection) {
      throw new ApiError(400, 'Comment section does not exist!');
    }
    
    let senderValid = false;
    
    //check message is valid
    result = validString.safeParse(message);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Message!');
    }

    //check sender ID is valid
    if (sender) {
      result = validObjectId.safeParse(sender.toString());
      if (!result.success) {
        throw new ApiError(400, 'Invalid ID!');
      }
    } else {
      throw new ApiError(400, 'Invalid ID!');
    }

    //check sender is valid
    const send = await User.findById(sender.toString());
    if (!send) {
      throw new ApiError(400, 'Invalid Sender!');
    }

    //check eventId is valid
    if (eventId) {
      result = validObjectId.safeParse(eventId.toString());
      if (!result.success) {
        throw new ApiError(400, 'Invalid EventId!');
      }
    } else {
      throw new ApiError(400, 'Invalid EventId!');
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(400, 'Event does not exist!');
    }

    //check that commenter is on attendees list
    event.attendees.forEach((a) => {
      if (a.toString() === sender.toString()) {
        senderValid = true;
      }
    });

    if (event.organizer.toString() === sender) {
      senderValid = true;
    }

    if (senderValid === false) {
      throw new ApiError(400, 'Commenter not attending event!');
    }

    const sendComment = {
      sender: sender,
      message: message,
    };

    commentSection.comments.push(sendComment);
    commentSection.save(function (err) {
      if (err) {
        console.log(err);
      }
    });

    return commentSection;
  }

  async readCommentSection(eventId) {
    const result = validObjectId.safeParse(eventId);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Event ID!');
    }
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found!');
    }

    const filter = {};
    filter.event = eventId;

    const commentSection = await CommentSection.find(filter);
    if (!commentSection) {
      throw new ApiError(404, 'Resource not found!');
    }
    return commentSection;
  }

  async deleteCommentSection({commentSectionId, eventId}) {
    //validate id
    let result = validObjectId.safeParse(commentSectionId.toString());
    if (!result.success) {
      throw new ApiError(400, 'Invalid Comment Section ID!');
    }
    result = validObjectId.safeParse(eventId);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Event ID!');
    }

    let event = Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found!');
    }

    let commentSection = await CommentSection.findByIdAndDelete(
      commentSectionId
    );
    if (!commentSection) {
      throw new ApiError(404, 'Comment section not found!');
    }

    return commentSection;
  }

  async deleteComment({ commentSectionId, commentId, senderId }) {
    //validate id
    let result = validObjectId.safeParse(commentSectionId);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Comment Section ID!');
    }
    result = validObjectId.safeParse(commentId);
    if (!result.success) {
      throw new ApiError(400, 'Invalid Comment ID!');
    }
    result = validObjectId.safeParse(senderId);

    if (!result.success) {
      throw new ApiError(400, 'Invalid Sender ID!');
    }
    let sender = await User.findById(senderId);
    if (!sender) {
      throw new ApiError(404, 'User not found!');
    }

    let commentSection = await CommentSection.findById(commentSectionId);
    if (!commentSection) {
      throw new ApiError(404, 'Comment section not found!');
    }

    let commentIndex = commentSection.comments.findIndex(
    (comment) => comment._id.toString() == commentId);

    if (commentIndex < 0) {
      throw new ApiError(404, 'Comment not found!');
    }

    const comment = commentSection.comments.splice(
      commentIndex,
      commentIndex + 1
    );
    commentSection.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Success!');
      }
    });

    return comment;
  }

  // delete all messages
  async deleteAll() {
    const commentSections = await CommentSection.deleteMany();
    return commentSections;
  }
}

export default CommentSectionDao;
