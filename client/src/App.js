import React, { useState } from 'react';
import EventList from './pages/EventList';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import NotFound from './pages/NotFound';
import EventDetail from './pages/EventDetail';

const App = () => {
  const [curUser, setCurUser] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="events" element={<EventList />} />
          <Route path="events/:eventid" element={<EventDetail />} />
          <Route path="create" element={<Landing />} />
          <Route path="login" element={<Login setCurUser={setCurUser}/>} />
          <Route path="signup" element={<CreateAccount />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;