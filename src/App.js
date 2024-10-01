import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskDashboard from './components/TaskDashboard';
import TaskReport from './components/TaskReport'; // Import TaskReport

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<TaskDashboard />} />
        <Route path="/report" element={<TaskReport />} /> {/* Task Report Route */}
      </Routes>
    </Router>
  );
}

export default App;
