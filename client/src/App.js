import React, { useState } from 'react';
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
  const [curUser, setCurUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="events" element={<EventList curUser={curUser}/>} />
          <Route path="events/:eventid" element={<EventDetail curUser={curUser}/>} />
          <Route path="login" element={<Login setCurUser={setCurUser} />} />
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