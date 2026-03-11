import React from 'react'
import {useState, useEffect} from 'react'
import prof from '../assets/profile.jpeg'
import './Profile.css'
import { getProfile, saveProfile, onProfileChange } from '../firebase/firebaseService';

const Profile = ({ user, score = 0, Tasks = [] }) => {
    const[profile,setProfile]=useState({
        name:"",
        mail:"",
        number:"",
        location:""
    });
    const[loading, setLoading]=useState(true);
    const[saving, setSaving]=useState(false);
    const[error, setError]=useState('');

    // Load profile on mount
    useEffect(()=>{
        if (user?.uid) {
            setLoading(true);
            getProfile(user.uid)
                .then(data => {
                    setProfile(data || {
                        name:"",
                        mail:"",
                        number:"",
                        location:""
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error loading profile:', err);
                    setError('Failed to load profile');
                    setLoading(false);
                });

            // Real-time listener for profile changes
            const unsubscribe = onProfileChange(user.uid, (data) => {
                setProfile(data || {
                    name:"",
                    mail:"",
                    number:"",
                    location:""
                });
            });

            return unsubscribe;
        } else {
            setLoading(false);
        }
    }, [user?.uid]);

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setProfile(prev=>({...prev,[name]:value}))
    }
    
    const handleSave=async()=>{
        try {
            setError('');
            setSaving(true);
            if (!user?.uid) {
                setError('Please sign in to save profile');
                return;
            }
            await saveProfile(user.uid, profile);
            alert("Profile saved successfully!");
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    const completedTasks = Tasks.filter(t => t.completed).length;
    const totalTasks = Tasks.length;

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div className='ProfileContainer'>
                <p style={{ textAlign: 'center', color: '#666' }}>Please sign in to view your profile</p>
            </div>
        );
    }

  return (
    <div className='ProfileContainer'>
      <div className='profile'>

        <div className='profileHeader'>
            <img src={prof} alt="profile"/>
            <div className='headerInfo'>
              <h2>{profile.name || "Your Name"}</h2>
              <h4>{profile.mail || "yourname@gmail.com"}</h4>
            </div>
        </div>

        <div className='ProfileStats'>
          <div className='StatBox'>
            <span className='StatLabel'>Total Tasks</span>
            <span className='StatValue'>{totalTasks}</span>
          </div>
          <div className='StatBox'>
            <span className='StatLabel'>Completed Tasks</span>
            <span className='StatValue'>{completedTasks}</span>
          </div>
          <div className='StatBox'>
            <span className='StatLabel'>Completion Rate</span>
            <span className='StatValue'>{totalTasks ? Math.round((completedTasks/totalTasks)*100) : 0}%</span>
          </div>
          <div className='StatBox'>
            <span className='StatLabel'>Productivity Score</span>
            <span className='StatValue'>{score}%</span>
          </div>
        </div>

        <div className='ProfileEditor'>
          <h3>Edit Profile</h3>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          
          <div className='FormGroup'>
            <label>Full Name</label>
            <input type="text" placeholder='Full Name' name="name" value={profile.name} onChange={handleChange}/>
          </div>

          <div className='FormGroup'>
            <label>Email Address</label>
            <input type="email" placeholder='E-mail' name='mail' value={profile.mail} onChange={handleChange}/>
          </div>

          <div className='FormGroup'>
            <label>Mobile Number</label>
            <input type="tel" placeholder='Mobile number' name='number' value={profile.number} onChange={handleChange}/>
          </div>

          <div className='FormGroup'>
            <label>Location</label>
            <input type="text" placeholder='Location' name='location' value={profile.location} onChange={handleChange}/>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!profile.name || !profile.mail || saving}
            className='SaveProfileButton'
          >
            {saving ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Profile