import express from 'express';
import UserDao from '../data/UserDao.js';
import { hidePassword } from './users.js';
import ApiError from '../models/ApiError.js';

const router = express.Router();
export const userDao = new UserDao();

router.put(`/friends/sendRequest`, async (req, res, next) => {
  try {
    const timeStamp = new Date();
    const { senderId, receiverId } = req.body;

    const sender = await userDao.read(senderId);
    const receiver = await userDao.read(receiverId);

    let sender1 = false;
    let receiver2 = false;

    sender.sentFriends.forEach((e) => {
      if (e.user.toString() === receiverId) {
        sender1 = true;
      }
    });

    receiver.receivedFriends.forEach((e) => {
      if (e.user.toString() === senderId) {
        receiver2 = true;
      }
    });

    if (sender1 || receiver2) {
      throw new ApiError(400, 'User has already requested this friend!');
    }

    const senderSentFriends = sender.sentFriends;

    senderSentFriends.push({ user: receiverId, date: timeStamp });

    const receiverReceivedFriends = receiver.receivedFriends;
    receiverReceivedFriends.push({ user: senderId, date: timeStamp });

    const updatedSender = await userDao.update({
      id: senderId,
      sentFriends: senderSentFriends,
    });

    const updatedReceiver = await userDao.update({
      id: receiverId,
      receivedFriends: receiverReceivedFriends,
    });

    res.json({
      status: 200,
      message: `Successfully sent friend request to ${updatedReceiver.name}!`,
      data: hidePassword(updatedSender),
    });
  } catch (err) {
    next(err);
  }
});

// removes a sent friend request to another person
router.put(`/friends/removeRequest`, async (req, res, next) => {
  try {
    const { removerId, otherId } = req.body;

    const remover = await userDao.read(removerId);
    const other = await userDao.read(otherId);

    let remover1 = false;
    let other2 = false;

    remover.sentFriends.forEach((e) => {
      if (e.user.toString() === otherId) {
        remover1 = true;
      }
    });

    other.receivedFriends.forEach((e) => {
      if (e.user.toString() === removerId) {
        other2 = true;
      }
    });

    if (!remover1 || !other2) {
      throw new ApiError(400, 'User was not requested as friend!');
    }

    let filteredSentRemover = remover.sentFriends.filter(
      (e) => e.user.toString() !== otherId
    );
    let filteredReceivedOther = other.receivedFriends.filter(
      (e) => e.user.toString() !== removerId
    );

    const updatedRemover = await userDao.update({
      id: removerId,
      sentFriends: filteredSentRemover,
    });
    const updatedOther = await userDao.update({
      id: otherId,
      receivedFriends: filteredReceivedOther,
    });

    res.json({
      status: 200,
      message: `Successfully unsent friend request to ${updatedOther.name}!`,
      data: hidePassword(updatedRemover),
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/friends/acceptRequest`, async (req, res, next) => {
  try {
    const timeStamp = new Date();
    const { acceptorId, requesterId } = req.body;

    const acceptor = await userDao.read(acceptorId);
    const requester = await userDao.read(requesterId);

    let acceptor1 = false;
    let requester2 = false;

    acceptor.receivedFriends.forEach((e) => {
      if (e.user.toString() === requesterId) {
        acceptor1 = true;
      }
    });

    requester.sentFriends.forEach((e) => {
      if (e.user.toString() === acceptorId) {
        requester2 = true;
      }
    });

    if (!acceptor1 || !requester2) {
      throw new ApiError(400, 'User was not requested as friend!');
    }

    let filteredAcceptor = acceptor.receivedFriends.filter(
      (e) => e.user.toString() !== requester.id
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e.user.toString() !== acceptor.id
    );

    const acceptorFriends = acceptor.friends;
    acceptorFriends.push({ user: requesterId, date: timeStamp });
    const requesterFriends = requester.friends;
    requesterFriends.push({ user: acceptorId, date: timeStamp });

    const updatedAcceptor = await userDao.update({
      id: acceptorId,
      receivedFriends: filteredAcceptor,
      friends: acceptorFriends,
    });

    const updatedRequester = await userDao.update({
      id: requesterId,
      sentFriends: filteredRequester,
      friends: requesterFriends,
    });

    res.json({
      status: 200,
      message: `Successfully accepted friend request from ${updatedRequester.name}!`,
      data: hidePassword(updatedAcceptor),
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/friends/declineRequest`, async (req, res, next) => {
  try {
    const { declinerId, requesterId } = req.body;

    const decliner = await userDao.read(declinerId);
    const requester = await userDao.read(requesterId);

    let decliner1 = false;
    let requester2 = false;

    decliner.receivedFriends.forEach((e) => {
      if (e.user.toString() === requesterId) {
        decliner1 = true;
      }
    });

    requester.sentFriends.forEach((e) => {
      if (e.user.toString() === declinerId) {
        requester2 = true;
      }
    });

    if (!decliner1 || !requester2) {
      throw new ApiError(400, 'User was not requested as friend!');
    }

    let filteredDecliner = decliner.receivedFriends.filter(
      (e) => e.user.toString() !== requester.id
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e.user.toString() !== decliner.id
    );

    const updatedDecliner = await userDao.update({
      id: declinerId,
      receivedFriends: filteredDecliner,
    });
    const updatedRequester = await userDao.update({
      id: requesterId,
      sentFriends: filteredRequester,
    });

    res.json({
      status: 200,
      message: `Successfully declined friend request from ${updatedRequester.name}!`,
      data: hidePassword(updatedDecliner),
    });
  } catch (err) {
    next(err);
  }
});

router.put(`/friends/removeFriend`, async (req, res, next) => {
  try {
    const { removerId, friendId } = req.body;

    const remover = await userDao.read(removerId);
    const friend = await userDao.read(friendId);

    let friends1 = false;
    let friends2 = false;

    remover.friends.forEach((e) => {
      if (e.user.toString() === friendId) {
        friends1 = true;
      }
    });

    friend.friends.forEach((e) => {
      if (e.user.toString() === removerId) {
        friends2 = true;
      }
    });

    if (!friends1 || !friends2) {
      throw new ApiError(400, 'Users are not friends!');
    }

    let filteredRemover = remover.friends.filter(
      (e) => e.user.toString() !== friendId
    );
    let filteredFriend = friend.friends.filter(
      (e) => e.user.toString() !== removerId
    );

    const updatedRemover = await userDao.update({
      id: removerId,
      friends: filteredRemover,
    });
    const updatedFriend = await userDao.update({
      id: friendId,
      friends: filteredFriend,
    });

    res.json({
      status: 200,
      message: `Successfully removed ${updatedFriend.name} as friend!`,
      data: hidePassword(updatedRemover),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
