import React from 'react'
import StatsSection from '../Components/StatsSection';
import TaskManager from '../Components/TaskManager';
import Hero from '../Components/Hero';
import {useState,useEffect} from 'react'
const Dashboard = () => {
  const[Tasks,setTasks]=useState(() => {
    const tt=JSON.parse(localStorage.getItem("Tasks"));
    return tt || [];
  });
  const completedTasks=Tasks.filter(t=>t.completed).length
  const score=Tasks.length?Math.round((completedTasks/Tasks.length)*100):0
  useEffect(()=>{
    localStorage.setItem("Tasks",JSON.stringify(Tasks));
  },[Tasks]);
  return (
    <div>
      <Hero />
      <TaskManager Tasks={Tasks} setTasks={setTasks} score={score}/>
      <StatsSection completed={completedTasks} total={Tasks.length}/>
    </div>
  )
}
export default Dashboard
