import React from 'react'
import './StatsSection.css'
const StatsCard = ({ title, value, icon }) => {
  return (
    <div className='StatsCard'>
      <div className='card-icon'>{icon}</div>
      <h3 className='card-title'>{title}</h3>
      <h2 className='card-value'>{value}</h2>
      <div className='card-border'></div>
    </div>
  )
}
export default StatsCard