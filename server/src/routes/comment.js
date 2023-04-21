import express from 'express';
import CommentSectionDao from '../data/CommentDao.js';
import UserDao from '../data/UserDao.js';
import EventDao from '../data/EventDao.js';
import ApiError from '../models/ApiError.js';

const router = express.Router();
export const commentDao = new CommentSectionDao();
export const userDao = new UserDao();
export const eventDao = new EventDao();


router.post(`/commentSection/:eventId`, async (req, res, next) => {
  try {
    const { eventId } = req.params
    const commentSection = await commentDao.createCommentSection({ eventId });

    res.status(201).json({
      status: 201,
      message: `Successfully created comment section!`,
      data: commentSection,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/comment/:commentSectionId', async (req, res, next) => {
  try {
    const { eventId, sender, message } = req.body;
    const { commentSectionId } = req.params;

    const commentSection = await commentDao.createComment({
      eventId,
      commentSectionId,
      sender,
      message,
    });
    res.status(201).json({
      status: 201,
      message: `Successfully posted comment!`,
      data: commentSection,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/getAllComments/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const commentSection = await commentDao.readCommentSection(eventId);
    if (!commentSection) {
      throw new ApiError(404, 'Resource not found!');
    }

    res.json({
      status: 200,
      message: `Successfully retrieved all of this event's comments!`,
      data: commentSection,
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/deleteCommentSection/:eventId', async (req, res, next) => {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        throw new ApiError(400, "No eventId")
      }
      
      const event = await eventDao.read(eventId);
      if (!event) {
        throw new ApiError(404, 'Resource not found!');
      }

      const commentSection = await commentDao.readCommentSection(eventId)
      if (!commentSection || commentSection.length < 0) {
        throw new ApiError(404, 'Resource not found!');
      }

      const deletedCommentSection = await commentDao.deleteCommentSection({ commentSectionId: commentSection[0]._id, eventId })
  
      res.json({
        status: 200,
        message: `Successfully deleted comment section!`,
        data: deletedCommentSection,
      });
    } catch (err) {
      next(err);
    }
  });

router.delete('/deleteComment/:commentSectionId', async (req, res, next) => {
  try {
    const { senderId, commentId } = req.body;
    const { commentSectionId } = req.params;
    if (!commentSectionId) {
    throw new ApiError(400, "No commentSectionId")
    }

    const deletedComment = await commentDao.deleteComment({ commentSectionId, commentId, senderId})

    res.json({
      status: 200,
      message: `Successfully deleted comment!`,
      data: deletedComment,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
