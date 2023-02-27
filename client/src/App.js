import EventList from './components/EventList';
import Landing from './components/Landing';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddHello from "./components/AddHello";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="events" element={<EventList />} />
          <Route path="create" element={<AddHello />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;