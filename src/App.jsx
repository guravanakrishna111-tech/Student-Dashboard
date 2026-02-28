import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'

import Navbar from "./Components/Navbar";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import History from "./pages/History";
import Profile from "./pages/Profile";
const App = () => {

const [Tasks, setTasks] = useState(() => {
  const tt = JSON.parse(localStorage.getItem("Tasks"));
  return tt || [];
});

const completedTasks = Tasks.filter(t => t.completed).length;

const score =
  Tasks.length ? Math.round((completedTasks / Tasks.length) * 100) : 0;

useEffect(() => {
  localStorage.setItem("Tasks", JSON.stringify(Tasks));
}, [Tasks]);
useEffect(() => {
  if (Tasks.length === 0) {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=10")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          text: item.title,
          completed: item.completed
        }));
        setTasks(formatted);
      });
  }
}, [Tasks]);
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              Tasks={Tasks}
              setTasks={setTasks}
              completedTasks={completedTasks}
              score={score}
            />
          }
        />

        <Route path="/calculator" element={<Calculator />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
};

export default App;
