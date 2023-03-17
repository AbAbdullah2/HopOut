import axios from 'axios';

const BASE_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:6002' : 'https://hopout.herokuapp.com';

// Get all users
async function getAllUsers() {
    const response = await axios.get(`${BASE_URL}/users`)
      .catch(function (error) {
        console.log(error);
      });
    return response;
}

// Get user by id 
async function getUser(userId) {
    const response = await axios.get(`${BASE_URL}/users/${userId}`)
    .catch(function (error) {
        console.log(error);
    });
    return response;
}

// create user / sign up / register
// user should be object with fields email, name password
async function register(user) {
  const response = await axios.post(`${BASE_URL}/register`, user)
    .catch(function (error) {
      console.log(error);
  });
  return response;
}

// login creds should be object with fields email and password
async function postLogin(creds) {
  const response = await axios.post(`${BASE_URL}/login`, creds)
    .catch(function (error) {
      console.log(error);
  });
  return response;
}

// delete a user (must have field _id)
async function deleteUser(user) {
    const response = await axios.delete(`${BASE_URL}/users/${user._id}`)
      .catch(function (error) {
        console.log(error);
      });
    return response;
}

// get all public events
async function getAllPublicEvents() {
  const response = await axios.get(`${BASE_URL}/events`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}
// get all private events
async function getAllPrivateEvents(userId) {
  const response = await axios.get(`${BASE_URL}/users/privateEvents/${userId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function getEvent(eventId) {
  const response = await axios.get(`${BASE_URL}/events/${eventId}`)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function createNewEvent(event) {
  const response = await axios.post(`${BASE_URL}/events`, event)
    .catch(function (error) {
      console.log(error);
    });
  return response;
}

async function rsvpToEvent(userId, eventId) {
  const body = { senderId: userId, eventId };
  const response = await axios.put(`${BASE_URL}/rsvp/sendRSVP`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
 }
 
 
 async function cancelRsvp(userId, eventId) {
  const body = { removerId: userId, eventId };
  const response = await axios.put(`${BASE_URL}/rsvp/removeRSVP`, body)
    .catch(function (error) {
      console.log(error);
    });
  return response;
 }

export { rsvpToEvent, cancelRsvp, getAllUsers, getUser, register, postLogin, deleteUser, getAllPublicEvents, getAllPrivateEvents, getEvent, createNewEvent }
