import React from 'react'
import { useState } from 'react';
import './Calculator.css'
import { saveCalculation } from '../firebase/firebaseService';

const Calculator = ({ user }) => {
  const [hoursStudied, setHoursStudied] = useState(0);
  const [focusLevel, setFocusLevel] = useState(0);
  const [efficiency, setEfficiency] = useState(null);
  const [subjectsCovered, setSubjectsCovered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function calculateEfficiency() {
    try {
      setError('');
      setLoading(true);
      
      if (!user?.uid) {
        setError('Please sign in to save calculations');
        return;
      }

      const result = hoursStudied * focusLevel + subjectsCovered * 5;
      setEfficiency(result);

      const timestamp = new Date().toLocaleString();
      const expression = `${hoursStudied}h × ${focusLevel}focus + ${subjectsCovered}×5`;
      const calculation = { expression, result, timestamp };

      // Save to Firebase
      await saveCalculation(user.uid, calculation);
    } catch (err) {
      console.error('Error saving calculation:', err);
      setError('Failed to save calculation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function verdict(value) {
    if (value >= 80) return "Excellent";
    else if (value >= 50) return "Good";
    else if (value >= 30) return "Average";
    else return "Needs Improvement";
  }

  return (
    <div className='main'>
      <div className='Calculator'>
        <h3>Know your efficiency for this day</h3>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <input type="number" placeholder="hoursStudied"
          onChange={(e) => setHoursStudied(Number(e.target.value))}
        />

        <input type="number" placeholder="focusLevel(1-10)"
          onChange={(e) => setFocusLevel(Number(e.target.value))}
        />

        <input type="number" placeholder="subjectsCovered"
          onChange={(e) => setSubjectsCovered(Number(e.target.value))}
        />

        <button onClick={calculateEfficiency} disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>

        {efficiency !== null && (
          <>
            <h4>Your Efficiency Score: {efficiency}</h4>
            <h4>Verdict: {verdict(efficiency)}</h4>
          </>
        )}

      </div>
    </div>
  )
}
export default Calculator