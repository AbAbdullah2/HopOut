import Hello from './components/Hello';
import CreateEvent from './components/CreateEvent';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="mx-auto h-screen flex flex-col items-center text-left justify-center relative">
        <Routes>
        <Route path="/" element={<Hello />}/>
        <Route path="/createevent" element={<CreateEvent />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;