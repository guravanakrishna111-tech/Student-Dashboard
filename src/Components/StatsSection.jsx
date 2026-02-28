import React from 'react'
import StatsCard from './StatsCard'
import './StatsSection.css'
const StatsSection = ({completed,total}) => {
  const stats = [
    { title: 'Total Tasks', value: total, icon: '📋' },
    { title: 'Completed', value: completed, icon: '✅' },
    { title: 'Pending', value: total - completed, icon: '⚠️' }
  ]

  return (
    <div className='StatsSection'>
      {stats.map((stat, index) => (
        <StatsCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}

export default StatsSection