import React, { useState, useEffect } from 'react';
import EventList from './pages/EventList';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import CreateEvent from './pages/CreateEvent';
import NotFound from './pages/NotFound';
import EventDetail from './pages/EventDetail';
import Account from './pages/Account';

const App = () => {
  const [curUser, setCurUser] = useState(window.localStorage.getItem("curUser") ? window.localStorage.getItem("curUser") : undefined);

  useEffect(() => {
    console.log("window.localStorage.getItem('curUser')", (window.localStorage.getItem('curUser')));
    setCurUser(window.localStorage.getItem('curUser'));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('curUser', curUser);
  }, [curUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing curUser={curUser} />} />
          <Route path="events" element={<EventList curUser={curUser}/>} />
          <Route path="events/:eventid" element={<EventDetail curUser={curUser}/>} />
          <Route path="login" element={<Login curUser={curUser} setCurUser={setCurUser} />} />
          <Route path="signup" element={<CreateAccount setCurUser={setCurUser}/>} />
          <Route path="account" element={<Account curUser={curUser} />} />
          <Route path="create" element={<CreateEvent curUser={curUser} />}/>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;