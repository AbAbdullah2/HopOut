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
yarn install
cd client
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
To run backend tests:
```shell
cd client
yarn test
```
Our frontend is deployed to [hopout.vercel.app](https://hopout.vercel.app/).
Our backend is deployed to https://hopout.herokuapp.com/.
