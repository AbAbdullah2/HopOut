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
      senderId,
      sentFriends: sender.sentFriends.push(receiverId),
    });
    const updatedReceiver = await userDao.update({
      receiverId,
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

// router.put(`/friends/acceptRequest`, async (req, res, next) => {
//     try {
//       const { senderId, receiverId } = req.body;

//       const sender = await userDao.read(senderId);
//       const receiver = await userDao.read(receiverId);

//       // var filteredArray = arr.filter(e => e !== 'seven')
//         let filteredSenderReceived = sender.receivedFriends.filter(e => e !== receiverId);
//         let filteredReceiverSender = sender.receivedFriends.filter(e => e !== receiverId);

//       const updatedSender = await userDao.update({
//         senderId,
//       });
//       const updatedReceiver = await userDao.update({
//         receiverId,
//       });

//       res.json({
//         status: 200,
//         message: `Successfully sent friend request to ${updatedReceiver.name}!`,
//         data: hidePassword(updatedSender),
//       });
//     } catch (err) {
//       next(err);
//     }
//   });
