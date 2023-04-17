import axios from 'axios';

const BASE_URL =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:6002'
    : 'https://hopoutapi.herokuapp.com';

// Get all users
async function getAllUsers() {
  const response = await axios.get(`${BASE_URL}/users`).catch(function (error) {
    console.log(error);
  });
  return response;
}

// Get user by id
async function getUser(userId) {
  const response = await axios
    .get(`${BASE_URL}/users/${userId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// create user / sign up / register
// user should be object with fields email, name password
async function register(user) {
  const response = await axios
    .post(`${BASE_URL}/register`, user)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function emailVerification(user) {
  const response = await axios.post(`${BASE_URL}/verification`, user)
    .catch(function (error) {
      console.log(error);
  });
  return response;
}

async function updateUser(user) {
  const response = await axios
    .put(`${BASE_URL}/users/${user._id}`, user)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// login creds should be object with fields email and password
async function postLogin(creds) {
  const response = await axios
    .post(`${BASE_URL}/login`, creds)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// delete a user (must have field _id)
async function deleteUser(user) {
  const response = await axios
    .delete(`${BASE_URL}/users/${user._id}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function createNewEvent(event) {
  const response = await axios
    .post(`${BASE_URL}/events`, event)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// get all public events
async function getAllPublicEvents() {
  const response = await axios
    .get(`${BASE_URL}/events`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}
// get all private events
async function getAllPrivateEvents(userId) {
  const response = await axios
    .get(`${BASE_URL}/users/privateEvents/${userId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// get all hosted events
async function getAllHostedEvents(userId) {
  const response = await axios.get(`${BASE_URL}/users/hostedEvents/${userId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function getEvent(eventId) {
  const response = await axios
    .get(`${BASE_URL}/events/${eventId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function updateEvent(event) {
  const response = await axios
    .put(`${BASE_URL}/events/${event._id}`, event)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function sendFriendReq(senderId, receiverId) {
  const response = await axios
    .put(`${BASE_URL}/friends/sendRequest`, { senderId, receiverId })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function acceptFriendReq(acceptorId, requesterId) {
  const response = await axios
    .put(`${BASE_URL}/friends/acceptRequest`, { acceptorId, requesterId })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function declineFriendReq(declinerId, requesterId) {
  const response = await axios
    .put(`${BASE_URL}/friends/declineRequest`, { declinerId, requesterId })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function removeFriendReq(removerId, otherId) {
  const response = await axios.put(`${BASE_URL}/friends/removeRequest`, { removerId, otherId })
  .catch(function (error) {
    console.log(error);
  });
  return response;
}

async function removeFriend(removerId, friendId) {
  const response = await axios
    .put(`${BASE_URL}/friends/removeFriend`, { removerId, friendId })
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function deleteEvent(eventId) {
  const response = await axios
    .delete(`${BASE_URL}/events/${eventId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function sendInvite(evid, invid) {
  const body = { eventId: evid, inviteeId: invid };
  const response = await axios
    .put(`${BASE_URL}/rsvp/sendInvite`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function unsendInvite(evid, invid) {
  const body = { eventId: evid, uninviteeId: invid };
  const response = await axios.put(`${BASE_URL}/rsvp/unsendInvite`, body)
  .catch(function (error) {
    console.log(error);
  });
  return response;
}

async function rsvpToEvent(userId, eventId) {
  const body = { senderId: userId, eventId };
  const response = await axios
    .put(`${BASE_URL}/rsvp/sendRSVP`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function cancelRsvp(userId, eventId) {
  const body = { removerId: userId, eventId };
  const response = await axios
    .put(`${BASE_URL}/rsvp/removeRSVP`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// get all of user's chats by userid
async function getAllChats(userId) {
  const response = await axios
    .get(`${BASE_URL}/getAllChats/${userId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// get all of user's chats by userid
async function getChat(chatId) {
  const response = await axios
    .get(`${BASE_URL}/getChat/${chatId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// send message to chat
async function sendMessage(chatId, senderId, receiverId, message) {
  const body = { chatId, senderId, receiverId, message };
  const response = await axios
    .post(`${BASE_URL}/message/`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// create new chat between two users
async function createChat(person1, person2) {
  const body = { person1, person2 };
  const response = await axios
    .post(`${BASE_URL}/chat/`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// get all of events's comments by eventid
async function getAllComments(eventId) {
  const response = await axios
    .get(`${BASE_URL}/getAllComments/${eventId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

// delete comment from comment section 
async function deleteComment(commentSectionId, commentId, senderId) {
  const body = { senderId, commentId };

  const response = await axios
    .delete(`${BASE_URL}/deleteComment/${commentSectionId}`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}


export {
  sendInvite,
  unsendInvite,
  rsvpToEvent,
  cancelRsvp,
  getAllUsers,
  getUser,
  register,
  postLogin,
  deleteUser,
  getAllPublicEvents,
  getAllPrivateEvents,
  getEvent,
  createNewEvent,
  updateEvent,
  deleteEvent,
  sendFriendReq,
  acceptFriendReq,
  declineFriendReq,
  removeFriendReq,
  removeFriend,
  updateUser,
  getAllHostedEvents, 
  emailVerification,
  getAllChats,
  getChat,
  sendMessage,
  createChat,
  getAllComments,
  deleteComment,
};

export const host = BASE_URL;
