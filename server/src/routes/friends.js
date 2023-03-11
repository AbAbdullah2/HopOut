import express from 'express';
import UserDao from '../data/UserDao.js';
import { hidePassword } from './users.js';

const router = express.Router();
export const userDao = new UserDao();

router.put(`/friends/sendRequest`, async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await userDao.read(senderId);
    const receiver = await userDao.read(receiverId);
  
    const senderSentFriends = sender.sentFriends;
    senderSentFriends.push(receiverId);
    const receiverReceivedFriends = receiver.receivedFriends;
    receiverReceivedFriends.push(senderId);

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

router.put(`/friends/acceptRequest`, async (req, res, next) => {
  try {
    const { acceptorId, requesterId } = req.body;

    const acceptor = await userDao.read(acceptorId);
    const requester = await userDao.read(requesterId);

    let filteredAcceptor = acceptor.receivedFriends.filter(
      (e) => e.toString() !== requester.id
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e.toString() !== acceptor.id
    );

    const acceptorFriends = acceptor.friends;
    acceptorFriends.push(requesterId);
    const requesterFriends = requester.friends;
    requesterFriends.push(acceptorId);


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

    let filteredDecliner = decliner.receivedFriends.filter(
      (e) => e.toString() !== requester.id
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e.toString() !== decliner.id
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

    let filteredRemover = remover.friends.filter((e) => e.toString() !== friendId);
    let filteredFriend = friend.friends.filter((e) => e.toString() !== removerId);

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