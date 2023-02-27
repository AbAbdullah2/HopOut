import EventList from './pages/EventList';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="events" element={<EventList />} />
          <Route path="create" element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<CreateAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;