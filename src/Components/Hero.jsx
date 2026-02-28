import React from 'react'
import { useState, useEffect } from 'react'
import "./Hero.css"
const Hero = () => {
  const [time, setTime] = useState(new Date());
  useEffect(()=>{
    const interval=setInterval(()=>{
      setTime(new Date());
    },1000);
    return()=> clearInterval(interval);
  },[]);
  return (
    <div className="hero">
      <div className='heroText'>
        <h1 className='init'>Welcome to Student DashBoard Of Anits</h1>
        <h1 className='time'>{time.toLocaleTimeString()}</h1>
        <p>Organize your tasks efficiently and boost your productivity with our intuitive task management system.</p>
      </div>
    </div>
  )
}
export default Hero
