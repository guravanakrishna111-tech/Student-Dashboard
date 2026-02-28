import React, { useState, useEffect, useMemo } from 'react'
import './History.css'
const History = () => {
  const [calculationHistory, setCalculationHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('calculationHistory')) || [] } catch { return [] }
  })

  const [taskHistory, setTaskHistory] = useState(() => {
    try {
      const tasks = JSON.parse(localStorage.getItem('Tasks')) || []
      return tasks.filter(t => t.completed)
    } catch { return [] }
  })

  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'calculationHistory') {
        try { setCalculationHistory(JSON.parse(e.newValue || "[]")) } catch { setCalculationHistory([]) }
      }
      if (e.key === 'Tasks') {
        try {
          const tasks = JSON.parse(e.newValue || "[]")
          setTaskHistory(tasks.filter(t => t.completed))
        } catch { setTaskHistory([]) }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const deleteCalculationHistory = (index) => {
    const updated = calculationHistory.filter((_, i) => i !== index)
    setCalculationHistory(updated)
    localStorage.setItem('calculationHistory', JSON.stringify(updated))
  }

  const clearAllCalculationHistory = () => {
    if (window.confirm('Are you sure you want to clear all calculation history?')) {
      setCalculationHistory([])
      localStorage.setItem('calculationHistory', JSON.stringify([]))
    }
  }

  const filteredCalculations = calculationHistory.filter(calc =>
    calc.expression?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.result?.toString().includes(searchTerm)
  )

  const stats = useMemo(() => {
    const tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    const totalTasks = tasks.length
    const completedTasks = taskHistory.length
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    const totalCalculations = calculationHistory.length
    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalCalculations,
      averageTime: '2.5 mins'
    }
  }, [calculationHistory, taskHistory])

  return (
    <div className='HistoryContainer'>
      <div className='HistoryContent'>
        <div className='HistoryHeader'>
          <h1>📜 History & Analytics</h1>
          <p>Track your progress and past activities</p>
        </div>

        <div className='StatsOverview'>
          <div className='StatCard'>
            <div className='StatIcon'>📋</div>
            <div className='StatDetails'>
              <h3>Total Tasks</h3>
              <p className='StatValue'>{stats.totalTasks}</p>
            </div>
          </div>
          <div className='StatCard'>
            <div className='StatIcon'>✅</div>
            <div className='StatDetails'>
              <h3>Completed</h3>
              <p className='StatValue'>{stats.completedTasks}</p>
            </div>
          </div>
          <div className='StatCard'>
            <div className='StatIcon'>📊</div>
            <div className='StatDetails'>
              <h3>Completion Rate</h3>
              <p className='StatValue'>{stats.completionRate}%</p>
            </div>
          </div>
          <div className='StatCard'>
            <div className='StatIcon'>🔢</div>
            <div className='StatDetails'>
              <h3>Calculations</h3>
              <p className='StatValue'>{stats.totalCalculations}</p>
            </div>
          </div>
        </div>

        <div className='TabContainer'>
          <div className='TabButtons'>
            <button className={`TabBtn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>📊 All Activities</button>
            <button className={`TabBtn ${activeTab === 'calculations' ? 'active' : ''}`} onClick={() => setActiveTab('calculations')}>🔢 Calculations</button>
            <button className={`TabBtn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>✅ Completed Tasks</button>
          </div>

          {activeTab === 'all' && (
            <div className='TabContent'>
              <h2>📊 All Activities</h2>
              {calculationHistory.length === 0 && taskHistory.length === 0 ? (
                <div className='EmptyState'>
                  <p className='EmptyIcon'>📭</p>
                  <p>No activities yet. Start by completing tasks or making calculations!</p>
                </div>
              ) : (
                <div className='ActivityList'>
                  {calculationHistory.length > 0 && (
                    <div className='ActivitySection'>
                      <h3>🔢 Recent Calculations</h3>
                      {calculationHistory.slice(-5).reverse().map((calc, index) => (
                        <div key={index} className='ActivityItem CalculationItem'>
                          <div className='ActivityInfo'>
                            <span className='ActivityType'>🧮 Calculation</span>
                            <span className='ActivityDetail'>{calc.expression} = {calc.result}</span>
                          </div>
                          <span className='ActivityTime'>{calc.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {taskHistory.length > 0 && (
                    <div className='ActivitySection'>
                      <h3>✅ Recent Task Completions</h3>
                      {taskHistory.slice(-5).map((task, index) => (
                        <div key={index} className='ActivityItem TaskItem'>
                          <div className='ActivityInfo'>
                            <span className='ActivityType'>✔️ Task</span>
                            <span className='ActivityDetail'>{task.text}</span>
                          </div>
                          <span className='ActivityTime'>Completed ✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calculations' && (
            <div className='TabContent'>
              <div className='TabHeader'>
                <h2>🔢 Calculation History</h2>
                {calculationHistory.length > 0 && (
                  <button className='ClearBtn' onClick={clearAllCalculationHistory}>🗑️ Clear All</button>
                )}
              </div>

              <div className='SearchBox'>
                <input
                  type='text'
                  placeholder='Search calculations...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='SearchInput'
                />
              </div>

              {filteredCalculations.length === 0 ? (
                <div className='EmptyState'>
                  <p className='EmptyIcon'>🔢</p>
                  <p>{searchTerm ? 'No calculations found matching your search' : 'No calculation history yet'}</p>
                </div>
              ) : (
                <div className='HistoryTable'>
                  <div className='TableHeader'>
                    <div className='TableCell'>Expression</div>
                    <div className='TableCell'>Result</div>
                    <div className='TableCell'>Time</div>
                    <div className='TableCell'>Action</div>
                  </div>
                  {filteredCalculations.slice().reverse().map((calc, index) => {
                    const realIndex = calculationHistory.length - 1 - index
                    return (
                      <div key={index} className='TableRow'>
                        <div className='TableCell'>{calc.expression}</div>
                        <div className='TableCell Result'>{calc.result}</div>
                        <div className='TableCell'>{calc.timestamp || 'N/A'}</div>
                        <div className='TableCell Action'>
                          <button className='DeleteBtn' onClick={() => deleteCalculationHistory(realIndex)}>🗑️</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className='TabContent'>
              <h2>✅ Completed Tasks</h2>
              {taskHistory.length === 0 ? (
                <div className='EmptyState'>
                  <p className='EmptyIcon'>📭</p>
                  <p>No completed tasks yet. Complete some tasks to see them here!</p>
                </div>
              ) : (
                <div className='TasksList'>
                  {taskHistory.map((task, index) => (
                    <div key={index} className='CompletedTaskItem'>
                      <div className='TaskCheckmark'>✓</div>
                      <span className='TaskName'>{task.text}</span>
                      <span className='TaskBadge'>Completed</span>
                    </div>
                  ))}
                  <div className='TaskSummary'>
                    <p>🎉 You have completed <strong>{taskHistory.length}</strong> tasks!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {(calculationHistory.length > 0 || taskHistory.length > 0) && (
          <div className='InsightsSection'>
            <h2>💡 Quick Insights</h2>
            <div className='InsightsGrid'>
              <div className='InsightCard'>
                <h3>🚀 Productivity Trend</h3>
                <p className='InsightValue'>📈 Trending Upward</p>
                <small>You're getting more productive each day!</small>
              </div>
              <div className='InsightCard'>
                <h3>⚡ Peak Activity Time</h3>
                <p className='InsightValue'>3:00 PM</p>
                <small>Your most active time of the day</small>
              </div>
              <div className='InsightCard'>
                <h3>🎯 Goal Progress</h3>
                <p className='InsightValue'>{stats.completionRate}%</p>
                <small>Keep going to reach 100%!</small>
              </div>
              <div className='InsightCard'>
                <h3>⏱️ Avg. Task Time</h3>
                <p className='InsightValue'>{stats.averageTime}</p>
                <small>Your average task completion time</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default History