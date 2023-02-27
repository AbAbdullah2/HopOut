import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Hello from './components/Hello';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';

const App = () => {
  return (
    <Router>
      <div className="mx-auto h-screen flex flex-col items-center text-left justify-center relative">
        <Routes>
        <Route path="/" element={<Hello />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/createaccount" element={<CreateAccount />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;