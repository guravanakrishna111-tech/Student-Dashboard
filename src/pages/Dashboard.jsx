import React from 'react'
import StatsSection from '../Components/StatsSection';
import TaskManager from '../Components/TaskManager';
import Hero from '../Components/Hero';
import {useState,useEffect} from 'react'
import './Dashboard.css'
import { saveStreak, getStreak, onStreakChange } from '../firebase/firebaseService';
import { saveTasks } from '../firebase/firebaseService';

const Dashboard = ({ user, Tasks = [], setTasks, completedTasks = 0, score = 0 }) => {
  const[localTasks,setLocalTasks]=useState(Tasks);
  const[streak,setStreak]=useState(0);
  const[lastDate,setLastDate]=useState(null);
  const[loading, setLoading]=useState(true);

  // Load initial streak data
  useEffect(()=>{
    if (user?.uid) {
      getStreak(user.uid)
        .then(data => {
          if (data.streak) setStreak(data.streak);
          if (data.lastDate) setLastDate(data.lastDate);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading streak:', err);
          setLoading(false);
        });

      // Real-time listener for streak changes
      const unsubscribe = onStreakChange(user.uid, (data) => {
        if (data.streak) setStreak(data.streak);
        if (data.lastDate) setLastDate(data.lastDate);
      });

      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  // Save local tasks changes
  useEffect(()=>{
    if (user?.uid) {
      setLocalTasks(Tasks);
    }
  }, [Tasks, user?.uid]);

  // Save tasks when local tasks change
  useEffect(()=>{
    if (user?.uid && localTasks.length > 0) {
      saveTasks(user.uid, localTasks).catch(err => {
        console.error('Error saving tasks:', err);
      });
    }
  }, [localTasks, user?.uid]);

  const completedCount = localTasks.filter(t=>t.completed).length;
  const pendingCount = localTasks.length - completedCount;
  const scoreValue = localTasks.length ? Math.round((completedCount/localTasks.length)*100) : 0;

  const handleTaskComplete = async (index) => {
    try {
      const today = new Date().toDateString();
      const updated = [...localTasks];
      updated[index].completed = !updated[index].completed;
      setLocalTasks(updated);
      
      if (updated[index].completed && lastDate !== today && user?.uid) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        await saveStreak(user.uid, newStreak, today);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="DashboardContainer">
        <p style={{ textAlign: 'center', color: '#666' }}>
          Please <a href="/login" style={{color:'#667eea'}}>sign in</a> to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="DashboardContainer">
      <Hero />
      
      <div className="DashboardContent">
        {/* Key Metrics */}
        <div className='MetricsSection'>
          <div className='MetricCard primary'>
            <div className='MetricIcon'>📋</div>
            <div className='MetricDetails'>
              <h3>Total Tasks</h3>
              <p className='MetricNumber'>{localTasks.length}</p>
            </div>
            <div className='MetricBar'>
              <div className='Bar' style={{width: '100%', background: '#667eea'}}></div>
            </div>
          </div>

          <div className='MetricCard success'>
            <div className='MetricIcon'>✅</div>
            <div className='MetricDetails'>
              <h3>Completed</h3>
              <p className='MetricNumber'>{completedCount}</p>
            </div>
            <div className='MetricBar'>
              <div className='Bar' style={{width: completedCount > 0 ? (completedCount/localTasks.length)*100 + '%' : '0%', background: '#10B981'}}></div>
            </div>
          </div>

          <div className='MetricCard warning'>
            <div className='MetricIcon'>⏳</div>
            <div className='MetricDetails'>
              <h3>Pending</h3>
              <p className='MetricNumber'>{pendingCount}</p>
            </div>
            <div className='MetricBar'>
              <div className='Bar' style={{width: pendingCount > 0 ? (pendingCount/localTasks.length)*100 + '%' : '0%', background: '#F59E0B'}}></div>
            </div>
          </div>

          <div className='MetricCard fire'>
            <div className='MetricIcon'>🔥</div>
            <div className='MetricDetails'>
              <h3>Streak</h3>
              <p className='MetricNumber'>{streak}</p>
            </div>
            <div className='MetricBar'>
              <div className='Bar' style={{width: Math.min(100, streak*10) + '%', background: '#EF4444'}}></div>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className='ScoreSection'>
          <div className='ScoreCard'>
            <h2>📊 Productivity Score</h2>
            <div className='ScoreDisplay'>
              <div className='CircularProgress'>
                <svg viewBox="0 0 36 36" className="CircularSvg">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="3"></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="3"
                    strokeDasharray={`${scoreValue * 100 / 100} 100`}
                    style={{transition: 'stroke-dasharray 0.5s'}}
                  ></circle>
                </svg>
                <div className='ScoreText'>
                  <span className='ScoreValue'>{scoreValue}%</span>
                  <span className='ScoreLabel'>Complete</span>
                </div>
              </div>
            </div>
            <p className='ScoreMessage'>
              {scoreValue >= 80 ? '🌟 Excellent work!' : 
               scoreValue >= 60 ? '👍 Good progress!' :
               scoreValue >= 40 ? '💪 Keep going!' : '🚀 Get started!'}
            </p>
          </div>
        </div>
      </div>

      {/* Task Manager */}
      <div className='TaskManagerSection'>
        <TaskManager Tasks={localTasks} setTasks={setLocalTasks} score={scoreValue}/>
      </div>

      {/* Stats */}
      <div className='StatsWrapper'>
        <StatsSection completed={completedCount} total={localTasks.length}/>
      </div>
    </div>
  )
}

export default Dashboard
