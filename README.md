# HopOut
HopOut will allow Hopkins students to quickly and easily host, discover, and RSVP to events happening around them, whether on or off campus! Our app will encourage students to branch out, make new friends, and have fun. Think: a better and user-friendly version of CampusGroups and Facebook Events combined. 
## Installing/Getting Started
To run the server, open up one terminal window and run:
```shell
cd server
yarn install
yarn dev
```
To run the client, open up another terminal window and run:
```shell
cd client
yarn install
yarn dev
```
## Developing
For local development, clone the repository on your computer.
We are using MongoDB Atlas for our database.
We are using Vitest as our backend testing framework. We have tests for the schema, data access objects, and routes for our Event and User classes.
To run backend tests:
```shell
cd server
yarn test
```
We are using Jest as our frontend testing framework.
To run frontend tests:
```shell
cd client
yarn test
```
Our frontend is deployed to [hopout.onrender.com](https://hopout.onrender.com/).
Our backend is deployed to https://hopoutapi.herokuapp.com/.

# FRONTEND Deployed
1/14/2024: https://hopout.netlify.app/

# BACKEND Deployed
1/13/2024: https://hop-out-api-5ced6a082730.herokuapp.com/


Map - done
Ratings and reviews - done
routes - done
see the github - done
friend button doesnt change on a user's profile when user unfriends someone
adding invitees does not work
have to refresh to receive notifcation
no alerts that you got notification
routes are not secure
Fix Chat