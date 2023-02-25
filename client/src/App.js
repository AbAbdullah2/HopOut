import EventList from './components/EventList';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddHello from "./components/AddHello";

const App = () => {
  return (
    <div className='mx-auto flex flex-col items-center justify-center h-full'>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<EventList />} />
            <Route path="add" element={<AddHello />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;