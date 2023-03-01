import axios from 'axios';

const BASE_URL = "http://localhost:4000";
// You should never save API key directly in source code

// Get all users
async function getAllUsers(user) {
    const response = await axios.get(`${BASE_URL}/users`)
      .catch(function (error) {
        console.log(error);
      });
    return response;
}

// Get user by id 
async function getUser(userId) {
    const response = await axios.get(`${BASE_URL}/users/${flashcardId}`)
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
