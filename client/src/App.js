import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import CreateEvent from './components/CreateEvent';
import Hello from './components/Hello';


const App = () => {
  return (
    <Router>
      <div className="mx-auto h-screen flex flex-col items-center text-left justify-center relative">
        <Routes>
        <Route path="/" element={<Hello />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/createaccount" element={<CreateAccount />}/>
        <Route path="/createevent" element={<CreateEvent />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;