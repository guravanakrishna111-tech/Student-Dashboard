import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'

import Navbar from "./Components/Navbar";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import History from "./pages/History";
import Profile from "./pages/Profile";
import TaskManagerPage from "./pages/TaskManagerPage";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { onAuthChange } from './firebase/firebaseService';
import { getTasks, saveTasks } from './firebase/firebaseService';

const App = () => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

const [Tasks, setTasks] = useState([]);

// Auth state listener
useEffect(() => {
  const unsubscribe = onAuthChange((currentUser) => {
    setUser(currentUser);
    setLoading(false);
    if (!currentUser) {
      setTasks([]);
    }
  });
  return unsubscribe;
}, []);

// Load tasks from Firestore when user changes
useEffect(() => {
  if (user?.uid) {
    getTasks(user.uid).then(data => {
      setTasks(data);
    }).catch(error => {
      console.error('Error loading tasks:', error);
      setTasks([]);
    });
  }
}, [user]);

// Save tasks to Firestore whenever they change
useEffect(() => {
  if (user?.uid && Tasks.length > 0) {
    saveTasks(user.uid, Tasks).catch(error => {
      console.error('Error saving tasks:', error);
    });
  }
}, [Tasks, user?.uid]);

// Fetch initial tasks if empty
useEffect(() => {
  if (user?.uid && Tasks.length === 0) {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          text: item.title,
          completed: item.completed
        }));
        setTasks(formatted);
      })
      .catch(error => console.error('Error fetching initial tasks:', error));
  }
}, [user?.uid]);

const completedTasks = Tasks.filter(t => t.completed).length;
const score = Tasks.length ? Math.round((completedTasks / Tasks.length) * 100) : 0;

if (loading) {
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
}

return (
  <>
    <Navbar user={user} />

    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            user={user}
            Tasks={Tasks}
            setTasks={setTasks}
            completedTasks={completedTasks}
            score={score}
          />
        }
      />

      <Route path="/calculator" element={<Calculator user={user} />} />
      <Route path="/history" element={<History user={user} Tasks={Tasks} completedTasks={completedTasks} />} />
      <Route path="/profile" element={<Profile user={user} score={score} Tasks={Tasks} />} />
      <Route path="/tasks" element={<TaskManagerPage user={user} Tasks={Tasks} setTasks={setTasks} />} />
      <Route path="/analytics" element={<Analytics user={user} Tasks={Tasks} />} />
      <Route path="/settings" element={<Settings user={user} Tasks={Tasks} setTasks={setTasks} />} />

    </Routes>
  </>
);
};

export default App;
