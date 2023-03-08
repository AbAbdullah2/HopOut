import express from 'express';
import UserDao from '../data/UserDao.js';

const router = express.Router();
export const userDao = new UserDao();

router.put(`/friends/sendRequest`, async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await userDao.read(senderId);
    const receiver = await userDao.read(receiverId);

    const updatedSender = await userDao.update({
      id: senderId,
      sentFriends: sender.sentFriends.push(receiverId),
    });
    const updatedReceiver = await userDao.update({
      id: receiverId,
      receivedFriends: receiver.receivedFriends.push(senderId),
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
      (e) => e !== requesterId
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e !== acceptorId
    );

    const updatedAcceptor = await userDao.update({
      id: acceptorId,
      receivedFriends: filteredAcceptor,
      friends: acceptor.friends.push(requesterId),
    });
    const updatedRequester = await userDao.update({
      id: requesterId,
      sentFriends: filteredRequester,
      friends: requester.friends.push(acceptorId),
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
      (e) => e !== requesterId
    );
    let filteredRequester = requester.sentFriends.filter(
      (e) => e !== declinerId
    );

    const updatedDecliner = await userDao.update({
      id: acceptorId,
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

    let filteredRemover = remover.friends.filter((e) => e !== friendId);
    let filteredFriend = friend.friends.filter((e) => e !== removerId);

    const updatedRemover = await userDao.update({
      id: acceptorId,
      friends: filteredRemover,
    });
    const updatedFriend = await userDao.update({
      id: requesterId,
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
